'use client';

import React from 'react';
import { AlertTriangle, ExternalLink, FileText, Star } from 'lucide-react';
import { Job } from '@/types';
import { isJobStale } from './helpers';

interface JobKanbanCardProps {
  job: Job;
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance?: (job: Job, e?: React.MouseEvent) => void;
}

export function JobKanbanCard({
  job,
  nowTime,
  onSelectJob,
  onToggleImportant,
}: JobKanbanCardProps) {
  const stale = isJobStale(job, nowTime);
  const isImportant = Boolean(job.isImportant);

  return (
    <div
      onClick={() => onSelectJob(job)}
      className={`p-3 border rounded-xs transition-all cursor-pointer shadow-xs space-y-2 ${
        isImportant
          ? 'border-amber-500/40 bg-amber-500/[0.04] hover:border-amber-400'
          : 'border-(--border-subtle) bg-(--bg-surface) hover:border-(--accent-primary)/80'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-bold text-sm truncate">{job.company}</span>
          {isImportant && <Star className="w-3 h-3 fill-amber-400 text-amber-400 shrink-0" />}
        </div>

        <div className="flex items-center gap-1">
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
            className="p-1 text-(--text-muted) hover:text-amber-400 transition-colors cursor-pointer group"
          >
            <Star
              className={`w-3.5 h-3.5 transition-transform group-hover:scale-110 active:scale-95 ${
                isImportant
                  ? 'text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.5)]'
                  : 'text-(--text-muted) hover:text-amber-400'
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
            className="p-1 text-(--text-muted) hover:text-(--text-primary)"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <p className="text-xs text-(--text-secondary) line-clamp-1">{job.role}</p>

      {job.referralStatus && job.referralStatus !== 'none' && (
        <div className="pt-0.5">
          <span
            className={`inline-flex items-center gap-1 text-[9px] px-1.5 py-0.2 uppercase tracking-wider font-semibold border rounded-xs ${
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
        </div>
      )}

      <div className="flex items-center justify-between pt-1 text-[11px] text-(--text-muted)">
        <div className="flex items-center gap-1">
          {job.status === 'Applied' && stale ? (
            <span className="text-amber-400 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-400 animate-pulse" />
              <span>Stale</span>
            </span>
          ) : (
            <span>Active</span>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelectJob(job);
          }}
          title="Open Notes"
          aria-label={`Open notes for ${job.role} at ${job.company}`}
          className="p-1 -mr-1 hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
