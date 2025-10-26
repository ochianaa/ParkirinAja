CREATE TABLE "favorites" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"garage_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "garages" (
	"garage_id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"price_per_hour" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP TABLE "Garages" CASCADE;--> statement-breakpoint
CREATE UNIQUE INDEX "favorites_user_garage_unique" ON "favorites" USING btree ("user_id","garage_id");