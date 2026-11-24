'use client';

import React, { useState } from 'react';
import { Trash2, LogOut, Eraser, AlertTriangle } from 'lucide-react';

interface PodDangerZoneProps {
  onLeavePod?: () => Promise<boolean>;
  onDeletePod?: () => Promise<boolean>;
  onClearJobs?: () => Promise<boolean>;
  isMutating?: boolean;
}

export function PodDangerZone({
  onLeavePod,
  onDeletePod,
  onClearJobs,
  isMutating,
}: PodDangerZoneProps) {
  const [confirmAction, setConfirmAction] = useState<'leave' | 'delete' | 'clear' | null>(null);

  const handleConfirm = async () => {
    if (confirmAction === 'leave' && onLeavePod) {
      await onLeavePod();
    } else if (confirmAction === 'delete' && onDeletePod) {
      await onDeletePod();
    } else if (confirmAction === 'clear' && onClearJobs) {
      await onClearJobs();
    }
    setConfirmAction(null);
  };

  if (confirmAction) {
    const actionLabel =
      confirmAction === 'leave'
        ? 'leave and detach from this pod'
        : confirmAction === 'delete'
          ? 'permanently delete this pod'
          : 'clear all jobs from this pod feed';

    return (
      <div className="p-3 border border-red-500/30 bg-red-500/10 rounded-sm space-y-2">
        <div className="flex items-center gap-1.5 text-xs text-red-500 font-semibold">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Confirm Action</span>
        </div>
        <p className="text-xs text-(--text-secondary)">Are you sure you want to {actionLabel}?</p>
        <div className="flex items-center gap-2 pt-1">
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isMutating}
            className="h-7 px-3 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-sm cursor-pointer disabled:opacity-50 transition-colors"
          >
            {isMutating ? 'Processing...' : 'Confirm'}
          </button>
          <button
            type="button"
            onClick={() => setConfirmAction(null)}
            disabled={isMutating}
            className="h-7 px-3 border border-(--border-subtle) bg-(--bg-surface) text-xs font-semibold text-(--text-secondary) hover:text-(--text-primary) rounded-sm cursor-pointer transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1.5 pt-2 border-t border-(--border-subtle)">
      <div className="text-[11px] font-semibold text-(--text-muted) uppercase tracking-wider">
        Pod Actions
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {onClearJobs && (
          <button
            type="button"
            onClick={() => setConfirmAction('clear')}
            disabled={isMutating}
            className="h-7 px-2.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-xs font-medium text-(--text-secondary) hover:text-(--text-primary) rounded-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Eraser className="w-3 h-3 text-(--text-muted)" />
            <span>Clear Feed</span>
          </button>
        )}
        {onLeavePod && (
          <button
            type="button"
            onClick={() => setConfirmAction('leave')}
            disabled={isMutating}
            className="h-7 px-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-medium text-red-500 rounded-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <LogOut className="w-3 h-3" />
            <span>Drop / Leave Pod</span>
          </button>
        )}
        {onDeletePod && (
          <button
            type="button"
            onClick={() => setConfirmAction('delete')}
            disabled={isMutating}
            className="h-7 px-2.5 border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-xs font-medium text-red-500 rounded-sm inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
            <span>Delete Pod</span>
          </button>
        )}
      </div>
    </div>
  );
}
