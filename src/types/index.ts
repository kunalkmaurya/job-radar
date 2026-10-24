import { z } from 'zod';
export type { Job, NewJob, User, NewUser } from '@/db/schema';

export const JOB_STATUSES = [
  'Saved',
  'Applied',
  'Interviewing',
  'Offer',
  'Rejected',
  'Archived',
] as const;

export type JobStatus = typeof JOB_STATUSES[number];

export const TIMELINE_FILTERS = [
  'all',
  'today',
  'this_week',
  'past_30_days',
] as const;

export type TimelineFilter = typeof TIMELINE_FILTERS[number];

// AI Extracted Job Schema
export const ExtractedJobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role title is required'),
  link: z.string().url('A valid job link is required'),
  location: z.string().default('N/A'),
  exp: z.string().default('N/A'),
});

export type ExtractedJob = z.infer<typeof ExtractedJobSchema>;

// Manual Job Creation Payload Schema
export const CreateJobSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  link: z.string().url('Valid URL is required'),
  status: z.enum(JOB_STATUSES).default('Saved'),
  notes: z.string().default(''),
  followUpDate: z.string().nullable().optional(),
  source: z.enum(['telegram', 'manual', 'bookmarklet']).default('manual'),
});

export type CreateJobPayload = z.infer<typeof CreateJobSchema>;

// Update Job Payload Schema
export const UpdateJobSchema = z.object({
  company: z.string().optional(),
  role: z.string().optional(),
  link: z.string().url().optional(),
  status: z.enum(JOB_STATUSES).optional(),
  notes: z.string().optional(),
  followUpDate: z.string().nullable().optional(),
  appliedAt: z.string().nullable().optional(),
});

export type UpdateJobPayload = z.infer<typeof UpdateJobSchema>;

// Funnel Metrics Response Type
export interface FunnelMetrics {
  totalJobs: number;
  appliedThisWeek: number;
  interviewingCount: number;
  offerCount: number;
  responseRatePercentage: number;
}
