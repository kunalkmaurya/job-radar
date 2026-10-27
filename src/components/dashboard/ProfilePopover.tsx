'use client';

import React, { useState } from 'react';
import { LogOut, Shield, User, ChevronRight, Download } from 'lucide-react';
import { usePwaInstall, InstallIOSModal } from '@/components/pwa';

interface ProfilePopoverProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  onOpenProfile?: () => void;
}

export function ProfilePopover({ currentUser, onOpenProfile }: ProfilePopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { isStandalone, triggerInstall, showIOSGuide, setShowIOSGuide } = usePwaInstall();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      window.location.href = '/login';
    }
  };

  const initial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'K';
  const displayName = currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Workspace Owner');
  const displayEmail = currentUser?.email || 'kunalkrraj@gmail.com';

  return (
    <div className="relative flex items-center">
      <button
        id="profile-avatar-button"
        onClick={() => setIsOpen(!isOpen)}
        title="User Account & Profile"
        className="h-8 w-8 shrink-0 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] hover:border-[var(--accent-primary)] text-[var(--accent-primary)] font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors"
      >
        {initial}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 z-50 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-4 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] font-bold text-sm flex items-center justify-center">
                {initial}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm text-[var(--text-primary)] truncate">{displayName}</div>
                <div className="text-[11px] text-[var(--text-muted)] truncate">{displayEmail}</div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Shield className="w-3 h-3" />
              <span>Authorized Owner</span>
            </div>

            <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5 text-[11px] text-[var(--text-muted)]">
              <div className="flex items-center justify-between">
                <span>Access Level</span>
                <span className="text-[var(--text-secondary)] font-medium">Single-User Personal</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Auth Provider</span>
                <span className="text-[var(--text-secondary)] font-medium">Google OAuth 2.0</span>
              </div>
            </div>
 
            {onOpenProfile && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  id="open-profile-button"
                  onClick={() => {
                    onOpenProfile();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-transparent transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>View Profile & Career Goals</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>
              </div>
            )}

            {!isStandalone && (
              <div className="pt-2 border-t border-[var(--border-subtle)]">
                <button
                  id="install-pwa-button"
                  onClick={() => {
                    triggerInstall();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-2.5 py-1.5 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-transparent transition-all text-left cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                    <span>Install Job Radar App</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-[var(--border-subtle)]">
              <button
                id="logout-button"
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all text-left cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out of Job Radar</span>
              </button>
            </div>
          </div>
        </>
      )}

      <InstallIOSModal isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} />
    </div>
  );
}
