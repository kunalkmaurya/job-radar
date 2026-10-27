'use client';

import React from 'react';
import { JobStatus } from '@/types';

export type JobStatusFilter = 'all' | JobStatus;

export interface JobStatusTabsProps {
  activeStatus: JobStatusFilter;
  onSelectStatus: (status: JobStatusFilter) => void;
  counts: Record<JobStatusFilter, number>;
}

interface StatusTabConfig {
  id: JobStatusFilter;
  label: string;
  dotColor: string;
}

const STATUS_TABS: StatusTabConfig[] = [
  { id: 'all', label: 'All', dotColor: 'var(--accent-primary)' },
  { id: 'Saved', label: 'Saved', dotColor: 'var(--status-saved-text, #70A1D7)' },
  { id: 'Applied', label: 'Applied', dotColor: 'var(--status-applied-text, #E07A5F)' },
  { id: 'Interviewing', label: 'Interviewing', dotColor: 'var(--status-interview-text, #B392F0)' },
  { id: 'Offer', label: 'Offer', dotColor: 'var(--status-offer-text, #68B684)' },
  { id: 'Rejected', label: 'Rejected', dotColor: 'var(--status-rejected-text, #E57373)' },
  { id: 'Archived', label: 'Archived', dotColor: 'var(--status-archived-text, #A1A09A)' },
];

export function JobStatusTabs({ activeStatus, onSelectStatus, counts }: JobStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter jobs by pipeline status"
      className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)] overflow-x-auto scrollbar-none flex items-center gap-1 scroll-smooth"
    >
      {STATUS_TABS.map((tab) => {
        const isActive = activeStatus === tab.id;
        const count = counts[tab.id] ?? 0;

        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-controls="jobs-table-panel"
            id={`status-tab-${tab.id.toLowerCase()}`}
            onClick={() => onSelectStatus(tab.id)}
            className={`flex items-center gap-1.5 sm:gap-2 py-2 sm:py-2.5 px-2.5 sm:px-3.5 text-[11px] sm:text-xs font-mono uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap shrink-0 ${
              isActive
                ? 'border-[var(--accent-primary)] text-[var(--text-primary)] font-bold'
                : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
            }`}
          >
            <span
              className="w-1.5 h-1.5 shrink-0"
              style={{ backgroundColor: tab.dotColor }}
              aria-hidden="true"
            />
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 font-mono transition-colors ${
                isActive
                  ? 'bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] font-bold'
                  : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
