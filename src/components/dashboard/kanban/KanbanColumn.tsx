'use client';

import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Job } from '@/types';
import { JobKanbanCard } from '../JobKanbanCard';

interface KanbanColumnProps {
  status: string;
  columnJobs: Job[];
  cardsPerColumn: number | 'all';
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
}

export function KanbanColumn({
  status,
  columnJobs,
  cardsPerColumn,
  nowTime,
  onSelectJob,
  onToggleImportant,
  onApplyAndAdvance,
}: KanbanColumnProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [prevCards, setPrevCards] = useState(cardsPerColumn);

  if (prevCards !== cardsPerColumn) {
    setPrevCards(cardsPerColumn);
    setCurrentPage(1);
  }

  const totalPages = useMemo(() => {
    if (cardsPerColumn === 'all') return 1;
    return Math.max(1, Math.ceil(columnJobs.length / cardsPerColumn));
  }, [columnJobs.length, cardsPerColumn]);

  const safeCurrentPage = Math.min(currentPage, totalPages);

  const visibleJobs = useMemo(() => {
    if (cardsPerColumn === 'all') return columnJobs;
    const start = (safeCurrentPage - 1) * cardsPerColumn;
    return columnJobs.slice(start, start + cardsPerColumn);
  }, [columnJobs, cardsPerColumn, safeCurrentPage]);

  const fromIndex =
    columnJobs.length === 0
      ? 0
      : (safeCurrentPage - 1) * (cardsPerColumn === 'all' ? 1 : cardsPerColumn) + 1;
  const toIndex =
    cardsPerColumn === 'all'
      ? columnJobs.length
      : Math.min(safeCurrentPage * cardsPerColumn, columnJobs.length);

  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) p-3 flex flex-col space-y-3 min-h-[480px] sm:min-h-[520px] w-[82vw] sm:w-[320px] md:w-auto shrink-0 md:shrink snap-start rounded-md shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-(--border-subtle)">
        <span className="text-xs font-bold uppercase tracking-wider text-(--text-primary)">
          {status}
        </span>
        <span className="text-[11px] font-bold text-(--text-secondary) px-2 py-0.5 bg-(--bg-app) border border-(--border-subtle) rounded-sm">
          {columnJobs.length}
        </span>
      </div>

      <div className="space-y-2.5 flex-1">
        {visibleJobs.length === 0 ? (
          <div className="h-32 flex flex-col items-center justify-center border border-dashed rounded-sm border-(--border-subtle) bg-(--bg-app)/50 text-(--text-muted) text-xs font-medium p-3 text-center">
            No jobs in {status}
          </div>
        ) : (
          visibleJobs.map((job) => (
            <JobKanbanCard
              key={job.id}
              job={job}
              nowTime={nowTime}
              onSelectJob={onSelectJob}
              onToggleImportant={onToggleImportant}
              onApplyAndAdvance={onApplyAndAdvance}
            />
          ))
        )}
      </div>

      {cardsPerColumn !== 'all' && totalPages > 1 && (
        <div className="pt-2 border-t border-(--border-subtle) flex items-center justify-between text-[11px] text-(--text-muted)">
          <span>
            {fromIndex}–{toIndex} of {columnJobs.length}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, Math.min(p, totalPages) - 1))}
              disabled={safeCurrentPage <= 1}
              aria-label={`Previous cards in ${status}`}
              title="Previous cards"
              className="h-6 w-6 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-app) hover:bg-(--bg-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer rounded-sm"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>

            <span className="px-1 text-(--text-primary) font-semibold">
              {safeCurrentPage}/{totalPages}
            </span>

            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(totalPages, Math.min(p, totalPages) + 1))
              }
              disabled={safeCurrentPage >= totalPages}
              aria-label={`Next cards in ${status}`}
              title="Next cards"
              className="h-6 w-6 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-app) hover:bg-(--bg-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer rounded-sm"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
