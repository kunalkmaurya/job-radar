'use client';

import React from 'react';

interface DateRangeInputsRowProps {
  startDate: string;
  endDate: string;
  onStartChange: (val: string) => void;
  onEndChange: (val: string) => void;
}

export function DateRangeInputsRow({
  startDate,
  endDate,
  onStartChange,
  onEndChange,
}: DateRangeInputsRowProps) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-2.5 text-xs">
      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase text-(--text-muted) tracking-wider font-semibold">
          From
        </span>
        <input
          type="text"
          placeholder="YYYY-MM-DD"
          value={startDate}
          onChange={(e) => onStartChange(e.target.value)}
          className="w-full h-8 px-2.5 text-xs border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 rounded-sm transition-all"
        />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-[10px] uppercase text-(--text-muted) tracking-wider font-semibold">
          To
        </span>
        <input
          type="text"
          placeholder="YYYY-MM-DD"
          value={endDate}
          onChange={(e) => onEndChange(e.target.value)}
          className="w-full h-8 px-2.5 text-xs border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 rounded-sm transition-all"
        />
      </div>
    </div>
  );
}
