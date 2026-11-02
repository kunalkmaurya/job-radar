'use client';

import React from 'react';
import { Sun, Moon, LogOut } from 'lucide-react';

interface SidebarUserFooterProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isCollapsed: boolean;
  onOpenProfile?: () => void;
}

export function SidebarUserFooter({
  currentUser,
  theme,
  onToggleTheme,
  isCollapsed,
  onOpenProfile,
}: SidebarUserFooterProps) {
  const initial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
  const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const roleLabel = currentUser?.role === 'admin' ? 'Admin' : 'Member';

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      window.location.href = '/login';
    }
  };

  return (
    <div className="p-2 border-t border-(--border-subtle) space-y-2">
      <div
        className={`flex items-center gap-2 ${isCollapsed ? 'justify-center' : 'justify-between'}`}
      >
        <button
          onClick={onToggleTheme}
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 border border-(--border-subtle) bg-(--bg-app) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer rounded-xs shrink-0"
        >
          {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        {!isCollapsed && (
          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-1.5 px-2 py-1 text-[11px] text-(--text-muted) hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer rounded-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        )}
      </div>

      <div
        onClick={onOpenProfile}
        title={isCollapsed ? `${displayName} (${roleLabel})` : undefined}
        className={`flex items-center gap-2 p-1.5 rounded-xs transition-colors cursor-pointer hover:bg-(--bg-surface-hover) ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="w-7 h-7 bg-(--accent-primary-bg) border border-(--border-subtle) text-(--accent-primary) font-bold text-xs flex items-center justify-center shrink-0 rounded-xs">
          {initial}
        </div>

        {!isCollapsed && (
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-1">
              <span className="font-semibold text-xs text-(--text-primary) truncate">
                {displayName}
              </span>
              <span className="text-[9px] uppercase font-mono px-1 border border-(--border-subtle) bg-(--bg-app) text-(--text-muted) rounded-xs">
                {roleLabel}
              </span>
            </div>
            <p className="text-[10px] text-(--text-muted) truncate">{currentUser?.email || ''}</p>
          </div>
        )}
      </div>
    </div>
  );
}
