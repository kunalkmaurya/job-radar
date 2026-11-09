'use client';

import React from 'react';
import { FileText, Clock } from 'lucide-react';
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
            <FileText className="w-3.5 h-3.5 text-(--accent-primary)" />
            <span>Personal Notes & Scratchpad</span>
          </label>
          {isSaving && <span className="text-[10px] text-(--accent-primary)">Saving...</span>}
        </div>
        <textarea
          rows={11}
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          onBlur={onSave}
          placeholder="Jot down referral contacts, interview talking points, recruiter email, compensation..."
          className="w-full p-3 text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) placeholder:text-(--text-muted) rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 leading-relaxed min-h-[220px] resize-y transition-all"
        />
      </div>

      <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm space-y-2.5">
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-(--text-secondary)">
          <Clock className="w-3.5 h-3.5 text-(--text-muted)" />
          <span>Timeline & Metadata</span>
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-[10px] uppercase font-semibold text-(--text-muted) block">
              Captured
            </span>
            <span className="text-(--text-secondary) font-medium">{formatDate(job.createdAt)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-semibold text-(--text-muted) block">
              Source
            </span>
            <span className="text-(--text-secondary) font-medium capitalize">{job.source}</span>
          </div>
          {job.appliedAt && (
            <div className="col-span-2 pt-2 border-t border-(--border-subtle)">
              <span className="text-[10px] uppercase font-semibold text-(--text-muted) block">
                Applied On
              </span>
              <span className="text-(--text-secondary) font-medium">
                {formatDate(job.appliedAt)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
