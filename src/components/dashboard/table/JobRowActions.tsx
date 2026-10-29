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
    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => onSelectJob(job)}
        title="Open Notes"
        aria-label={`Open notes for ${job.role} at ${job.company}`}
        className="p-1.5 hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) cursor-pointer"
      >
        <FileText className="w-4 h-4" />
      </button>

      <a
        href={job.link}
        target="_blank"
        rel="noreferrer"
        title="Open Job Link"
        aria-label={`External link to ${job.role} at ${job.company}`}
        className="p-1.5 hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) cursor-pointer"
      >
        <ExternalLink className="w-4 h-4" />
      </a>

      <button
        onClick={(e) => onDeleteJob(job.id, e)}
        title="Delete Job"
        aria-label={`Delete ${job.role} at ${job.company}`}
        className="p-1.5 hover:bg-red-500/10 text-(--text-muted) hover:text-red-400 cursor-pointer"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
