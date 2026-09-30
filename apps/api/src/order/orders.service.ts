import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { eq, desc, inArray, SQL } from 'drizzle-orm';
import { OrderStatus, UserRole } from '@food-delivery/types';
import { OrdersGateWay } from '../gateway/orders.gateway';
import { DriverService } from '../driver/driver.service';

@Injectable()
export class OrdersService {
  constructor(
    @Inject('DB') private db: NeonHttpDatabase<typeof schema>,
    private ordersGateway: OrdersGateWay,
    private driverService: DriverService,
  ) {}

  async create(customerId: string, dto: CreateOrderDto) {
    const menuItemIds = dto.items.map((item) => item.menuItemId);

    // Fetch all menuitems in one query

    const menuItems = await this.db
      .select()
      .from(schema.menuItems)
      .where(inArray(schema.menuItems.id, menuItemIds));

    //   Verify all menu items IDs were actually found in the db
    // if any id is invalid, menuItems.length < dto.items.length
    // without this check, find() returns undefined and total become NaN

    if (menuItems.length !== dto.items.length) {
      throw new BadRequestException('One or more menu items are invalid');
    }

    //Verify all items belong the specified restaurant
    const allBelongToRestaurant = menuItems.every(
      (item) => item.restaurantId === dto.restaurantId,
    );

    if (!allBelongToRestaurant)
      throw new BadRequestException(
        'All items must belong to the same restaurant',
      );

    //Calculate the total price
    const total = dto.items.reduce((sum, orderItem) => {
      const menuItem = menuItems.find((m) => m.id === orderItem.menuItemId);

      if (!menuItem) return sum;
      return sum + parseFloat(menuItem.price) * parseFloat(orderItem.quantity);
    }, 0);

    // Insert order in db
    const [order] = await this.db
      .insert(schema.orders)
      .values({
        customerId,
        restaurantId: dto.restaurantId,
        deliveryAddress: dto.deliveryAddress,
        totalAmount: total.toString(),
        status: 'PENDING',
      })
      .returning();

    //   Insert all order items
    await this.db.insert(schema.orderItems).values(
      dto.items.map((item) => {
        const menuItem = menuItems.find((m) => m.id === item.menuItemId)!;
        return {
          orderId: order.id,
          menuItemId: item.menuItemId,
          quantity: +item.quantity,
          unitPrice: menuItem.price,
        };
      }),
    );
    return order;
  }

  async findByCustomer(customerId: string) {
    return this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.customerId, customerId));
  }

  async findByDriver(driverId: string) {
    return this.findOrdersWithDetails(eq(schema.orders.driverId, driverId));
  }

  // routes to customer or driver query based on JWT role
  async findMyOrders(userId: string, role: string) {
    if (role === UserRole.DRIVER) {
      return this.findByDriver(userId);
    }
    return this.findByCustomer(userId);
  }

  async findById(orderId: string, user: { sub: string; role: string }) {
    const [order] = await this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId));

    if (!order) throw new NotFoundException('Order not foundt');

    // Authorization check
    //check access by role - each role can only view orders they are involved in
    // we use the NotFoundException message regardless - avoids leaking whether oredr exist or not.

    const canView =
      (user.role === UserRole.CUSTOMER && order.customerId === user.sub) ||
      (user.role === UserRole.RESTAURANT_OWNER &&
        (await this.isOwnerOfRestaurant(user.sub, order.restaurantId))) ||
      (user.role === UserRole.DRIVER && order.driverId === user.sub);

    if (!canView) throw new ForbiddenException('Unauthorized');

    // Fetch order items
    const items = await this.db
      .select()
      .from(schema.orderItems)
      .where(eq(schema.orderItems.orderId, orderId));

    return { ...order, items };
  }

  async findByRestaurant(ownerId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    return this.findOrdersWithDetails(
      eq(schema.orders.restaurantId, restaurant.id),
    );
  }

  async updateStatus(
    orderId: string,
    newStatus: OrderStatus,
    user: { sub: string; role: string },
  ) {
    const [order] = await this.db
      .select()
      .from(schema.orders)
      .where(eq(schema.orders.id, orderId));

    if (!order) throw new NotFoundException('Order not found!');

    this.validateTransition(order.status, newStatus, user.role);

    if (user.role === UserRole.RESTAURANT_OWNER) {
      const [restaurant] = await this.db
        .select()
        .from(schema.restaurants)
        .where(eq(schema.restaurants.ownerId, user.sub));

      if (!restaurant || restaurant.id !== order.restaurantId)
        throw new ForbiddenException('Unauthorized');
    }

    if (user.role === UserRole.DRIVER && order.driverId)
      throw new ForbiddenException(
        'This order is already assigned to another driver',
      );

    const [updated] = await this.db
      .update(schema.orders)
      .set({
        status: newStatus,
        updatedAt: new Date(),
      })
      .where(eq(schema.orders.id, orderId))
      .returning();

    this.ordersGateway.emitOrderUdpate(updated);

    if (newStatus === 'READY') {
      await this.driverService.assignDriver(orderId);
    }
    return updated;
  }

  private validateTransition(
    currentStatus: string,
    newStatus: string,
    role: string,
  ) {
    const ownerTransitions: Record<string, string[]> = {
      CONFIRMED: ['PREPARING', 'CANCELLED'],
      PREPARING: ['READY', 'CANCELLED'],
    };

    const driverTransitions: Record<string, string[]> = {
      READY: ['PICKED_UP'],
      PICKED_UP: ['DELIVERED'],
    };

    const allowed =
      role === UserRole.RESTAURANT_OWNER
        ? (ownerTransitions[currentStatus] ?? [])
        : role === UserRole.DRIVER
          ? (driverTransitions[currentStatus] ?? [])
          : [];

    if (!allowed.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition from ${currentStatus} to ${newStatus}`,
      );
    }
  }

  private async isOwnerOfRestaurant(ownerId: string, restaurantId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    return restaurant?.id === restaurantId;
  }

  private async enrichOrders(orderRows: (typeof schema.orders.$inferSelect)[]) {
    if (orderRows.length === 0) return [];

    const orderIds = orderRows.map((o) => o.id);
    const restaurantIds = [...new Set(orderRows.map((o) => o.restaurantId))];

    const restaurants = await this.db
      .select({
        id: schema.restaurants.id,
        name: schema.restaurants.name,
      })
      .from(schema.restaurants)
      .where(inArray(schema.restaurants.id, restaurantIds));

    const items = await this.db
      .select()
      .from(schema.orderItems)
      .where(inArray(schema.orderItems.orderId, orderIds));

    const restaurantMap = Object.fromEntries(restaurants.map((r) => [r.id, r]));

    return orderRows.map((order) => ({
      ...order,
      restaurant: restaurantMap[order.restaurantId],
      items: items.filter((i) => i.orderId === order.id),
    }));
  }

  private async findOrdersWithDetails(where: SQL) {
    const orderRows = await this.db
      .select()
      .from(schema.orders)
      .where(where)
      .orderBy(desc(schema.orders.createdAt));

    return this.enrichOrders(orderRows);
  }
}
