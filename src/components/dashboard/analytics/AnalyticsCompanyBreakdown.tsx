'use client';

import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { formatDate } from '../data';
import { STATUS_CONFIG } from '../common/statusConfig';

interface CompanyBreakdownProps {
  jobs: Job[];
}

export function AnalyticsCompanyBreakdown({ jobs }: CompanyBreakdownProps) {
  const sortedJobs = [...jobs].slice(0, 6);

  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-semibold text-(--text-primary)">
            Active Targets & Company Statuses
          </h3>
        </div>
        <span className="text-[11px] text-(--text-muted)">{jobs.length} companies</span>
      </div>

      <div className="divide-y divide-(--border-subtle) text-xs">
        {sortedJobs.map((job) => {
          const conf = STATUS_CONFIG[job.status as JobStatus] || STATUS_CONFIG.Saved;
          return (
            <div key={job.id} className="py-2.5 flex items-center justify-between gap-3 group">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="font-semibold text-(--text-primary) shrink-0">{job.company}</span>
                <span className="text-(--border-strong) font-normal text-xs select-none shrink-0">
                  |
                </span>
                <span className="text-(--text-secondary) truncate">{job.role}</span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span
                  className="px-1.5 py-0.5 text-[11px] font-semibold rounded-sm uppercase tracking-wider border select-none"
                  style={{
                    color: conf.text,
                    backgroundColor: conf.bg,
                    borderColor: conf.border,
                  }}
                >
                  {job.status}
                </span>
                <span className="text-[10px] text-(--text-muted) hidden md:inline">
                  {formatDate(job.appliedAt || job.createdAt)}
                </span>
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-(--text-muted) hover:text-(--accent-primary) transition-colors p-1 rounded-sm hover:bg-(--bg-surface-hover)"
                  title="Open job link"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
