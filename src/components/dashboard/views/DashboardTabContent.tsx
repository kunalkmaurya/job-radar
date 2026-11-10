'use client';

import React from 'react';
import { DashboardTab } from '../DashboardNavTabs';
import { PipelineView } from './PipelineView';
import { AnalyticsView } from './AnalyticsView';
import { SettingsView } from './SettingsView';
import { ProfileView } from './ProfileView';
import { FeedView } from '../feed/FeedView';
import { PodFeedView } from '../pod/PodFeedView';
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
  onJobTracked?: () => void;
  refreshTrigger?: number;
  onOpenInviteModal?: () => void;
  onSync?: () => void;
  isSyncing?: boolean;
}

export function DashboardTabContent(props: DashboardTabContentProps) {
  const {
    activeTab,
    jobs,
    metrics,
    currentUser,
    handleExportCSV,
    onOpenInviteModal,
    onSync,
    isSyncing,
  } = props;

  return (
    <div className="w-full px-3 sm:px-5 py-4 sm:py-6 flex-1 flex flex-col min-h-full">
      {activeTab === 'dashboard' && (
        <PipelineView
          timelineFilter={props.timelineFilter}
          onSelectTimeline={props.setTimelineFilter}
          customRange={props.customRange}
          onCustomRangeChange={props.setCustomRange}
          timelineScopedJobs={props.timelineScopedJobs}
          totalJobsCount={jobs.length}
          isLoading={props.isLoading}
          metrics={metrics}
          searchQuery={props.searchQuery}
          onSearchChange={props.setSearchQuery}
          staleCount={props.staleCount}
          staleOnlyFilter={props.staleOnlyFilter}
          onToggleStaleFilter={() => props.setStaleOnlyFilter(!props.staleOnlyFilter)}
          viewMode={props.viewMode}
          onSelectViewMode={props.setViewMode}
          filteredJobs={props.filteredJobs}
          statusFilter={props.statusFilter}
          onSelectStatus={props.setStatusFilter}
          nowTime={props.nowTime}
          onSelectJob={props.setDrawerJob}
          onStatusChange={props.onJobStatusChange}
          onToggleImportant={props.handleToggleImportant}
          onApplyAndAdvance={props.handleApplyAndAdvance}
          onDeleteJob={props.onJobDelete}
          onSync={onSync}
          isSyncing={isSyncing}
        />
      )}

      {activeTab === 'pod' && (
        <PodFeedView
          onJobTracked={props.onJobTracked}
          refreshTrigger={props.refreshTrigger}
          onOpenInviteModal={onOpenInviteModal}
        />
      )}

      {activeTab === 'feed' && (
        <FeedView
          onJobTracked={props.onJobTracked}
          refreshTrigger={props.refreshTrigger}
          onSync={onSync}
          isSyncing={isSyncing}
        />
      )}

      {activeTab === 'analytics' && (
        <AnalyticsView
          timelineFilter={props.timelineFilter}
          onSelectTimeline={props.setTimelineFilter}
          customRange={props.customRange}
          onCustomRangeChange={props.setCustomRange}
          timelineScopedJobs={props.timelineScopedJobs}
          totalJobsCount={jobs.length}
          metrics={metrics}
          nowTime={props.nowTime}
        />
      )}

      {activeTab === 'settings' && (
        <SettingsView
          currentUser={currentUser}
          onExportCSV={handleExportCSV}
          totalJobs={jobs.length}
          theme={props.theme}
          onToggleTheme={props.toggleTheme}
        />
      )}

      {activeTab === 'profile' && (
        <ProfileView
          currentUser={currentUser}
          totalJobs={jobs.length}
          metrics={metrics}
          onExportCSV={handleExportCSV}
          onOpenInviteModal={onOpenInviteModal}
        />
      )}
    </div>
  );
}
