'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { CustomSelect } from '../common/CustomSelect';
import { PaginationBarProps } from './types';

export type { PaginationBarProps };

export function PaginationBar({
  currentPage,
  totalPages,
  totalItems,
  fromItem,
  toItem,
  pageSize,
  pageSizeOptions,
  canPrevPage,
  canNextPage,
  pageNumbers,
  onPageChange,
  onPageSizeChange,
  onFirstPage,
  onLastPage,
  onPrevPage,
  onNextPage,
  className = '',
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  return (
    <div
      className={`flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-(--bg-surface) border-t border-(--border-subtle) text-xs text-(--text-secondary) ${className}`}
    >
      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-(--text-muted)">
          Showing <strong className="text-(--text-primary) font-semibold">{fromItem}</strong>–
          <strong className="text-(--text-primary) font-semibold">{toItem}</strong> of{' '}
          <strong className="text-(--text-primary) font-semibold">{totalItems}</strong> jobs
        </span>

        <div className="flex items-center gap-2">
          <span className="text-(--text-muted) whitespace-nowrap">Per page:</span>
          <CustomSelect
            value={pageSize}
            options={pageSizeOptions.map((opt) => ({ value: opt, label: `${opt}` }))}
            onChange={onPageSizeChange}
            ariaLabel="Jobs per page"
            direction="up"
          />
        </div>
      </div>

      <nav
        aria-label="Job pagination"
        className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end"
      >
        <button
          onClick={onFirstPage}
          disabled={!canPrevPage}
          aria-label="Go to first page"
          title="First page"
          className="h-8 w-8 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer rounded-sm"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPrevPage}
          disabled={!canPrevPage}
          aria-label="Go to previous page"
          title="Previous page"
          className="h-8 w-8 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer rounded-sm"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        <span className="flex sm:hidden px-2.5 py-1 text-xs text-(--text-primary) font-semibold select-none">
          {currentPage} / {totalPages}
        </span>

        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 py-1 text-(--text-muted) select-none">
                  …
                </span>
              );
            }

            const isCurrent = p === currentPage;
            return (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                aria-label={`Go to page ${p}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`min-w-[32px] h-8 px-2 text-xs flex items-center justify-center border rounded-sm transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-(--accent-primary) text-(--accent-primary-text) border-(--accent-primary) font-bold shadow-xs'
                    : 'bg-(--bg-surface) border-(--border-subtle) text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover)'
                }`}
              >
                {p}
              </button>
            );
          })}
        </div>

        <button
          onClick={onNextPage}
          disabled={!canNextPage}
          aria-label="Go to next page"
          title="Next page"
          className="h-8 w-8 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer rounded-sm"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onLastPage}
          disabled={!canNextPage}
          aria-label="Go to last page"
          title="Last page"
          className="h-8 w-8 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer rounded-sm"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
}
