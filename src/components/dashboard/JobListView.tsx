'use client';

import React from 'react';
import { Job, JobStatus } from '@/types';
import { JobTableRow } from './JobTableRow';

interface JobListViewProps {
  jobs: Job[];
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string, e?: React.MouseEvent) => void;
}

export function JobListView({
  jobs,
  nowTime,
  onSelectJob,
  onStatusChange,
  onApplyAndAdvance,
  onDeleteJob,
}: JobListViewProps) {
  return (
    <section className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-surface)]/50">
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Company</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Role</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider">Timeline / Age</th>
              <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-subtle)]">
            {jobs.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                  No job applications match your filters.
                </td>
              </tr>
            ) : (
              jobs.map((job) => (
                <JobTableRow
                  key={job.id}
                  job={job}
                  nowTime={nowTime}
                  onSelectJob={onSelectJob}
                  onStatusChange={onStatusChange}
                  onApplyAndAdvance={onApplyAndAdvance}
                  onDeleteJob={onDeleteJob}
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
