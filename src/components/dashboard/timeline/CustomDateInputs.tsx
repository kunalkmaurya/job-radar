'use client';

import React, { useRef } from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { CustomDateRange } from '@/types';

interface CustomDateInputsProps {
  customRange: CustomDateRange;
  onChange: (range: CustomDateRange) => void;
}

export function CustomDateInputs({ customRange, onChange }: CustomDateInputsProps) {
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  const openPicker = (ref: React.RefObject<HTMLInputElement | null>) => {
    try {
      ref.current?.showPicker?.();
    } catch {
      ref.current?.focus();
    }
  };

  return (
    <div className="pt-2.5 border-t border-[var(--border-subtle)] flex flex-wrap items-center gap-3 text-xs">
      <span className="font-mono text-[11px] text-[var(--accent-primary)] uppercase tracking-wider font-semibold">
        Custom Date Range:
      </span>

      <div className="flex flex-wrap items-center gap-2 font-mono">
        {/* From Date Pill */}
        <div
          onClick={() => openPicker(fromInputRef)}
          className="flex items-center gap-2 px-2.5 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[11px] text-[var(--text-muted)]">From:</span>
          <input
            ref={fromInputRef}
            type="date"
            value={customRange.startDate}
            onClick={(e) => {
              e.stopPropagation();
              openPicker(fromInputRef);
            }}
            onChange={(e) => onChange({ ...customRange, startDate: e.target.value })}
            className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
          />
        </div>

        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />

        {/* To Date Pill */}
        <div
          onClick={() => openPicker(toInputRef)}
          className="flex items-center gap-2 px-2.5 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:border-[var(--accent-primary)] transition-colors cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5 text-[var(--text-muted)]" />
          <span className="text-[11px] text-[var(--text-muted)]">To:</span>
          <input
            ref={toInputRef}
            type="date"
            value={customRange.endDate}
            onClick={(e) => {
              e.stopPropagation();
              openPicker(toInputRef);
            }}
            onChange={(e) => onChange({ ...customRange, endDate: e.target.value })}
            className="bg-transparent text-xs text-[var(--text-primary)] focus:outline-none cursor-pointer"
          />
        </div>
      </div>

      {(customRange.startDate || customRange.endDate) && (
        <button
          onClick={() => onChange({ startDate: '', endDate: '' })}
          className="text-[11px] font-mono text-[var(--text-muted)] hover:text-[var(--text-primary)] underline cursor-pointer"
        >
          Reset Range
        </button>
      )}
    </div>
  );
}
