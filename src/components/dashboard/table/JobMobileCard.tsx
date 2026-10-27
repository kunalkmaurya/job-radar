'use client';

import React from 'react';
import { AlertTriangle, Star } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { formatDate } from '../data';
import { isJobStale } from '../helpers';
import { JobRowActions } from './JobRowActions';
import { JobStatusDropdown } from '../common/JobStatusDropdown';

interface JobMobileCardProps {
  job: Job;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus, e?: React.MouseEvent) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string, e?: React.MouseEvent) => void;
}

export function JobMobileCard({
  job,
  nowTime,
  onSelectJob,
  onStatusChange,
  onToggleImportant,
  onDeleteJob,
}: JobMobileCardProps) {
  const stale = isJobStale(job, nowTime);
  const isImportant = Boolean(job.isImportant);

  return (
    <div
      onClick={() => onSelectJob(job)}
      className="p-3.5 bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors cursor-pointer space-y-2.5 border-b border-[var(--border-subtle)] last:border-b-0"
    >
      {/* Top Row: Star + Company + Action Icons */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant?.(job.id, e);
            }}
            title={isImportant ? 'Unmark important' : 'Mark important'}
            aria-label={isImportant ? `Unmark ${job.company} as important` : `Mark ${job.company} as important`}
            className="p-1 -ml-1 text-[var(--text-muted)] hover:text-amber-400 transition-colors cursor-pointer shrink-0"
          >
            <Star
              className={`w-4 h-4 ${isImportant ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]' : 'text-[var(--text-muted)]'}`}
            />
          </button>

          <div className="w-6 h-6 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] text-[var(--accent-primary)] font-bold text-[11px] flex items-center justify-center shrink-0">
            {job.company.charAt(0)}
          </div>

          <span className="font-semibold text-sm text-[var(--text-primary)] truncate">
            {job.company}
          </span>
        </div>

        {/* Action icons (Notes, Link, Delete) */}
        <JobRowActions
          job={job}
          onSelectJob={onSelectJob}
          onDeleteJob={onDeleteJob}
        />
      </div>

      {/* Middle Row: Role Title & Referral Badge */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-[var(--text-secondary)] font-medium">
          {job.role}
        </span>
        {job.referralStatus && job.referralStatus !== 'none' && (
          <span
            className={`text-[9px] px-1.5 py-0.2 font-mono uppercase tracking-wider font-semibold border ${
              job.referralStatus === 'received'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : job.referralStatus === 'asked'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}
          >
            {job.referralStatus === 'received'
              ? job.referrerName ? `Referred (${job.referrerName.split(' ')[0]})` : 'Referred'
              : `Referral: ${job.referralStatus}`}
          </span>
        )}
      </div>

      {/* Bottom Row: Status Dropdown + Timeline / Age */}
      <div className="flex items-center justify-between gap-2 pt-1 border-t border-[var(--border-subtle)]/40 text-[11px]">
        <div onClick={(e) => e.stopPropagation()}>
          <JobStatusDropdown
            status={job.status}
            onChange={(newStatus) => onStatusChange(job.id, newStatus)}
          />
        </div>

        <div className="flex items-center gap-1 text-[var(--text-muted)] font-mono text-[10px]">
          {stale && <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />}
          <span>
            {job.status === 'Applied' && job.appliedAt
              ? `Applied ${Math.round((nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24))}d ago`
              : `Added ${formatDate(job.createdAt)}`}
          </span>
        </div>
      </div>
    </div>
  );
}
