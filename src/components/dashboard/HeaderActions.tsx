'use client';

import React from 'react';
import { Sun, Moon, Bookmark, Download, Plus, RefreshCw, Users } from 'lucide-react';

export interface HeaderActionsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenBookmarklet: () => void;
  onExportCSV: () => void;
  onOpenAddJob: () => void;
  onOpenPodModal?: () => void;
  podMemberCount?: number;
  isSyncing?: boolean;
  onSync?: () => void;
}

export function HeaderActions({
  theme,
  onToggleTheme,
  onOpenBookmarklet,
  onExportCSV,
  onOpenAddJob,
  onOpenPodModal,
  podMemberCount,
  isSyncing,
  onSync,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      {onSync && (
        <button
          onClick={onSync}
          disabled={isSyncing}
          title={isSyncing ? 'Syncing...' : 'Sync pipeline'}
          aria-label="Sync jobs pipeline"
          className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-focus) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0 disabled:opacity-50"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-(--accent-primary)' : ''}`}
          />
        </button>
      )}

      {onOpenPodModal && (
        <button
          onClick={onOpenPodModal}
          title="Peer Job Pod"
          className="inline-flex items-center gap-1.5 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-focus) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
        >
          <Users className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span className="hidden sm:inline">Pod</span>
          {podMemberCount !== undefined && podMemberCount > 1 && (
            <span className="px-1 py-0.2 text-[10px] font-mono rounded-xs bg-(--accent-primary-bg) text-(--accent-blue-bright)">
              {podMemberCount}
            </span>
          )}
        </button>
      )}

      <button
        onClick={onOpenBookmarklet}
        title="1-Click Browser Bookmarklet"
        className="hidden lg:inline-flex items-center gap-1.5 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-focus) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span>Bookmarklet</span>
      </button>

      <button
        onClick={onExportCSV}
        title="Export CSV"
        aria-label="Export CSV"
        className="h-8 w-8 sm:w-auto p-0 sm:px-2.5 flex items-center justify-center gap-1.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-focus) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Export</span>
      </button>

      <div className="hidden sm:block h-4 w-px bg-(--border-subtle) mx-0.5" />

      <button
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        aria-label="Toggle theme"
        className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-focus) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
      >
        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={onOpenAddJob}
        className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold rounded-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Add Job</span>
        <span className="sm:hidden">Add</span>
      </button>
    </div>
  );
}
