DO $$ BEGIN
 CREATE TYPE "provider" AS ENUM('google', 'kakao', 'naver');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "comment" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"post_id" char(36) NOT NULL,
	"content" text NOT NULL,
	"is_first_choice" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"reply_to_id" char(36)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "post" (
	"id" char(26) PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"author_id" char(36) NOT NULL,
	"first_choice" varchar(255) NOT NULL,
	"second_choice" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "reference" (
	"id" varchar(36) PRIMARY KEY NOT NULL,
	"post_id" char(36) NOT NULL,
	"image_path" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"username" varchar(20) NOT NULL,
	"email" varchar(50) NOT NULL,
	"sns_id" varchar(30) NOT NULL,
	"provider" "provider"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vote" (
	"id" char(36) PRIMARY KEY NOT NULL,
	"user_id" char(36) NOT NULL,
	"post_id" char(36) NOT NULL,
	"is_first_choice" boolean,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comment" ADD CONSTRAINT "comment_reply_to_id_comment_id_fk" FOREIGN KEY ("reply_to_id") REFERENCES "comment"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
