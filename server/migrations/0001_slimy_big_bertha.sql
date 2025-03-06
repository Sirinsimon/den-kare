CREATE TABLE "detections" (
	"appointment_id" uuid PRIMARY KEY NOT NULL,
	"clinic_id" uuid NOT NULL,
	"detected" text[] DEFAULT '{}',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
