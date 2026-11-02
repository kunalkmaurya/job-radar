'use client';

import React from 'react';
import Image from 'next/image';
import { PanelLeftClose, PanelLeft, Plus, X } from 'lucide-react';
import { useSidebar } from './useSidebar';
import { SidebarNavItems } from './SidebarNavItems';
import { SidebarUserFooter } from './SidebarUserFooter';
import { DashboardTab } from '../DashboardNavTabs';

interface DashboardSidebarProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  jobCount?: number;
  currentUser: { email?: string; name?: string; role?: string } | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAddJob: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function DashboardSidebar({
  activeTab,
  onTabChange,
  jobCount,
  currentUser,
  theme,
  onToggleTheme,
  onOpenAddJob,
  isMobileOpen,
  onCloseMobile,
}: DashboardSidebarProps) {
  const { width, isCollapsed, toggleCollapsed, resetWidth, startResizing } = useSidebar();
  const currentWidth = isCollapsed ? 64 : width;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 z-50 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        style={{ width: `${currentWidth}px` }}
        className={`fixed md:sticky top-0 left-0 h-screen z-50 md:z-30 bg-(--bg-surface) border-r border-(--border-subtle) flex flex-col justify-between transition-[width] duration-150 select-none ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header */}
          <div className="h-14 px-3 flex items-center justify-between border-b border-(--border-subtle) shrink-0">
            {isCollapsed ? (
              <button
                onClick={toggleCollapsed}
                title="Expand sidebar (Cmd+B)"
                className="w-full flex items-center justify-center p-1 text-(--text-muted) hover:text-(--text-primary) rounded-xs cursor-pointer transition-colors group"
              >
                <div className="w-7 h-7 bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center p-1 shrink-0 rounded-xs group-hover:hidden">
                  <Image
                    src="/logo.png"
                    alt="Job Radar"
                    width={18}
                    height={18}
                    className="w-4 h-4 object-contain rounded-xs"
                  />
                </div>
                <PanelLeft className="w-4 h-4 hidden group-hover:block text-(--accent-blue-bright)" />
              </button>
            ) : (
              <>
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-7 h-7 bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center p-1 shrink-0 rounded-xs">
                    <Image
                      src="/logo.png"
                      alt="Job Radar"
                      width={18}
                      height={18}
                      className="w-4 h-4 object-contain rounded-xs"
                    />
                  </div>
                  <span className="font-bold text-xs tracking-wider uppercase text-(--text-primary) truncate">
                    JOB RADAR
                  </span>
                </div>

                <button
                  onClick={toggleCollapsed}
                  title="Collapse sidebar (Cmd+B)"
                  className="hidden md:flex p-1.5 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-app) rounded-xs cursor-pointer transition-colors"
                >
                  <PanelLeftClose className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={onCloseMobile}
                  className="md:hidden p-1.5 text-(--text-muted) hover:text-(--text-primary) cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* Quick CTA */}
          <div className="p-2.5">
            <button
              onClick={onOpenAddJob}
              title="Add Job"
              className={`w-full flex items-center justify-center gap-1.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white font-semibold text-xs py-2 rounded-xs shadow-xs transition-all active:scale-[0.98] cursor-pointer ${
                isCollapsed ? 'px-0' : 'px-3'
              }`}
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              {!isCollapsed && <span>Add Job</span>}
            </button>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-2">
            <SidebarNavItems
              activeTab={activeTab}
              onTabChange={onTabChange}
              jobCount={jobCount}
              isCollapsed={isCollapsed}
              onItemClick={onCloseMobile}
            />
          </div>
        </div>

        {/* User Footer */}
        <SidebarUserFooter
          currentUser={currentUser}
          theme={theme}
          onToggleTheme={onToggleTheme}
          isCollapsed={isCollapsed}
          onOpenProfile={() => {
            onTabChange('profile');
            onCloseMobile();
          }}
        />

        {/* Resizer Handle (Desktop only when expanded) */}
        {!isCollapsed && (
          <div
            onMouseDown={startResizing}
            onDoubleClick={resetWidth}
            title="Drag to resize, double-click to reset"
            className="hidden md:block absolute right-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-(--accent-primary) active:bg-(--accent-primary) transition-colors z-40"
          />
        )}
      </aside>
    </>
  );
}
