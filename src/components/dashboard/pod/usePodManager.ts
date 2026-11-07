'use client';

import { useState, useEffect, useCallback } from 'react';
import { PodData } from './PodInviteModal';

export function usePodManager() {
  const [isPodOpen, setIsPodOpen] = useState(false);
  const [podData, setPodData] = useState<PodData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchPod = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/workspaces/current');
      if (res.ok) {
        const data = await res.json();
        if (data?.pod) setPodData(data.pod);
      }
    } catch {
      // ignore
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/workspaces/current');
        if (res.ok && !ignore) {
          const data = await res.json();
          if (data?.pod) setPodData(data.pod);
        }
      } catch {
        // ignore
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleSaveChatId = async (chatId: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/workspaces/current', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramChatId: chatId }),
      });
      if (res.ok) {
        await fetchPod();
        return true;
      }
    } catch {
      // ignore
    }
    return false;
  };

  const handleSendTest = async (): Promise<boolean> => {
    try {
      const res = await fetch('/api/workspaces/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_ping' }),
      });
      const data = await res.json();
      return Boolean(res.ok && data.success);
    } catch {
      return false;
    }
  };

  return {
    isPodOpen,
    setIsPodOpen,
    podData,
    isRefreshing,
    fetchPod,
    handleSaveChatId,
    handleSendTest,
  };
}
