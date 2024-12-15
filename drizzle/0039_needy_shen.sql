CREATE TABLE IF NOT EXISTS "design_guidelines" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text,
	"description" text,
	"html" text,
	"conference_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "design_guidelines" ADD CONSTRAINT "design_guidelines_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
