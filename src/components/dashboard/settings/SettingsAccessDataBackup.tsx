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
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-4 shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-(--border-subtle)">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-500" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Access Security & Data Management
          </h3>
        </div>
        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
          <CheckCircle className="w-3 h-3" />
          <span>Active & Protected</span>
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] text-(--text-muted) uppercase font-semibold">
              Signed In Account
            </div>
            <div className="font-bold text-(--text-primary) mt-0.5 truncate max-w-[220px]">
              {currentUser?.email || 'user@example.com'}
            </div>
            <div className="text-[10px] text-(--text-muted)">
              {currentUser?.role === 'admin' ? 'Platform Administrator' : 'Standard Member'}
            </div>
          </div>
          <span className="px-2 py-0.5 text-[10px] rounded-sm bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
            {currentUser?.role === 'admin' ? 'ADMIN' : 'MEMBER'}
          </span>
        </div>

        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm flex items-center justify-between">
          <div>
            <div className="text-[10px] text-(--text-muted) uppercase font-semibold">
              Neon PostgreSQL
            </div>
            <div className="font-bold text-(--text-primary) mt-0.5">
              {totalJobs} Pipeline Records
            </div>
            <div className="text-[10px] text-(--text-muted)">Serverless Database Cloud</div>
          </div>
          <Database className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 border-t border-(--border-subtle) text-xs">
        <button
          type="button"
          onClick={onResetDefaults}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-3 border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) rounded-sm transition-colors cursor-pointer text-xs font-semibold"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>

        <button
          type="button"
          onClick={onExportCSV}
          className="h-8 inline-flex items-center justify-center gap-1.5 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm shadow-xs transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export</span>
        </button>
      </div>
    </div>
  );
}
