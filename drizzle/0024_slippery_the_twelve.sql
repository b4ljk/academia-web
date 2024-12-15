CREATE TABLE IF NOT EXISTS "agenda" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"start" date,
	"end" date,
	"html" text,
	"conference_id" integer
);
--> statement-breakpoint
ALTER TABLE "organizers" ALTER COLUMN "name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "organizers" ALTER COLUMN "logo" SET NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agenda" ADD CONSTRAINT "agenda_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "organizers" DROP COLUMN IF EXISTS "description";--> statement-breakpoint
ALTER TABLE "organizers" DROP COLUMN IF EXISTS "country";