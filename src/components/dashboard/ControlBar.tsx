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
    <section className="flex flex-col sm:flex-row gap-2.5 sm:gap-3 items-stretch sm:items-center justify-between">
      <div className="flex flex-1 items-center gap-2 sm:gap-3 min-w-0">
        <div className="relative flex-1 max-w-full sm:max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            id="job-search-input"
            type="text"
            placeholder="Search company or role... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--border-focus) transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {staleCount > 0 && (
          <button
            onClick={onToggleStaleFilter}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer shrink-0 ${
              staleOnlyFilter
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>{staleCount} Stale</span>
          </button>
        )}
      </div>

      <div className="flex items-center justify-end gap-2.5 shrink-0">
        <div className="flex items-center p-1 border border-(--border-subtle) bg-(--bg-app) text-xs gap-1 rounded-xs">
          <button
            onClick={() => onSelectViewMode('list')}
            className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
              viewMode === 'list'
                ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
                : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            List
          </button>
          <button
            onClick={() => onSelectViewMode('kanban')}
            className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
              viewMode === 'kanban'
                ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
                : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Board
          </button>
        </div>
      </div>
    </section>
  );
}
