'use client';

import React from 'react';
import { ExternalLink, MapPin, Briefcase, Trash2 } from 'lucide-react';
import { FeedJobItem } from './useFeedJobs';
import { FeedTrackButton } from './FeedTrackButton';

interface FeedListRowProps {
  job: FeedJobItem;
  trackingId: string | null;
  onTrack: (jobId: string) => void;
  onUntrack?: (jobId: string) => void;
  onDelete?: (jobId: string) => void;
}

const getInitials = (c: string) =>
  (
    c
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join('') || c.slice(0, 2)
  ).toUpperCase();

const isUnspec = (v?: string | null, def = '') =>
  !v || v === 'N/A' || v === 'Not Specified' || v === def;

export function FeedListRow({ job, trackingId, onTrack, onUntrack, onDelete }: FeedListRowProps) {
  const formattedDate = new Date(job.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const initials = getInitials(job.company);
  const isLocUnspecified = isUnspec(job.location, 'Remote / Flexible');
  const displayLocation = isLocUnspecified ? 'Not Specified' : job.location;
  const isExpUnspecified = isUnspec(job.exp, 'All Levels');
  const displayExp = isExpUnspecified ? 'Not Specified' : job.exp;

  return (
    <tr className="hover:bg-(--bg-surface-hover) transition-colors group">
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
        <span
          className={`inline-flex items-center gap-1 max-w-[140px] truncate ${
            isLocUnspecified ? 'text-(--text-muted) italic' : 'text-(--text-secondary)'
          }`}
          title={
            isLocUnspecified ? 'Location could not be determined from posting' : displayLocation
          }
        >
          <MapPin className="w-3 h-3 text-(--text-muted) shrink-0" />
          <span className="truncate">{displayLocation}</span>
        </span>
      </td>
      <td className="py-3 px-3">
        <span
          className={`inline-flex items-center gap-1 max-w-[130px] truncate ${
            isExpUnspecified ? 'text-(--text-muted) italic' : 'text-(--text-secondary)'
          }`}
          title={isExpUnspecified ? 'Experience requirements not specified in posting' : displayExp}
        >
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
}
