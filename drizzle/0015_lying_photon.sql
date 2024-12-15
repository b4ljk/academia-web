ALTER TABLE "committee_members" ADD COLUMN "avatar" text;--> statement-breakpoint
ALTER TABLE "committee_members" DROP COLUMN IF EXISTS "track";