'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, User, ChevronRight, ChevronsUpDown, Download } from 'lucide-react';
import { usePwaInstall, InstallIOSModal } from '@/components/pwa';

interface SidebarUserFooterProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  isCollapsed: boolean;
  onOpenProfile?: () => void;
}

export function SidebarUserFooter({
  currentUser,
  isCollapsed,
  onOpenProfile,
}: SidebarUserFooterProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { isStandalone, triggerInstall, showIOSGuide, setShowIOSGuide } = usePwaInstall();

  const initial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
  const displayName = currentUser?.name || currentUser?.email?.split('@')[0] || 'User';
  const displayEmail = currentUser?.email || '';

  const handleLogout = () => {
    fetch('/api/auth/logout', { method: 'POST' }).finally(() => {
      router.push('/login');
    });
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div className="relative p-2 border-t border-(--border-subtle)">
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div
            className={`absolute z-50 border border-(--border-subtle) bg-(--bg-surface) shadow-lg p-2 rounded-md animate-in fade-in zoom-in-95 duration-150 ${
              isCollapsed ? 'left-full ml-2 bottom-0 w-64' : 'bottom-full mb-2 left-1 right-1'
            }`}
          >
            <div className="flex items-center gap-3 p-1.5 pb-2">
              <div className="w-8 h-8 rounded-full bg-(--accent-primary-bg) border border-(--accent-border) text-(--accent-blue-bright) font-bold text-xs flex items-center justify-center shrink-0">
                {initial}
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-semibold text-xs text-(--text-primary) truncate">
                  {displayName}
                </div>
                <div className="text-[11px] text-(--text-muted) truncate">{displayEmail}</div>
              </div>
            </div>

            <div className="my-1 h-px bg-(--border-subtle)" />

            <div className="space-y-0.5">
              {onOpenProfile && (
                <button
                  onClick={() => {
                    onOpenProfile();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-(--text-muted) group-hover:text-(--accent-primary) transition-colors" />
                    <span>Profile & Preferences</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-(--text-muted) group-hover:text-(--text-secondary)" />
                </button>
              )}

              {!isStandalone && (
                <button
                  onClick={() => {
                    triggerInstall();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-sm text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-4 h-4 text-(--text-muted) group-hover:text-(--accent-primary) transition-colors" />
                    <span>Install App</span>
                  </div>
                  <span className="text-[9px] px-1 py-0.5 bg-(--bg-app) text-(--text-muted) border border-(--border-subtle) rounded-sm">
                    PWA
                  </span>
                </button>
              )}
            </div>

            <div className="my-1 h-px bg-(--border-subtle)" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2.5 py-1.5 rounded-sm text-xs font-medium text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </>
      )}

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center gap-2.5 p-1.5 rounded-sm border border-transparent hover:border-(--border-subtle) hover:bg-(--bg-surface-hover) transition-all cursor-pointer text-left group ${
          isCollapsed ? 'justify-center' : ''
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-(--accent-primary-bg) border border-(--accent-border) text-(--accent-blue-bright) font-bold text-xs flex items-center justify-center shrink-0 relative">
          {initial}
          <span className="w-2 h-2 rounded-full bg-emerald-500 absolute bottom-0 right-0 ring-2 ring-(--bg-surface)" />
        </div>

        {!isCollapsed && (
          <>
            <div className="min-w-0 flex-1">
              <span className="font-semibold text-xs text-(--text-primary) truncate block">
                {displayName}
              </span>
              <span className="text-[10px] text-(--text-muted) truncate block">{displayEmail}</span>
            </div>
            <ChevronsUpDown className="w-3.5 h-3.5 text-(--text-muted) group-hover:text-(--text-secondary) shrink-0 transition-colors" />
          </>
        )}
      </button>

      <InstallIOSModal isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} />
    </div>
  );
}
