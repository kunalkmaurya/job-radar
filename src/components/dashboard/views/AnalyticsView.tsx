'use client';

import React, { useMemo } from 'react';
import { Job, TimelineFilter, CustomDateRange } from '@/types';
import { TimelineBar } from '../TimelineBar';
import {
  computeVelocityTrend,
  computeFunnelStages,
  computeWeeklyRhythm,
  computeVelocityStats,
} from '../analytics/analyticsHelpers';
import { AnalyticsVelocityCards } from '../analytics/AnalyticsVelocityCards';
import { AnalyticsVelocityChart } from '../analytics/AnalyticsVelocityChart';
import { AnalyticsFunnelFlow } from '../analytics/AnalyticsFunnelFlow';
import { AnalyticsWeeklyRhythm } from '../analytics/AnalyticsWeeklyRhythm';
import { AnalyticsSourceBreakdown } from '../analytics/AnalyticsSourceBreakdown';
import { AnalyticsCompanyBreakdown } from '../analytics/AnalyticsCompanyBreakdown';

interface AnalyticsViewProps {
  timelineFilter: TimelineFilter;
  onSelectTimeline: (filter: TimelineFilter) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  timelineScopedJobs: Job[];
  totalJobsCount: number;
  metrics?: unknown;
  nowTime?: number;
}

export function AnalyticsView({
  timelineFilter,
  onSelectTimeline,
  customRange,
  onCustomRangeChange,
  timelineScopedJobs,
  totalJobsCount,
  nowTime = 0,
}: AnalyticsViewProps) {
  const effectiveNow = nowTime || 1729792800000;

  const velocityData = useMemo(
    () => computeVelocityTrend(timelineScopedJobs, effectiveNow),
    [timelineScopedJobs, effectiveNow]
  );
  const funnelStages = useMemo(() => computeFunnelStages(timelineScopedJobs), [timelineScopedJobs]);
  const weeklyRhythm = useMemo(() => computeWeeklyRhythm(timelineScopedJobs), [timelineScopedJobs]);
  const velocityStats = useMemo(
    () => computeVelocityStats(timelineScopedJobs, effectiveNow),
    [timelineScopedJobs, effectiveNow]
  );

  return (
    <div className="space-y-6">
      <TimelineBar
        timelineFilter={timelineFilter}
        onSelectTimeline={onSelectTimeline}
        customRange={customRange}
        onCustomRangeChange={onCustomRangeChange}
        scopedCount={timelineScopedJobs.length}
        totalCount={totalJobsCount}
      />

      {/* KPI Velocity & Pipeline Health Metric Cards */}
      <AnalyticsVelocityCards stats={velocityStats} totalScoped={timelineScopedJobs.length} />

      {/* 14-Day Application Velocity Histogram */}
      <AnalyticsVelocityChart data={velocityData} />

      {/* Stage-to-Stage Conversion Funnel Flow */}
      <AnalyticsFunnelFlow stages={funnelStages} />

      {/* 2-Column Grid: Weekly Submission Rhythm & Ingestion Channel Telemetry */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsWeeklyRhythm data={weeklyRhythm} />
        <AnalyticsSourceBreakdown jobs={timelineScopedJobs} />
      </div>

      {/* Target Companies & Direct Stage Tracker */}
      <AnalyticsCompanyBreakdown jobs={timelineScopedJobs} />
    </div>
  );
}
