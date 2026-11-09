'use client';

import React from 'react';
import { LayoutDashboard, Users, Globe, BarChart3, Settings2, User } from 'lucide-react';
import { DashboardTab } from '../DashboardNavTabs';

interface SidebarNavItemsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  jobCount?: number;
  podJobCount?: number;
  isCollapsed: boolean;
  onItemClick?: () => void;
}

export function SidebarNavItems({
  activeTab,
  onTabChange,
  jobCount,
  podJobCount,
  isCollapsed,
  onItemClick,
}: SidebarNavItemsProps) {
  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, badge: jobCount },
    { id: 'pod' as const, label: 'Pod Feed', icon: Users, badge: podJobCount },
    { id: 'feed' as const, label: 'Explore', icon: Globe },
    { id: 'analytics' as const, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as const, label: 'Settings', icon: Settings2 },
    { id: 'profile' as const, label: 'Profile', icon: User },
  ];

  const handleSelect = (tab: DashboardTab) => {
    onTabChange(tab);
    onItemClick?.();
  };

  return (
    <nav className="space-y-1 w-full px-2">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => handleSelect(item.id)}
            title={isCollapsed ? item.label : undefined}
            className={`w-full flex items-center gap-2.5 h-8 px-2.5 text-xs font-medium transition-colors cursor-pointer rounded-sm ${
              isActive
                ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold'
                : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover)'
            } ${isCollapsed ? 'justify-center px-0' : 'justify-between'}`}
          >
            <div
              className={`flex items-center gap-2.5 min-w-0 ${isCollapsed ? 'justify-center' : ''}`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </div>

            {!isCollapsed && item.badge !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-sm shrink-0 ${
                  isActive
                    ? 'bg-(--accent-primary)/20 text-(--accent-blue-bright) font-semibold'
                    : 'bg-(--bg-surface-hover) text-(--text-muted)'
                }`}
              >
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
