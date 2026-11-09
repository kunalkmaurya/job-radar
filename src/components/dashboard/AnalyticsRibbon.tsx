'use client';

import React from 'react';
import { TrendingUp, Users, Target, Activity } from 'lucide-react';
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
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 relative z-0">
      <div className="p-3.5 sm:p-4 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-(--text-secondary)">
          <span className="text-[11px] sm:text-xs font-semibold">Captured in Scope</span>
          <Activity className="w-4 h-4 text-(--accent-primary)" />
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-(--text-primary)">
          {metrics.totalJobs}
        </div>
        <span className="text-[10px] sm:text-[11px] text-(--text-muted) mt-1">
          {metrics.windowLabel}
        </span>
      </div>

      <div className="p-3.5 sm:p-4 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-(--text-secondary)">
          <span className="text-[11px] sm:text-xs font-semibold">{metrics.appliedLabel}</span>
          <TrendingUp className="w-4 h-4 text-amber-500 dark:text-amber-400" />
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
          {metrics.appliedCount}
        </div>
        <span className="text-[10px] sm:text-[11px] text-amber-600/80 dark:text-amber-400/80 mt-1">
          Applications dispatched
        </span>
      </div>

      <div className="p-3.5 sm:p-4 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-(--text-secondary)">
          <span className="text-[11px] sm:text-xs font-semibold">Active Interviews</span>
          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-purple-600 dark:text-purple-400">
          {metrics.interviewingCount}
        </div>
        <span className="text-[10px] sm:text-[11px] text-(--text-muted) mt-1">
          Active interview rounds
        </span>
      </div>

      <div className="p-3.5 sm:p-4 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between text-(--text-secondary)">
          <span className="text-[11px] sm:text-xs font-semibold">Response Rate</span>
          <Target className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
          {metrics.responseRate}%
        </div>
        <span className="text-[10px] sm:text-[11px] text-(--text-muted) mt-1">
          Interview conversion ratio
        </span>
      </div>
    </section>
  );
}
