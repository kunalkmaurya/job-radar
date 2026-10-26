'use client';

import React from 'react';

export function AnalyticsRibbonShimmer() {
  const cards = [1, 2, 3, 4];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {cards.map((idx) => (
        <div
          key={`analytics-shimmer-${idx}`}
          className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3"
        >
          <div className="flex items-center justify-between">
            <div className="h-3 w-28 shimmer-block bg-[var(--border-subtle)]" />
            <div className="w-4 h-4 shimmer-block bg-[var(--border-subtle)]" />
          </div>
          <div className="h-8 w-16 shimmer-block bg-[var(--border-subtle)]" />
          <div className="h-2.5 w-32 shimmer-block bg-[var(--border-subtle)]" />
        </div>
      ))}
    </section>
  );
}
