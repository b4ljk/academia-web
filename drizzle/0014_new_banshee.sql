CREATE TABLE IF NOT EXISTS "about" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text,
	"html" text,
	"youtube_url" text,
	"conference_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "about" ADD CONSTRAINT "about_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
