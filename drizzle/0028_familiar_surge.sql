ALTER TABLE "about" DROP CONSTRAINT "about_conference_id_conference_id_fk";
--> statement-breakpoint
ALTER TABLE "committees" ALTER COLUMN "conference_id" DROP NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "about" ADD CONSTRAINT "about_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
