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
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerFollowUp, setDrawerFollowUp] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (job) {
      setDrawerNotes(job.notes || '');
      setDrawerFollowUp(job.followUpDate || '');
    }
  }, [job]);

  if (!job) return null;

  const handleSave = async (notesVal = drawerNotes, followUpVal = drawerFollowUp) => {
    setIsSaving(true);
    await onSaveNotes(job.id, notesVal, followUpVal || null);
    setIsSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-(--bg-surface) border-l border-(--border-subtle) p-4 sm:p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div className="space-y-6 overflow-y-auto flex-1 pr-1">
          <DrawerHeader
            job={job}
            onClose={onClose}
            onStatusChange={onStatusChange}
            onToggleImportant={onToggleImportant}
          />

          <DrawerFollowUp
            value={drawerFollowUp}
            nowTime={nowTime}
            onChange={(date) => {
              setDrawerFollowUp(date);
              handleSave(drawerNotes, date);
            }}
          />

          {onUpdateReferral && (
            <DrawerReferralSection job={job} onUpdateReferral={onUpdateReferral} />
          )}

          <DrawerNotesSection
            job={job}
            notes={drawerNotes}
            isSaving={isSaving}
            onNotesChange={setDrawerNotes}
            onSave={() => handleSave(drawerNotes, drawerFollowUp)}
          />
        </div>

        <div className="pt-4 border-t border-(--border-subtle) flex items-center justify-between text-xs text-(--text-muted)">
          <span>Added via {job.source}</span>
          <button
            type="button"
            onClick={() => onDeleteJob(job.id)}
            className="flex items-center gap-1.5 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete job</span>
          </button>
        </div>
      </div>
    </div>
  );
}
