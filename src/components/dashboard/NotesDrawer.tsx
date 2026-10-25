'use client';

import React, { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import { Job, JobStatus } from '@/types';
import { DrawerHeader } from './drawer/DrawerHeader';
import { DrawerFollowUp } from './drawer/DrawerFollowUp';
import { DrawerNotesSection } from './drawer/DrawerNotesSection';

interface NotesDrawerProps {
  job: Job | null;
  nowTime: number;
  onClose: () => void;
  onStatusChange: (jobId: string, status: JobStatus) => void;
  onDeleteJob: (jobId: string) => void;
  onSaveNotes: (jobId: string, notes: string, followUpDate: string | null) => Promise<void>;
}

export function NotesDrawer({
  job,
  nowTime,
  onClose,
  onStatusChange,
  onDeleteJob,
  onSaveNotes,
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
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
        <div className="space-y-6">
          <DrawerHeader job={job} onClose={onClose} onStatusChange={onStatusChange} />

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
            onSave={() => handleSave()}
          />
        </div>

        <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
          <button
            onClick={() => onDeleteJob(job.id)}
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Job</span>
          </button>
          <button
            onClick={() => handleSave()}
            className="px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-medium text-xs shadow-sm cursor-pointer"
          >
            Save Notes
          </button>
        </div>
      </div>
    </div>
  );
}
