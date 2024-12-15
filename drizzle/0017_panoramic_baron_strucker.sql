ALTER TABLE "important_dates" ADD COLUMN "date" date;--> statement-breakpoint
ALTER TABLE "important_dates" DROP COLUMN IF EXISTS "poster_submission";--> statement-breakpoint
ALTER TABLE "important_dates" DROP COLUMN IF EXISTS "paper_submission";--> statement-breakpoint
ALTER TABLE "important_dates" DROP COLUMN IF EXISTS "notification";--> statement-breakpoint
ALTER TABLE "important_dates" DROP COLUMN IF EXISTS "registration_and_payment";--> statement-breakpoint
ALTER TABLE "important_dates" DROP COLUMN IF EXISTS "conference_date";