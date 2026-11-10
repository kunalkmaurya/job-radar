'use client';

import React from 'react';
import { CalendarDay } from './calendarHelpers';

interface CalendarMonthGridProps {
  days: CalendarDay[];
  selectedStart: string;
  effectiveEnd: string;
  onDayClick: (dateStr: string) => void;
  onHoverDate: (dateStr: string | null) => void;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

export function CalendarMonthGrid({
  days,
  selectedStart,
  effectiveEnd,
  onDayClick,
  onHoverDate,
}: CalendarMonthGridProps) {
  return (
    <>
      <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-medium text-(--text-muted) mb-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="py-0.5">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-xs mb-3">
        {days.map((day: CalendarDay) => {
          const isStart = day.date === selectedStart;
          const isEnd = day.date === effectiveEnd;
          const inRange =
            Boolean(selectedStart && effectiveEnd) &&
            day.date > selectedStart &&
            day.date < effectiveEnd;

          let cellClass = 'hover:bg-(--bg-surface-hover) text-(--text-primary) rounded-sm';
          if (day.isFuture) {
            cellClass = 'text-(--text-muted) opacity-25 cursor-not-allowed hover:bg-transparent';
          } else if (isStart || isEnd) {
            cellClass =
              'bg-(--accent-primary) text-(--accent-primary-text) font-bold rounded-sm shadow-xs';
          } else if (inRange) {
            cellClass = 'bg-(--accent-primary-bg) text-(--accent-blue-bright) rounded-none';
          } else if (!day.isCurrentMonth) {
            cellClass = 'text-(--text-muted) opacity-40 hover:opacity-80 rounded-sm';
          }

          return (
            <button
              key={day.date}
              type="button"
              disabled={day.isFuture}
              onClick={() => onDayClick(day.date)}
              onMouseEnter={() => onHoverDate(day.date)}
              onMouseLeave={() => onHoverDate(null)}
              className={`h-7 flex items-center justify-center transition-colors text-[11px] font-medium ${
                day.isFuture ? 'cursor-not-allowed' : 'cursor-pointer'
              } ${cellClass}`}
            >
              {day.dayNumber}
            </button>
          );
        })}
      </div>
    </>
  );
}
