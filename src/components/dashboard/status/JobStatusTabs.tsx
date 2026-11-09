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
  textColor: string;
  activeTextColor: string;
  bgColor: string;
  activeBgColor: string;
  borderColor: string;
  activeBorderColor: string;
}

const STATUS_TABS: StatusTabConfig[] = [
  {
    id: 'all',
    label: 'All',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--accent-blue-bright)',
    bgColor: 'transparent',
    activeBgColor: 'var(--accent-primary-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--accent-primary)',
  },
  {
    id: 'Saved',
    label: 'Saved',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-saved-text, #44546F)',
    bgColor: 'transparent',
    activeBgColor: 'var(--status-saved-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--status-saved-border)',
  },
  {
    id: 'Applied',
    label: 'Applied',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-applied-text, #0052CC)',
    bgColor: 'transparent',
    activeBgColor: 'var(--status-applied-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--status-applied-border)',
  },
  {
    id: 'Interviewing',
    label: 'Interviewing',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-interview-text, #944900)',
    bgColor: 'transparent',
    activeBgColor: 'var(--status-interview-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--status-interview-border)',
  },
  {
    id: 'Offer',
    label: 'Offer',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-offer-text, #216E4E)',
    bgColor: 'transparent',
    activeBgColor: 'var(--status-offer-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--status-offer-border)',
  },
  {
    id: 'Rejected',
    label: 'Rejected',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-rejected-text, #AE2E24)',
    bgColor: 'transparent',
    activeBgColor: 'var(--status-rejected-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--status-rejected-border)',
  },
  {
    id: 'Archived',
    label: 'Archived',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-archived-text, #44546F)',
    bgColor: 'transparent',
    activeBgColor: 'var(--status-archived-bg)',
    borderColor: 'var(--border-subtle)',
    activeBorderColor: 'var(--status-archived-border)',
  },
];

export function JobStatusTabs({ activeStatus, onSelectStatus, counts }: JobStatusTabsProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter jobs by pipeline status"
      className="w-full flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 scroll-smooth"
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
            style={{
              backgroundColor: isActive ? tab.activeBgColor : tab.bgColor,
              borderColor: isActive ? tab.activeBorderColor : tab.borderColor,
              color: isActive ? tab.activeTextColor : tab.textColor,
            }}
            className={`flex items-center gap-1.5 h-8 px-3 text-xs border rounded-sm whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              isActive ? 'font-semibold shadow-xs' : 'font-medium hover:text-(--text-primary)'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-sm transition-colors ${
                isActive
                  ? 'bg-current/15 font-bold'
                  : 'bg-black/5 dark:bg-white/5 text-(--text-muted)'
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
