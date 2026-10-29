'use client';

import React, { useState } from 'react';
import { DayActivity } from './analyticsHelpers';
import { TrendingUp, Calendar } from 'lucide-react';

interface VelocityChartProps {
  data: DayActivity[];
}

export function AnalyticsVelocityChart({ data }: VelocityChartProps) {
  const [activeDay, setActiveDay] = useState<DayActivity | null>(null);

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const totalInPeriod = data.reduce((acc, d) => acc + d.count, 0);
  const peakDay = [...data].sort((a, b) => b.count - a.count)[0];

  return (
    <div className="p-5 border border-(--border-subtle) bg-(--bg-surface) space-y-4 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-(--border-subtle) gap-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-semibold text-(--text-primary)">
            Application Velocity (14-Day Timeline)
          </h3>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-(--text-muted)">
          <span>
            Total: <strong className="text-(--text-primary)">{totalInPeriod}</strong>
          </span>
          <span>•</span>
          <span>
            Peak: <strong className="text-(--accent-primary)">{peakDay?.count || 0}</strong> (
            {peakDay?.label})
          </span>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="relative pt-6 pb-2">
        <div className="flex items-end justify-between gap-1.5 sm:gap-2 h-36 border-b border-(--border-subtle) px-1">
          {data.map((d) => {
            const heightPercent = d.count > 0 ? Math.max((d.count / maxCount) * 100, 14) : 4;
            const isHovered = activeDay?.dateKey === d.dateKey;
            const isPeak = d.count === maxCount && d.count > 0;

            return (
              <div
                key={d.dateKey}
                onMouseEnter={() => setActiveDay(d)}
                onMouseLeave={() => setActiveDay(null)}
                className="flex-1 flex flex-col items-center justify-end h-full group cursor-pointer relative"
              >
                {/* Count badge on hover or peak */}
                {d.count > 0 && (
                  <span
                    className={`absolute -top-6 text-[10px] font-bold transition-opacity ${
                      isHovered || isPeak
                        ? 'opacity-100 text-(--accent-primary)'
                        : 'opacity-0 group-hover:opacity-100 text-(--text-secondary)'
                    }`}
                  >
                    {d.count}
                  </span>
                )}

                {/* Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full max-w-[28px] transition-all duration-200 ${
                    d.count === 0
                      ? 'bg-(--border-subtle) opacity-40'
                      : isHovered
                        ? 'bg-(--accent-primary)'
                        : isPeak
                          ? 'bg-(--accent-primary) opacity-90'
                          : 'bg-neutral-600 dark:bg-neutral-400 group-hover:bg-(--accent-primary)'
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* X-Axis Labels */}
        <div className="flex justify-between text-[9px] text-(--text-muted) pt-2 px-1">
          <span>{data[0]?.label}</span>
          <span>{data[Math.floor(data.length / 2)]?.label}</span>
          <span>{data[data.length - 1]?.label}</span>
        </div>
      </div>

      {/* Selected Day Telemetry Box */}
      <div className="p-2.5 border border-(--border-subtle) bg-(--bg-app) text-xs flex items-center justify-between min-h-[38px]">
        <div className="flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span className="text-(--text-secondary)">
            {activeDay ? activeDay.label : 'Hover over any day bar for exact pipeline telemetry'}
          </span>
        </div>
        {activeDay && (
          <div className="flex items-center gap-2">
            <span className="font-bold text-(--text-primary)">
              {activeDay.count} {activeDay.count === 1 ? 'application' : 'applications'}
            </span>
            {activeDay.companies.length > 0 && (
              <span className="text-[10px] text-(--text-muted)">
                ({activeDay.companies.join(', ')})
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
