'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  formatDateIso,
  parseDateIso,
  getCalendarDays,
  calcPopoverPosition,
} from './calendarHelpers';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { DateRangeInputsRow } from './DateRangeInputsRow';
import { DateRangePopoverFooter } from './DateRangePopoverFooter';
import { DateRangePopoverHeader } from './DateRangePopoverHeader';

interface DateRangePopoverProps {
  startDate: string;
  endDate: string;
  anchorRef?: React.RefObject<HTMLElement | null>;
  anchorRect?: DOMRect | null;
  onApply: (range: { startDate: string; endDate: string }) => void;
  onClose: () => void;
}

export function DateRangePopover({
  startDate,
  endDate,
  anchorRef,
  anchorRect,
  onApply,
  onClose,
}: DateRangePopoverProps) {
  const initial = parseDateIso(startDate) || new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [selectedStart, setSelectedStart] = useState(startDate);
  const [selectedEnd, setSelectedEnd] = useState(endDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);

  const [coords, setCoords] = useState(() => calcPopoverPosition(null, anchorRect));

  useEffect(() => {
    const update = () => setCoords(calcPopoverPosition(anchorRef?.current, anchorRect));
    update();
    window.addEventListener('scroll', update, true);
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update, true);
      window.removeEventListener('resize', update);
    };
  }, [anchorRef, anchorRect]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const changeMonth = (delta: number) => {
    const next = viewMonth + delta;
    if (next < 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else if (next > 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth(next);
    }
  };

  const handleDayClick = (dateStr: string) => {
    if (!selectedStart || (selectedStart && selectedEnd)) {
      setSelectedStart(dateStr);
      setSelectedEnd('');
    } else {
      setSelectedEnd(dateStr < selectedStart ? selectedStart : dateStr);
      if (dateStr < selectedStart) setSelectedStart(dateStr);
    }
  };

  const effectiveEnd =
    selectedEnd ||
    (hoveredDate && selectedStart && hoveredDate >= selectedStart ? hoveredDate : '');

  const handleClear = () => {
    setSelectedStart('');
    setSelectedEnd('');
    onApply({ startDate: '', endDate: '' });
    onClose();
  };

  if (typeof document === 'undefined') return null;

  const todayStr = formatDateIso(new Date());
  const days = getCalendarDays(viewYear, viewMonth, todayStr);

  return createPortal(
    <>
      <div className="fixed inset-0 bg-transparent" style={{ zIndex: 99998 }} onClick={onClose} />
      <div
        style={{
          top: `${coords.top}px`,
          left: `${coords.left}px`,
          zIndex: 99999,
          transform: coords.isUp ? 'translateY(-100%)' : undefined,
        }}
        className="fixed w-72 max-w-[calc(100vw-2rem)] p-3.5 bg-(--bg-surface) border border-(--border-subtle) shadow-2xl rounded-md text-xs select-none space-y-2.5 animate-in fade-in zoom-in-95 duration-100"
        onClick={(e) => e.stopPropagation()}
      >
        <DateRangeInputsRow
          startDate={selectedStart}
          endDate={selectedEnd}
          onStartChange={setSelectedStart}
          onEndChange={setSelectedEnd}
        />

        <DateRangePopoverHeader
          viewYear={viewYear}
          viewMonth={viewMonth}
          onPrev={() => changeMonth(-1)}
          onNext={() => changeMonth(1)}
        />

        <CalendarMonthGrid
          days={days}
          selectedStart={selectedStart}
          effectiveEnd={effectiveEnd}
          onDayClick={handleDayClick}
          onHoverDate={setHoveredDate}
        />

        <DateRangePopoverFooter
          onClear={handleClear}
          onCancel={onClose}
          onApply={() => {
            onApply({ startDate: selectedStart, endDate: selectedEnd || selectedStart });
            onClose();
          }}
        />
      </div>
    </>,
    document.body
  );
}
