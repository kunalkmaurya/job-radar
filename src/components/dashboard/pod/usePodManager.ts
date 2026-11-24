'use client';

import { useState, useEffect, useCallback } from 'react';
import { PodData } from './PodInviteModal';

export function usePodManager() {
  const [isPodOpen, setIsPodOpen] = useState(false);
  const [podData, setPodData] = useState<PodData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isMutating, setIsMutating] = useState(false);

  const fetchPod = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/workspaces/current');
      if (res.ok) {
        const data = await res.json();
        setPodData(data?.pod || null);
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
          setPodData(data?.pod || null);
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

  const executeAction = async (action: string) => {
    setIsMutating(true);
    try {
      const res = await fetch('/api/workspaces/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (res.ok) {
        if (action === 'leave' || action === 'delete_pod') {
          setPodData(null);
          setIsPodOpen(false);
        } else {
          await fetchPod();
        }
        return true;
      }
    } catch {
      // ignore
    } finally {
      setIsMutating(false);
    }
    return false;
  };

  const handleCreatePod = () => executeAction('create');
  const handleLeavePod = () => executeAction('leave');
  const handleDeletePod = () => executeAction('delete_pod');
  const handleClearJobs = () => executeAction('clear_jobs');

  const handleJoinPod = async (code: string): Promise<boolean> => {
    setIsMutating(true);
    try {
      const res = await fetch('/api/workspaces/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inviteCode: code }),
      });
      if (res.ok) {
        await fetchPod();
        return true;
      }
    } catch {
      // ignore
    } finally {
      setIsMutating(false);
    }
    return false;
  };

  return {
    isPodOpen,
    setIsPodOpen,
    podData,
    isRefreshing,
    isMutating,
    fetchPod,
    handleSaveChatId,
    handleSendTest,
    handleCreatePod,
    handleLeavePod,
    handleDeletePod,
    handleClearJobs,
    handleJoinPod,
  };
}
