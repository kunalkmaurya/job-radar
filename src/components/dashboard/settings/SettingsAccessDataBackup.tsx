'use client';

import React from 'react';
import { Shield, Download, Database, RotateCcw, CheckCircle } from 'lucide-react';

interface SettingsAccessDataBackupProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  onExportCSV: () => void;
  totalJobs: number;
  onResetDefaults: () => void;
}

export function SettingsAccessDataBackup({
  currentUser,
  onExportCSV,
  totalJobs,
  onResetDefaults,
}: SettingsAccessDataBackupProps) {
  return (
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Access Security & Data Management
          </h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 font-semibold flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>Whitelist Enforced</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-xs">
        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Authorized Account
            </div>
            <div className="font-bold text-[var(--text-primary)] mt-0.5 truncate max-w-[220px]">
              {currentUser?.email || 'kunalkrraj@gmail.com'}
            </div>
            <div className="text-[9px] text-[var(--text-muted)]">OAuth Personal Whitelist</div>
          </div>
          <span className="px-2 py-0.5 text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold">
            OWNER
          </span>
        </div>

        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] flex items-center justify-between">
          <div>
            <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">
              Neon PostgreSQL
            </div>
            <div className="font-bold text-[var(--text-primary)] mt-0.5">
              {totalJobs} Pipeline Records
            </div>
            <div className="text-[9px] text-[var(--text-muted)]">Serverless Database Cloud</div>
          </div>
          <Database className="w-4 h-4 text-blue-400" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)] font-mono text-xs">
        <button
          type="button"
          onClick={onResetDefaults}
          className="flex items-center justify-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] hover:border-neutral-500 bg-[var(--bg-app)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer text-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>

        <button
          type="button"
          onClick={onExportCSV}
          className="flex items-center justify-center gap-1.5 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-mono text-xs font-semibold transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Full CSV Database</span>
        </button>
      </div>
    </div>
  );
}
