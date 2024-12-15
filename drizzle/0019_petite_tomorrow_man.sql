ALTER TABLE "submission" ALTER COLUMN "title" SET DEFAULT 'Paper submission';--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "subtitle" text DEFAULT 'Papers can be submitted via';--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "link" text;--> statement-breakpoint
ALTER TABLE "submission" ADD COLUMN "html" text;--> statement-breakpoint
ALTER TABLE "submission" DROP COLUMN IF EXISTS "abstract";--> statement-breakpoint
ALTER TABLE "submission" DROP COLUMN IF EXISTS "keywords";--> statement-breakpoint
ALTER TABLE "submission" DROP COLUMN IF EXISTS "authors";