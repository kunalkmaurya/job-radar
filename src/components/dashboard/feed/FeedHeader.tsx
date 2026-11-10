'use client';

import React from 'react';
import { Search, Globe, LayoutGrid, List, RefreshCw } from 'lucide-react';

interface FeedHeaderProps {
  totalJobs: number;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (m: 'grid' | 'list') => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function FeedHeader({
  totalJobs,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onSync,
  isSyncing = false,
}: FeedHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-(--border-subtle) pb-3.5">
      <div>
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-(--accent-primary)" />
          <h2 className="font-bold text-base sm:text-lg text-(--text-primary)">Explore</h2>
          <span className="text-[10px] font-semibold px-2 py-0.5 border border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) rounded-sm">
            {totalJobs} Available
          </span>
        </div>
        <p className="text-xs text-(--text-muted) mt-0.5">
          Verified opportunities curated by platform administrators. Track any job to your private
          pipeline.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-60">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted) pointer-events-none" />
          <input
            type="text"
            placeholder="Search roles, companies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full h-8 bg-(--bg-surface) border border-(--border-subtle) pl-8 pr-3 text-xs text-(--text-primary) placeholder:text-(--text-muted) rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
          />
        </div>

        {onSync && (
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            title="Sync explore feed"
            aria-label="Sync explore feed"
            className="inline-flex items-center gap-1.5 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) text-xs font-medium shrink-0 cursor-pointer rounded-sm disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-(--accent-primary)' : ''}`}
            />
            <span className="hidden md:inline">Sync</span>
          </button>
        )}

        <div className="inline-flex items-center h-8 p-0.5 border border-(--border-subtle) bg-(--bg-app) rounded-sm shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`h-full px-2 rounded-sm transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-(--bg-surface) text-(--accent-blue-bright) shadow-xs font-semibold'
                : 'text-(--text-muted) hover:text-(--text-primary)'
            }`}
            title="Card view"
            aria-label="Card view"
          >
            <LayoutGrid className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onViewModeChange('list')}
            className={`h-full px-2 rounded-sm transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-(--bg-surface) text-(--accent-blue-bright) shadow-xs font-semibold'
                : 'text-(--text-muted) hover:text-(--text-primary)'
            }`}
            title="List view"
            aria-label="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
