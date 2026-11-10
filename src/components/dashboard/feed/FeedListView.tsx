'use client';

import React from 'react';
import { ExternalLink, MapPin, Briefcase, Trash2 } from 'lucide-react';
import { FeedJobItem } from './useFeedJobs';
import { FeedTrackButton } from './FeedTrackButton';

interface FeedListViewProps {
  jobs: FeedJobItem[];
  trackingId: string | null;
  onTrack: (jobId: string) => void;
  onUntrack?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
}

function getInitials(company: string) {
  const parts = company.split(/\s+/).filter(Boolean);
  return (
    parts
      .slice(0, 2)
      .map((w) => w[0])
      .join('') || company.slice(0, 2)
  ).toUpperCase();
}

export function FeedListView({
  jobs,
  trackingId,
  onTrack,
  onUntrack,
  onDelete,
}: FeedListViewProps) {
  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md overflow-x-auto shadow-xs">
      <table className="w-full min-w-[720px] text-left border-collapse text-xs">
        <thead>
          <tr className="border-b border-(--border-subtle) bg-(--bg-surface-hover) text-[11px] font-bold text-(--text-muted) uppercase tracking-wider">
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
            const initials = getInitials(job.company);
            const displayLocation =
              !job.location || job.location === 'N/A' ? 'Remote / Flexible' : job.location;
            const displayExp = !job.exp || job.exp === 'N/A' ? 'All Levels' : job.exp;

            return (
              <tr key={job.id} className="hover:bg-(--bg-surface-hover) transition-colors group">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 border border-(--accent-border) bg-(--accent-primary-bg) flex items-center justify-center font-bold text-[10px] tracking-wider text-(--accent-blue-bright) rounded-sm shrink-0 select-none">
                      {initials}
                    </div>
                    <span className="font-bold text-(--text-primary) group-hover:text-(--accent-blue-bright) transition-colors truncate max-w-[150px]">
                      {job.company}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-3">
                  <span
                    className="font-medium text-(--text-primary) truncate block max-w-[220px]"
                    title={job.role}
                  >
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
                <td className="py-3 px-3 text-[11px] text-(--text-muted) whitespace-nowrap">
                  {formattedDate}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="inline-flex items-center justify-end gap-1.5">
                    <a
                      href={job.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-7 w-[68px] inline-flex items-center justify-center gap-1 text-xs text-(--text-secondary) hover:text-(--text-primary) border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) hover:bg-(--bg-surface-hover) rounded-sm transition-colors shrink-0"
                    >
                      <span>Apply</span>
                      <ExternalLink className="w-3 h-3 text-(--text-muted) shrink-0" />
                    </a>
                    {onDelete && (
                      <button
                        type="button"
                        onClick={() => onDelete(job.id)}
                        title="Delete from pod feed"
                        className="h-7 w-7 inline-flex items-center justify-center text-(--text-muted) hover:text-red-500 hover:bg-red-500/10 rounded-sm border border-(--border-subtle) hover:border-red-500/30 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                    <FeedTrackButton
                      jobId={job.id}
                      isTracked={Boolean(job.isTracked)}
                      isTracking={trackingId === job.id}
                      onTrack={onTrack}
                      onUntrack={onUntrack}
                      size="sm"
                    />
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
