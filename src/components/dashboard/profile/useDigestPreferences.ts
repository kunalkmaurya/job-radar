'use client';

import { useState, useEffect } from 'react';

export type DigestFrequency = 'none' | 'weekly' | 'monthly';

export interface DigestOption {
  id: DigestFrequency;
  label: string;
  desc: string;
}

export const DIGEST_OPTIONS: DigestOption[] = [
  {
    id: 'none',
    label: 'Off / No Digest',
    desc: 'Do not send recurring email digests. Only receive account and security alerts.',
  },
  {
    id: 'weekly',
    label: 'Weekly Digest',
    desc: 'Receive fresh curated job opportunities delivered to your inbox every Monday.',
  },
  {
    id: 'monthly',
    label: 'Monthly Roundup',
    desc: 'Receive a high-signal monthly summary of top roles and pipeline market trends.',
  },
];

export function useDigestPreferences() {
  const [frequency, setFrequency] = useState<DigestFrequency>('none');
  const [loading, setLoading] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPreferences() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.data?.jobDigestFrequency) {
            setFrequency(json.data.jobDigestFrequency as DigestFrequency);
          }
        }
      } catch {
        // Fallback silently to default
      } finally {
        if (isMounted) setInitialLoading(false);
      }
    }
    loadPreferences();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobDigestFrequency: frequency }),
      });

      if (res.ok) {
        setSavedNotice(true);
        setTimeout(() => setSavedNotice(false), 2500);
      }
    } catch (err) {
      console.warn('Failed to save digest frequency:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    frequency,
    setFrequency,
    loading,
    savedNotice,
    initialLoading,
    handleSave,
  };
}
