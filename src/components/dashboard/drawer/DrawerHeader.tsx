'use client';

import React from 'react';
import { X, ArrowUpRight, Star, Users } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { JobStatusDropdown } from '../common/JobStatusDropdown';
import { getLinkedIn1stDegreeSearchUrl } from '@/lib/linkedin';

interface DrawerHeaderProps {
  job: Job;
  onClose: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onToggleImportant?: (jobId: string) => void;
}

export function DrawerHeader({
  job,
  onClose,
  onStatusChange,
  onToggleImportant,
}: DrawerHeaderProps) {
  const isImportant = Boolean(job.isImportant);
  const linkedInUrl = getLinkedIn1stDegreeSearchUrl(job.company);

  return (
    <div className="space-y-3.5">
      <div className="flex items-start justify-between pb-3 border-b border-(--border-subtle)">
        <div className="min-w-0 pr-4">
          <h2 className="text-xl font-bold tracking-tight text-(--text-primary) truncate">
            {job.company}
          </h2>
          <p className="text-xs text-(--text-secondary) mt-0.5 truncate">{job.role}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="h-8 w-8 inline-flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm transition-colors cursor-pointer shrink-0"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <JobStatusDropdown
          status={job.status}
          onChange={(newStatus) => onStatusChange(job.id, newStatus)}
          size="md"
        />

        <button
          type="button"
          onClick={() => onToggleImportant?.(job.id)}
          title={isImportant ? 'Marked as Important' : 'Mark as Important'}
          className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold rounded-sm border transition-colors cursor-pointer ${
            isImportant
              ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 dark:text-amber-400'
              : 'border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary)'
          }`}
        >
          <Star
            className={`w-3.5 h-3.5 ${isImportant ? 'fill-amber-500 text-amber-500' : 'text-(--text-muted)'}`}
          />
          <span>{isImportant ? 'Starred' : 'Star'}</span>
        </button>

        <div className="ml-auto flex items-center gap-2">
          <a
            href={linkedInUrl}
            target="_blank"
            rel="noreferrer"
            title={`Find 1st-degree connections at ${job.company}`}
            className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold text-[#0A66C2] hover:bg-[#0A66C2]/10 border border-[#0A66C2]/30 bg-[#0A66C2]/5 rounded-sm transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            <span>LinkedIn</span>
          </a>

          <a
            href={job.link}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold text-(--accent-blue-bright) hover:bg-(--accent-primary-bg) border border-(--accent-border) bg-(--accent-primary-bg)/40 rounded-sm transition-colors"
          >
            <span>Open</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
