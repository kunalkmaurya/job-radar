'use client';

import React from 'react';
import { LayoutDashboard, BarChart3, Settings2 } from 'lucide-react';

export type DashboardTab = 'dashboard' | 'analytics' | 'settings';

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
  ];

  return (
    <div className="w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)] px-[20px]">
      <nav className="flex items-center gap-1 -mb-[1px]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-xs font-mono tracking-wider uppercase transition-colors cursor-pointer border-b-2 ${
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
