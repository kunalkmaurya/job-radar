'use client';

import React, { useState, useRef } from 'react';
import { Calendar, ChevronDown, X } from 'lucide-react';
import { formatHumanDate } from '../timeline/calendarHelpers';
import { SingleDatePickerPopover } from './SingleDatePickerPopover';

interface DrawerFollowUpProps {
  value: string;
  nowTime: number;
  onChange: (date: string) => void;
}

export function DrawerFollowUp({ value, nowTime, onChange }: DrawerFollowUpProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dateValue = value ? value.split('T')[0] : '';

  const handleToggle = () => {
    if (!isOpen && triggerRef.current) {
      setAnchorRect(triggerRef.current.getBoundingClientRect());
    }
    setIsOpen((prev) => !prev);
  };

  const setOffsetDays = (days: number) => {
    const d = new Date(nowTime + 1000 * 60 * 60 * 24 * days).toISOString().split('T')[0];
    onChange(d);
  };

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-(--text-secondary) flex items-center justify-between">
        <span className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span>Follow-up Date</span>
        </span>
        {dateValue && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="text-[11px] text-(--text-muted) hover:text-rose-500 transition-colors flex items-center gap-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Clear</span>
          </button>
        )}
      </label>

      <div className="flex items-center gap-1.5">
        <button
          ref={triggerRef}
          type="button"
          onClick={handleToggle}
          className={`flex-1 flex items-center justify-between gap-2 h-8 px-2.5 border bg-(--bg-surface) transition-colors cursor-pointer text-xs font-medium rounded-sm shadow-xs ${
            isOpen || Boolean(dateValue)
              ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright)'
              : 'border-(--border-subtle) hover:border-(--border-strong) text-(--text-secondary) hover:text-(--text-primary)'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Calendar className="w-3.5 h-3.5 text-(--accent-primary) shrink-0" />
            <span
              className={`truncate ${dateValue ? 'text-(--text-primary) font-semibold' : 'text-(--text-muted)'}`}
            >
              {dateValue ? formatHumanDate(dateValue) : 'Select date'}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            {dateValue && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  onChange('');
                }}
                className="p-0.5 hover:bg-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) transition-colors rounded-xs"
                title="Clear date"
              >
                <X className="w-3 h-3" />
              </span>
            )}
            <ChevronDown
              className={`w-3.5 h-3.5 text-(--text-muted) transition-transform duration-150 ${
                isOpen ? 'rotate-180 text-(--accent-primary)' : ''
              }`}
            />
          </div>
        </button>

        <button
          type="button"
          onClick={() => setOffsetDays(1)}
          className="h-8 px-2 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs font-medium rounded-sm transition-colors cursor-pointer"
          title="Tomorrow"
        >
          +1d
        </button>
        <button
          type="button"
          onClick={() => setOffsetDays(3)}
          className="h-8 px-2 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs font-medium rounded-sm transition-colors cursor-pointer"
          title="3 days"
        >
          +3d
        </button>
        <button
          type="button"
          onClick={() => setOffsetDays(7)}
          className="h-8 px-2 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs font-medium rounded-sm transition-colors cursor-pointer"
          title="1 week"
        >
          +1w
        </button>
      </div>

      {isOpen && (
        <SingleDatePickerPopover
          value={dateValue}
          anchorRect={anchorRect}
          onSelect={(d) => onChange(d)}
          onClose={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
