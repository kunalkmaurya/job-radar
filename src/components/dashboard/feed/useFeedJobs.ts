'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicJob } from '@/types';

export interface FeedJobItem extends PublicJob {
  isTracked: boolean;
  isPodJob?: boolean;
}

interface UseFeedJobsProps {
  initialFeedType?: 'pod' | 'public';
  onJobTracked?: () => void;
  refreshTrigger?: number;
}

export function useFeedJobs({
  initialFeedType = 'public',
  onJobTracked,
  refreshTrigger,
}: UseFeedJobsProps = {}) {
  const [feedJobs, setFeedJobs] = useState<FeedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterMode, setFilterMode] = useState<'pod' | 'public'>(initialFeedType);
  const [podJobCount, setPodJobCount] = useState<number>(0);
  const [publicJobCount, setPublicJobCount] = useState<number>(0);
  const [userPodName, setUserPodName] = useState<string | null>(null);
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  const fetchFeedJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      params.set('feedType', filterMode);
      if (searchQuery) params.set('search', searchQuery);

      const res = await fetch(`/api/feed/jobs?${params.toString()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.jobs)) {
        setFeedJobs(json.data.jobs);
        setPodJobCount(json.data.podCount || 0);
        setPublicJobCount(json.data.publicCount || 0);
        if (json.data.userPodName) setUserPodName(json.data.userPodName);
      }
    } catch (err) {
      console.error('[Feed] Failed to fetch feed jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [filterMode, searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedJobs();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchFeedJobs, refreshTrigger]);

  const syncTelegramJobs = async () => {
    try {
      setIsSyncing(true);
      const res = await fetch('/api/workspaces/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_jobs' }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchFeedJobs();
      }
      return data;
    } catch {
      return { success: false, error: 'Sync failed' };
    } finally {
      setIsSyncing(false);
    }
  };

  const trackJob = async (jobId: string) => {
    setTrackingId(jobId);
    setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: true } : j)));

    try {
      const res = await fetch(`/api/feed/jobs/${jobId}/track`, { method: 'POST' });
      const json = await res.json();
      if (!res.ok && json.error?.code !== 'DUPLICATE') {
        setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: false } : j)));
      } else if (onJobTracked) {
        onJobTracked();
      }
    } catch (err) {
      console.error('[Feed] Failed to track job:', err);
      setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: false } : j)));
    } finally {
      setTrackingId(null);
    }
  };

  const untrackJob = async (jobId: string) => {
    setTrackingId(jobId);
    setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: false } : j)));

    try {
      const res = await fetch(`/api/feed/jobs/${jobId}/track`, { method: 'DELETE' });
      if (!res.ok) {
        setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: true } : j)));
      } else if (onJobTracked) {
        onJobTracked();
      }
    } catch (err) {
      console.error('[Feed] Failed to untrack job:', err);
      setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: true } : j)));
    } finally {
      setTrackingId(null);
    }
  };

  const deleteJob = async (jobId: string) => {
    try {
      const res = await fetch(`/api/feed/jobs?id=${jobId}`, { method: 'DELETE' });
      if (res.ok) {
        setFeedJobs((prev) => prev.filter((j) => j.id !== jobId));
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  return {
    feedJobs,
    totalCount: feedJobs.length,
    podJobCount,
    publicJobCount,
    userPodName,
    filterMode,
    setFilterMode,
    isLoading,
    searchQuery,
    setSearchQuery,
    trackingId,
    trackJob,
    untrackJob,
    deleteJob,
    isAddOpen,
    setIsAddOpen,
    isSyncing,
    syncTelegramJobs,
    refreshFeed: fetchFeedJobs,
  };
}
