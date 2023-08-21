DO $$ BEGIN
 CREATE TYPE "reference_type" AS ENUM('image, link, video');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"post_id" varchar(36) NOT NULL,
	"content" text NOT NULL,
	"password" varchar(80) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"reply_to_id" varchar(36)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"author_id" varchar(36) NOT NULL,
	"password" varchar(80) NOT NULL,
	"first_choice" varchar(100) NOT NULL,
	"second_choice" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reference" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"post_id" varchar(36) NOT NULL,
	"reference_type" "reference_type" NOT NULL,
	"reference_url" text NOT NULL,
	"annotation" text
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"user_ip" varchar(20) NOT NULL,
	"nickname" varchar(10) NOT NULL,
	"agent" varchar(255) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote" (
	"id" varchar(26) PRIMARY KEY NOT NULL,
	"user_id" varchar(36) NOT NULL,
	"post_id" varchar(36) NOT NULL,
	"is_fisrt" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL
);
