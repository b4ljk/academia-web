DO $$ BEGIN
 CREATE TYPE "public"."commitee_type_enum" AS ENUM('ORGANIZING', 'PROGRAM', 'STEERING');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "call_for_paper" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"html" text,
	"conference_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "committee_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"affilation" text,
	"country" text,
	"track" text,
	"committee_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "Committees" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"conference_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "important_dates" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text DEFAULT 'Important Dates',
	"poster_submission" date,
	"paper_submission" date,
	"notification" date,
	"registration_and_payment" date,
	"conference_date" date,
	"conference_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "call_for_paper" ADD CONSTRAINT "call_for_paper_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_committee_id_Committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."Committees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "Committees" ADD CONSTRAINT "Committees_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "important_dates" ADD CONSTRAINT "important_dates_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
