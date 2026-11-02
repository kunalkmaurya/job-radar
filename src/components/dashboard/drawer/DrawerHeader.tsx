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
    <div className="space-y-4">
      <div className="flex items-start justify-between pb-4 border-b border-(--border-subtle)">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{job.company}</h2>
            {isImportant && (
              <span className="inline-flex items-center gap-1 text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-medium">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>Priority</span>
              </span>
            )}
          </div>
          <p className="text-xs text-(--text-secondary) mt-0.5">{job.role}</p>
        </div>
        <button
          onClick={onClose}
          className="p-1 text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <JobStatusDropdown
          status={job.status}
          onChange={(newStatus) => onStatusChange(job.id, newStatus)}
        />

        <button
          type="button"
          onClick={() => onToggleImportant?.(job.id)}
          title={isImportant ? 'Marked as Important' : 'Mark as Important'}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-(--border-subtle) bg-(--bg-app) hover:border-amber-400 transition-colors cursor-pointer"
        >
          <Star
            className={`w-3.5 h-3.5 ${isImportant ? 'text-amber-400' : 'text-(--text-muted)'}`}
            fill={isImportant ? 'currentColor' : 'none'}
          />
          <span className={isImportant ? 'text-amber-400 font-medium' : 'text-(--text-secondary)'}>
            {isImportant ? 'Important' : 'Mark Important'}
          </span>
        </button>

        <a
          href={linkedInUrl}
          target="_blank"
          rel="noreferrer"
          title={`Find 1st-degree connections at ${job.company}`}
          className="flex items-center gap-1.5 text-xs text-[#0A66C2] hover:underline px-3 py-1.5 border border-[#0A66C2]/30 bg-[#0A66C2]/10 transition-colors ml-auto"
        >
          <Users className="w-3.5 h-3.5" />
          <span>LinkedIn</span>
        </a>

        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-(--accent-primary) hover:underline px-3 py-1.5 border border-(--border-subtle) bg-(--accent-primary-bg)"
        >
          <span>Open Link</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
