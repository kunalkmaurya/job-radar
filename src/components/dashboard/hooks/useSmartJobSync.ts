'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Job } from '@/types';

interface UseSmartJobSyncProps {
  setJobs: React.Dispatch<React.SetStateAction<Job[]>>;
  setIsLoading: (loading: boolean) => void;
}

export function useSmartJobSync({ setJobs, setIsLoading }: UseSmartJobSyncProps) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const etagRef = useRef<string | null>(null);
  const lastFocusTimeRef = useRef<number>(0);

  const fetchJobs = useCallback(
    async (options?: { force?: boolean; background?: boolean }) => {
      const force = options?.force ?? false;
      const background = options?.background ?? false;

      if (!background) setIsSyncing(true);

      try {
        const headers: Record<string, string> = {};
        if (etagRef.current && !force) {
          headers['If-None-Match'] = etagRef.current;
        }

        const res = await fetch('/api/jobs', {
          headers,
          cache: 'no-cache',
        });

        // HTTP 304 Not Modified: Cache is fresh, 0 bytes needed
        if (res.status === 304) {
          setLastSyncedAt(new Date());
          return;
        }

        if (res.ok) {
          const newEtag = res.headers.get('etag');
          if (newEtag) etagRef.current = newEtag;

          const json = await res.json();
          if (json.success && Array.isArray(json.data?.jobs)) {
            setJobs(json.data.jobs);
            setLastSyncedAt(new Date());
          }
        }
      } catch (err) {
        console.error('[SmartSync] Failed to sync jobs:', err);
      } finally {
        setIsLoading(false);
        setIsSyncing(false);
      }
    },
    [setJobs, setIsLoading]
  );

  useEffect(() => {
    // 1. Initial fetch on mount
    fetchJobs();

    // 2. Revalidate on window focus (throttled to at most once per 15s)
    const handleFocus = () => {
      const now = Date.now();
      if (now - lastFocusTimeRef.current > 15000) {
        lastFocusTimeRef.current = now;
        fetchJobs({ background: true });
      }
    };

    // 3. Revalidate on online reconnection
    const handleOnline = () => {
      fetchJobs({ background: true });
    };

    // 4. Gentle visibility-aware sync:
    // Only runs every 45s while the tab is actively visible.
    // If user minimizes or switches tab, polling completely halts.
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchJobs({ background: true });
      }
    }, 45000);

    window.addEventListener('focus', handleFocus);
    window.addEventListener('online', handleOnline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('online', handleOnline);
    };
  }, [fetchJobs]);

  const revalidate = useCallback(() => {
    return fetchJobs({ force: true });
  }, [fetchJobs]);

  return {
    fetchJobs,
    isSyncing,
    lastSyncedAt,
    revalidate,
  };
}
