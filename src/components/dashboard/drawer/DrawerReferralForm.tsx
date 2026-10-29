'use client';

import React from 'react';
import { UserCheck, Link2, Send } from 'lucide-react';

interface DrawerReferralFormProps {
  name: string;
  setName: (v: string) => void;
  contact: string;
  setContact: (v: string) => void;
  notes: string;
  setNotes: (v: string) => void;
  isSaving: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export function DrawerReferralForm({
  name,
  setName,
  contact,
  setContact,
  notes,
  setNotes,
  isSaving,
  onSubmit,
}: DrawerReferralFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-2.5 text-xs"
    >
      <div>
        <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
          Referrer Name & Role
        </label>
        <div className="relative">
          <UserCheck className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="e.g. Alex Chen (Staff Engineer / Alumni)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
          Contact / LinkedIn Profile URL
        </label>
        <div className="relative">
          <Link2 className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
          <input
            type="text"
            placeholder="https://linkedin.com/in/... or email"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
          />
        </div>
      </div>

      <div>
        <label className="block text-[10px] font-mono uppercase text-[var(--text-muted)] mb-1">
          Outreach & Follow-Up Notes
        </label>
        <textarea
          rows={2}
          placeholder="e.g. Sent message on LinkedIn, waiting on confirmation..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full p-2 text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] resize-none"
        />
      </div>

      <div className="flex justify-end pt-1">
        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white shadow-sm transition-colors cursor-pointer"
        >
          <Send className="w-3 h-3" />
          <span>{isSaving ? 'Saving...' : 'Update Referral'}</span>
        </button>
      </div>
    </form>
  );
}
