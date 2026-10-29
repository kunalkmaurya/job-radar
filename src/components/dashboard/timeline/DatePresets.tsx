'use client';

import React from 'react';
import { CustomDateRange } from '@/types';
import { PresetKey, getPresetRange } from './calendarHelpers';

interface DatePresetsProps {
  customRange: CustomDateRange;
  onSelectPreset: (preset: PresetKey) => void;
  onClear: () => void;
  items?: Array<{ key: PresetKey; label: string }>;
}

const DEFAULT_PRESETS: Array<{ key: PresetKey; label: string }> = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 Days' },
  { key: '14d', label: 'Last 14 Days' },
  { key: '30d', label: 'Last 30 Days' },
];

export function DatePresets({
  customRange,
  onSelectPreset,
  onClear,
  items = DEFAULT_PRESETS,
}: DatePresetsProps) {
  const isPresetActive = (key: PresetKey) => {
    if (key === 'all') {
      return !customRange.startDate && !customRange.endDate;
    }
    const preset = getPresetRange(key);
    return customRange.startDate === preset.startDate && customRange.endDate === preset.endDate;
  };

  const handlePresetClick = (key: PresetKey) => {
    if (key === 'all') {
      onClear();
      return;
    }
    if (isPresetActive(key)) {
      onClear();
    } else {
      onSelectPreset(key);
    }
  };

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {items.map((p) => {
        const active = isPresetActive(p.key);
        return (
          <button
            key={p.key}
            type="button"
            onClick={() => handlePresetClick(p.key)}
            className={`px-2.5 py-1.5 text-xs font-medium border rounded-xs transition-colors cursor-pointer ${
              active
                ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
                : 'border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-strong)'
            }`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
