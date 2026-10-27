'use client';

import React from 'react';
import { LayoutDashboard, BarChart3, Settings2, User } from 'lucide-react';

export type DashboardTab = 'dashboard' | 'analytics' | 'settings' | 'profile';

interface DashboardNavTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  jobCount?: number;
}

export function DashboardNavTabs({ activeTab, onTabChange, jobCount }: DashboardNavTabsProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, badge: jobCount },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings2 },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  return (
    <div className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)] px-3 sm:px-5">
      <nav className="flex items-center gap-1 -mb-[1px] overflow-x-auto scrollbar-none whitespace-nowrap">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-3 sm:px-4 text-[11px] sm:text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer border-b-2 shrink-0 ${
                isActive
                  ? 'border-[var(--accent-primary)] text-[var(--accent-primary)] font-bold'
                  : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--border-subtle)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 ${
                    isActive
                      ? 'bg-[var(--accent-primary-bg)] text-[var(--accent-primary)]'
                      : 'bg-[var(--border-subtle)] text-[var(--text-muted)]'
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
