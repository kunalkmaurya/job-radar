'use client';

import React from 'react';
import { Calendar, SlidersHorizontal } from 'lucide-react';
import { TimelineFilter, TIMELINE_FILTERS, CustomDateRange } from '@/types';
import { CustomDateInputs } from './timeline/CustomDateInputs';
import { TimelineBarShimmer } from './shimmer/TimelineBarShimmer';

interface TimelineBarProps {
  timelineFilter: TimelineFilter;
  onSelectTimeline: (filter: TimelineFilter) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  scopedCount: number;
  totalCount: number;
  isLoading?: boolean;
}

export function TimelineBar({
  timelineFilter,
  onSelectTimeline,
  customRange,
  onCustomRangeChange,
  scopedCount,
  totalCount,
  isLoading = false,
}: TimelineBarProps) {
  if (isLoading) {
    return <TimelineBarShimmer />;
  }

  const getFilterLabel = (f: TimelineFilter) => {
    switch (f) {
      case 'all': return 'All Time';
      case 'today': return 'Today';
      case 'this_week': return 'This Week';
      case 'past_30_days': return 'Past 30 Days';
      case 'custom': return 'Custom Range';
      default: return f;
    }
  };

  const activeDescription =
    timelineFilter === 'custom'
      ? customRange.startDate && customRange.endDate
        ? `${customRange.startDate} to ${customRange.endDate}`
        : 'Select start and end dates below'
      : getFilterLabel(timelineFilter);

  return (
    <section className="p-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 space-y-3 shadow-sm">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        {/* Left Scope Info */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] text-[var(--accent-primary)] flex items-center justify-center">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--accent-primary)] font-semibold flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Workspace Scope</span>
              </span>
              <span className="text-[10px] px-1.5 py-0.2 bg-[var(--border-subtle)] text-[var(--text-secondary)] font-mono">
                {scopedCount} of {totalCount} records
              </span>
            </div>
            <span className="text-xs text-[var(--text-secondary)]">
              Filtering full workspace analytics and pipeline by:{' '}
              <strong className="text-[var(--text-primary)] font-semibold">{activeDescription}</strong>
            </span>
          </div>
        </div>

        {/* Right Segmented Timeline Tabs */}
        <div className="flex items-center overflow-x-auto scrollbar-none p-1 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-xs font-mono max-w-full">
          {TIMELINE_FILTERS.map((tab) => (
            <button
              key={tab}
              onClick={() => onSelectTimeline(tab)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 text-[11px] sm:text-xs ${
                timelineFilter === tab
                  ? 'bg-[var(--accent-primary)] text-white font-semibold shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {getFilterLabel(tab)}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Date Range Picker */}
      {timelineFilter === 'custom' && (
        <CustomDateInputs customRange={customRange} onChange={onCustomRangeChange} />
      )}
    </section>
  );
}
