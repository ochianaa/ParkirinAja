CREATE TABLE "Garages" (
	"garage_id" serial PRIMARY KEY NOT NULL,
	"owner_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"address" text NOT NULL,
	"description" text,
	"price_per_hour" numeric(10, 2) NOT NULL,
	"status" varchar(50) DEFAULT 'available' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
