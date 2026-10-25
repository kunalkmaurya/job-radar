'use client';

import React from 'react';
import { Job, JobStatus, TimelineFilter, CustomDateRange } from '@/types';
import { TimelineBar } from '../TimelineBar';
import { AnalyticsRibbon } from '../AnalyticsRibbon';
import { ControlBar } from '../ControlBar';
import { JobListView } from '../JobListView';
import { JobKanbanView } from '../JobKanbanView';

interface PipelineViewProps {
  timelineFilter: TimelineFilter;
  onSelectTimeline: (filter: TimelineFilter) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  timelineScopedJobs: Job[];
  totalJobsCount: number;
  metrics: {
    totalJobs: number;
    appliedCount: number;
    appliedLabel: string;
    interviewingCount: number;
    offerCount: number;
    responseRate: number;
    windowLabel: string;
  };
  searchQuery: string;
  onSearchChange: (val: string) => void;
  staleCount: number;
  staleOnlyFilter: boolean;
  onToggleStaleFilter: () => void;
  viewMode: 'list' | 'kanban';
  onSelectViewMode: (mode: 'list' | 'kanban') => void;
  filteredJobs: Job[];
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string) => void;
}

export function PipelineView({
  timelineFilter,
  onSelectTimeline,
  customRange,
  onCustomRangeChange,
  timelineScopedJobs,
  totalJobsCount,
  metrics,
  searchQuery,
  onSearchChange,
  staleCount,
  staleOnlyFilter,
  onToggleStaleFilter,
  viewMode,
  onSelectViewMode,
  filteredJobs,
  nowTime,
  onSelectJob,
  onStatusChange,
  onApplyAndAdvance,
  onDeleteJob,
}: PipelineViewProps) {
  return (
    <div className="space-y-6">
      {/* 1. TOP TIMELINE SCOPE BAR */}
      <TimelineBar
        timelineFilter={timelineFilter}
        onSelectTimeline={onSelectTimeline}
        customRange={customRange}
        onCustomRangeChange={onCustomRangeChange}
        scopedCount={timelineScopedJobs.length}
        totalCount={totalJobsCount}
      />

      {/* 2. TIMELINE-FILTERED ANALYTICS RIBBON */}
      <AnalyticsRibbon metrics={metrics} />

      {/* 3. CONTROL & SEARCH BAR */}
      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        staleCount={staleCount}
        staleOnlyFilter={staleOnlyFilter}
        onToggleStaleFilter={onToggleStaleFilter}
        viewMode={viewMode}
        onSelectViewMode={onSelectViewMode}
      />

      {/* 4. PIPELINE JOBS CONTENT */}
      {viewMode === 'list' ? (
        <JobListView
          jobs={filteredJobs}
          nowTime={nowTime}
          onSelectJob={onSelectJob}
          onStatusChange={onStatusChange}
          onApplyAndAdvance={onApplyAndAdvance}
          onDeleteJob={onDeleteJob}
        />
      ) : (
        <JobKanbanView
          jobs={filteredJobs}
          nowTime={nowTime}
          onSelectJob={onSelectJob}
          onApplyAndAdvance={onApplyAndAdvance}
        />
      )}
    </div>
  );
}
