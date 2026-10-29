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
}: PaginationBarProps) {
  if (totalItems === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-3 px-4 bg-[var(--bg-surface)] border-t border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
      {/* Left side: Results Count & Page Size Selector */}
      <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
        <span className="text-[var(--text-muted)] font-mono">
          Showing <strong className="text-[var(--text-primary)] font-semibold">{fromItem}</strong>–
          <strong className="text-[var(--text-primary)] font-semibold">{toItem}</strong> of{' '}
          <strong className="text-[var(--text-primary)] font-semibold">{totalItems}</strong> jobs
        </span>

        <div className="flex items-center gap-2">
          <span className="text-[var(--text-muted)] whitespace-nowrap">Jobs per page:</span>
          <CustomSelect
            value={pageSize}
            options={pageSizeOptions.map((opt) => ({ value: opt, label: `${opt}` }))}
            onChange={onPageSizeChange}
            ariaLabel="Jobs per page"
            direction="up"
          />
        </div>
      </div>

      {/* Right side: Page Navigation */}
      <nav
        aria-label="Job pagination"
        className="flex items-center gap-1 w-full sm:w-auto justify-center sm:justify-end"
      >
        <button
          onClick={onFirstPage}
          disabled={!canPrevPage}
          aria-label="Go to first page"
          title="First page"
          className="p-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <ChevronsLeft className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onPrevPage}
          disabled={!canPrevPage}
          aria-label="Go to previous page"
          title="Previous page"
          className="p-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>

        {/* Mobile Page Indicator */}
        <span className="flex sm:hidden px-2.5 py-1 text-xs font-mono text-[var(--text-primary)] font-semibold select-none">
          {currentPage} / {totalPages}
        </span>

        {/* Desktop Numbered Page Buttons */}
        <div className="hidden sm:flex items-center gap-1 mx-1">
          {pageNumbers.map((p, idx) => {
            if (p === 'ellipsis') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 py-1 text-[var(--text-muted)] select-none"
                >
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
                className={`min-w-[28px] h-7 px-2 font-mono text-xs flex items-center justify-center border transition-colors cursor-pointer ${
                  isCurrent
                    ? 'bg-[var(--accent-primary)] text-white border-[var(--accent-primary)] font-bold shadow-sm'
                    : 'bg-[var(--bg-app)] border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
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
          className="p-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        <button
          onClick={onLastPage}
          disabled={!canNextPage}
          aria-label="Go to last page"
          title="Last page"
          className="p-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          <ChevronsRight className="w-3.5 h-3.5" />
        </button>
      </nav>
    </div>
  );
}
