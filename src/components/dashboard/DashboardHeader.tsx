'use client';

import React from 'react';
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
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/85 backdrop-blur-xl px-3 sm:px-5 py-2.5 sm:py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
        <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] flex items-center justify-center p-1 shrink-0">
          <img src="/icon.svg" alt="Job Radar" className="w-4 h-4 sm:w-5 sm:h-5 object-contain" />
        </div>
        <span className="font-bold text-sm sm:text-base tracking-tight truncate">JOB RADAR</span>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Cloud Sync Button */}
        {onSync && (
          <button
            onClick={onSync}
            disabled={isSyncing}
            title={isSyncing ? 'Syncing...' : 'Sync pipeline (checks for Telegram updates)'}
            aria-label="Sync jobs pipeline"
            className="h-8 w-8 flex items-center justify-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[var(--accent-primary)]' : ''}`} />
          </button>
        )}

        {/* Bookmarklet Helper */}
        <button
          onClick={onOpenBookmarklet}
          title="1-Click Browser Bookmarklet"
          className="hidden md:inline-flex items-center gap-1.5 h-8 px-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarklet</span>
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          title="Export CSV"
          aria-label="Export CSV"
          className="h-8 w-8 sm:w-auto p-0 sm:px-3 flex items-center justify-center gap-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        {/* Add Job Button */}
        <button
          onClick={onOpenAddJob}
          className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="inline">Add Job</span>
        </button>

        {/* Profile Popover */}
        <ProfilePopover currentUser={currentUser} onOpenProfile={onOpenProfile} />
      </div>
    </header>
  );
}
