'use client';

import React from 'react';
import { Briefcase, TrendingUp, Users, Target } from 'lucide-react';

interface AnalyticsRibbonProps {
  metrics: {
    totalJobs: number;
    appliedThisWeek: number;
    interviewingCount: number;
    offerCount: number;
    responseRate: number;
  };
}

export function AnalyticsRibbon({ metrics }: AnalyticsRibbonProps) {
  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-xs font-medium">Total Captured</span>
          <Briefcase className="w-4 h-4 text-[var(--accent-primary)]" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight">{metrics.totalJobs}</div>
        <span className="text-[11px] text-[var(--text-muted)] mt-1">All-time applications tracked</span>
      </div>

      <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-xs font-medium">Applied This Week</span>
          <TrendingUp className="w-4 h-4 text-amber-400" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-amber-400">
          {metrics.appliedThisWeek}
        </div>
        <span className="text-[11px] text-amber-500/80 mt-1">Active weekly momentum</span>
      </div>

      <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-xs font-medium">Active Interviews</span>
          <Users className="w-4 h-4 text-purple-400" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-purple-400">
          {metrics.interviewingCount}
        </div>
        <span className="text-[11px] text-[var(--text-muted)] mt-1">In interview pipeline</span>
      </div>

      <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-xs font-medium">Response Rate</span>
          <Target className="w-4 h-4 text-emerald-400" />
        </div>
        <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
          {metrics.responseRate}%
        </div>
        <span className="text-[11px] text-[var(--text-muted)] mt-1">Interview conversion ratio</span>
      </div>
    </section>
  );
}
