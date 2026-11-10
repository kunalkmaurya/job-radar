'use client';

import React, { useState } from 'react';
import { Users, Send, Plus, ArrowRight } from 'lucide-react';

interface PodFeedEmptyStateProps {
  hasPod?: boolean;
  telegramConnectUrl?: string;
  onOpenAddJob: () => void;
  onCreatePod?: () => void;
  onJoinPod?: (code: string) => Promise<boolean>;
  isMutating?: boolean;
}

export function PodFeedEmptyState({
  hasPod = true,
  telegramConnectUrl,
  onOpenAddJob,
  onCreatePod,
  onJoinPod,
  isMutating = false,
}: PodFeedEmptyStateProps) {
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [joinError, setJoinError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCodeInput.trim() || !onJoinPod) return;
    setJoinError(null);
    const ok = await onJoinPod(inviteCodeInput.trim());
    if (!ok) {
      setJoinError('Invalid or expired invite code.');
    }
  };

  if (!hasPod) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-(--border-subtle) text-(--text-muted) gap-4 rounded-md text-center px-4">
        <div className="w-12 h-12 rounded-full bg-(--accent-primary-bg) border border-(--accent-border) flex items-center justify-center text-(--accent-blue-bright)">
          <Users className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-(--text-primary)">
            You are not part of any Job Pod
          </p>
          <p className="text-xs text-(--text-muted) max-w-md mt-1">
            Create a pod to share job postings with peers, or enter an invite code to join an
            existing group.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          {onCreatePod && (
            <button
              type="button"
              onClick={onCreatePod}
              disabled={isMutating}
              className="inline-flex items-center gap-1.5 h-8 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{isMutating ? 'Creating...' : 'Create New Pod'}</span>
            </button>
          )}

          {onJoinPod && (
            <form onSubmit={handleJoin} className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="pod_xxxx"
                value={inviteCodeInput}
                onChange={(e) => setInviteCodeInput(e.target.value)}
                className="h-8 px-2.5 bg-(--bg-surface) border border-(--border-subtle) text-xs text-(--text-primary) placeholder:text-(--text-muted) rounded-sm w-32 focus:outline-none focus:border-(--border-focus)"
              />
              <button
                type="submit"
                disabled={isMutating || !inviteCodeInput.trim()}
                className="h-8 px-3 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs font-semibold text-(--text-primary) rounded-sm inline-flex items-center gap-1 cursor-pointer disabled:opacity-50 transition-colors"
              >
                <span>Join</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </form>
          )}
        </div>
        {joinError && <p className="text-xs text-red-500 font-medium">{joinError}</p>}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-(--border-subtle) text-(--text-muted) gap-3 rounded-md text-center px-4">
      <div className="w-10 h-10 rounded-full bg-(--accent-primary-bg) border border-(--accent-border) flex items-center justify-center text-(--accent-blue-bright)">
        <Users className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm font-semibold text-(--text-primary)">No pooled pod jobs yet</p>
        <p className="text-xs text-(--text-muted) max-w-md mt-1">
          Any job link shared by you or your peers in your connected Telegram group will
          automatically extract details and appear here.
        </p>
      </div>
      <div className="flex items-center gap-2 pt-1">
        {telegramConnectUrl && (
          <a
            href={telegramConnectUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 h-8 px-3.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-sm shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Telegram Group</span>
          </a>
        )}
        <button
          onClick={onOpenAddJob}
          className="h-8 px-3.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) text-xs font-semibold rounded-sm cursor-pointer transition-colors"
        >
          Share First Job
        </button>
      </div>
    </div>
  );
}
