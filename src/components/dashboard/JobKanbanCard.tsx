'use client';

import React from 'react';
import { ExternalLink, Star } from 'lucide-react';
import { Job } from '@/types';
import { isJobStale } from './helpers';

interface JobKanbanCardProps {
  job: Job;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
}

export function JobKanbanCard({
  job,
  nowTime,
  onSelectJob,
  onToggleImportant,
  onApplyAndAdvance,
}: JobKanbanCardProps) {
  const stale = isJobStale(job, nowTime);
  const isImportant = Boolean(job.isImportant);

  return (
    <div
      onClick={() => onSelectJob(job)}
      className={`p-3.5 border transition-all cursor-pointer shadow-sm space-y-2 ${
        isImportant
          ? 'border-amber-500/40 bg-amber-500/[0.04] hover:border-amber-400'
          : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-[var(--accent-primary)]'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold text-sm truncate">{job.company}</span>
          {isImportant && (
            <span className="text-[10px] px-1 py-0.2 text-amber-400 font-mono font-semibold tracking-wider">
              ★
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant?.(job.id, e);
            }}
            title={isImportant ? 'Marked as Important (Click to unmark)' : 'Mark as Important'}
            aria-label={isImportant ? `Unmark ${job.role} at ${job.company} as important` : `Mark ${job.role} at ${job.company} as important`}
            className="p-1 text-[var(--text-muted)] hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <Star
              className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 active:scale-95 ${
                isImportant
                  ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : 'text-[var(--text-muted)] hover:text-amber-400'
              }`}
              fill={isImportant ? 'currentColor' : 'none'}
            />
          </button>

          <a
            href={job.link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open Link"
            className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{job.role}</p>

      {job.referralStatus && job.referralStatus !== 'none' && (
        <div className="pt-0.5">
          <span
            className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 font-mono uppercase tracking-wider font-semibold border ${
              job.referralStatus === 'received'
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                : job.referralStatus === 'asked'
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-400'
                : 'bg-red-500/15 border-red-500/30 text-red-400'
            }`}
          >
            🤝 {job.referralStatus === 'received' ? (job.referrerName ? `Referred (${job.referrerName.split(' ')[0]})` : 'Referred') : job.referralStatus}
          </span>
        </div>
      )}

      <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-muted)]">
        <span>{job.status === 'Applied' && stale ? '⚠️ Stale' : 'Active'}</span>
        {job.status === 'Saved' ? (
          <button
            onClick={(e) => onApplyAndAdvance(job, e)}
            className="text-[var(--accent-primary)] hover:underline flex items-center gap-0.5 cursor-pointer font-medium"
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
