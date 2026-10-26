'use client';

import React from 'react';
import { ExternalLink, FileText, Trash2, ArrowUpRight } from 'lucide-react';
import { Job } from '@/types';

interface JobRowActionsProps {
  job: Job;
  onSelectJob: (job: Job) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string, e?: React.MouseEvent) => void;
}

export function JobRowActions({
  job,
  onSelectJob,
  onApplyAndAdvance,
  onDeleteJob,
}: JobRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
      {job.status === 'Saved' && (
        <button
          onClick={(e) => onApplyAndAdvance(job, e)}
          className="flex items-center gap-1 px-2.5 py-1 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] text-[var(--accent-primary)] hover:bg-[var(--accent-primary)] hover:text-white transition-all text-xs font-medium cursor-pointer"
        >
          <span>Apply</span>
          <ArrowUpRight className="w-3 h-3" />
        </button>
      )}

      <button
        onClick={() => onSelectJob(job)}
        title="Open Notes"
        aria-label={`Open notes for ${job.role} at ${job.company}`}
        className="p-1.5 hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
      >
        <FileText className="w-4 h-4" />
      </button>

      <a
        href={job.link}
        target="_blank"
        rel="noreferrer"
        title="Open Job Link"
        aria-label={`External link to ${job.role} at ${job.company}`}
        className="p-1.5 hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" />
      </a>

      <button
        onClick={(e) => onDeleteJob(job.id, e)}
        title="Delete Job"
        aria-label={`Delete ${job.role} at ${job.company}`}
        className="p-1.5 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
