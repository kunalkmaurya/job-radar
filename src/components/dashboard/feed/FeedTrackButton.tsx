'use client';

import React from 'react';
import { Check, Plus, Loader2, X } from 'lucide-react';

interface FeedTrackButtonProps {
  jobId: string;
  isTracked: boolean;
  isTracking: boolean;
  onTrack: (jobId: string) => void;
  onUntrack?: (jobId: string) => void;
  size?: 'sm' | 'md';
}

export function FeedTrackButton({
  jobId,
  isTracked,
  isTracking,
  onTrack,
  onUntrack,
  size = 'md',
}: FeedTrackButtonProps) {
  const isSm = size === 'sm';
  const sizeClass = isSm ? 'h-7 w-[80px] gap-1' : 'h-8 w-[88px] gap-1.5';
  const iconSize = isSm ? 'w-3 h-3' : 'w-3.5 h-3.5';

  if (isTracked) {
    return (
      <button
        type="button"
        onClick={() => onUntrack?.(jobId)}
        disabled={isTracking}
        title="Click to untrack from personal board"
        aria-label="Untrack job"
        className={`group/track ${sizeClass} inline-flex items-center justify-center text-xs text-(--status-offer-text) hover:text-red-500 bg-(--status-offer-bg) hover:bg-red-500/10 border border-(--status-offer-border) hover:border-red-500/30 font-semibold rounded-sm transition-colors cursor-pointer shrink-0 disabled:opacity-50`}
      >
        {isTracking ? (
          <Loader2 className={`${iconSize} animate-spin`} />
        ) : (
          <>
            <Check className={`${iconSize} group-hover/track:hidden shrink-0`} />
            <span className="group-hover/track:hidden">Tracked</span>
            <X className={`${iconSize} hidden group-hover/track:inline shrink-0`} />
            <span className="hidden group-hover/track:inline">Untrack</span>
          </>
        )}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => onTrack(jobId)}
      disabled={isTracking}
      title="Click to track job"
      aria-label="Track job"
      className={`${sizeClass} inline-flex items-center justify-center text-xs font-semibold bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) border border-transparent rounded-sm shadow-xs transition-colors cursor-pointer shrink-0 disabled:opacity-50`}
    >
      {isTracking ? (
        <Loader2 className={`${iconSize} animate-spin`} />
      ) : (
        <>
          <Plus className={`${iconSize} shrink-0`} />
          <span>Track</span>
        </>
      )}
    </button>
  );
}
