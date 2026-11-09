'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Job } from '@/types';
import { AddJobAutoFetchTab } from './modals/AddJobAutoFetchTab';
import { AddJobManualTab } from './modals/AddJobManualTab';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJobAdded: (job: Job) => void;
  onRefreshJobs: () => Promise<void>;
}

export function AddJobModal({ isOpen, onClose, onJobAdded, onRefreshJobs }: AddJobModalProps) {
  const [addTab, setAddTab] = useState<'fetch' | 'manual'>('fetch');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-md border border-(--border-subtle) bg-(--bg-surface) p-6 rounded-[8px] shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm uppercase tracking-wider text-(--text-primary)">
            Add Job
          </h3>
          <button
            onClick={onClose}
            className="h-8 w-8 inline-flex items-center justify-center text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-surface-hover) rounded-sm cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex p-0.5 bg-(--bg-app) border border-(--border-subtle) text-xs gap-1 rounded-sm">
          <button
            onClick={() => setAddTab('fetch')}
            className={`flex-1 h-7 text-xs font-semibold transition-colors cursor-pointer rounded-sm ${
              addTab === 'fetch'
                ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Auto-Fetch
          </button>
          <button
            onClick={() => setAddTab('manual')}
            className={`flex-1 h-7 text-xs font-semibold transition-colors cursor-pointer rounded-sm ${
              addTab === 'manual'
                ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright)'
                : 'text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Manual
          </button>
        </div>

        {addTab === 'fetch' ? (
          <AddJobAutoFetchTab onSuccess={onRefreshJobs} onClose={onClose} />
        ) : (
          <AddJobManualTab onJobAdded={onJobAdded} onClose={onClose} />
        )}
      </div>
    </div>
  );
}
