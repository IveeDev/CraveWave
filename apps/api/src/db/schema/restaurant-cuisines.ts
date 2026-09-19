import { pgTable, primaryKey, uuid, index } from 'drizzle-orm/pg-core';

import { restaurants } from './restaurants';
import { cuisines } from './cuisines';

export const restaurantCuisines = pgTable(
  'restaurant_cuisines',
  {
    restaurantId: uuid('restaurant_id')
      .notNull()
      .references(() => restaurants.id, { onDelete: 'cascade' }),
    cuisineId: uuid('cuisine_id')
      .notNull()
      .references(() => cuisines.id, { onDelete: 'cascade' }),
  },
  (table) => [
    primaryKey({ columns: [table.restaurantId, table.cuisineId] }),
    index('restaurant_cuisines_cuisine_id_idx').on(table.cuisineId), // ← new
  ],
);

export type RestaurantCuisine = typeof restaurantCuisines.$inferSelect;

export type NewRestaurantCuisine = typeof restaurantCuisines.$inferInsert;
