'use client';

import React, { useEffect } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';

interface ControlBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  staleCount: number;
  staleOnlyFilter: boolean;
  onToggleStaleFilter: () => void;
  viewMode: 'list' | 'kanban';
  onSelectViewMode: (mode: 'list' | 'kanban') => void;
}

export function ControlBar({
  searchQuery,
  onSearchChange,
  staleCount,
  staleOnlyFilter,
  onToggleStaleFilter,
  viewMode,
  onSelectViewMode,
}: ControlBarProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        document.getElementById('job-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section className="flex flex-col sm:flex-row gap-2 sm:gap-3 items-stretch sm:items-center justify-between">
      <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none" />
          <input
            id="job-search-input"
            type="text"
            placeholder="Search company or role... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 pl-8 pr-8 text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) placeholder-(--text-muted) rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {staleCount > 0 && (
          <button
            onClick={onToggleStaleFilter}
            className={`inline-flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold border rounded-sm transition-colors cursor-pointer shrink-0 ${
              staleOnlyFilter
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-500 dark:text-amber-300'
                : 'bg-amber-500/10 border-amber-500/25 text-amber-600 dark:text-amber-400 hover:bg-amber-500/15'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{staleCount} Stale</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-2 shrink-0">
        <div className="inline-flex items-center h-8 p-0.5 border border-(--border-subtle) bg-(--bg-surface) rounded-sm">
          <button
            onClick={() => onSelectViewMode('list')}
            className={`h-full px-3 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            List
          </button>
          <button
            onClick={() => onSelectViewMode('kanban')}
            className={`h-full px-3 text-xs font-semibold rounded-sm transition-colors cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Board
          </button>
        </div>
      </div>
    </section>
  );
}
