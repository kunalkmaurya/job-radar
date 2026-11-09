'use client';

import React from 'react';
import Image from 'next/image';
import { Menu } from 'lucide-react';
import { DashboardTab, DASHBOARD_TAB_MAP } from './DashboardNavTabs';
import { HeaderActions, HeaderActionsProps } from './HeaderActions';

interface DashboardHeaderProps extends HeaderActionsProps {
  onOpenMobileMenu?: () => void;
  activeTab?: DashboardTab;
  jobCount?: number;
}

export function DashboardHeader({
  theme,
  onToggleTheme,
  onOpenBookmarklet,
  onExportCSV,
  onOpenAddJob,
  onOpenPodModal,
  podMemberCount,
  isSyncing,
  onSync,
  onOpenMobileMenu,
  activeTab = 'dashboard',
  jobCount,
}: DashboardHeaderProps) {
  const currentTab = DASHBOARD_TAB_MAP[activeTab] || DASHBOARD_TAB_MAP.dashboard;
  const TabIcon = currentTab.icon;

  return (
    <header className="sticky top-0 z-30 h-12 w-full border-b border-(--border-subtle) bg-(--bg-surface) px-3 sm:px-5 flex items-center justify-between">
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="md:hidden h-8 w-8 flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) rounded-sm cursor-pointer"
        >
          <Menu className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-2 md:hidden">
          <div className="w-6 h-6 bg-(--accent-primary-bg) border border-(--accent-border) flex items-center justify-center p-0.5 rounded-sm">
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
          <div className="flex items-center gap-1.5 font-semibold text-(--text-primary)">
            <TabIcon className="w-3.5 h-3.5 text-(--accent-primary)" />
            <span>{currentTab.label}</span>
          </div>
          {activeTab === 'dashboard' && jobCount !== undefined && (
            <span className="ml-1 px-1.5 py-0.5 text-[10px] font-semibold rounded-sm bg-(--accent-primary-bg) text-(--accent-blue-bright) border border-(--accent-border)">
              {jobCount} tracked
            </span>
          )}
        </div>
      </div>

      <HeaderActions
        theme={theme}
        onToggleTheme={onToggleTheme}
        onOpenBookmarklet={onOpenBookmarklet}
        onExportCSV={onExportCSV}
        onOpenAddJob={onOpenAddJob}
        onOpenPodModal={onOpenPodModal}
        podMemberCount={podMemberCount}
        isSyncing={isSyncing}
        onSync={onSync}
      />
    </header>
  );
}
