'use client';

import { useState, useEffect, useCallback } from 'react';
import { PodData } from '../pod';

export function useProfilePod() {
  const [pod, setPod] = useState<PodData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isEditingChatId, setIsEditingChatId] = useState(false);
  const [chatIdInput, setChatIdInput] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  const fetchPod = useCallback(async () => {
    try {
      const res = await fetch('/api/workspaces/current');
      if (res.ok) {
        const data = await res.json();
        if (data.pod) {
          setPod(data.pod);
          setChatIdInput(data.pod.telegramChatId || '');
        } else {
          setPod(null);
        }
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      try {
        const res = await fetch('/api/workspaces/current');
        if (res.ok && !ignore) {
          const data = await res.json();
          if (data?.pod) {
            setPod(data.pod);
            setChatIdInput(data.pod.telegramChatId || '');
          } else {
            setPod(null);
          }
        }
      } catch {
        // ignore
      } finally {
        if (!ignore) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    };
    void load();
    return () => {
      ignore = true;
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchPod();
  };

  const handleSaveChatId = async () => {
    try {
      const res = await fetch('/api/workspaces/current', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramChatId: chatIdInput }),
      });
      if (res.ok) {
        setIsEditingChatId(false);
        setStatusMsg({ text: 'Group Chat ID saved!' });
        fetchPod();
      } else {
        setStatusMsg({ text: 'Failed to save Chat ID', isError: true });
      }
    } catch {
      setStatusMsg({ text: 'Error saving Chat ID', isError: true });
    }
    setTimeout(() => setStatusMsg(null), 3000);
  };

  const handleTestPing = async () => {
    try {
      const res = await fetch('/api/workspaces/current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'test_ping' }),
      });
      const data = await res.json();
      setStatusMsg(
        res.ok && data.success
          ? { text: 'Test message sent to group!' }
          : { text: data.error || 'Test failed', isError: true }
      );
    } catch {
      setStatusMsg({ text: 'Failed to contact bot API', isError: true });
    }
    setTimeout(() => setStatusMsg(null), 4000);
  };

  const handleCopyInvite = () => {
    if (!pod) return;
    navigator.clipboard.writeText(pod.inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return {
    pod,
    loading,
    refreshing,
    isEditingChatId,
    setIsEditingChatId,
    chatIdInput,
    setChatIdInput,
    statusMsg,
    copied,
    handleRefresh,
    handleSaveChatId,
    handleTestPing,
    handleCopyInvite,
  };
}
