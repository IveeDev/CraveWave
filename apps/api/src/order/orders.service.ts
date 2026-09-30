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
import { eq, and, inArray } from 'drizzle-orm';
import { UserRole } from '@food-delivery/types';

@Injectable()
export class OrderService {
  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

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

  private async isOwnerOfRestaurant(ownerId: string, restaurantId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    return restaurant?.id === restaurantId;
  }
}
