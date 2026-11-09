'use client';

import React, { useState, useRef } from 'react';
import { Calendar, ChevronRight, ChevronDown, X } from 'lucide-react';
import { CustomDateRange } from '@/types';
import { DatePresets } from './DatePresets';
import { DateRangePopover } from './DateRangePopover';
import { getPresetRange, PresetKey } from './calendarHelpers';

interface CustomDateInputsProps {
  customRange: CustomDateRange;
  onChange: (range: CustomDateRange) => void;
}

const PRESET_ITEMS: Array<{ key: PresetKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: '7d', label: '7d' },
  { key: '14d', label: '14d' },
  { key: '30d', label: '30d' },
];

export function CustomDateInputs({ customRange, onChange }: CustomDateInputsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const isPresetActive = (key: PresetKey) => {
    if (key === 'all') {
      return !customRange.startDate && !customRange.endDate;
    }
    const preset = getPresetRange(key);
    return customRange.startDate === preset.startDate && customRange.endDate === preset.endDate;
  };

  const isAnyPresetActive =
    !customRange.startDate && !customRange.endDate
      ? false
      : (['today', '7d', '14d', '30d'] as PresetKey[]).some(isPresetActive);

  const isCustomRangeActive =
    Boolean(customRange.startDate || customRange.endDate) && !isAnyPresetActive;

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange({ startDate: '', endDate: '' });
  };

  const handlePresetSelect = (preset: PresetKey) => {
    onChange(getPresetRange(preset));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 text-xs">
      <DatePresets
        customRange={customRange}
        items={PRESET_ITEMS}
        onSelectPreset={handlePresetSelect}
        onClear={() => onChange({ startDate: '', endDate: '' })}
      />

      <div ref={containerRef} className="relative">
        <button
          type="button"
          onClick={() => {
            if (!isOpen && containerRef.current) {
              setAnchorRect(containerRef.current.getBoundingClientRect());
            }
            setIsOpen((prev) => !prev);
          }}
          className={`flex items-center gap-2 h-8 px-2.5 border bg-(--bg-surface) transition-colors cursor-pointer text-xs font-medium rounded-sm shadow-xs ${
            isOpen || isCustomRangeActive
              ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright)'
              : 'border-(--border-subtle) hover:border-(--border-strong) text-(--text-secondary) hover:text-(--text-primary)'
          }`}
        >
          <Calendar className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span
            className={isCustomRangeActive && customRange.startDate ? 'text-(--text-primary)' : ''}
          >
            {isCustomRangeActive && customRange.startDate ? customRange.startDate : 'From'}
          </span>
          <ChevronRight className="w-3 h-3 text-(--text-muted)" />
          <span
            className={isCustomRangeActive && customRange.endDate ? 'text-(--text-primary)' : ''}
          >
            {isCustomRangeActive && customRange.endDate ? customRange.endDate : 'To'}
          </span>

          {isCustomRangeActive ? (
            <span
              onClick={handleClear}
              className="p-0.5 hover:bg-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) transition-colors ml-0.5"
            >
              <X className="w-3 h-3" />
            </span>
          ) : (
            <ChevronDown
              className={`w-3.5 h-3.5 text-(--text-muted) transition-transform ${
                isOpen ? 'rotate-180 text-(--accent-primary)' : ''
              }`}
            />
          )}
        </button>

        {isOpen && (
          <DateRangePopover
            anchorRef={containerRef}
            anchorRect={anchorRect}
            startDate={customRange.startDate}
            endDate={customRange.endDate}
            onApply={(newRange) => onChange(newRange)}
            onClose={() => setIsOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
