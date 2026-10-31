CREATE TABLE "public_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"link" text NOT NULL,
	"location" varchar(255) DEFAULT 'N/A' NOT NULL,
	"exp" varchar(100) DEFAULT 'N/A' NOT NULL,
	"source" varchar(50) DEFAULT 'admin' NOT NULL,
	"posted_by" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "jobs" DROP CONSTRAINT "jobs_user_id_users_id_fk";
--> statement-breakpoint
DROP INDEX "idx_jobs_link";--> statement-breakpoint
ALTER TABLE "jobs" ADD COLUMN "public_job_id" uuid;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" varchar(50) DEFAULT 'user' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "telegram_chat_id" varchar(100);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "ingest_token" varchar(64);--> statement-breakpoint
ALTER TABLE "public_jobs" ADD CONSTRAINT "public_jobs_posted_by_users_id_fk" FOREIGN KEY ("posted_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_public_jobs_link" ON "public_jobs" USING btree ("link");--> statement-breakpoint
CREATE INDEX "idx_public_jobs_created_at" ON "public_jobs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_public_jobs_posted_by" ON "public_jobs" USING btree ("posted_by");--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_public_job_id_public_jobs_id_fk" FOREIGN KEY ("public_job_id") REFERENCES "public"."public_jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_jobs_user_link" ON "jobs" USING btree ("user_id","link");--> statement-breakpoint
CREATE INDEX "idx_jobs_user_status" ON "jobs" USING btree ("user_id","status");--> statement-breakpoint
CREATE INDEX "idx_jobs_public_job_id" ON "jobs" USING btree ("public_job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_ingest_token" ON "users" USING btree ("ingest_token");--> statement-breakpoint
CREATE INDEX "idx_users_telegram_chat_id" ON "users" USING btree ("telegram_chat_id");