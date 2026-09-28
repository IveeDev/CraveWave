import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { and, eq } from 'drizzle-orm';
import { NeonHttpDatabase } from 'drizzle-orm/neon-http';
import * as schema from '../db/schema';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  constructor(@Inject('DB') private db: NeonHttpDatabase<typeof schema>) {}

  private async getRestaurantByOwner(ownerId: string) {
    const [restaurant] = await this.db
      .select()
      .from(schema.restaurants)
      .where(eq(schema.restaurants.ownerId, ownerId));

    if (!restaurant) throw new NotFoundException('Create restaurant first!');

    return restaurant;
  }

  //   CATEGORIES

  async createCategory(ownerId: string, dto: CreateCategoryDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);

    if (!restaurant) new NotFoundException('Create restaurant first');

    const [category] = await this.db
      .insert(schema.menuCategories)
      .values({ restaurantId: restaurant.id, name: dto.name })
      .returning();

    return category;
  }

  //   getCategories
  async getCategories(restaurantId: string) {
    return this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.restaurantId, restaurantId));
  }

  //   UpdateCategories
  async updateCategory(id: string, ownerId: string, dto: UpdateCategoryDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const [category] = await this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    if (!category) throw new NotFoundException('Category not found');

    if (category.restaurantId !== restaurant.id)
      throw new ForbiddenException(
        'This category does not belong to your restaurant',
      );

    const [updatedCategory] = await this.db
      .update(schema.menuCategories)
      .set({ name: dto.name })
      .where(eq(schema.menuCategories.id, id))
      .returning();

    return updatedCategory;
  }

  async deleteCategory(id: string, ownerId: string) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const [category] = await this.db
      .select()
      .from(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    if (!category) throw new NotFoundException('Category Not Found');

    if (category.restaurantId !== restaurant.id)
      throw new ForbiddenException(
        'This category does not belong to your restaurant',
      );

    //   Cascade delete will remove all items in this category automatically
    await this.db
      .delete(schema.menuCategories)
      .where(eq(schema.menuCategories.id, id));

    return { message: 'Category deleted!' };
  }

  //   MenuItems:
  async createMenuItem(ownerId: string, dto: CreateMenuItemDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);

    if (!restaurant) throw new NotFoundException('Create a restaurant firs');

    const [menuItem] = await this.db
      .insert(schema.menuItems)
      .values({
        restaurantId: restaurant.id,
        categoryId: dto.categoryId,
        name: dto.name,
        description: dto.description,
        imageUrl: dto.imageUrl,
        prepTime: dto.prepTime,
        price: dto.price,
      })
      .returning();

    return menuItem;
  }

  // getItemsByRestaurants

  async getItemsByRestaurant(restaurantId: string) {
    //   returns all items for a restaurant

    return this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.restaurantId, restaurantId));
  }

  async updateMenuItem(id: string, ownerId: string, dto: UpdateMenuItemDto) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const [menuItem] = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id));

    if (!menuItem) throw new NotFoundException('Menu item not found');

    if (menuItem.restaurantId !== restaurant.id)
      throw new ForbiddenException(
        'This item does not belong to your restaurant',
      );

    const [updatedItem] = await this.db
      .update(schema.menuItems)
      .set({ ...dto, updatedAt: new Date() })
      .where(eq(schema.menuItems.id, id))
      .returning();

    return updatedItem;
  }

  async deleteMenuItem(id: string, ownerId: string) {
    const restaurant = await this.getRestaurantByOwner(ownerId);
    const [menuItem] = await this.db
      .select()
      .from(schema.menuItems)
      .where(eq(schema.menuItems.id, id));

    if (!menuItem) throw new NotFoundException('Menu item not found');

    if (menuItem.restaurantId !== restaurant.id)
      throw new ForbiddenException(
        'This item does not belong to your restaurant',
      );

    await this.db.delete(schema.menuItems).where(eq(schema.menuItems.id, id));

    return { message: 'Item deleted successfully!' };
  }
}
