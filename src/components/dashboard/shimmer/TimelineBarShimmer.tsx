'use client';

import React from 'react';

export function TimelineBarShimmer() {
  return (
    <section className="p-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 shadow-sm animate-pulse">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Scope Info Skeleton */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 shimmer-block bg-[var(--border-subtle)] flex-shrink-0" />
          <div className="flex flex-col space-y-2">
            <div className="flex items-center gap-2">
              <div className="h-3 w-28 shimmer-block bg-[var(--border-subtle)]" />
              <div className="h-3 w-20 shimmer-block bg-[var(--border-subtle)]" />
            </div>
            <div className="h-3 w-64 shimmer-block bg-[var(--border-subtle)]" />
          </div>
        </div>

        {/* Right Segmented Tabs Skeleton */}
        <div className="flex items-center p-1 border border-[var(--border-subtle)] bg-[var(--bg-app)] gap-1">
          <div className="h-7 w-16 shimmer-block bg-[var(--border-subtle)]" />
          <div className="h-7 w-14 shimmer-block bg-[var(--border-subtle)]" />
          <div className="h-7 w-18 shimmer-block bg-[var(--border-subtle)]" />
          <div className="h-7 w-22 shimmer-block bg-[var(--border-subtle)]" />
          <div className="h-7 w-24 shimmer-block bg-[var(--border-subtle)]" />
        </div>
      </div>
    </section>
  );
}
