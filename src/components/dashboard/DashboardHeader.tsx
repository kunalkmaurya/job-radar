'use client';

import React from 'react';
import Image from 'next/image';
import { Sun, Moon, Bookmark, Download, Plus, RefreshCw, Menu } from 'lucide-react';
import { ProfilePopover } from './ProfilePopover';
import { DashboardTab } from './DashboardNavTabs';

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
  onOpenMobileMenu?: () => void;
  activeTab?: DashboardTab;
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
  onOpenMobileMenu,
  activeTab = 'dashboard',
}: DashboardHeaderProps) {
  const tabTitles: Record<DashboardTab, string> = {
    dashboard: 'My Dashboard',
    feed: 'Explore Jobs',
    analytics: 'Application Analytics',
    settings: 'Workspace Settings',
    profile: 'User Profile',
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-(--border-subtle) bg-(--bg-app)/90 backdrop-blur-xl px-3 sm:px-5 py-2 sm:py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="md:hidden p-1.5 border border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) rounded-xs cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="w-6 h-6 bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center p-0.5 rounded-xs">
            <Image
              src="/logo.png"
              alt="Job Radar"
              width={16}
              height={16}
              className="w-3.5 h-3.5 object-contain"
            />
          </div>
          <span className="font-bold text-xs tracking-wider uppercase text-(--text-primary)">
            JOB RADAR
          </span>
        </div>

        <div className="hidden md:flex items-center gap-2 text-xs">
          <span className="text-(--text-muted)">Workspace</span>
          <span className="text-(--border-strong)">/</span>
          <span className="font-semibold text-(--text-primary)">{tabTitles[activeTab]}</span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {onSync && (
          <button
            onClick={onSync}
            disabled={isSyncing}
            title={isSyncing ? 'Syncing...' : 'Sync pipeline'}
            aria-label="Sync jobs pipeline"
            className="h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0 disabled:opacity-50"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-(--accent-primary)' : ''}`}
            />
          </button>
        )}

        <button
          onClick={onOpenBookmarklet}
          title="1-Click Browser Bookmarklet"
          className="hidden lg:inline-flex items-center gap-1.5 h-8 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
        >
          <Bookmark className="w-3.5 h-3.5" />
          <span>Bookmarklet</span>
        </button>

        <button
          onClick={onExportCSV}
          title="Export CSV"
          aria-label="Export CSV"
          className="h-8 w-8 sm:w-auto p-0 sm:px-2.5 flex items-center justify-center gap-1.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Export</span>
        </button>

        <button
          onClick={onOpenAddJob}
          className="inline-flex items-center gap-1 sm:gap-1.5 h-8 px-2.5 sm:px-3 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold rounded-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add</span>
        </button>

        <ProfilePopover currentUser={currentUser} onOpenProfile={onOpenProfile} />
      </div>
    </header>
  );
}
