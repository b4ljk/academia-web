CREATE TABLE IF NOT EXISTS "cronjob" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"last_run" date DEFAULT now()
);
