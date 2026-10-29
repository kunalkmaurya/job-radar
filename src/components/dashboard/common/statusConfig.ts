import { JobStatus } from '@/types';

export const STATUS_CONFIG: Record<
  JobStatus,
  { text: string; bg: string; dot: string; border: string }
> = {
  Saved: {
    text: 'var(--status-saved-text, #94A3B8)',
    bg: 'var(--status-saved-bg, rgba(100, 116, 139, 0.15))',
    dot: '#94A3B8',
    border: 'var(--status-saved-border, rgba(100, 116, 139, 0.30))',
  },
  Applied: {
    text: 'var(--status-applied-text, #5499EB)',
    bg: 'var(--status-applied-bg, rgba(49, 120, 198, 0.15))',
    dot: '#3178C6',
    border: 'var(--status-applied-border, rgba(49, 120, 198, 0.40))',
  },
  Interviewing: {
    text: 'var(--status-interview-text, #FACC15)',
    bg: 'var(--status-interview-bg, rgba(234, 179, 8, 0.15))',
    dot: '#EAB308',
    border: 'var(--status-interview-border, rgba(234, 179, 8, 0.40))',
  },
  Offer: {
    text: 'var(--status-offer-text, #34D399)',
    bg: 'var(--status-offer-bg, rgba(16, 185, 129, 0.15))',
    dot: '#10B981',
    border: 'var(--status-offer-border, rgba(16, 185, 129, 0.40))',
  },
  Rejected: {
    text: 'var(--status-rejected-text, #F87171)',
    bg: 'var(--status-rejected-bg, rgba(239, 68, 68, 0.15))',
    dot: '#EF4444',
    border: 'var(--status-rejected-border, rgba(239, 68, 68, 0.40))',
  },
  Archived: {
    text: 'var(--status-archived-text, #94A3B8)',
    bg: 'var(--status-archived-bg, rgba(100, 116, 139, 0.15))',
    dot: '#94A3B8',
    border: 'var(--status-archived-border, rgba(100, 116, 139, 0.30))',
  },
};
