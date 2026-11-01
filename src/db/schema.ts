import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  boolean,
  uniqueIndex,
  index,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users Table (Personal Account & Role Isolation)
export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    name: varchar('name', { length: 255 }),
    image: text('image'),
    role: varchar('role', { length: 50 }).default('user').notNull(), // 'admin' | 'user'
    telegramChatId: varchar('telegram_chat_id', { length: 100 }),
    ingestToken: varchar('ingest_token', { length: 64 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('idx_users_email').on(table.email),
    uniqueIndex('idx_users_ingest_token').on(table.ingestToken),
    index('idx_users_telegram_chat_id').on(table.telegramChatId),
  ]
);

// Public Jobs Table (Curated Community / Admin Pool)
export const publicJobs = pgTable(
  'public_jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    company: varchar('company', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull(),
    link: text('link').notNull(),
    location: varchar('location', { length: 255 }).default('N/A').notNull(),
    exp: varchar('exp', { length: 100 }).default('N/A').notNull(),
    source: varchar('source', { length: 50 }).default('admin').notNull(), // 'admin' | 'telegram'
    postedBy: uuid('posted_by').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('idx_public_jobs_link').on(table.link),
    index('idx_public_jobs_created_at').on(table.createdAt),
    index('idx_public_jobs_posted_by').on(table.postedBy),
  ]
);

// Jobs Table (User-Specific Private Tracking Entity)
export const jobs = pgTable(
  'jobs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    publicJobId: uuid('public_job_id').references(() => publicJobs.id, { onDelete: 'set null' }),
    company: varchar('company', { length: 255 }).notNull(),
    role: varchar('role', { length: 255 }).notNull(),
    link: text('link').notNull(),
    location: varchar('location', { length: 255 }).default('N/A').notNull(),
    exp: varchar('exp', { length: 100 }).default('N/A').notNull(),
    status: varchar('status', { length: 50 }).default('Saved').notNull(), // Saved, Applied, Interviewing, Offer, Rejected, Archived
    notes: text('notes').default('').notNull(),
    followUpDate: date('follow_up_date'),
    appliedAt: timestamp('applied_at', { withTimezone: true }),
    isImportant: boolean('is_important').default(false),
    referralStatus: varchar('referral_status', { length: 50 }).default('none'), // none, asked, received, declined
    referrerName: varchar('referrer_name', { length: 255 }),
    referrerContact: varchar('referrer_contact', { length: 255 }),
    referralNotes: text('referral_notes').default(''),
    source: varchar('source', { length: 50 }).default('telegram').notNull(), // telegram, manual, bookmarklet, feed
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('idx_jobs_user_link').on(table.userId, table.link),
    index('idx_jobs_user_id').on(table.userId),
    index('idx_jobs_status').on(table.status),
    index('idx_jobs_user_status').on(table.userId, table.status),
    index('idx_jobs_created_at').on(table.createdAt),
    index('idx_jobs_applied_at').on(table.appliedAt),
    index('idx_jobs_public_job_id').on(table.publicJobId),
  ]
);

// Drizzle Relations
export const usersRelations = relations(users, ({ many }) => ({
  jobs: many(jobs),
  publicJobs: many(publicJobs),
}));

export const publicJobsRelations = relations(publicJobs, ({ one, many }) => ({
  postedByUser: one(users, {
    fields: [publicJobs.postedBy],
    references: [users.id],
  }),
  trackedUserJobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one }) => ({
  user: one(users, {
    fields: [jobs.userId],
    references: [users.id],
  }),
  publicJob: one(publicJobs, {
    fields: [jobs.publicJobId],
    references: [publicJobs.id],
  }),
}));

// Export Types
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type PublicJob = typeof publicJobs.$inferSelect;
export type NewPublicJob = typeof publicJobs.$inferInsert;
