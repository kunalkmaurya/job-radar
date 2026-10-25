'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';
import { Job } from '@/types';
import { isJobStale } from './helpers';

interface JobKanbanCardProps {
  job: Job;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
}

export function JobKanbanCard({ job, nowTime, onSelectJob, onApplyAndAdvance }: JobKanbanCardProps) {
  const stale = isJobStale(job, nowTime);

  return (
    <div
      onClick={() => onSelectJob(job)}
      className="p-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)] cursor-pointer transition-all shadow-sm space-y-2"
    >
      <div className="flex items-center justify-between">
        <span className="font-bold text-sm">{job.company}</span>
        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
      <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{job.role}</p>
      <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-muted)]">
        <span>{job.status === 'Applied' && stale ? '⚠️ Stale' : 'Active'}</span>
        {job.status === 'Saved' ? (
          <button
            onClick={(e) => onApplyAndAdvance(job, e)}
            className="text-[var(--accent-primary)] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            Apply ↗
          </button>
        ) : (
          <span className="hover:text-[var(--text-primary)]">Notes 📝</span>
        )}
      </div>
    </div>
  );
}
