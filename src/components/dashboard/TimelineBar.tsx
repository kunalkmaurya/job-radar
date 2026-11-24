'use client';

import React from 'react';
import { Calendar } from 'lucide-react';
import { TimelineFilter, CustomDateRange } from '@/types';
import { CustomDateInputs } from './timeline/CustomDateInputs';
import { TimelineBarShimmer } from './shimmer/TimelineBarShimmer';

interface TimelineBarProps {
  timelineFilter: TimelineFilter;
  onSelectTimeline: (filter: TimelineFilter) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  scopedCount?: number;
  totalCount?: number;
  isLoading?: boolean;
}

export function TimelineBar({
  onSelectTimeline,
  customRange,
  onCustomRangeChange,
  isLoading = false,
}: TimelineBarProps) {
  if (isLoading) {
    return <TimelineBarShimmer />;
  }

  const handleRangeChange = (range: CustomDateRange) => {
    onCustomRangeChange(range);
    if (range.startDate || range.endDate) {
      if (
        range.startDate === range.endDate &&
        range.startDate === new Date().toISOString().split('T')[0]
      ) {
        onSelectTimeline('today');
      } else {
        onSelectTimeline('custom');
      }
    } else {
      onSelectTimeline('all');
    }
  };

  return (
    <section className="p-3 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs relative z-10 overflow-visible">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-(--accent-primary-bg) border border-(--accent-border) text-(--accent-primary) flex items-center justify-center shrink-0 rounded-sm">
            <Calendar className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-(--accent-primary) font-bold">
                Workspace Scope
              </span>
              {/* <span className="text-[11px] px-1.5 py-0.5 text-(--text-secondary) bg-(--bg-surface-hover) rounded-sm">
                <span>{scopedCount}</span> of <span>{totalCount}</span> records
              </span> */}
            </div>
            <span className="text-xs text-(--text-secondary)">Filtering pipeline & analytics.</span>
          </div>
        </div>

        <CustomDateInputs customRange={customRange} onChange={handleRangeChange} />
      </div>
    </section>
  );
}
