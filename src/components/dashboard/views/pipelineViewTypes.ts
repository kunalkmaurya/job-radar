import React from 'react';
import { Job, JobStatus, TimelineFilter, CustomDateRange } from '@/types';
import { JobStatusFilter } from '../status/JobStatusTabs';

export interface PipelineMetrics {
  totalJobs: number;
  appliedCount: number;
  appliedLabel: string;
  interviewingCount: number;
  offerCount: number;
  responseRate: number;
  windowLabel: string;
}

export interface PipelineViewProps {
  timelineFilter: TimelineFilter;
  onSelectTimeline: (filter: TimelineFilter) => void;
  customRange: CustomDateRange;
  onCustomRangeChange: (range: CustomDateRange) => void;
  timelineScopedJobs: Job[];
  totalJobsCount: number;
  isLoading?: boolean;
  metrics: PipelineMetrics;
  searchQuery: string;
  onSearchChange: (val: string) => void;
  staleCount: number;
  staleOnlyFilter: boolean;
  onToggleStaleFilter: () => void;
  statusFilter?: JobStatusFilter;
  onSelectStatus?: (status: JobStatusFilter) => void;
  viewMode: 'list' | 'kanban';
  onSelectViewMode: (mode: 'list' | 'kanban') => void;
  filteredJobs: Job[];
  nowTime: number;
  onSelectJob: (job: Job) => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onToggleImportant?: (jobId: string, e?: React.MouseEvent) => void;
  onApplyAndAdvance: (job: Job, e?: React.MouseEvent) => void;
  onDeleteJob: (jobId: string) => void;
  onSync?: () => void;
  isSyncing?: boolean;
}
