'use client';

import React from 'react';
import { AlertTriangle, Star } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { formatDate } from './data';
import { isJobStale } from './helpers';
import { JobRowActions } from './table/JobRowActions';
import { JobStatusDropdown } from './common/JobStatusDropdown';

interface JobTableRowProps {
  job: Job;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus, e?: React.MouseEvent) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string, e?: React.MouseEvent) => void;
}

export function JobTableRow({
  job,
  nowTime,
  onSelectJob,
  onStatusChange,
  onToggleImportant,
  onDeleteJob,
}: JobTableRowProps) {
  const stale = isJobStale(job, nowTime);
  const isImportant = Boolean(job.isImportant);

  return (
    <tr
      onClick={() => onSelectJob(job)}
      className="hover:bg-(--bg-surface-hover) cursor-pointer transition-colors"
    >
      {/* Important / Star Toggle */}
      <td
        className="py-3.5 pl-3 pr-1 w-8 text-center"
        onClick={(e) => {
          e.stopPropagation();
          onToggleImportant?.(job.id, e);
        }}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleImportant?.(job.id, e);
          }}
          title={isImportant ? 'Marked as Important (Click to unmark)' : 'Mark as Important'}
          aria-label={
            isImportant
              ? `Unmark ${job.role} at ${job.company} as important`
              : `Mark ${job.role} at ${job.company} as important`
          }
          className="p-1 text-(--text-muted) hover:text-amber-400 transition-colors cursor-pointer group inline-flex items-center justify-center"
        >
          <Star
            className={`w-4 h-4 transition-transform group-hover:scale-110 active:scale-95 ${
              isImportant
                ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                : 'text-(--text-muted) hover:text-amber-400'
            }`}
            fill={isImportant ? 'currentColor' : 'none'}
          />
        </button>
      </td>

      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-(--accent-primary-bg) border border-(--border-subtle) text-(--accent-primary) font-bold text-xs flex items-center justify-center rounded-xs">
            {job.company.charAt(0)}
          </div>
          <span className="font-semibold text-sm text-(--text-primary)">{job.company}</span>
        </div>
      </td>

      <td className="py-3.5 px-4 text-(--text-secondary)">
        <div className="flex items-center gap-2 flex-wrap">
          <span>{job.role}</span>
          {job.referralStatus && job.referralStatus !== 'none' && (
            <span
              title={job.referrerName ? `Referrer: ${job.referrerName}` : 'Referral active'}
              className={`text-[9px] px-1.5 py-0.2 uppercase tracking-wider font-semibold border rounded-xs ${
                job.referralStatus === 'received'
                  ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  : job.referralStatus === 'asked'
                    ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                    : 'bg-red-500/15 border-red-500/30 text-red-400'
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
      </td>

      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
        <JobStatusDropdown
          status={job.status}
          onChange={(newStatus) => onStatusChange(job.id, newStatus)}
        />
      </td>

      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5 text-(--text-muted)">
          {stale && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
          <span suppressHydrationWarning className="text-[11px]">
            {job.status === 'Applied' && job.appliedAt
              ? `Applied ${Math.round((nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24))}d ago`
              : `Added ${formatDate(job.createdAt)}`}
          </span>
        </div>
      </td>

      <td className="py-3.5 px-4 text-right">
        <JobRowActions job={job} onSelectJob={onSelectJob} onDeleteJob={onDeleteJob} />
      </td>
    </tr>
  );
}
