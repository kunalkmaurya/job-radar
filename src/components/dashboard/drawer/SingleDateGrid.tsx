'use client';

import React from 'react';
import { CalendarDay } from '../timeline/calendarHelpers';

interface SingleDateGridProps {
  days: CalendarDay[];
  value: string;
  onSelect: (date: string) => void;
  onClose: () => void;
}

export function SingleDateGrid({ days, value, onSelect, onClose }: SingleDateGridProps) {
  return (
    <div className="grid grid-cols-7 gap-1 text-center text-xs">
      {days.map((day) => {
        const isSelected = day.date === value;
        let cellClass = 'hover:bg-(--bg-surface-hover) text-(--text-primary)';
        if (isSelected) {
          cellClass = 'bg-(--accent-primary) text-(--accent-primary-text) font-bold shadow-xs';
        } else if (day.isToday) {
          cellClass =
            'border border-(--accent-primary) text-(--accent-primary) font-semibold hover:bg-(--bg-surface-hover)';
        } else if (!day.isCurrentMonth) {
          cellClass = 'text-(--text-muted) opacity-40 hover:opacity-80';
        }

        return (
          <button
            key={day.date}
            type="button"
            onClick={() => {
              onSelect(day.date);
              onClose();
            }}
            className={`h-7 flex items-center justify-center transition-colors cursor-pointer text-[11px] rounded-sm ${cellClass}`}
          >
            {day.dayNumber}
          </button>
        );
      })}
    </div>
  );
}
