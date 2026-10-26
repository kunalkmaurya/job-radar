'use client';

import React from 'react';
import { ShieldCheck, KeyRound, Download, LogOut } from 'lucide-react';

interface ProfileSecurityCardProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  onExportCSV: () => void;
}

export function ProfileSecurityCard({ currentUser, onExportCSV }: ProfileSecurityCardProps) {
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      window.location.href = '/login';
    }
  };

  const email = currentUser?.email || 'kunalkrraj@gmail.com';

  return (
    <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-sm space-y-4">
      <div className="flex items-center gap-2 border-b border-[var(--border-subtle)] pb-3">
        <KeyRound className="w-4 h-4 text-[var(--accent-primary)]" />
        <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--text-primary)]">
          Account Governance & Security Boundary
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Auth Architecture</span>
          <div className="font-semibold text-[var(--text-primary)]">Google OAuth 2.0 / Password</div>
          <span className="text-[10px] text-emerald-400 font-mono">Protected</span>
        </div>

        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Whitelist Verification</span>
          <div className="font-semibold text-[var(--text-primary)] truncate">{email}</div>
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" /> Whitelisted
          </span>
        </div>

        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1">
          <span className="text-[10px] font-mono uppercase text-[var(--text-muted)]">Data Sovereignty</span>
          <div className="font-semibold text-[var(--text-primary)]">Neon Serverless PostgreSQL</div>
          <span className="text-[10px] text-blue-400 font-mono">Encrypted at rest</span>
        </div>
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-[var(--border-subtle)]">
        <button
          onClick={onExportCSV}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-primary)] font-medium transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <span>Export Complete Career Data (.CSV)</span>
        </button>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-1.5 px-3.5 py-2 border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-colors cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out of Job Radar</span>
        </button>
      </div>
    </div>
  );
}
