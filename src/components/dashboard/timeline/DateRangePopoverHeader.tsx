'use client';

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CALENDAR_MONTHS } from './calendarHelpers';

interface DateRangePopoverHeaderProps {
  viewYear: number;
  viewMonth: number;
  onPrev: () => void;
  onNext: () => void;
}

export function DateRangePopoverHeader({
  viewYear,
  viewMonth,
  onPrev,
  onNext,
}: DateRangePopoverHeaderProps) {
  return (
    <div className="flex items-center justify-between pb-2 border-b border-(--border-subtle)">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Previous month"
        className="h-7 w-7 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) rounded-sm transition-colors cursor-pointer"
      >
        <ChevronLeft className="w-3.5 h-3.5" />
      </button>
      <span className="text-xs font-semibold text-(--text-primary)">
        {CALENDAR_MONTHS[viewMonth]} {viewYear}
      </span>
      <button
        type="button"
        onClick={onNext}
        aria-label="Next month"
        className="h-7 w-7 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) rounded-sm transition-colors cursor-pointer"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
