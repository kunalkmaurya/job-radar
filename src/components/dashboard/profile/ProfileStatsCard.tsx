'use client';

import React from 'react';
import { BarChart3, TrendingUp, CheckCircle, Clock } from 'lucide-react';

interface ProfileStatsCardProps {
  metrics: {
    totalJobs: number;
    appliedCount: number;
    appliedLabel: string;
    interviewingCount: number;
    offerCount: number;
    responseRate: number;
  };
}

export function ProfileStatsCard({ metrics }: ProfileStatsCardProps) {
  const statItems = [
    {
      label: 'Total Jobs Tracked',
      value: metrics.totalJobs,
      color: 'var(--accent-primary)',
      icon: BarChart3,
    },
    {
      label: 'Applications Submitted',
      value: metrics.appliedCount,
      color: 'var(--status-applied-text)',
      icon: TrendingUp,
    },
    {
      label: 'In Active Interview',
      value: metrics.interviewingCount,
      color: 'var(--status-interview-text)',
      icon: Clock,
    },
    {
      label: 'Offers Received',
      value: metrics.offerCount,
      color: 'var(--status-offer-text)',
      icon: CheckCircle,
    },
  ];

  return (
    <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Application Pipeline Telemetry & Velocity
          </h3>
        </div>
        <span className="text-[11px] text-(--accent-blue-bright) font-semibold">
          {metrics.responseRate}% Response Rate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm space-y-1"
            >
              <div className="flex items-center justify-between text-(--text-muted)">
                <span className="text-[10px] uppercase font-semibold">{item.label}</span>
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <div className="text-xl font-bold text-(--text-primary)">{item.value}</div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] text-(--text-secondary)">
          <span>Pipeline Conversion (Offers / Applied)</span>
          <span className="font-bold text-(--text-primary)">
            {metrics.appliedCount > 0
              ? `${Math.round((metrics.offerCount / metrics.appliedCount) * 100)}%`
              : '0%'}
          </span>
        </div>
        <div className="w-full h-2 bg-(--border-subtle) rounded-full overflow-hidden">
          <div
            className="h-full bg-(--accent-primary) rounded-full transition-all duration-500"
            style={{
              width: `${metrics.appliedCount > 0 ? Math.min(100, Math.round((metrics.offerCount / metrics.appliedCount) * 100)) : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
