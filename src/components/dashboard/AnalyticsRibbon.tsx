'use client';

import React from 'react';
import { Briefcase, TrendingUp, Users, Target } from 'lucide-react';
import { AnalyticsRibbonShimmer } from './shimmer/AnalyticsRibbonShimmer';

interface AnalyticsRibbonProps {
  isLoading?: boolean;
  metrics: {
    totalJobs: number;
    appliedCount: number;
    appliedLabel: string;
    interviewingCount: number;
    offerCount: number;
    responseRate: number;
    windowLabel: string;
  };
}

export function AnalyticsRibbon({ metrics, isLoading = false }: AnalyticsRibbonProps) {
  if (isLoading) {
    return <AnalyticsRibbonShimmer />;
  }

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
      <div className="p-3 sm:p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-[11px] sm:text-xs font-medium">Captured in Scope</span>
          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--accent-primary)]" />
        </div>
        <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight">{metrics.totalJobs}</div>
        <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1">{metrics.windowLabel}</span>
      </div>

      <div className="p-3 sm:p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-[11px] sm:text-xs font-medium">{metrics.appliedLabel}</span>
          <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" />
        </div>
        <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-amber-400">
          {metrics.appliedCount}
        </div>
        <span className="text-[10px] sm:text-[11px] text-amber-500/80 mt-1">Applications dispatched</span>
      </div>

      <div className="p-3 sm:p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-[11px] sm:text-xs font-medium">Active Interviews</span>
          <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
        </div>
        <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-purple-400">
          {metrics.interviewingCount}
        </div>
        <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1">Active interview rounds</span>
      </div>

      <div className="p-3 sm:p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
        <div className="flex items-center justify-between text-[var(--text-secondary)]">
          <span className="text-[11px] sm:text-xs font-medium">Response Rate</span>
          <Target className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
        </div>
        <div className="mt-1.5 sm:mt-2 text-xl sm:text-2xl font-bold tracking-tight text-emerald-400">
          {metrics.responseRate}%
        </div>
        <span className="text-[10px] sm:text-[11px] text-[var(--text-muted)] mt-1">Interview conversion ratio</span>
      </div>
    </section>
  );
}
