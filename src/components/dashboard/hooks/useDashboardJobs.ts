'use client';

import { useState, useEffect, useMemo } from 'react';
import { Job, JobStatus, TimelineFilter, CustomDateRange } from '@/types';
import {
  isJobStale,
  filterJobsByTimeline,
  computeMetrics,
  filterJobs,
  exportJobsToCSV,
} from '../helpers';
import { patchJob, deleteJobApi } from './jobApi';

import { useSmartJobSync } from './useSmartJobSync';

export function useDashboardJobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');
  const [customRange, setCustomRange] = useState<CustomDateRange>({ startDate: '', endDate: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [staleOnlyFilter, setStaleOnlyFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<JobStatus | 'all'>('Saved');
  const [nowTime, setNowTime] = useState<number>(1729792800000);
  const [currentUser, setCurrentUser] = useState<{
    email?: string;
    name?: string;
    role?: string;
  } | null>(null);

  const { fetchJobs, isSyncing, lastSyncedAt, revalidate } = useSmartJobSync({
    setJobs,
    setIsLoading,
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setNowTime(Date.now());
      const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.documentElement.dataset.theme = savedTheme;
        document.documentElement.classList.remove('dark', 'light');
        document.documentElement.classList.add(savedTheme);
      } else {
        document.documentElement.dataset.theme = 'dark';
        document.documentElement.classList.remove('light');
        document.documentElement.classList.add('dark');
      }
    }, 0);

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setCurrentUser(json.data);
      })
      .catch((err) => console.error('Failed to fetch user:', err));

    const handleSettingsUpdate = () => {
      try {
        const stored = localStorage.getItem('job_radar_app_settings_v1');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed.defaultView === 'list' || parsed.defaultView === 'kanban') {
            setViewMode(parsed.defaultView);
          }
        }
      } catch {
        // ignore
      }
    };
    handleSettingsUpdate();
    window.addEventListener('job_radar_settings_updated', handleSettingsUpdate);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('job_radar_settings_updated', handleSettingsUpdate);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
  };

  const timelineScopedJobs = useMemo(
    () => filterJobsByTimeline(jobs, timelineFilter, nowTime, customRange),
    [jobs, timelineFilter, nowTime, customRange]
  );

  const metrics = useMemo(
    () => computeMetrics(timelineScopedJobs, timelineFilter, nowTime, customRange),
    [timelineScopedJobs, timelineFilter, nowTime, customRange]
  );

  const staleCount = useMemo(
    () => timelineScopedJobs.filter((j) => isJobStale(j, nowTime)).length,
    [timelineScopedJobs, nowTime]
  );

  const filteredJobs = useMemo(
    () => filterJobs(timelineScopedJobs, searchQuery, staleOnlyFilter, nowTime),
    [timelineScopedJobs, searchQuery, staleOnlyFilter, nowTime]
  );

  const handleApplyAndAdvance = async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(job.link, '_blank');
    const appliedAt = new Date(nowTime);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id
          ? { ...j, status: 'Applied' as JobStatus, appliedAt, updatedAt: appliedAt }
          : j
      )
    );
    setStatusFilter('Applied');
    await patchJob(job.id, { status: 'Applied', appliedAt: appliedAt.toISOString() });
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const appliedAt = newStatus === 'Applied' ? new Date(nowTime) : undefined;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId
          ? {
              ...j,
              status: newStatus,
              appliedAt: appliedAt || j.appliedAt,
              updatedAt: new Date(nowTime),
            }
          : j
      )
    );
    setStatusFilter(newStatus);
    await patchJob(jobId, {
      status: newStatus,
      ...(appliedAt ? { appliedAt: appliedAt.toISOString() } : {}),
    });
  };

  const handleToggleImportant = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentJob = jobs.find((j) => j.id === jobId);
    const nextVal = currentJob ? !currentJob.isImportant : true;
    setJobs((prev) =>
      prev.map((j) =>
        j.id === jobId ? { ...j, isImportant: nextVal, updatedAt: new Date(nowTime) } : j
      )
    );

    const res = await patchJob(jobId, { isImportant: nextVal });
    if (!res?.success) {
      setJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isImportant: !nextVal } : j)));
    }
  };

  const handleDeleteJob = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    await deleteJobApi(jobId);
  };

  return {
    jobs,
    setJobs,
    isLoading,
    isSyncing,
    lastSyncedAt,
    revalidate,
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
    handleStatusChange,
    handleToggleImportant,
    handleDeleteJob,
    handleExportCSV: () => exportJobsToCSV(timelineScopedJobs),
    fetchJobs,
  };
}
