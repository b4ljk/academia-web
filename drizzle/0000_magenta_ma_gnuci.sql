DO $$ BEGIN
 CREATE TYPE "public"."type" AS ENUM('COMMITEE', 'CHAIRS', 'SPEAKER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conference" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"logo" text,
	"banner" text,
	"location" text,
	"start" date NOT NULL,
	"end" date,
	"year" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "organizers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"logo" text,
	"description" text,
	"country" text,
	"html" text,
	"conference_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speakers" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"bio" text,
	"title" text,
	"avatar" text,
	"description" text NOT NULL,
	"country" text,
	"type" "type" DEFAULT 'SPEAKER'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "speakers_to_conference" (
	"user_id" integer NOT NULL,
	"conference_id" integer NOT NULL,
	CONSTRAINT "speakers_to_conference_user_id_conference_id_pk" PRIMARY KEY("user_id","conference_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "venue" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"location" text,
	"description" text,
	"html" text,
	"conference_id" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "organizers" ADD CONSTRAINT "organizers_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speakers_to_conference" ADD CONSTRAINT "speakers_to_conference_user_id_speakers_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."speakers"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "speakers_to_conference" ADD CONSTRAINT "speakers_to_conference_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "venue" ADD CONSTRAINT "venue_conference_id_conference_id_fk" FOREIGN KEY ("conference_id") REFERENCES "public"."conference"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
