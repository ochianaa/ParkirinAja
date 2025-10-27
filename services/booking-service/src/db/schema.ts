import { pgTable, serial, integer, varchar, text, decimal, timestamp, check } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const bookings = pgTable('Bookings', {
  booking_id: serial('booking_id').primaryKey(),
  user_id: integer('user_id').notNull(),
  garage_id: integer('garage_id').notNull(),
  start_time: timestamp('start_time').notNull(),
  end_time: timestamp('end_time').notNull(),
  total_price: decimal('total_price', { precision: 10, scale: 2 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  payment_status: varchar('payment_status', { length: 50 }).notNull().default('unpaid'),
  notes: text('notes'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
});

export const reviews = pgTable('Reviews', {
  review_id: serial('review_id').primaryKey(),
  booking_id: integer('booking_id').notNull().references(() => bookings.booking_id),
  user_id: integer('user_id').notNull(),
  garage_id: integer('garage_id').notNull(),
  rating: integer('rating').notNull(),
  review_text: text('review_text'),
  created_at: timestamp('created_at').notNull().defaultNow(),
  updated_at: timestamp('updated_at').notNull().defaultNow()
}, (table) => ({
  ratingCheck: check('rating_check', sql`${table.rating} >= 1 AND ${table.rating} <= 5`)
}));

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type Review = typeof reviews.$inferSelect;
export type NewReview = typeof reviews.$inferInsert;