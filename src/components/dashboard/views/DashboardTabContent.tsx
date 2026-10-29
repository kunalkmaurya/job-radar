'use client';

import React from 'react';
import { DashboardTab } from '../DashboardNavTabs';
import { PipelineView } from './PipelineView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { ProfileView } from './ProfileView';
import { PipelineMetrics } from './pipelineViewTypes';
import { Job, JobStatus, TimelineFilter, CustomDateRange } from '@/types';

interface DashboardTabContentProps {
  activeTab: DashboardTab;
  jobs: Job[];
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  viewMode: 'list' | 'kanban';
  setViewMode: (mode: 'list' | 'kanban') => void;
  timelineFilter: TimelineFilter;
  setTimelineFilter: (f: TimelineFilter) => void;
  customRange: CustomDateRange;
  setCustomRange: (r: CustomDateRange) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  staleOnlyFilter: boolean;
  setStaleOnlyFilter: (s: boolean) => void;
  statusFilter: JobStatus | 'all';
  setStatusFilter: (s: JobStatus | 'all') => void;
  nowTime: number;
  currentUser: { email?: string; name?: string; role?: string } | null;
  staleCount: number;
  metrics: PipelineMetrics;
  filteredJobs: Job[];
  timelineScopedJobs: Job[];
  handleApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  handleToggleImportant: (jobId: string, e?: React.MouseEvent) => void;
  handleExportCSV: () => void;
  setDrawerJob: (job: Job) => void;
  onJobStatusChange: (jobId: string, status: JobStatus) => void;
  onJobDelete: (jobId: string) => void;
}

export function DashboardTabContent({
  activeTab,
  jobs,
  isLoading,
  theme,
  toggleTheme,
  viewMode,
  setViewMode,
  timelineFilter,
  setTimelineFilter,
  customRange,
  setCustomRange,
  searchQuery,
  setSearchQuery,
  staleOnlyFilter,
  setStaleOnlyFilter,
  statusFilter,
  setStatusFilter,
  nowTime,
  currentUser,
  staleCount,
  metrics,
  filteredJobs,
  timelineScopedJobs,
  handleApplyAndAdvance,
  handleToggleImportant,
  handleExportCSV,
  setDrawerJob,
  onJobStatusChange,
  onJobDelete,
}: DashboardTabContentProps) {
  return (
    <div className="w-full px-3 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1">
      {activeTab === 'dashboard' && (
        <PipelineView
          timelineFilter={timelineFilter}
          onSelectTimeline={setTimelineFilter}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          timelineScopedJobs={timelineScopedJobs}
          totalJobsCount={jobs.length}
          isLoading={isLoading}
          metrics={metrics}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          staleCount={staleCount}
          staleOnlyFilter={staleOnlyFilter}
          onToggleStaleFilter={() => setStaleOnlyFilter(!staleOnlyFilter)}
          viewMode={viewMode}
          onSelectViewMode={setViewMode}
          filteredJobs={filteredJobs}
          statusFilter={statusFilter}
          onSelectStatus={setStatusFilter}
          nowTime={nowTime}
          onSelectJob={setDrawerJob}
          onStatusChange={onJobStatusChange}
          onToggleImportant={handleToggleImportant}
          onApplyAndAdvance={handleApplyAndAdvance}
          onDeleteJob={onJobDelete}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsView
          timelineFilter={timelineFilter}
          onSelectTimeline={setTimelineFilter}
          customRange={customRange}
          onCustomRangeChange={setCustomRange}
          timelineScopedJobs={timelineScopedJobs}
          totalJobsCount={jobs.length}
          metrics={metrics}
          nowTime={nowTime}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          currentUser={currentUser}
          onExportCSV={handleExportCSV}
          totalJobs={jobs.length}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          currentUser={currentUser}
          totalJobs={jobs.length}
          metrics={metrics}
          onExportCSV={handleExportCSV}
        />
      )}
    </div>
  );
}
