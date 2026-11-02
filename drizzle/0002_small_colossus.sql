ALTER TABLE "users" ADD COLUMN "password_hash" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_token" text;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "reset_password_expires" timestamp with time zone;--> statement-breakpoint
CREATE INDEX "idx_users_reset_password_token" ON "users" USING btree ("reset_password_token");