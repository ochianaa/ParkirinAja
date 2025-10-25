
import { pgTable, serial, integer, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core';

export const garages = pgTable('Garages', {
  garage_id: serial('garage_id').primaryKey(),
  owner_id: integer('owner_id').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  address: text('address').notNull(),
  description: text('description'),
  price_per_hour: decimal('price_per_hour', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('available'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

// Export types for TypeScript
export type Garage = typeof garages.$inferSelect;
export type NewGarage = typeof garages.$inferInsert;
