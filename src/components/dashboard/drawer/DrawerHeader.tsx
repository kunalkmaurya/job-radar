'use client';

import React from 'react';
import { X, ArrowUpRight } from 'lucide-react';
import { Job, JOB_STATUSES, JobStatus } from '@/types';

interface DrawerHeaderProps {
  job: Job;
  onClose: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
}

export function DrawerHeader({ job, onClose, onStatusChange }: DrawerHeaderProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
        <div>
          <h2 className="text-xl font-bold tracking-tight">{job.company}</h2>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5">{job.role}</p>
        </div>
        <button onClick={onClose} className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer">
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <select
          value={job.status}
          onChange={(e) => onStatusChange(job.id, e.target.value as JobStatus)}
          className="px-3 py-1.5 text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none cursor-pointer"
        >
          {JOB_STATUSES.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <a
          href={job.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-1.5 text-xs text-[var(--accent-primary)] hover:underline px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)]"
        >
          <span>Open Career Link</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}
