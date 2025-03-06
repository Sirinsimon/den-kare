CREATE TABLE IF NOT EXISTS "doctors" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"pwd" text NOT NULL,
	"clinicId" uuid
);
--> statement-breakpoint
DROP TABLE "users";