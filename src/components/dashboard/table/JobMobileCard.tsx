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
      className="p-3.5 bg-(--bg-surface) hover:bg-(--bg-surface-hover) transition-colors cursor-pointer space-y-2.5 border-b border-(--border-subtle) last:border-b-0"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant?.(job.id, e);
            }}
            title={isImportant ? 'Unmark important' : 'Mark important'}
            aria-label={
              isImportant
                ? `Unmark ${job.company} as important`
                : `Mark ${job.company} as important`
            }
            className="p-1 -ml-1 text-(--text-muted) hover:text-amber-500 transition-colors cursor-pointer shrink-0 rounded-sm"
          >
            <Star
              className={`w-4 h-4 ${isImportant ? 'text-amber-500 fill-amber-500' : 'text-(--text-muted)'}`}
            />
          </button>

          <div className="w-6 h-6 bg-(--accent-primary-bg) border border-(--accent-border) text-(--accent-blue-bright) font-bold text-[11px] flex items-center justify-center shrink-0 rounded-sm">
            {job.company.charAt(0)}
          </div>

          <span className="font-semibold text-xs text-(--text-primary) truncate">
            {job.company}
          </span>
        </div>

        <JobRowActions job={job} onSelectJob={onSelectJob} onDeleteJob={onDeleteJob} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs text-(--text-secondary) font-medium">{job.role}</span>
        {job.referralStatus && job.referralStatus !== 'none' && (
          <span
            className={`text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-semibold border rounded-sm ${
              job.referralStatus === 'received'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                : job.referralStatus === 'asked'
                  ? 'bg-amber-500/15 border-amber-500/30 text-amber-600 dark:text-amber-400'
                  : 'bg-red-500/15 border-red-500/30 text-red-600 dark:text-red-400'
            }`}
          >
            {job.referralStatus === 'received'
              ? job.referrerName
                ? `Referred (${job.referrerName.split(' ')[0]})`
                : 'Referred'
              : `Referral: ${job.referralStatus}`}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1 border-t border-(--border-subtle)/40 text-[11px]">
        <div onClick={(e) => e.stopPropagation()}>
          <JobStatusDropdown
            status={job.status}
            onChange={(newStatus) => onStatusChange(job.id, newStatus)}
          />
        </div>

        <div className="flex items-center gap-1 text-(--text-muted) text-[10px]">
          {stale && <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse" />}
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
