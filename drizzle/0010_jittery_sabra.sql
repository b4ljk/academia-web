ALTER TABLE "conference" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "conference" ADD COLUMN "hero_text" text;--> statement-breakpoint
ALTER TABLE "conference" DROP COLUMN IF EXISTS "about";