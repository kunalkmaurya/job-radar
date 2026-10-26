'use client';

import React, { useState, useEffect } from 'react';
import { Users, Check } from 'lucide-react';
import { Job, ReferralStatus, REFERRAL_STATUSES } from '@/types';
import { DrawerReferralForm } from './DrawerReferralForm';

interface DrawerReferralSectionProps {
  job: Job;
  onUpdateReferral: (
    jobId: string,
    data: {
      referralStatus: ReferralStatus;
      referrerName?: string;
      referrerContact?: string;
      referralNotes?: string;
    }
  ) => Promise<void>;
}

const STATUS_LABELS: Record<ReferralStatus, { label: string; activeClass: string }> = {
  none: { label: 'No Referral', activeClass: 'bg-[var(--border-subtle)] text-[var(--text-secondary)] font-bold' },
  asked: { label: 'Asked', activeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold' },
  received: { label: 'Got Referral', activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold' },
  declined: { label: 'Declined', activeClass: 'bg-red-500/20 text-red-300 border-red-500/40 font-bold' },
};

export function DrawerReferralSection({ job, onUpdateReferral }: DrawerReferralSectionProps) {
  const [status, setStatus] = useState<ReferralStatus>((job.referralStatus as ReferralStatus) || 'none');
  const [name, setName] = useState(job.referrerName || '');
  const [contact, setContact] = useState(job.referrerContact || '');
  const [notes, setNotes] = useState(job.referralNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);

  useEffect(() => {
    setStatus((job.referralStatus as ReferralStatus) || 'none');
    setName(job.referrerName || '');
    setContact(job.referrerContact || '');
    setNotes(job.referralNotes || '');
  }, [job]);

  const handleStatusChange = async (newStatus: ReferralStatus) => {
    setStatus(newStatus);
    setIsSaving(true);
    await onUpdateReferral(job.id, {
      referralStatus: newStatus,
      referrerName: name,
      referrerContact: contact,
      referralNotes: notes,
    });
    setIsSaving(false);
  };

  const handleSaveDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    await onUpdateReferral(job.id, {
      referralStatus: status === 'none' ? 'asked' : status,
      referrerName: name,
      referrerContact: contact,
      referralNotes: notes,
    });
    if (status === 'none') setStatus('asked');
    setIsSaving(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-3 pt-4 border-t border-[var(--border-subtle)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
            Referral Tracker
          </h4>
        </div>
        {savedNotice && (
          <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-400">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <div className="grid grid-cols-4 gap-1.5">
        {REFERRAL_STATUSES.map((s) => {
          const isSelected = status === s;
          const conf = STATUS_LABELS[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`py-1.5 px-2 text-[10px] font-mono uppercase tracking-wider border transition-colors cursor-pointer text-center ${
                isSelected
                  ? conf.activeClass
                  : 'border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:border-[var(--border-focus)]'
              }`}
            >
              {conf.label}
            </button>
          );
        })}
      </div>

      {status !== 'none' && (
        <DrawerReferralForm
          name={name}
          setName={setName}
          contact={contact}
          setContact={setContact}
          notes={notes}
          setNotes={setNotes}
          isSaving={isSaving}
          onSubmit={handleSaveDetails}
        />
      )}
    </div>
  );
}
