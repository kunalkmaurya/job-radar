import { JobStatus } from '@/types';

export const STATUS_CONFIG: Record<
  JobStatus,
  { text: string; bg: string; dot: string; border: string }
> = {
  Saved: {
    text: 'var(--status-saved-text, #44546F)',
    bg: 'var(--status-saved-bg, #F1F2F4)',
    dot: '#626F86',
    border: 'var(--status-saved-border, #DCDFE4)',
  },
  Applied: {
    text: 'var(--status-applied-text, #0052CC)',
    bg: 'var(--status-applied-bg, #E9F2FF)',
    dot: '#0C66E4',
    border: 'var(--status-applied-border, #CCE0FF)',
  },
  Interviewing: {
    text: 'var(--status-interview-text, #944900)',
    bg: 'var(--status-interview-bg, #FFF7D6)',
    dot: '#FF8B00',
    border: 'var(--status-interview-border, #F5CD47)',
  },
  Offer: {
    text: 'var(--status-offer-text, #216E4E)',
    bg: 'var(--status-offer-bg, #DCFFF1)',
    dot: '#1F845A',
    border: 'var(--status-offer-border, #7EE2B8)',
  },
  Rejected: {
    text: 'var(--status-rejected-text, #AE2E24)',
    bg: 'var(--status-rejected-bg, #FFEDEB)',
    dot: '#CA3521',
    border: 'var(--status-rejected-border, #FD9891)',
  },
  Archived: {
    text: 'var(--status-archived-text, #44546F)',
    bg: 'var(--status-archived-bg, #F1F2F4)',
    dot: '#626F86',
    border: 'var(--status-archived-border, #DCDFE4)',
  },
};
