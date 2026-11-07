'use client';

import React from 'react';
import { LayoutDashboard, Globe, BarChart3, Settings2, User } from 'lucide-react';

export type DashboardTab = 'dashboard' | 'feed' | 'analytics' | 'settings' | 'profile';

export const DASHBOARD_TAB_MAP: Record<
  DashboardTab,
  { label: string; icon: React.ComponentType<{ className?: string }> }
> = {
  dashboard: { label: 'My Dashboard', icon: LayoutDashboard },
  feed: { label: 'Explore Jobs', icon: Globe },
  analytics: { label: 'Analytics', icon: BarChart3 },
  settings: { label: 'Settings', icon: Settings2 },
  profile: { label: 'Profile', icon: User },
};

interface DashboardNavTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  jobCount?: number;
}

export function DashboardNavTabs({ activeTab, onTabChange, jobCount }: DashboardNavTabsProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'My Dashboard', icon: LayoutDashboard, badge: jobCount },
    { id: 'feed' as const, label: 'Explore Jobs', icon: Globe },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings2 },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="w-full border-b border-(--border-subtle) bg-(--bg-app) px-3 sm:px-5 py-2">
      <nav className="flex items-center gap-1.5 overflow-x-auto scrollbar-none whitespace-nowrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 py-1.5 px-3 text-xs font-medium transition-colors cursor-pointer border rounded-xs shrink-0 ${
                isActive
                  ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
                  : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary) hover:border-(--border-strong)'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-xs ${
                    isActive
                      ? 'bg-(--accent-primary)/20 text-(--accent-primary)'
                      : 'bg-(--border-subtle) text-(--text-muted)'
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
