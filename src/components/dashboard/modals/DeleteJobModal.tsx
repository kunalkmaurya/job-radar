'use client';

import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { STATUS_CONFIG } from '../common/statusConfig';

interface DeleteJobModalProps {
  job: Job | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting?: boolean;
}

export function DeleteJobModal({
  job,
  isOpen,
  onConfirm,
  onCancel,
  isDeleting = false,
}: DeleteJobModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancel();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen || !job) return null;

  const statusStyle = STATUS_CONFIG[job.status as JobStatus] || STATUS_CONFIG.Saved;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md border border-(--border-subtle) bg-(--bg-surface) p-6 shadow-2xl z-10 space-y-4 text-xs animate-in zoom-in-95 duration-150">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center shrink-0">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-(--text-primary)">Delete Job Application</h3>
              <p className="text-[11px] text-(--text-muted)">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onCancel}
            title="Close dialog"
            className="text-(--text-muted) hover:text-(--text-primary) cursor-pointer p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Job preview card */}
        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 bg-(--accent-primary-bg) border border-(--border-subtle) text-(--accent-primary) font-bold text-xs flex items-center justify-center shrink-0">
              {job.company.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="font-semibold text-xs text-(--text-primary) truncate">
                {job.company}
              </div>
              <div className="text-[11px] text-(--text-secondary) truncate">{job.role}</div>
            </div>
          </div>

          <span
            className="text-[10px] px-2 py-0.5 uppercase tracking-wider font-semibold shrink-0 border"
            style={{
              backgroundColor: statusStyle.bg,
              color: statusStyle.text,
              borderColor: statusStyle.border,
            }}
          >
            {job.status}
          </span>
        </div>

        <p className="text-(--text-secondary) leading-relaxed">
          Are you sure you want to delete this job application? All associated notes, timeline
          records, and referral details will be permanently removed.
        </p>

        <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-(--border-subtle)">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-3.5 py-1.5 border border-(--border-subtle) bg-(--bg-app) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer text-xs font-medium disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-medium transition-colors cursor-pointer text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{isDeleting ? 'Deleting...' : 'Delete Job'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
