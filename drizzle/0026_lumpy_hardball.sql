ALTER TABLE "call_for_paper" DROP CONSTRAINT "call_for_paper_conference_id_conference_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "call_for_paper" ADD CONSTRAINT "call_for_paper_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
