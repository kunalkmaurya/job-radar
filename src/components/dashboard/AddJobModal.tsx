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
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-md border border-(--border-subtle) bg-(--bg-surface) p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-base">Add New Job Opening</h3>
          <button onClick={onClose} className="text-(--text-muted) hover:text-white cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex p-1 bg-(--bg-app) border border-(--border-subtle) text-xs gap-1.5 rounded-xs">
          <button
            onClick={() => setAddTab('fetch')}
            className={`flex-1 py-1.5 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
              addTab === 'fetch'
                ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
                : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Auto-Fetch Link
          </button>
          <button
            onClick={() => setAddTab('manual')}
            className={`flex-1 py-1.5 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
              addTab === 'manual'
                ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
                : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)'
            }`}
          >
            Manual Entry
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
