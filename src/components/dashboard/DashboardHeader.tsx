'use client';

import React from 'react';
import Image from 'next/image';
import { Sun, Moon, Bookmark, Download, Plus, RefreshCw } from 'lucide-react';
import { ProfilePopover } from './ProfilePopover';

interface DashboardHeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenBookmarklet: () => void;
  onExportCSV: () => void;
  onOpenAddJob: () => void;
  onOpenProfile?: () => void;
  currentUser: { email?: string; name?: string; role?: string } | null;
  isSyncing?: boolean;
  onSync?: () => void;
}

export function DashboardHeader({
  theme,
  onToggleTheme,
  onOpenBookmarklet,
  onExportCSV,
  onOpenAddJob,
  onOpenProfile,
  currentUser,
  isSyncing,
  onSync,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-(--border-subtle) bg-(--bg-app)/85 backdrop-blur-xl px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center p-1 shrink-0 rounded-xs">
          <Image
            src="/logo.png"
            alt="Job Radar"
            width={20}
            height={20}
            className="w-4 h-4 sm:w-5 sm:h-5 object-contain rounded-xs"
          />
        </div>
        <span className="font-bold text-sm sm:text-base tracking-tight truncate">JOB RADAR</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer shrink-0"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {onSync && (
          <button
            onClick={onSync}
            disabled={isSyncing}
            title={isSyncing ? 'Syncing...' : 'Sync pipeline (checks for Telegram updates)'}
            aria-label="Sync jobs pipeline"
            className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-(--accent-primary)' : ''}`}
            />
          </button>
        )}

        <button
          onClick={onOpenBookmarklet}
          title="1-Click Browser Bookmarklet"
          className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer shrink-0"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarklet</span>
        </button>

        <button
          onClick={onExportCSV}
          title="Export CSV"
          aria-label="Export CSV"
          className="h-8 w-8 sm:w-auto p-0 sm:px-3 flex items-center justify-center gap-1.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onOpenAddJob}
          className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="inline">Add</span>
        </button>

        <ProfilePopover currentUser={currentUser} onOpenProfile={onOpenProfile} />
      </div>
    </header>
  );
}
