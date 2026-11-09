'use client';

import React from 'react';
import { ExternalLink, FileText, Trash2 } from 'lucide-react';
import { Job } from '@/types';

interface JobRowActionsProps {
  job: Job;
  onSelectJob: (job: Job) => void;
  onApplyAndAdvance?: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string, e?: React.MouseEvent) => void;
}

export function JobRowActions({ job, onSelectJob, onDeleteJob }: JobRowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => onSelectJob(job)}
        title="Open Notes"
        aria-label={`Open notes for ${job.role} at ${job.company}`}
        className="h-7 w-7 inline-flex items-center justify-center rounded-sm hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
      >
        <FileText className="w-3.5 h-3.5" />
      </button>

      <a
        href={job.link}
        target="_blank"
        rel="noreferrer"
        title="Open Job Link"
        aria-label={`External link to ${job.role} at ${job.company}`}
        className="h-7 w-7 inline-flex items-center justify-center rounded-sm hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
      >
        <ExternalLink className="w-3.5 h-3.5" />
      </a>

      <button
        onClick={(e) => onDeleteJob(job.id, e)}
        title="Delete Job"
        aria-label={`Delete ${job.role} at ${job.company}`}
        className="h-7 w-7 inline-flex items-center justify-center rounded-sm hover:bg-red-500/10 text-(--text-muted) hover:text-red-500 transition-colors cursor-pointer"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
