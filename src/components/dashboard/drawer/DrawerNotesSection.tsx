'use client';

import React from 'react';
import { FileText } from 'lucide-react';
import { Job } from '@/types';
import { formatDate } from '../data';

interface DrawerNotesSectionProps {
  job: Job;
  notes: string;
  isSaving: boolean;
  onNotesChange: (val: string) => void;
  onSave: () => void;
}

export function DrawerNotesSection({
  job,
  notes,
  isSaving,
  onNotesChange,
  onSave,
}: DrawerNotesSectionProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-(--text-secondary) flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>Personal Notes & Scratchpad</span>
          </label>
          {isSaving && <span className="text-[10px] text-(--accent-primary)">Saving...</span>}
        </div>
        <textarea
          rows={7}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          onBlur={onSave}
          placeholder="Jot down referral contacts, interview talking points, recruiter email, compensation..."
          className="w-full p-3 text-xs border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) placeholder-(--text-muted) focus:outline-none focus:border-(--border-focus) leading-relaxed"
        />
      </div>

      <div className="p-3 border border-(--border-subtle) bg-(--bg-app) space-y-1 text-[11px] text-(--text-muted)">
        <div>Captured: {formatDate(job.createdAt)}</div>
        {job.appliedAt && <div>Applied: {formatDate(job.appliedAt)}</div>}
        <div>Source: {job.source}</div>
      </div>
    </div>
  );
}
