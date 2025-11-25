
import { pgTable, serial, integer, varchar, text, decimal, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';

export const garages = pgTable('garages', {
  garage_id: serial('garage_id').primaryKey(),
  owner_id: integer('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  description: text('description'),
  image_url: varchar('image_url', { length: 2048 }),
  price_per_hour: decimal('price_per_hour', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('available'),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow()
});

export const favorites = pgTable('favorites', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').notNull(),
  garage_id: integer('garage_id').notNull(),
  created_at: timestamp('created_at').defaultNow()
}, (table) => {
  return {
    favoritesUserGarageUnique: uniqueIndex('favorites_user_garage_unique').on(table.user_id, table.garage_id)
  };
});

export type Garage = typeof garages.$inferSelect;
export type NewGarage = typeof garages.$inferInsert;

export type Favorite = typeof favorites.$inferSelect;
export type NewFavorite = typeof favorites.$inferInsert;
