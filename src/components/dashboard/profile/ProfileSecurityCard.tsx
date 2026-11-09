'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, KeyRound, Download, LogOut } from 'lucide-react';

interface ProfileSecurityCardProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  onExportCSV: () => void;
}

export function ProfileSecurityCard({ currentUser, onExportCSV }: ProfileSecurityCardProps) {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      router.push('/login');
    }
  };

  const email = currentUser?.email || 'user@example.com';

  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md p-5 shadow-xs space-y-4">
      <div className="flex items-center gap-2 border-b border-(--border-subtle) pb-3">
        <KeyRound className="w-4 h-4 text-(--accent-primary)" />
        <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
          Account Governance & Security Boundary
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm space-y-1">
          <span className="text-[10px] uppercase font-semibold text-(--text-muted)">
            Auth Architecture
          </span>
          <div className="font-semibold text-(--text-primary)">Google / Password</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">
            Protected
          </span>
        </div>

        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm space-y-1">
          <span className="text-[10px] uppercase font-semibold text-(--text-muted)">
            Active Session
          </span>
          <div className="font-semibold text-(--text-primary) truncate">{email}</div>
          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Verified
          </span>
        </div>

        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm space-y-1">
          <span className="text-[10px] uppercase font-semibold text-(--text-muted)">
            Data Sovereignty
          </span>
          <div className="font-semibold text-(--text-primary)">Neon Serverless PostgreSQL</div>
          <span className="text-[10px] text-blue-500 font-medium">Encrypted at rest</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-(--border-subtle)">
        <button
          onClick={onExportCSV}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-3.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-strong) text-xs text-(--text-primary) font-semibold rounded-sm transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span>Export</span>
        </button>

        <button
          onClick={handleLogout}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-3.5 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-semibold rounded-sm transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Log out</span>
        </button>
      </div>
    </div>
  );
}
