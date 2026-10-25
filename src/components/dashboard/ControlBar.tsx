'use client';

import React, { useEffect } from 'react';
import { Search, X, AlertTriangle } from 'lucide-react';
import { TimelineFilter } from '@/types';

interface ControlBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  staleCount: number;
  staleOnlyFilter: boolean;
  onToggleStaleFilter: () => void;
  timelineFilter: TimelineFilter;
  onSelectTimeline: (filter: TimelineFilter) => void;
  viewMode: 'list' | 'kanban';
  onSelectViewMode: (mode: 'list' | 'kanban') => void;
}

export function ControlBar({
  searchQuery,
  onSearchChange,
  staleCount,
  staleOnlyFilter,
  onToggleStaleFilter,
  timelineFilter,
  onSelectTimeline,
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
    <section className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
      <div className="flex flex-1 items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            id="job-search-input"
            type="text"
            placeholder="Search company or role... (Press '/' to focus)"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Stale Jobs Alert Chip */}
        {staleCount > 0 && (
          <button
            onClick={onToggleStaleFilter}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
              staleOnlyFilter
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
            <span>{staleCount} Stale {staleCount === 1 ? 'Job' : 'Jobs'}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2.5">
        {/* Timeline Filter Segmented Tabs */}
        <div className="flex items-center p-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs">
          {(['all', 'today', 'this_week', 'past_30_days'] as TimelineFilter[]).map((tab) => (
            <button
              key={tab}
              onClick={() => onSelectTimeline(tab)}
              className={`px-2.5 py-1 capitalize transition-all cursor-pointer ${
                timelineFilter === tab
                  ? 'bg-[var(--accent-primary)] text-white font-medium shadow-sm'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs">
          <button
            onClick={() => onSelectViewMode('list')}
            className={`px-2.5 py-1 transition-all cursor-pointer ${
              viewMode === 'list'
                ? 'bg-[var(--accent-primary)] text-white font-medium shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            List
          </button>
          <button
            onClick={() => onSelectViewMode('kanban')}
            className={`px-2.5 py-1 transition-all cursor-pointer ${
              viewMode === 'kanban'
                ? 'bg-[var(--accent-primary)] text-white font-medium shadow-sm'
                : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
            }`}
          >
            Board
          </button>
        </div>
      </div>
    </section>
  );
}
