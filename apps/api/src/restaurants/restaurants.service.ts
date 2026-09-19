import {
  ForbiddenException,
  Injectable,
  Inject,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { eq, and, or, ilike, inArray, SQL } from 'drizzle-orm';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';

import * as schema from '../db/schema';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';

@Injectable()
export class RestaurantsService {
  private readonly logger = new Logger(RestaurantsService.name);

  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

  //   Create Restaurant
  async create(ownerId: string, dto: CreateRestaurantDto) {
    const [existing] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (existing)
      throw new ForbiddenException('Owner already has a restaurant');

    const [restaurant] = await this.db
      .insert(schema.restaurants)
      .values({
        ownerId,
        name: dto.name,
        address: dto.address,
        kitchenPhone: dto.kitchenPhone,
        prepTimeMinutes: dto.prepTimeMinutes,
        description: dto.description,
        imageUrl: dto.imageUrl,
      })
      .returning();

    if (dto.cuisineIds?.length) {
      try {
        await this.db.insert(schema.restaurantCuisines).values(
          dto.cuisineIds.map((cuisineId) => ({
            restaurantId: restaurant.id,
            cuisineId,
          })),
        );
      } catch (err) {
        // neon-http has no real transactions across separate inserts,
        // so if linking cuisines fails, we manually undo the restaurant
        // insert rather than leave an orphaned record behind.
        this.logger.error(
          `Failed to link cuisines for restaurant ${restaurant.id}, rolling back`,
          err,
        );

        await this.db
          .delete(schema.restaurants)
          .where(eq(schema.restaurants.id, restaurant.id));

        throw err;
      }
    }

    return this.findOne(restaurant.id);
  }

  //   Find My Restaurant
  async findMyRestaurant(ownerId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (!restaurant)
      throw new NotFoundException('Restaurant not found for owner');

    const cuisines = await this.getCuisinesFor(restaurant.id);

    return { ...restaurant, cuisines };
  }

  //   Find One Restaurant by Id
  async findOne(id: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.id, id));

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    const cuisines = await this.getCuisinesFor(restaurant.id);

    return { ...restaurant, cuisines };
  }

  //   Find All Restaurants
  async findAll(filters?: { search?: string; cuisineIds?: string[] }) {
    const baseConditions: (SQL<unknown> | undefined)[] = [
      eq(schema.restaurants.isAcceptingOrders, true),
    ];

    if (filters?.search) {
      baseConditions.push(
        or(
          ilike(schema.restaurants.name, `%${filters.search}%`),
          ilike(schema.restaurants.address, `%${filters.search}%`),
        ),
      );
    }

    if (!filters?.cuisineIds?.length) {
      return this.db
        .select()
        .from(schema.restaurants)
        .where(and(...baseConditions));
    }

    const rows = await this.db
      .selectDistinct({ restaurant: schema.restaurants })
      .from(schema.restaurants)
      .innerJoin(
        schema.restaurantCuisines,
        eq(schema.restaurantCuisines.restaurantId, schema.restaurants.id),
      )
      .where(
        and(
          ...baseConditions,
          inArray(schema.restaurantCuisines.cuisineId, filters.cuisineIds),
        ),
      );

    return rows.map((r) => r.restaurant);
  }

  //   Update Restaurant
  async update(id: string, dto: UpdateRestaurantDto, ownerId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.id, id));

    if (!restaurant) throw new NotFoundException('Restaurant not found');

    if (restaurant.ownerId !== ownerId) {
      throw new ForbiddenException('You do not own this restaurant');
    }

    // Separate cuisineIds out — it doesn't belong in the restaurants
    // table update, it needs to go through the join table instead.
    const { cuisineIds, ...restaurantFields } = dto;

    const [updated] = await this.db
      .update(schema.restaurants)
      .set({ ...restaurantFields, updatedAt: new Date() })
      .where(eq(schema.restaurants.id, id))
      .returning();

    if (cuisineIds) {
      // Replace-all strategy: wipe existing links, insert the new set.
      // Simpler and safer than diffing add/remove for a small tag list.
      await this.db
        .delete(schema.restaurantCuisines)
        .where(eq(schema.restaurantCuisines.restaurantId, id));

      if (cuisineIds.length) {
        await this.db.insert(schema.restaurantCuisines).values(
          cuisineIds.map((cuisineId) => ({
            restaurantId: id,
            cuisineId,
          })),
        );
      }
    }

    return this.findOne(id);
  }

  //   Shared helper: fetch a restaurant's cuisine list
  private async getCuisinesFor(restaurantId: string) {
    return this.db
      .select({ id: schema.cuisines.id, name: schema.cuisines.name })
      .from(schema.restaurantCuisines)
      .innerJoin(
        schema.cuisines,
        eq(schema.cuisines.id, schema.restaurantCuisines.cuisineId),
      )
      .where(eq(schema.restaurantCuisines.restaurantId, restaurantId));
  }
}
