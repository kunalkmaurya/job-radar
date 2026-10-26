'use client';

import React from 'react';
import { TimelineBar } from '../TimelineBar';
import { AnalyticsRibbon } from '../AnalyticsRibbon';
import { ControlBar } from '../ControlBar';
import { JobStatusTabs } from '../status/JobStatusTabs';
import { useStatusFilter } from '../status/useStatusFilter';
import { JobListView } from '../JobListView';
import { JobKanbanView } from '../JobKanbanView';
import { PipelineViewProps } from './pipelineViewTypes';

export function PipelineView({
  timelineFilter,
  onSelectTimeline,
  customRange,
  onCustomRangeChange,
  timelineScopedJobs,
  totalJobsCount,
  isLoading = false,
  metrics,
  searchQuery,
  onSearchChange,
  staleCount,
  staleOnlyFilter,
  onToggleStaleFilter,
  statusFilter,
  onSelectStatus,
  viewMode,
  onSelectViewMode,
  filteredJobs,
  nowTime,
  onSelectJob,
  onStatusChange,
  onToggleImportant,
  onApplyAndAdvance,
  onDeleteJob,
}: PipelineViewProps) {
  const { activeStatus, setActiveStatus, counts, displayedJobs } = useStatusFilter(
    filteredJobs,
    statusFilter,
    onSelectStatus
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
        isLoading={isLoading}
      />

      <AnalyticsRibbon metrics={metrics} isLoading={isLoading} />

      <ControlBar
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        staleCount={staleCount}
        staleOnlyFilter={staleOnlyFilter}
        onToggleStaleFilter={onToggleStaleFilter}
        viewMode={viewMode}
        onSelectViewMode={onSelectViewMode}
      />

      {viewMode === 'list' ? (
        <div className="flex flex-col gap-3">
          <JobStatusTabs
            activeStatus={activeStatus}
            onSelectStatus={setActiveStatus}
            counts={counts}
          />
          <JobListView
            key={activeStatus}
            jobs={displayedJobs}
            isLoading={isLoading}
            nowTime={nowTime}
            onSelectJob={onSelectJob}
            onStatusChange={onStatusChange}
            onToggleImportant={onToggleImportant}
            onApplyAndAdvance={onApplyAndAdvance}
            onDeleteJob={onDeleteJob}
          />
        </div>
      ) : (
        <JobKanbanView
          jobs={filteredJobs}
          isLoading={isLoading}
          nowTime={nowTime}
          onSelectJob={onSelectJob}
          onToggleImportant={onToggleImportant}
          onApplyAndAdvance={onApplyAndAdvance}
        />
      )}
    </div>
  );
}


