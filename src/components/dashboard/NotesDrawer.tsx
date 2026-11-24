'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Job, JobStatus, UpdateReferralData } from '@/types';
import { DrawerHeader } from './drawer/DrawerHeader';
import { DrawerFollowUp } from './drawer/DrawerFollowUp';
import { DrawerNotesSection } from './drawer/DrawerNotesSection';
import { DrawerReferralSection } from './drawer/DrawerReferralSection';

interface NotesDrawerProps {
  job: Job | null;
  nowTime: number;
  onClose: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onToggleImportant?: (jobId: string) => void;
  onDeleteJob: (jobId: string) => void;
  onSaveNotes: (jobId: string, notes: string, followUpDate: string | null) => Promise<void>;
  onUpdateReferral?: (jobId: string, data: UpdateReferralData) => Promise<void>;
}

export function NotesDrawer({
  job,
  nowTime,
  onClose,
  onStatusChange,
  onToggleImportant,
  onDeleteJob,
  onSaveNotes,
  onUpdateReferral,
}: NotesDrawerProps) {
  const [drawerNotes, setDrawerNotes] = useState(job?.notes || '');
  const [drawerFollowUp, setDrawerFollowUp] = useState(job?.followUpDate || '');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!job) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [job, onClose]);

  if (!job) return null;

  const handleSave = async (notesVal = drawerNotes, followUpVal = drawerFollowUp) => {
    setIsSaving(true);
    await onSaveNotes(job.id, notesVal, followUpVal || null);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-4xl max-h-[90vh] bg-(--bg-surface) border border-(--border-subtle) rounded-[8px] shadow-2xl flex flex-col z-10 animate-in zoom-in-95 duration-150">
        <div className="p-4 sm:p-6 border-b border-(--border-subtle) shrink-0">
          <DrawerHeader
            job={job}
            onClose={onClose}
            onStatusChange={onStatusChange}
            onToggleImportant={onToggleImportant}
          />
        </div>

        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            <div className="space-y-6">
              <DrawerFollowUp
                value={drawerFollowUp}
                nowTime={nowTime}
                onChange={(date) => {
                  setDrawerFollowUp(date);
                  handleSave(drawerNotes, date);
                }}
              />

              <DrawerNotesSection
                job={job}
                notes={drawerNotes}
                isSaving={isSaving}
                onNotesChange={setDrawerNotes}
                onSave={() => handleSave(drawerNotes, drawerFollowUp)}
              />
            </div>

            <div className="space-y-4">
              {onUpdateReferral && (
                <DrawerReferralSection job={job} onUpdateReferral={onUpdateReferral} />
              )}
            </div>
          </div>
        </div>

        <div className="px-4 py-3 sm:px-6 border-t border-(--border-subtle) bg-(--bg-surface) flex items-center justify-between text-xs text-(--text-muted) shrink-0 rounded-b-[8px]">
          <span className="text-[11px] text-(--text-muted)">
            Press{' '}
            <kbd className="px-1.5 py-0.5 border border-(--border-subtle) rounded-xs bg-(--bg-app) text-[10px] font-mono">
              Esc
            </kbd>{' '}
            to close
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onDeleteJob(job.id)}
              className="h-8 inline-flex items-center gap-1.5 px-2.5 text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 rounded-sm transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="h-8 px-5 text-xs font-semibold bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) rounded-sm shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
