'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Job, JobStatus, TimelineFilter } from '@/types';
import { INITIAL_MOCK_JOBS } from '../data';
import { isJobStale, computeMetrics, filterJobs, exportJobsToCSV } from '../helpers';

export function useDashboardJobs() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_MOCK_JOBS);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staleOnlyFilter, setStaleOnlyFilter] = useState(false);
  const [nowTime, setNowTime] = useState<number>(1729792800000);
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      const res = await fetch('/api/jobs');
      const json = await res.json();
      if (json.success && json.data?.jobs?.length > 0) {
        setJobs(json.data.jobs);
      }
    } catch (err) {
      console.error('Failed to fetch jobs from Neon DB:', err);
    }
  }, []);

  useEffect(() => {
    setNowTime(Date.now());
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    fetchJobs();

    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) setCurrentUser(json.data);
      })
      .catch((err) => console.error('Failed to fetch user:', err));

    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const staleCount = useMemo(() => jobs.filter((j) => isJobStale(j, nowTime)).length, [jobs, nowTime]);
  const metrics = useMemo(() => computeMetrics(jobs, nowTime), [jobs, nowTime]);
  const filteredJobs = useMemo(
    () => filterJobs(jobs, searchQuery, staleOnlyFilter, timelineFilter, nowTime),
    [jobs, searchQuery, staleOnlyFilter, timelineFilter, nowTime]
  );

  const handleApplyAndAdvance = async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(job.link, '_blank');
    const appliedAt = new Date(nowTime);
    setJobs((prev) => prev.map((j) => (j.id === job.id ? { ...j, status: 'Applied' as JobStatus, appliedAt, updatedAt: appliedAt } : j)));
    try {
      await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Applied', appliedAt: appliedAt.toISOString() }),
      });
    } catch (err) {
      console.error('Failed to sync apply status:', err);
    }
  };

  const handleStatusChange = async (jobId: string, newStatus: JobStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const appliedAt = newStatus === 'Applied' ? new Date(nowTime) : undefined;
    setJobs((prev) =>
      prev.map((j) => (j.id === jobId ? { ...j, status: newStatus, appliedAt: appliedAt || j.appliedAt, updatedAt: new Date(nowTime) } : j))
    );
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, ...(appliedAt ? { appliedAt: appliedAt.toISOString() } : {}) }),
      });
    } catch (err) {
      console.error('Failed to sync status:', err);
    }
  };

  const handleDeleteJob = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    try {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };

  return {
    jobs, setJobs, theme, toggleTheme, viewMode, setViewMode, timelineFilter, setTimelineFilter,
    searchQuery, setSearchQuery, staleOnlyFilter, setStaleOnlyFilter, nowTime, currentUser,
    staleCount, metrics, filteredJobs, handleApplyAndAdvance, handleStatusChange,
    handleDeleteJob, handleExportCSV: () => exportJobsToCSV(jobs), fetchJobs,
  };
}
