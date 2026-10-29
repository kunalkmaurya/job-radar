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
    bgColor: 'rgba(49, 120, 198, 0.06)',
    activeBgColor: 'var(--accent-primary-bg)',
    borderColor: 'rgba(49, 120, 198, 0.2)',
    activeBorderColor: 'var(--accent-primary)',
  },
  {
    id: 'Saved',
    label: 'Saved',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-saved-text, #94A3B8)',
    bgColor: 'rgba(100, 116, 139, 0.06)',
    activeBgColor: 'var(--status-saved-bg)',
    borderColor: 'rgba(100, 116, 139, 0.18)',
    activeBorderColor: 'rgba(100, 116, 139, 0.55)',
  },
  {
    id: 'Applied',
    label: 'Applied',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-applied-text, #5499EB)',
    bgColor: 'rgba(49, 120, 198, 0.06)',
    activeBgColor: 'var(--status-applied-bg)',
    borderColor: 'rgba(49, 120, 198, 0.2)',
    activeBorderColor: 'rgba(49, 120, 198, 0.6)',
  },
  {
    id: 'Interviewing',
    label: 'Interviewing',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-interview-text, #FACC15)',
    bgColor: 'rgba(234, 179, 8, 0.06)',
    activeBgColor: 'var(--status-interview-bg)',
    borderColor: 'rgba(234, 179, 8, 0.2)',
    activeBorderColor: 'rgba(234, 179, 8, 0.6)',
  },
  {
    id: 'Offer',
    label: 'Offer',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-offer-text, #34D399)',
    bgColor: 'rgba(16, 185, 129, 0.06)',
    activeBgColor: 'var(--status-offer-bg)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
    activeBorderColor: 'rgba(16, 185, 129, 0.6)',
  },
  {
    id: 'Rejected',
    label: 'Rejected',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-rejected-text, #F87171)',
    bgColor: 'rgba(239, 68, 68, 0.06)',
    activeBgColor: 'var(--status-rejected-bg)',
    borderColor: 'rgba(239, 68, 68, 0.2)',
    activeBorderColor: 'rgba(239, 68, 68, 0.6)',
  },
  {
    id: 'Archived',
    label: 'Archived',
    textColor: 'var(--text-secondary)',
    activeTextColor: 'var(--status-archived-text, #94A3B8)',
    bgColor: 'rgba(100, 116, 139, 0.06)',
    activeBgColor: 'var(--status-archived-bg)',
    borderColor: 'rgba(100, 116, 139, 0.18)',
    activeBorderColor: 'rgba(100, 116, 139, 0.55)',
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
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs border rounded-xs whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
              isActive ? 'font-semibold shadow-xs' : 'font-medium hover:text-(--text-primary)'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-xs transition-colors ${
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
