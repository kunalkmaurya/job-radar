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
    <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-[var(--accent-primary)]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-bold text-[var(--text-primary)]">
            Application Pipeline Telemetry & Velocity
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[var(--accent-primary)] font-semibold">
          {metrics.responseRate}% Response Rate
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1"
            >
              <div className="flex items-center justify-between text-[var(--text-muted)]">
                <span className="text-[10px] font-mono uppercase tracking-wider">{item.label}</span>
                <Icon className="w-3.5 h-3.5" style={{ color: item.color }} />
              </div>
              <div className="text-xl font-bold font-mono text-[var(--text-primary)]">
                {item.value}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2 text-xs">
        <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-secondary)]">
          <span>Pipeline Conversion (Offers / Applied)</span>
          <span className="font-bold text-[var(--text-primary)]">
            {metrics.appliedCount > 0
              ? `${Math.round((metrics.offerCount / metrics.appliedCount) * 100)}%`
              : '0%'}
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--border-subtle)] overflow-hidden">
          <div
            className="h-full bg-[var(--accent-primary)] transition-all duration-500"
            style={{
              width: `${metrics.appliedCount > 0 ? Math.min(100, Math.round((metrics.offerCount / metrics.appliedCount) * 100)) : 0}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
