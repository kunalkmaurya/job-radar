'use client';

import React from 'react';
import { Sun, Moon, Bookmark, Download, Plus } from 'lucide-react';
import { ProfilePopover } from './ProfilePopover';

interface DashboardHeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenBookmarklet: () => void;
  onExportCSV: () => void;
  onOpenAddJob: () => void;
  currentUser: { email?: string; name?: string; role?: string } | null;
}

export function DashboardHeader({
  theme,
  onToggleTheme,
  onOpenBookmarklet,
  onExportCSV,
  onOpenAddJob,
  currentUser,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/85 backdrop-blur-xl px-[20px] py-3.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] flex items-center justify-center p-1">
          <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
        </div>
        <span className="font-bold text-base tracking-tight">JOB RADAR</span>
      </div>

      <div className="flex items-center gap-2.5">
        {/* Theme Toggle */}
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* Bookmarklet Helper */}
        <button
          onClick={onOpenBookmarklet}
          title="1-Click Browser Bookmarklet"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarklet</span>
        </button>

        {/* Export CSV */}
        <button
          onClick={onExportCSV}
          title="Export CSV"
          className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Export</span>
        </button>

        {/* Add Job Button */}
        <button
          onClick={onOpenAddJob}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98] cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Job</span>
        </button>

        {/* Profile Popover */}
        <ProfilePopover currentUser={currentUser} />
      </div>
    </header>
  );
}
