'use client';

import React from 'react';
import { AlertTriangle, ExternalLink, Star, Users } from 'lucide-react';
import { Job } from '@/types';
import { isJobStale } from './helpers';
import { getLinkedIn1stDegreeSearchUrl } from '@/lib/linkedin';

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
  const linkedInUrl = getLinkedIn1stDegreeSearchUrl(job.company);

  return (
    <div
      onClick={() => onSelectJob(job)}
      className={`p-3 border rounded-sm transition-all cursor-pointer shadow-xs space-y-2 select-none ${
        isImportant
          ? 'border-amber-500/40 bg-amber-500/[0.04] hover:border-amber-400'
          : 'border-(--border-subtle) bg-(--bg-surface) hover:border-(--accent-primary)'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-xs text-(--text-primary) truncate">
            {job.company}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleImportant?.(job.id, e);
            }}
            title={isImportant ? 'Marked as Important' : 'Mark as Important'}
            aria-label={
              isImportant
                ? `Unmark ${job.role} at ${job.company} as important`
                : `Mark ${job.role} at ${job.company} as important`
            }
            className="p-1 text-(--text-muted) hover:text-amber-500 transition-colors cursor-pointer rounded-sm"
          >
            <Star
              className={`w-3.5 h-3.5 ${
                isImportant ? 'text-amber-500 fill-amber-500' : 'text-(--text-muted)'
              }`}
            />
          </button>

          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={`Find 1st-degree connections at ${job.company}`}
            className="p-1 text-(--text-muted) hover:text-[#0A66C2] transition-colors rounded-sm"
          >
            <Users className="w-3.5 h-3.5" />
          </a>

          <a
            href={job.link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            title="Open Link"
            className="p-1 text-(--text-muted) hover:text-(--text-primary) transition-colors rounded-sm"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      <p className="text-xs text-(--text-secondary) line-clamp-1">{job.role}</p>

      {job.referralStatus && job.referralStatus !== 'none' && (
        <div className="pt-0.5">
          <span
            className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 uppercase tracking-wider font-semibold border rounded-sm ${
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
        </div>
      )}

      <div className="flex items-center justify-between pt-1 text-[11px] text-(--text-muted)">
        <div className="flex items-center gap-1">
          {job.status === 'Applied' && stale ? (
            <span className="text-amber-500 font-medium flex items-center gap-1">
              <AlertTriangle className="w-3 h-3 text-amber-500 animate-pulse" />
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
          className="text-[11px] font-medium text-(--accent-blue-bright) hover:underline cursor-pointer"
        >
          Details
        </button>
      </div>
    </div>
  );
}
