'use client';

import React from 'react';
import { Filter, ArrowRight } from 'lucide-react';

interface FunnelFlowProps {
  stages: {
    total: number;
    saved: number;
    applied: number;
    interviewing: number;
    offer: number;
    rejected: number;
    savedToAppliedRate: number;
    appliedToInterviewRate: number;
    interviewToOfferRate: number;
  };
}

export function AnalyticsFunnelFlow({ stages }: FunnelFlowProps) {
  const steps = [
    {
      label: 'INGESTED / SAVED',
      count: stages.saved,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      label: 'SUBMITTED',
      count: stages.applied,
      color: 'text-amber-400',
      bg: 'bg-amber-400/10',
      rate: `${stages.savedToAppliedRate}% applied`,
    },
    {
      label: 'INTERVIEWING',
      count: stages.interviewing,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
      rate: `${stages.appliedToInterviewRate}% screen`,
    },
    {
      label: 'OFFER WON',
      count: stages.offer,
      color: 'text-emerald-400',
      bg: 'bg-emerald-400/10',
      rate: `${stages.interviewToOfferRate}% offer`,
    },
  ];

  return (
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--accent-primary)]" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Conversion Pipeline Funnel
          </h3>
        </div>
        <span className="text-[11px] font-mono text-[var(--text-muted)]">
          {stages.total} total tracked
        </span>
      </div>

      {/* Stepped Conversion Flow */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 font-mono">
        {steps.map((step, idx) => (
          <div
            key={step.label}
            className="relative flex flex-col justify-between p-3.5 border border-[var(--border-subtle)] bg-[var(--bg-app)]"
          >
            <div className="space-y-1">
              <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                {step.label}
              </div>
              <div className="text-2xl font-bold text-[var(--text-primary)]">{step.count}</div>
            </div>

            <div className="mt-3 pt-2 border-t border-[var(--border-subtle)] flex items-center justify-between text-[11px]">
              {step.rate ? (
                <span className={`font-semibold ${step.color}`}>{step.rate}</span>
              ) : (
                <span className="text-[var(--text-muted)]">Initial stage</span>
              )}
              {idx < steps.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] hidden sm:block -mr-1" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Outcome Bar */}
      <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-xs space-y-2">
        <div className="flex justify-between items-center text-[11px]">
          <span className="text-[var(--text-secondary)]">Pipeline Attrition & Closure:</span>
          <span className="text-[var(--text-muted)]">
            Archived / Rejected: <strong className="text-rose-400">{stages.rejected}</strong> (
            {Math.round((stages.rejected / stages.total) * 100)}%)
          </span>
        </div>
        <div className="w-full h-1.5 bg-[var(--border-subtle)] flex overflow-hidden">
          <div
            style={{ width: `${Math.round((stages.offer / stages.total) * 100)}%` }}
            className="bg-emerald-400 h-full"
            title="Offer"
          />
          <div
            style={{ width: `${Math.round((stages.interviewing / stages.total) * 100)}%` }}
            className="bg-purple-400 h-full"
            title="Interviewing"
          />
          <div
            style={{ width: `${Math.round((stages.applied / stages.total) * 100)}%` }}
            className="bg-amber-400 h-full"
            title="Applied"
          />
          <div
            style={{ width: `${Math.round((stages.saved / stages.total) * 100)}%` }}
            className="bg-blue-400 h-full"
            title="Saved"
          />
          <div
            style={{ width: `${Math.round((stages.rejected / stages.total) * 100)}%` }}
            className="bg-neutral-500 h-full"
            title="Rejected"
          />
        </div>
      </div>
    </div>
  );
}
