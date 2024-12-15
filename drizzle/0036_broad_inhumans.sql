CREATE TABLE IF NOT EXISTS "author" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"submission_file_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "submission_file" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"paper_file" text NOT NULL,
	"is_poster" boolean DEFAULT false,
	"conference_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "author" ADD CONSTRAINT "author_submission_file_id_submission_file_id_fk" FOREIGN KEY ("submission_file_id") REFERENCES "public"."submission_file"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "submission_file" ADD CONSTRAINT "submission_file_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
