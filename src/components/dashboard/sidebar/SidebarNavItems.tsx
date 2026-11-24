'use client';

import React from 'react';
import { LayoutDashboard, Users, Globe, BarChart3, Settings2, User, Settings } from 'lucide-react';
import { DashboardTab } from '../DashboardNavTabs';

interface SidebarNavItemsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  jobCount?: number;
  podJobCount?: number;
  isCollapsed: boolean;
  onItemClick?: () => void;
  showPodFeed?: boolean;
  onOpenPodModal?: () => void;
  hasPod?: boolean;
}

export function SidebarNavItems({
  activeTab,
  onTabChange,
  jobCount,
  podJobCount,
  isCollapsed,
  onItemClick,
  showPodFeed = true,
  onOpenPodModal,
  hasPod,
}: SidebarNavItemsProps) {
  const [podFeedVisible] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') return showPodFeed;
    try {
      const stored = localStorage.getItem('job_radar_app_settings_v1');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.showPodFeed !== undefined) return Boolean(parsed.showPodFeed);
      }
    } catch {
      // ignore
    }
    return showPodFeed;
  });

  const navItems = [
    { id: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard, badge: jobCount },
    ...(podFeedVisible
      ? [{ id: 'pod' as const, label: 'Pod Feed', icon: Users, badge: podJobCount }]
      : []),
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

        if (item.id === 'pod' && !isCollapsed) {
          return (
            <div
              key={item.id}
              className={`w-full flex items-center justify-between h-8 px-2.5 text-xs font-medium transition-colors rounded-sm ${
                isActive
                  ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover)'
              }`}
            >
              <button
                type="button"
                onClick={() => handleSelect(item.id)}
                className="flex items-center gap-2.5 min-w-0 flex-1 h-full text-left cursor-pointer"
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>

              <div className="flex items-center gap-1 shrink-0">
                {onOpenPodModal && (
                  <button
                    type="button"
                    onClick={onOpenPodModal}
                    title={hasPod ? 'Manage Pod' : 'Create or Join Pod'}
                    aria-label="Pod settings"
                    className="p-1 text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface) rounded-xs cursor-pointer transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5" />
                  </button>
                )}
                {item.badge !== undefined && (
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
              </div>
            </div>
          );
        }

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
