'use client';

import { useState, useEffect, useCallback } from 'react';
import { PublicJob } from '@/types';

export interface FeedJobItem extends PublicJob {
  isTracked: boolean;
}

interface UseFeedJobsProps {
  onJobTracked?: () => void;
  refreshTrigger?: number;
}

export function useFeedJobs({ onJobTracked, refreshTrigger }: UseFeedJobsProps = {}) {
  const [feedJobs, setFeedJobs] = useState<FeedJobItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState<boolean>(false);

  const fetchFeedJobs = useCallback(async () => {
    try {
      setIsLoading(true);
      const url = searchQuery
        ? `/api/feed/jobs?search=${encodeURIComponent(searchQuery)}`
        : '/api/feed/jobs';
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.success && Array.isArray(json.data?.jobs)) {
        setFeedJobs(json.data.jobs);
      }
    } catch (err) {
      console.error('[Feed] Failed to fetch public jobs:', err);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchFeedJobs();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchFeedJobs, refreshTrigger]);

  const trackJob = async (jobId: string) => {
    setTrackingId(jobId);
    setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: true } : j)));

    try {
      const res = await fetch(`/api/feed/jobs/${jobId}/track`, {
        method: 'POST',
      });
      const json = await res.json();
      if (!res.ok && json.error?.code !== 'DUPLICATE') {
        setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: false } : j)));
      } else {
        if (onJobTracked) onJobTracked();
      }
    } catch (err) {
      console.error('[Feed] Failed to track job:', err);
      setFeedJobs((prev) => prev.map((j) => (j.id === jobId ? { ...j, isTracked: false } : j)));
    } finally {
      setTrackingId(null);
    }
  };

  return {
    feedJobs,
    isLoading,
    searchQuery,
    setSearchQuery,
    trackingId,
    trackJob,
    isAddOpen,
    setIsAddOpen,
    refreshFeed: fetchFeedJobs,
  };
}
