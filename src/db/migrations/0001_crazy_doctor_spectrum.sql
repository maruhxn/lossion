ALTER TABLE "comment" ALTER COLUMN "user_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "post_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "comment" ALTER COLUMN "reply_to_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "post" ALTER COLUMN "author_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "reference" ALTER COLUMN "id" SET DATA TYPE varchar(26);--> statement-breakpoint
ALTER TABLE "reference" ALTER COLUMN "post_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "user" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "user_id" SET DATA TYPE char(26);--> statement-breakpoint
ALTER TABLE "vote" ALTER COLUMN "post_id" SET DATA TYPE char(26);