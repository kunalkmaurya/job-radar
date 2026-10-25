import { Job } from '@/types';

export const INITIAL_MOCK_JOBS: Job[] = [
  {
    id: '1',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    link: 'https://stripe.com/jobs/12345',
    location: 'N/A',
    exp: 'N/A',
    status: 'Saved',
    notes: 'Referred by Sarah on LinkedIn. Focus on distributed systems and Go.',
    followUpDate: null,
    appliedAt: null,
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-24T18:00:00Z'),
    updatedAt: new Date('2026-10-24T18:00:00Z'),
  },
  {
    id: '2',
    company: 'Datadog',
    role: 'Senior Backend Systems Lead',
    link: 'https://careers.datadoghq.com/detail/67890',
    location: 'N/A',
    exp: 'N/A',
    status: 'Applied',
    notes: 'Applied via Greenhouse. Recruiter message sent to John.',
    followUpDate: '2026-10-30',
    appliedAt: new Date('2026-10-21T10:00:00Z'),
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-21T10:00:00Z'),
    updatedAt: new Date('2026-10-21T10:00:00Z'),
  },
  {
    id: '3',
    company: 'Linear',
    role: 'Fullstack Product Engineer',
    link: 'https://jobs.lever.co/linear/11223',
    location: 'N/A',
    exp: 'N/A',
    status: 'Interviewing',
    notes: 'Technical screen scheduled for Thursday at 2 PM PST.',
    followUpDate: '2026-10-29',
    appliedAt: new Date('2026-10-17T14:00:00Z'),
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-16T12:00:00Z'),
    updatedAt: new Date('2026-10-22T09:00:00Z'),
  },
  {
    id: '4',
    company: 'Nvidia',
    role: 'AI Infrastructure Specialist',
    link: 'https://nvidia.wd5.myworkdayjobs.com/detail/44556',
    location: 'N/A',
    exp: 'N/A',
    status: 'Applied',
    notes: 'Workday application submitted. Stale check warning demo.',
    followUpDate: null,
    appliedAt: new Date('2026-10-08T11:00:00Z'), // > 14 days ago (Stale!)
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-08T11:00:00Z'),
    updatedAt: new Date('2026-10-08T11:00:00Z'),
  },
  {
    id: '5',
    company: 'Vercel',
    role: 'Edge Runtime Engineer',
    link: 'https://vercel.com/careers/edge-7788',
    location: 'N/A',
    exp: 'N/A',
    status: 'Offer',
    notes: 'Offer letter received! Reviewing compensation package.',
    followUpDate: null,
    appliedAt: new Date('2026-10-04T16:00:00Z'),
    source: 'manual',
    userId: null,
    createdAt: new Date('2026-10-02T10:00:00Z'),
    updatedAt: new Date('2026-10-23T15:00:00Z'),
  },
];

export function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}
