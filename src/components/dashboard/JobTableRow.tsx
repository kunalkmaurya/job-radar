'use client';

import React from 'react';
import { AlertTriangle, Star } from 'lucide-react';
import { Job, JOB_STATUSES, JobStatus } from '@/types';
import { formatDate } from './data';
import { isJobStale } from './helpers';
import { JobRowActions } from './table/JobRowActions';

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
  onApplyAndAdvance,
  onDeleteJob,
}: JobTableRowProps) {
  const stale = isJobStale(job, nowTime);
  const isImportant = Boolean(job.isImportant);

  return (
    <tr
      onClick={() => onSelectJob(job)}
      className="hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-colors"
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
          aria-label={isImportant ? `Unmark ${job.role} at ${job.company} as important` : `Mark ${job.role} at ${job.company} as important`}
          className="p-1 text-[var(--text-muted)] hover:text-amber-400 transition-colors cursor-pointer group inline-flex items-center justify-center"
        >
          <Star
            className={`w-4 h-4 transition-transform group-hover:scale-110 active:scale-95 ${
              isImportant
                ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                : 'text-[var(--text-muted)] hover:text-amber-400'
            }`}
            fill={isImportant ? 'currentColor' : 'none'}
          />
        </button>
      </td>

      {/* Company */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] text-[var(--accent-primary)] font-bold text-xs flex items-center justify-center">
            {job.company.charAt(0)}
          </div>
          <span className="font-semibold text-sm text-[var(--text-primary)]">
            {job.company}
          </span>
        </div>
      </td>

      {/* Role */}
      <td className="py-3.5 px-4 text-[var(--text-secondary)]">
        <div className="flex items-center gap-2">
          <span>{job.role}</span>
          <span className="text-[10px] px-1.5 py-0.5 bg-[var(--border-subtle)] text-[var(--text-muted)]">
            {job.location}
          </span>
        </div>
      </td>

      {/* Status Dropdown */}
      <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
          className="px-2.5 py-1 text-xs font-medium border border-transparent cursor-pointer focus:outline-none"
          style={{
            color: `var(--status-${job.status.toLowerCase()}-text, #60A5FA)`,
            backgroundColor: `var(--status-${job.status.toLowerCase()}-bg, rgba(59,130,246,0.15))`,
          }}
        >
          {JOB_STATUSES.map((status) => (
            <option key={status} value={status} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
              {status}
            </option>
          ))}
        </select>
      </td>

      {/* Timeline / Age */}
      <td className="py-3.5 px-4">
        <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
          {stale && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
          <span suppressHydrationWarning>
            {job.status === 'Applied' && job.appliedAt
              ? `Applied ${Math.round((nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24))}d ago`
              : `Added ${formatDate(job.createdAt)}`}
          </span>
        </div>
      </td>

      {/* Quick Actions */}
      <td className="py-3.5 px-4 text-right">
        <JobRowActions
          job={job}
          onSelectJob={onSelectJob}
          onApplyAndAdvance={onApplyAndAdvance}
          onDeleteJob={onDeleteJob}
        />
      </td>
    </tr>
  );
}
