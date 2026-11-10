'use client';

import React, { useState } from 'react';
import { Users, Plus, ArrowRight, X } from 'lucide-react';

interface PodCreateJoinCardProps {
  onClose: () => void;
  onCreatePod?: () => Promise<boolean>;
  onJoinPod?: (code: string) => Promise<boolean>;
  isMutating?: boolean;
}

export function PodCreateJoinCard({
  onClose,
  onCreatePod,
  onJoinPod,
  isMutating = false,
}: PodCreateJoinCardProps) {
  const [inviteCode, setInviteCode] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteCode.trim() || !onJoinPod) return;
    setError(null);
    const ok = await onJoinPod(inviteCode.trim());
    if (!ok) {
      setError('Invalid or expired invite code.');
    }
  };

  const handleCreate = async () => {
    if (!onCreatePod) return;
    setError(null);
    const ok = await onCreatePod();
    if (!ok) {
      setError('Failed to create pod. Please try again.');
    }
  };

  return (
    <div className="relative w-full max-w-md bg-(--bg-surface) border border-(--border-subtle) shadow-2xl p-5 sm:p-6 space-y-4 z-10 rounded-lg">
      <div className="flex items-start justify-between border-b border-(--border-subtle) pb-3.5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-(--accent-primary)" />
            <h3 className="font-semibold text-sm text-(--text-primary)">Peer Job Pod</h3>
          </div>
          <p className="text-xs text-(--text-muted)">
            Pool and track job opportunities privately with peers
          </p>
        </div>
        <button
          onClick={onClose}
          className="h-7 w-7 inline-flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 py-2">
        <button
          type="button"
          onClick={handleCreate}
          disabled={isMutating}
          className="w-full h-9 px-4 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{isMutating ? 'Creating Pod...' : 'Create New Pod'}</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex-1 h-px bg-(--border-subtle)" />
          <span className="text-[11px] text-(--text-muted) uppercase">or join</span>
          <div className="flex-1 h-px bg-(--border-subtle)" />
        </div>

        <form onSubmit={handleJoin} className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Enter invite code (e.g. pod_xxxx)"
              value={inviteCode}
              onChange={(e) => setInviteCode(e.target.value)}
              className="flex-1 h-9 px-3 bg-(--bg-app) border border-(--border-subtle) text-xs text-(--text-primary) placeholder:text-(--text-muted) rounded-sm focus:outline-none focus:border-(--border-focus)"
            />
            <button
              type="submit"
              disabled={isMutating || !inviteCode.trim()}
              className="h-9 px-4 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs font-semibold text-(--text-primary) rounded-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
            >
              <span>Join</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
        </form>
      </div>
    </div>
  );
}
