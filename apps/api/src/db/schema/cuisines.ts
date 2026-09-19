import { pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';

export const cuisines = pgTable('cuisines', {
  id: uuid('id').primaryKey().defaultRandom(),

  name: text('name').notNull().unique(),

  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type Cuisine = typeof cuisines.$inferSelect;

export type NewCuisine = typeof cuisines.$inferInsert;
