'use client';

import React from 'react';
import { Job, JOB_STATUSES } from '@/types';
import { JobKanbanCard } from './JobKanbanCard';

interface JobKanbanViewProps {
  jobs: Job[];
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
}

export function JobKanbanView({
  jobs,
  nowTime,
  onSelectJob,
  onApplyAndAdvance,
}: JobKanbanViewProps) {
  const visibleStatuses = JOB_STATUSES.filter((s) => s !== 'Archived');

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
      {visibleStatuses.map((colStatus) => {
        const columnJobs = jobs.filter((j) => j.status === colStatus);
        return (
          <div
            key={colStatus}
            className="border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3 flex flex-col space-y-3 min-h-[500px]"
          >
            <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
              <span className="text-xs font-semibold uppercase tracking-wider">{colStatus}</span>
              <span className="text-xs px-2 py-0.5 bg-[var(--border-subtle)] text-[var(--text-secondary)]">
                {columnJobs.length}
              </span>
            </div>

            <div className="space-y-2.5 flex-1">
              {columnJobs.map((job) => (
                <JobKanbanCard
                  key={job.id}
                  job={job}
                  nowTime={nowTime}
                  onSelectJob={onSelectJob}
                  onApplyAndAdvance={onApplyAndAdvance}
                />
              ))}
            </div>
          </div>
        );
      })}
    </section>
  );
}
