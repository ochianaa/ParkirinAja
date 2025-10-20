import { pgTable, serial, integer, varchar, text, decimal, timestamp } from 'drizzle-orm/pg-core';

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

export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;