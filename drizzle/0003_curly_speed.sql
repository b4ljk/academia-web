ALTER TABLE "Committees" RENAME TO "committees";--> statement-breakpoint
ALTER TABLE "committee_members" DROP CONSTRAINT "committee_members_committee_id_Committees_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "committee_members" ADD CONSTRAINT "committee_members_committee_id_committees_id_fk" FOREIGN KEY ("committee_id") REFERENCES "public"."committees"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
