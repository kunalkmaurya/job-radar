CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"company" varchar(255) NOT NULL,
	"role" varchar(255) NOT NULL,
	"link" text NOT NULL,
	"location" varchar(255) DEFAULT 'N/A' NOT NULL,
	"exp" varchar(100) DEFAULT 'N/A' NOT NULL,
	"status" varchar(50) DEFAULT 'Saved' NOT NULL,
	"notes" text DEFAULT '' NOT NULL,
	"follow_up_date" date,
	"applied_at" timestamp with time zone,
	"is_important" boolean DEFAULT false,
	"referral_status" varchar(50) DEFAULT 'none',
	"referrer_name" varchar(255),
	"referrer_contact" varchar(255),
	"referral_notes" text DEFAULT '',
	"source" varchar(50) DEFAULT 'telegram' NOT NULL,
	"user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"image" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_jobs_link" ON "jobs" USING btree ("link");--> statement-breakpoint
CREATE INDEX "idx_jobs_status" ON "jobs" USING btree ("status");--> statement-breakpoint
CREATE INDEX "idx_jobs_created_at" ON "jobs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "idx_jobs_applied_at" ON "jobs" USING btree ("applied_at");--> statement-breakpoint
CREATE INDEX "idx_jobs_user_id" ON "jobs" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_users_email" ON "users" USING btree ("email");