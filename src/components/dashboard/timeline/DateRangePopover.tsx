'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateIso, parseDateIso, getCalendarDays } from './calendarHelpers';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { DateRangeInputsRow } from './DateRangeInputsRow';
import { DateRangePopoverFooter } from './DateRangePopoverFooter';

interface DateRangePopoverProps {
  startDate: string;
  endDate: string;
  onApply: (range: { startDate: string; endDate: string }) => void;
  onClose: () => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function DateRangePopover({ startDate, endDate, onApply, onClose }: DateRangePopoverProps) {
  const initial = parseDateIso(startDate) || new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [selectedStart, setSelectedStart] = useState(startDate);
  const [selectedEnd, setSelectedEnd] = useState(endDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const todayStr = formatDateIso(new Date());
  const days = getCalendarDays(viewYear, viewMonth, todayStr);

  const handlePrev = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const handleNext = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const handleDayClick = (dateStr: string) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(dateStr);
      setSelectedEnd('');
    } else {
      if (dateStr < selectedStart) {
        setSelectedEnd(selectedStart);
        setSelectedStart(dateStr);
      } else {
        setSelectedEnd(dateStr);
      }
    }
  };

  const effectiveEnd =
    selectedEnd ||
    (hoveredDate && selectedStart && hoveredDate >= selectedStart ? hoveredDate : '');

  return (
    <div className="absolute top-full right-0 mt-1.5 z-50 w-72 max-w-[calc(100vw-2rem)] p-3 bg-(--bg-surface) border border-(--border-strong) shadow-2xl rounded-xs text-xs select-none">
      <DateRangeInputsRow
        startDate={selectedStart}
        endDate={selectedEnd}
        onStartChange={setSelectedStart}
        onEndChange={setSelectedEnd}
      />

      <div className="flex items-center justify-between mb-2 pb-2 border-b border-(--border-subtle)">
        <button
          type="button"
          onClick={handlePrev}
          className="p-1 border border-(--border-subtle) hover:bg-(--bg-surface-hover) text-(--text-secondary) rounded-xs cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="text-xs font-semibold text-(--text-primary)">
          {MONTH_NAMES[viewMonth]} {viewYear}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="p-1 border border-(--border-subtle) hover:bg-(--bg-surface-hover) text-(--text-secondary) rounded-xs cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <CalendarMonthGrid
        days={days}
        selectedStart={selectedStart}
        effectiveEnd={effectiveEnd}
        onDayClick={handleDayClick}
        onHoverDate={setHoveredDate}
      />

      <DateRangePopoverFooter
        onClear={() => {
          setSelectedStart('');
          setSelectedEnd('');
          onApply({ startDate: '', endDate: '' });
          onClose();
        }}
        onCancel={onClose}
        onApply={() => {
          onApply({ startDate: selectedStart, endDate: selectedEnd || selectedStart });
          onClose();
        }}
      />
    </div>
  );
}
