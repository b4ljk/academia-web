CREATE TABLE IF NOT EXISTS "registered_user" (
	"id" serial PRIMARY KEY NOT NULL,
	"first_name" text NOT NULL,
	"last_name" text NOT NULL,
	"degree" text,
	"position" text,
	"organization" text,
	"address_of_organization" text,
	"phone" text,
	"email" text NOT NULL,
	"country" text,
	"zip_code" text,
	"is_presenter" boolean DEFAULT false,
	"title_of_paper" text,
	"abstract" text,
	"conference_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "registered_user" ADD CONSTRAINT "registered_user_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
