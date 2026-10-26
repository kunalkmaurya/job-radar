'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';

interface KanbanHeaderBarProps {
  totalJobs: number;
  columnCount: number;
  cardsPerColumn: number | 'all';
  onCardsPerColumnChange: (val: number | 'all') => void;
}

export function KanbanHeaderBar({
  totalJobs,
  columnCount,
  cardsPerColumn,
  onCardsPerColumnChange,
}: KanbanHeaderBarProps) {
  const options: (number | 'all')[] = [3, 5, 10, 'all'];

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
      <div className="flex items-center gap-2">
        <LayoutGrid className="w-4 h-4 text-[var(--accent-primary)]" />
        <span className="font-mono text-[var(--text-muted)]">
          Board Pipeline • <strong className="text-[var(--text-primary)] font-semibold">{totalJobs}</strong> jobs across{' '}
          <strong className="text-[var(--text-primary)] font-semibold">{columnCount}</strong> stages
        </span>
      </div>

      <div className="flex items-center gap-2">
        <label htmlFor="kanban-cards-per-col" className="text-[var(--text-muted)] whitespace-nowrap">
          Cards per column:
        </label>
        <select
          id="kanban-cards-per-col"
          aria-label="Cards per column in Kanban board"
          value={cardsPerColumn}
          onChange={(e) => {
            const val = e.target.value;
            onCardsPerColumnChange(val === 'all' ? 'all' : Number(val));
          }}
          className="py-1 px-2.5 bg-[var(--bg-app)] border border-[var(--border-subtle)] text-[var(--text-primary)] font-medium focus:outline-none focus:border-[var(--border-focus)] transition-colors cursor-pointer"
        >
          {options.map((opt) => (
            <option key={opt} value={opt} className="bg-[var(--bg-surface)] text-[var(--text-primary)]">
              {opt === 'all' ? 'All (no limit)' : `${opt} cards`}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
