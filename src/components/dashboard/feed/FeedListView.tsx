'use client';

import React from 'react';
import { FeedJobItem } from './useFeedJobs';
import { FeedListRow } from './FeedListRow';

interface FeedListViewProps {
  jobs: FeedJobItem[];
  trackingId: string | null;
  onTrack: (jobId: string) => void;
  onUntrack?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
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
          {jobs.map((job) => (
            <FeedListRow
              key={job.id}
              job={job}
              trackingId={trackingId}
              onTrack={onTrack}
              onUntrack={onUntrack}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
