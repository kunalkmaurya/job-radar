'use client';

import React from 'react';
import { JOB_STATUSES } from '@/types';

export function KanbanShimmer() {
  const visibleStatuses = JOB_STATUSES.filter((s) => s !== 'Archived');

  return (
    <section className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start animate-pulse">
      {visibleStatuses.map((status) => (
        <div
          key={`shimmer-col-${status}`}
          className="border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3 flex flex-col space-y-3 min-h-[500px]"
        >
          {/* Column Header Skeleton */}
          <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              {status}
            </span>
            <div className="w-5 h-4 shimmer-block bg-[var(--border-subtle)]" />
          </div>

          {/* Cards Skeletons */}
          <div className="space-y-2.5 flex-1">
            {[1, 2].map((cardIdx) => (
              <div
                key={`shimmer-card-${status}-${cardIdx}`}
                className="p-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div className="h-4 w-24 shimmer-block bg-[var(--border-subtle)]" />
                  <div className="w-4 h-4 shimmer-block bg-[var(--border-subtle)]" />
                </div>
                <div className="h-3 w-32 shimmer-block bg-[var(--border-subtle)]" />
                <div className="flex items-center justify-between pt-1">
                  <div className="h-2.5 w-14 shimmer-block bg-[var(--border-subtle)]" />
                  <div className="h-2.5 w-12 shimmer-block bg-[var(--border-subtle)]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
