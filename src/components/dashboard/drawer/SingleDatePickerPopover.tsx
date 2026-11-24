'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDateIso, parseDateIso, getCalendarDays } from '../timeline/calendarHelpers';
import { SingleDateGrid } from './SingleDateGrid';

interface SingleDatePickerPopoverProps {
  value: string;
  anchorRect: DOMRect | null;
  onSelect: (date: string) => void;
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
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function SingleDatePickerPopover({
  value,
  anchorRect,
  onSelect,
  onClose,
}: SingleDatePickerPopoverProps) {
  const initial = parseDateIso(value) || new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());

  const todayStr = formatDateIso(new Date());
  const days = getCalendarDays(viewYear, viewMonth, todayStr);

  useEffect(() => {
    const handleClose = () => onClose();
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('scroll', handleClose, true);
    window.addEventListener('resize', handleClose);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('scroll', handleClose, true);
      window.removeEventListener('resize', handleClose);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!anchorRect || typeof document === 'undefined') return null;

  const spaceBelow = window.innerHeight - anchorRect.bottom;
  const isUp = spaceBelow < 290 && anchorRect.top > 290;
  const top = isUp ? anchorRect.top - 4 : anchorRect.bottom + 4;
  const left = Math.max(8, Math.min(anchorRect.left, window.innerWidth - 264));

  const handlePrev = () => {
    setViewYear((y) => (viewMonth === 0 ? y - 1 : y));
    setViewMonth((m) => (m === 0 ? 11 : m - 1));
  };

  const handleNext = () => {
    setViewYear((y) => (viewMonth === 11 ? y + 1 : y));
    setViewMonth((m) => (m === 11 ? 0 : m + 1));
  };

  return createPortal(
    <>
      <div className="fixed inset-0 bg-transparent" style={{ zIndex: 99998 }} onClick={onClose} />
      <div
        style={{
          top: `${top}px`,
          left: `${left}px`,
          zIndex: 99999,
          transform: isUp ? 'translateY(-100%)' : undefined,
        }}
        className="fixed w-64 p-3 bg-(--bg-surface) border border-(--border-subtle) rounded-md shadow-xl text-xs select-none space-y-2.5 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handlePrev}
            className="p-1 hover:bg-(--bg-surface-hover) rounded-sm text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
            aria-label="Previous month"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="font-semibold text-xs text-(--text-primary)">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={handleNext}
            className="p-1 hover:bg-(--bg-surface-hover) rounded-sm text-(--text-muted) hover:text-(--text-primary) transition-colors cursor-pointer"
            aria-label="Next month"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-(--text-muted)">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-0.5">
              {w}
            </div>
          ))}
        </div>

        <SingleDateGrid days={days} value={value} onSelect={onSelect} onClose={onClose} />

        <div className="pt-2 border-t border-(--border-subtle) flex items-center justify-between text-[11px]">
          <button
            type="button"
            onClick={() => {
              onSelect('');
              onClose();
            }}
            className="text-(--text-muted) hover:text-(--accent-primary) transition-colors cursor-pointer"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={() => {
              onSelect(todayStr);
              onClose();
            }}
            className="text-(--accent-primary) font-semibold hover:underline cursor-pointer"
          >
            Today
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
