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
  scopedCount = 0,
  totalCount = 0,
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
    <section className="p-3 border border-(--border-subtle) bg-(--bg-surface)/60 shadow-sm relative z-10 overflow-visible">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-(--accent-primary-bg) border border-(--border-subtle) text-(--accent-primary) flex items-center justify-center shrink-0 rounded-xs">
            <Calendar className="w-3.5 h-3.5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[11px] uppercase tracking-wider text-(--accent-primary) font-semibold">
                Workspace Scope
              </span>
              <span className="text-[11px] px-1.5 py-0.5 text-(--text-secondary) rounded-xs">
                <span className="">{scopedCount}</span> of <span className="">{totalCount}</span>{' '}
                records
              </span>
            </div>
            <span className="text-xs text-(--text-secondary)">Filtering pipeline & analytics.</span>
          </div>
        </div>

        <CustomDateInputs customRange={customRange} onChange={handleRangeChange} />
      </div>
    </section>
  );
}
