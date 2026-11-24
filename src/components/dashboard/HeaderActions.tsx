'use client';

import React from 'react';
import { Sun, Moon, Bookmark, Download, Plus } from 'lucide-react';

export interface HeaderActionsProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenBookmarklet: () => void;
  onExportCSV: () => void;
  onOpenAddJob: () => void;
}

export function HeaderActions({
  theme,
  onToggleTheme,
  onOpenBookmarklet,
  onExportCSV,
  onOpenAddJob,
}: HeaderActionsProps) {
  return (
    <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
      <button
        onClick={onOpenBookmarklet}
        title="1-Click Browser Bookmarklet"
        className="hidden lg:inline-flex items-center gap-1.5 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-strong) text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-sm shrink-0"
      >
        <Bookmark className="w-3.5 h-3.5" />
        <span>Bookmark</span>
      </button>

      <button
        onClick={onExportCSV}
        title="Export CSV"
        aria-label="Export CSV"
        className="h-8 w-8 sm:w-auto p-0 sm:px-2.5 flex items-center justify-center gap-1.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-strong) text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-sm shrink-0"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Export</span>
      </button>

      <div className="hidden sm:block h-4 w-px bg-(--border-subtle) mx-0.5" />

      <button
        onClick={onToggleTheme}
        title={theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        aria-label="Toggle theme"
        className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-strong) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-sm shrink-0"
      >
        {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
      </button>

      <button
        onClick={onOpenAddJob}
        className="inline-flex items-center gap-1.5 h-8 px-3 bg-(--accent-primary) hover:bg-(--accent-primary-hover) active:bg-(--accent-primary-active) text-(--accent-primary-text) text-xs font-semibold rounded-sm shadow-xs transition-colors cursor-pointer shrink-0"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add</span>
      </button>
    </div>
  );
}
