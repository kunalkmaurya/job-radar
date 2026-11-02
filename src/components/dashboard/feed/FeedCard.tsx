'use client';

import React from 'react';
import { ExternalLink, Check, Plus, Loader2, MapPin, Briefcase, ShieldCheck } from 'lucide-react';
import { FeedJobItem } from './useFeedJobs';

interface FeedCardProps {
  job: FeedJobItem;
  isTracking: boolean;
  onTrack: (jobId: string) => void;
}

export function FeedCard({ job, isTracking, onTrack }: FeedCardProps) {
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const initials =
    job.company
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('')
      .toUpperCase() || job.company.slice(0, 2).toUpperCase();

  const displayLocation =
    !job.location || job.location === 'N/A' ? 'Remote / Flexible' : job.location;
  const displayExp = !job.exp || job.exp === 'N/A' ? 'All Experience Levels' : job.exp;

  return (
    <div className="group relative border border-(--border-subtle) hover:border-(--border-focus) bg-(--bg-surface) hover:bg-(--bg-surface-hover) p-4 rounded-xs transition-all duration-150 flex flex-col justify-between gap-3.5 shadow-2xs hover:shadow-xs">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 border border-(--border-subtle) bg-(--bg-app) flex items-center justify-center font-bold text-xs tracking-wider text-(--accent-blue-bright) rounded-xs shrink-0 select-none">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-[11px] font-bold tracking-wider uppercase text-(--accent-blue-bright) truncate">
              {job.company}
            </span>
            <span className="text-[10px] text-(--text-muted) font-mono shrink-0">
              {formattedDate}
            </span>
          </div>

          <h3
            className="font-semibold text-sm text-(--text-primary) truncate group-hover:text-(--accent-blue-bright) transition-colors"
            title={job.role}
          >
            {job.role}
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) rounded-xs">
          <MapPin className="w-3 h-3 text-(--text-muted)" />
          <span className="truncate max-w-[130px]">{displayLocation}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) rounded-xs">
          <Briefcase className="w-3 h-3 text-(--text-muted)" />
          <span className="truncate max-w-[120px]">{displayExp}</span>
        </span>

        <span className="inline-flex items-center gap-1 px-2 py-0.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-muted) rounded-xs">
          <ShieldCheck className="w-3 h-3 text-(--accent-blue-bright)" />
          <span className="capitalize">{job.source} Curated</span>
        </span>
      </div>

      <div className="pt-2.5 border-t border-(--border-subtle) flex items-center justify-between gap-2">
        <a
          href={job.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-app) hover:bg-(--bg-surface-hover) px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer"
        >
          <span>Apply</span>
          <ExternalLink className="w-3 h-3 text-(--text-muted)" />
        </a>

        {job.isTracked ? (
          <span className="inline-flex items-center gap-1.5 text-xs text-(--status-offer-text) bg-(--status-offer-bg) border border-(--status-offer-border) font-medium px-2.5 py-1.5 rounded-xs">
            <Check className="w-3.5 h-3.5" />
            <span>Tracked</span>
          </span>
        ) : (
          <button
            onClick={() => onTrack(job.id)}
            disabled={isTracking}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white rounded-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
          >
            {isTracking ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Plus className="w-3.5 h-3.5" />
            )}
            <span>Track</span>
          </button>
        )}
      </div>
    </div>
  );
}
