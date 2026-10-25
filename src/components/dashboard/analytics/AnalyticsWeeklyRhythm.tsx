'use client';

import React from 'react';
import { CalendarRange, Sparkles } from 'lucide-react';

interface WeeklyRhythmProps {
  data: {
    rhythm: { day: string; count: number }[];
    primeDay: string;
    maxCount: number;
  };
}

export function AnalyticsWeeklyRhythm({ data }: WeeklyRhythmProps) {
  return (
    <div className="p-5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4 shadow-sm">
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)]">
        <div className="flex items-center gap-2">
          <CalendarRange className="w-4 h-4 text-amber-400" />
          <h3 className="font-mono text-xs uppercase tracking-wider font-semibold text-[var(--text-primary)]">
            Submission Rhythm by Day
          </h3>
        </div>
        <div className="flex items-center gap-1 font-mono text-[10px] text-[var(--accent-primary)] font-semibold">
          <Sparkles className="w-3 h-3" />
          <span>Prime Day: {data.primeDay}</span>
        </div>
      </div>

      {/* 7-Day Bar Display */}
      <div className="pt-2">
        <div className="flex items-end justify-between gap-2 h-28 border-b border-[var(--border-subtle)] pb-1 px-2">
          {data.rhythm.map((item) => {
            const isPrime = item.day === data.primeDay && item.count > 0;
            const heightPercent = item.count > 0 ? Math.max((item.count / data.maxCount) * 100, 16) : 6;

            return (
              <div key={item.day} className="flex-1 flex flex-col items-center justify-end h-full group">
                {item.count > 0 && (
                  <span className={`text-[10px] font-mono mb-1 ${isPrime ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-secondary)]'}`}>
                    {item.count}
                  </span>
                )}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[24px] transition-all duration-300 ${
                    item.count === 0
                      ? 'bg-[var(--border-subtle)] opacity-40'
                      : isPrime
                      ? 'bg-[var(--accent-primary)]'
                      : 'bg-neutral-600 dark:bg-neutral-400 group-hover:bg-[var(--accent-primary)]'
                  }`}
                />
                <span className={`text-[10px] font-mono mt-2 ${isPrime ? 'text-[var(--accent-primary)] font-bold' : 'text-[var(--text-muted)]'}`}>
                  {item.day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="p-2.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[11px] text-[var(--text-secondary)] leading-relaxed">
        Submissions sent on <strong className="text-[var(--text-primary)]">{data.primeDay}</strong> yielded the quickest review responses. Avoid late Friday submissions.
      </div>
    </div>
  );
}
