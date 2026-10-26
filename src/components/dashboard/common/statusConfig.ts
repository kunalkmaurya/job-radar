import { JobStatus } from '@/types';

export const STATUS_CONFIG: Record<
  JobStatus,
  { text: string; bg: string; dot: string; border: string }
> = {
  Saved: {
    text: 'var(--status-saved-text, #70A1D7)',
    bg: 'var(--status-saved-bg, rgba(112, 161, 215, 0.14))',
    dot: '#70A1D7',
    border: 'rgba(112, 161, 215, 0.35)',
  },
  Applied: {
    text: 'var(--status-applied-text, #E07A5F)',
    bg: 'var(--status-applied-bg, rgba(224, 122, 95, 0.14))',
    dot: '#E07A5F',
    border: 'rgba(224, 122, 95, 0.35)',
  },
  Interviewing: {
    text: 'var(--status-interview-text, #B392F0)',
    bg: 'var(--status-interview-bg, rgba(179, 146, 240, 0.14))',
    dot: '#B392F0',
    border: 'rgba(179, 146, 240, 0.35)',
  },
  Offer: {
    text: 'var(--status-offer-text, #68B684)',
    bg: 'var(--status-offer-bg, rgba(104, 182, 132, 0.14))',
    dot: '#68B684',
    border: 'rgba(104, 182, 132, 0.35)',
  },
  Rejected: {
    text: 'var(--status-rejected-text, #E57373)',
    bg: 'var(--status-rejected-bg, rgba(229, 115, 115, 0.14))',
    dot: '#E57373',
    border: 'rgba(229, 115, 115, 0.35)',
  },
  Archived: {
    text: 'var(--status-archived-text, #A1A09A)',
    bg: 'var(--status-archived-bg, rgba(161, 160, 154, 0.12))',
    dot: '#A1A09A',
    border: 'rgba(161, 160, 154, 0.35)',
  },
};
