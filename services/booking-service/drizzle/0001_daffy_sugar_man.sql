CREATE TABLE IF NOT EXISTS "Reviews" (
	"review_id" serial PRIMARY KEY NOT NULL,
	"booking_id" integer NOT NULL,
	"user_id" integer NOT NULL,
	"garage_id" integer NOT NULL,
	"rating" integer NOT NULL,
	"review_text" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "rating_check" CHECK ("Reviews"."rating" >= 1 AND "Reviews"."rating" <= 5)
);
--> statement-breakpoint
ALTER TABLE "Reviews" ADD CONSTRAINT "Reviews_booking_id_Bookings_booking_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."Bookings"("booking_id") ON DELETE no action ON UPDATE no action;