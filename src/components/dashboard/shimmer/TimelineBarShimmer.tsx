'use client';

import React from 'react';

export function TimelineBarShimmer() {
  return (
    <section className="p-3 border border-(--border-subtle) bg-(--bg-surface)/60 shadow-sm flex items-center gap-2 overflow-visible animate-pulse">
      <div className="h-8 w-12 shimmer-block bg-(--border-subtle)" />
      <div className="h-8 w-14 shimmer-block bg-(--border-subtle)" />
      <div className="h-8 w-32 shimmer-block bg-(--border-subtle)" />
      <div className="h-8 w-18 shimmer-block bg-(--border-subtle)" />
      <div className="h-8 w-20 shimmer-block bg-(--border-subtle)" />
      <div className="h-8 w-20 shimmer-block bg-(--border-subtle)" />
      <div className="h-8 w-24 shimmer-block bg-(--border-subtle)" />
    </section>
  );
}
