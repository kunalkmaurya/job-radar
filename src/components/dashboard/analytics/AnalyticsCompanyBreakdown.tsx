'use client';

import React from 'react';
import { Building2, ExternalLink } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '../data';

interface CompanyBreakdownProps {
  jobs: Job[];
}

const STATUS_BADGES: Record<string, string> = {
  Saved: 'border-blue-500/40 text-blue-400 bg-blue-500/10',
  Applied: 'border-amber-500/40 text-amber-400 bg-amber-500/10',
  Interviewing: 'border-purple-500/40 text-purple-400 bg-purple-500/10',
  Offer: 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10',
  Rejected: 'border-neutral-500/40 text-neutral-400 bg-neutral-500/10',
  Archived: 'border-neutral-600/40 text-neutral-500 bg-neutral-600/10',
};

export function AnalyticsCompanyBreakdown({ jobs }: CompanyBreakdownProps) {
  const sortedJobs = [...jobs].slice(0, 6);

  return (
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[var(--accent-primary)]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Active Targets & Company Statuses
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
          {jobs.length} companies
        </span>
      </div>

      <div className="divide-y divide-[var(--border-subtle)] font-mono text-xs">
        {sortedJobs.map((job) => (
          <div key={job.id} className="py-2.5 flex items-center justify-between gap-3 group">
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="font-bold text-[var(--text-primary)] truncate">{job.company}</span>
              <span className="text-[var(--text-muted)] truncate hidden sm:inline">
                • {job.role}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span
                className={`px-2 py-0.5 text-[10px] font-medium border uppercase tracking-wider ${STATUS_BADGES[job.status] || ''}`}
              >
                {job.status}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] hidden md:inline">
                {formatDate(job.appliedAt || job.createdAt)}
              </span>
              <a
                href={job.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[var(--text-muted)] hover:text-[var(--accent-primary)] transition-colors p-1"
                title="Open job link"
              >
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
