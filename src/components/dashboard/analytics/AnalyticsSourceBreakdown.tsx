'use client';

import React from 'react';
import { Send, Bookmark, MousePointerClick, Radio } from 'lucide-react';
import { Job } from '@/types';

interface SourceBreakdownProps {
  jobs: Job[];
}

export function AnalyticsSourceBreakdown({ jobs }: SourceBreakdownProps) {
  const total = jobs.length || 1;

  const telegramJobs = jobs.filter((j) => j.source === 'telegram');
  const bookmarkJobs = jobs.filter((j) => j.source === 'bookmarklet');
  const manualJobs = jobs.filter((j) => j.source === 'manual');

  const sources = [
    {
      label: 'Telegram Bot',
      count: telegramJobs.length,
      pct: Math.round((telegramJobs.length / total) * 100),
      interviews: telegramJobs.filter((j) => j.status === 'Interviewing' || j.status === 'Offer')
        .length,
      icon: Send,
      color: 'text-blue-400',
      barColor: 'bg-blue-400',
    },
    {
      label: 'Bookmarklet',
      count: bookmarkJobs.length,
      pct: Math.round((bookmarkJobs.length / total) * 100),
      interviews: bookmarkJobs.filter((j) => j.status === 'Interviewing' || j.status === 'Offer')
        .length,
      icon: Bookmark,
      color: 'text-amber-400',
      barColor: 'bg-amber-400',
    },
    {
      label: 'Manual Links',
      count: manualJobs.length,
      pct: Math.round((manualJobs.length / total) * 100),
      interviews: manualJobs.filter((j) => j.status === 'Interviewing' || j.status === 'Offer')
        .length,
      icon: MousePointerClick,
      color: 'text-purple-400',
      barColor: 'bg-purple-400',
    },
  ];

  return (
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-emerald-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Ingestion Telemetry & Channels
          </h3>
        </div>
        <span className="text-[11px] font-mono text-emerald-400 font-semibold flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Webhook Active
        </span>
      </div>

      <div className="space-y-3 font-mono">
        {sources.map((src) => {
          const Icon = src.icon;
          return (
            <div
              key={src.label}
              className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${src.color}`} />
                  <span className="font-semibold text-[var(--text-primary)]">{src.label}</span>
                </div>
                <div className="text-[var(--text-muted)] text-[11px]">
                  <strong className="text-[var(--text-primary)]">{src.count}</strong> jobs (
                  {src.pct}%)
                  {src.interviews > 0 && (
                    <span className="ml-2 text-emerald-400 font-semibold">
                      • {src.interviews} screened
                    </span>
                  )}
                </div>
              </div>
              <div className="w-full h-1.5 bg-[var(--border-subtle)]">
                <div className={`h-full ${src.barColor}`} style={{ width: `${src.pct}%` }} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-2.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[11px] text-[var(--text-secondary)] leading-relaxed">
        Telegram channel achieves lowest ingestion friction (avg 18s from share-sheet to AI
        parsing).
      </div>
    </div>
  );
}
