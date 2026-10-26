'use client';

import React from 'react';
import { X, ArrowUpRight, Star } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { JobStatusDropdown } from '../common/JobStatusDropdown';

interface DrawerHeaderProps {
  job: Job;
  onClose: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onToggleImportant?: (jobId: string) => void;
}

export function DrawerHeader({ job, onClose, onStatusChange, onToggleImportant }: DrawerHeaderProps) {
  const isImportant = Boolean(job.isImportant);

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight">{job.company}</h2>
            {isImportant && (
              <span className="text-xs px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono font-medium">
                ★ Priority
              </span>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{job.role}</p>
        </div>
        <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-amber-400 transition-colors cursor-pointer"
        >
          <Star
            className={`w-3.5 h-3.5 ${isImportant ? 'text-amber-400' : 'text-[var(--text-muted)]'}`}
            fill={isImportant ? 'currentColor' : 'none'}
          />
          <span className={isImportant ? 'text-amber-400 font-medium' : 'text-[var(--text-secondary)]'}>
            {isImportant ? 'Important' : 'Mark Important'}
          </span>
        </button>

        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] ml-auto"
        >
          <span>Open Link</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
