'use client';

import React from 'react';
import { Search, Plus, Users, LayoutGrid, List, RefreshCw, Settings } from 'lucide-react';

interface PodFeedHeaderProps {
  podName: string;
  totalJobs: number;
  memberCount: number;
  memberLimit: number;
  isTelegramConnected: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (m: 'grid' | 'list') => void;
  onOpenAddJob: () => void;
  onOpenManagePod?: () => void;
  onSyncTelegram?: () => void;
  isSyncing?: boolean;
}

export function PodFeedHeader({
  podName,
  totalJobs,
  memberCount,
  memberLimit,
  isTelegramConnected,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  onOpenAddJob,
  onOpenManagePod,
  onSyncTelegram,
  isSyncing = false,
}: PodFeedHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-(--border-subtle) pb-3.5">
      <div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-(--accent-primary)" />
          <h2 className="font-bold text-base sm:text-lg text-(--text-primary)">
            {podName || 'Peer Pod Feed'}
          </h2>
          <span className="text-[10px] font-mono px-2 py-0.5 border border-(--accent-primary)/30 bg-(--accent-primary-bg) text-(--accent-blue-bright) rounded-xs">
            {memberCount} / {memberLimit} Peers
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 border border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) rounded-xs">
            {totalJobs} Pooled
          </span>
        </div>
        <p className="text-xs text-(--text-muted) mt-0.5">
          Opportunities pooled exclusively within your peer pod via Telegram and dashboard.
        </p>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 sm:w-52">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-(--text-muted)" />
          <input
            type="text"
            placeholder="Search roles, companies..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-(--bg-surface) border border-(--border-subtle) pl-8 pr-3 py-1.5 text-xs text-(--text-primary) placeholder:text-(--text-muted) focus:border-(--accent-primary) outline-hidden rounded-xs"
          />
        </div>

        <div className="flex items-center p-0.5 border border-(--border-subtle) bg-(--bg-app) rounded-xs shrink-0">
          <button
            type="button"
            onClick={() => onViewModeChange('grid')}
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
              viewMode === 'grid'
                ? 'bg-(--bg-surface) text-(--accent-blue-bright) shadow-2xs font-semibold'
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
            className={`p-1.5 rounded-xs transition-colors cursor-pointer ${
              viewMode === 'list'
                ? 'bg-(--bg-surface) text-(--accent-blue-bright) shadow-2xs font-semibold'
                : 'text-(--text-muted) hover:text-(--text-primary)'
            }`}
            title="List view"
            aria-label="List view"
          >
            <List className="w-3.5 h-3.5" />
          </button>
        </div>

        {onSyncTelegram && isTelegramConnected && (
          <button
            onClick={onSyncTelegram}
            disabled={isSyncing}
            title="Sync Telegram Group"
            className="inline-flex items-center gap-1 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) text-xs font-medium shrink-0 cursor-pointer rounded-xs"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-(--accent-primary)' : ''}`}
            />
            <span className="hidden md:inline">Sync</span>
          </button>
        )}

        {onOpenManagePod && (
          <button
            onClick={onOpenManagePod}
            title="Manage Pod Peers & Telegram"
            className="inline-flex items-center gap-1 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) text-xs font-medium shrink-0 cursor-pointer rounded-xs"
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Manage</span>
          </button>
        )}

        <button
          onClick={onOpenAddJob}
          className="inline-flex items-center gap-1.5 h-8 px-3 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold shrink-0 cursor-pointer rounded-xs shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Share Job</span>
        </button>
      </div>
    </div>
  );
}
