ALTER TABLE "committee_members" DROP CONSTRAINT "committee_members_committee_id_committees_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
