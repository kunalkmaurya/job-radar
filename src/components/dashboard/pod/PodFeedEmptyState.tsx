'use client';

import React from 'react';
import { Users, Send } from 'lucide-react';

interface PodFeedEmptyStateProps {
  telegramConnectUrl?: string;
  onOpenAddJob: () => void;
}

export function PodFeedEmptyState({ telegramConnectUrl, onOpenAddJob }: PodFeedEmptyStateProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-16 border border-dashed border-(--border-subtle) text-(--text-muted) gap-3 rounded-xs text-center px-4">
      <div className="w-10 h-10 rounded-full bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center text-(--accent-blue-bright)">
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
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-semibold rounded-xs shadow-xs"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Open Telegram Group</span>
          </a>
        )}
        <button
          onClick={onOpenAddJob}
          className="px-3 py-1.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) text-xs font-semibold rounded-xs cursor-pointer"
        >
          Share First Job
        </button>
      </div>
    </div>
  );
}
