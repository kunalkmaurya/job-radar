'use client';

import React from 'react';
import { ExternalLink, Check, Plus, Loader2, MapPin, Briefcase } from 'lucide-react';
import { FeedJobItem } from './useFeedJobs';

interface FeedListViewProps {
  jobs: FeedJobItem[];
  trackingId: string | null;
  onTrack: (jobId: string) => void;
}

export function FeedListView({ jobs, trackingId, onTrack }: FeedListViewProps) {
  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-xs overflow-x-auto shadow-2xs">
      <table className="w-full min-w-[720px] text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-(--border-subtle) bg-(--bg-app) text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider">
            <th className="py-2.5 px-4">Company</th>
            <th className="py-2.5 px-3">Role</th>
            <th className="py-2.5 px-3">Location</th>
            <th className="py-2.5 px-3">Experience</th>
            <th className="py-2.5 px-3">Posted</th>
            <th className="py-2.5 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-(--border-subtle)">
          {jobs.map((job) => {
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
            const displayExp = !job.exp || job.exp === 'N/A' ? 'All Levels' : job.exp;
            const isTracking = trackingId === job.id;

            return (
              <tr key={job.id} className="hover:bg-(--bg-surface-hover) transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 border border-(--border-subtle) bg-(--bg-app) flex items-center justify-center font-bold text-[10px] tracking-wider text-(--accent-blue-bright) rounded-xs shrink-0 select-none">
                      {initials}
                    </div>
                    <span className="font-bold text-(--text-primary) group-hover:text-(--accent-blue-bright) transition-colors truncate max-w-[150px]">
                      {job.company}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span className="font-medium text-(--text-primary) truncate block max-w-[220px]" title={job.role}>
                    {job.role}
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-(--text-secondary) max-w-[140px] truncate">
                    <MapPin className="w-3 h-3 text-(--text-muted) shrink-0" />
                    <span className="truncate">{displayLocation}</span>
                  </span>
                </td>
                <td className="py-3 px-3">
                  <span className="inline-flex items-center gap-1 text-(--text-secondary) max-w-[130px] truncate">
                    <Briefcase className="w-3 h-3 text-(--text-muted) shrink-0" />
                    <span className="truncate">{displayExp}</span>
                  </span>
                </td>
                <td className="py-3 px-3 font-mono text-[11px] text-(--text-muted) whitespace-nowrap">
                  {formattedDate}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-2">
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-app) px-2 py-1 rounded-xs transition-colors"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3 text-(--text-muted)" />
                    </a>
                    {job.isTracked ? (
                      <span className="inline-flex items-center gap-1 text-xs text-(--status-offer-text) bg-(--status-offer-bg) border border-(--status-offer-border) font-medium px-2 py-1 rounded-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>Tracked</span>
                      </span>
                    ) : (
                      <button
                        onClick={() => onTrack(job.id)}
                        disabled={isTracking}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white rounded-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
                      >
                        {isTracking ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Plus className="w-3 h-3" />
                        )}
                        <span>Track</span>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

