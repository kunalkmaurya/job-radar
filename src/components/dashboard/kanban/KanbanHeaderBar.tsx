'use client';

import React from 'react';
import { LayoutGrid } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';

interface KanbanHeaderBarProps {
  totalJobs: number;
  columnCount: number;
  cardsPerColumn: number | 'all';
  onCardsPerColumnChange: (val: number | 'all') => void;
}

const SELECT_OPTIONS: { value: number | 'all'; label: string }[] = [
  { value: 3, label: '3 cards' },
  { value: 5, label: '5 cards' },
  { value: 10, label: '10 cards' },
  { value: 'all', label: 'All (no limit)' },
];

export function KanbanHeaderBar({
  totalJobs,
  columnCount,
  cardsPerColumn,
  onCardsPerColumnChange,
}: KanbanHeaderBarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
      <div className="flex items-center gap-2">
        <LayoutGrid className="w-4 h-4 text-[var(--accent-primary)]" />
        <span className="font-mono text-[var(--text-muted)]">
          Board Pipeline •{' '}
          <strong className="text-[var(--text-primary)] font-semibold">{totalJobs}</strong> jobs
          across <strong className="text-[var(--text-primary)] font-semibold">{columnCount}</strong>{' '}
          stages
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-[var(--text-muted)] whitespace-nowrap">Cards per column:</span>
        <CustomSelect
          value={cardsPerColumn}
          options={SELECT_OPTIONS}
          onChange={onCardsPerColumnChange}
          ariaLabel="Cards per column in Kanban board"
        />
      </div>
    </div>
  );
}
