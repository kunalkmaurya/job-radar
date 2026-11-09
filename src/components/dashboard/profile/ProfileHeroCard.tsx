'use client';

import React from 'react';
import { ShieldCheck, Mail, Database, Sparkles, Calendar } from 'lucide-react';

interface ProfileHeroCardProps {
  currentUser: { email?: string; name?: string; role?: string } | null;
  totalJobs: number;
}

export function ProfileHeroCard({ currentUser, totalJobs }: ProfileHeroCardProps) {
  const initial = currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'U';
  const displayName =
    currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'User');
  const displayEmail = currentUser?.email || 'user@example.com';

  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md p-6 shadow-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-(--accent-primary-bg) border-2 border-(--accent-border) text-(--accent-blue-bright) font-bold text-2xl flex items-center justify-center shrink-0">
            {initial}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h2 className="text-lg font-bold text-(--text-primary) tracking-tight">
                {displayName}
              </h2>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-semibold bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 rounded-sm">
                <ShieldCheck className="w-3 h-3" />
                {currentUser?.role === 'admin' ? 'Platform Admin' : 'Member'}
              </span>
            </div>
            <p className="flex items-center gap-1.5 text-xs text-(--text-secondary)">
              <Mail className="w-3.5 h-3.5 text-(--text-muted)" />
              <span>{displayEmail}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap text-xs">
          <div className="h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) flex items-center gap-1.5 rounded-sm font-medium">
            <Sparkles className="w-3.5 h-3.5 text-(--accent-primary)" />
            <span>{totalJobs} Jobs In Radar</span>
          </div>
          <div className="h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) flex items-center gap-1.5 rounded-sm font-medium">
            <Database className="w-3.5 h-3.5 text-blue-500" />
            <span>Neon DB Active</span>
          </div>
          <div className="h-8 px-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) flex items-center gap-1.5 rounded-sm font-medium">
            <Calendar className="w-3.5 h-3.5 text-amber-500" />
            <span>Personal Workspace</span>
          </div>
        </div>
      </div>
    </div>
  );
}
