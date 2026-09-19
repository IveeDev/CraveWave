import {
  boolean,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';

import { users } from './users';

export const restaurants = pgTable('restaurants', {
  id: uuid('id').primaryKey().defaultRandom(),

  ownerId: uuid('owner_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  name: text('name').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),

  address: text('address').notNull(),
  kitchenPhone: text('kitchen_phone'),

  isAcceptingOrders: boolean('is_accepting_orders').notNull().default(false),

  prepTimeMinutes: integer('prep_time_minutes').notNull().default(20),

  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

export type Restaurant = typeof restaurants.$inferSelect;
export type NewRestaurant = typeof restaurants.$inferInsert;
