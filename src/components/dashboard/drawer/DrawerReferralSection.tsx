'use client';

import React from 'react';
import { Users, Check, Sparkles } from 'lucide-react';
import { Job, ReferralStatus, REFERRAL_STATUSES, UpdateReferralData } from '@/types';
import { DrawerReferralForm } from './DrawerReferralForm';
import { LinkedInFinderCard } from './LinkedInFinderCard';
import { LinkedInPitchGenerator } from './LinkedInPitchGenerator';
import { useDrawerReferral } from './useDrawerReferral';

interface DrawerReferralSectionProps {
  job: Job;
  onUpdateReferral: (jobId: string, data: UpdateReferralData) => Promise<void>;
}

const STATUS_LABELS: Record<ReferralStatus, { label: string; activeClass: string }> = {
  none: {
    label: 'No Referral',
    activeClass: 'bg-(--border-subtle) text-(--text-secondary) font-bold',
  },
  asked: {
    label: 'Asked',
    activeClass: 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold',
  },
  received: {
    label: 'Got Referral',
    activeClass: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold',
  },
  declined: {
    label: 'Declined',
    activeClass: 'bg-red-500/20 text-red-300 border-red-500/40 font-bold',
  },
};

export function DrawerReferralSection({ job, onUpdateReferral }: DrawerReferralSectionProps) {
  const {
    status,
    name,
    setName,
    contact,
    setContact,
    notes,
    setNotes,
    isSaving,
    savedNotice,
    showPitchDrafter,
    setShowPitchDrafter,
    handleStatusChange,
    handleSaveDetails,
    handleSetReferrerFromPitch,
  } = useDrawerReferral(job, onUpdateReferral);

  return (
    <div className="space-y-3 p-4 border border-(--border-subtle) bg-(--bg-app)/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-(--accent-primary)" />
          <h4 className="text-xs font-semibold uppercase tracking-wider text-(--text-muted)">
            Referral & Network Outreach
          </h4>
        </div>
        {savedNotice && (
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      {/* 1. LinkedIn 1st-Degree & 2nd-Degree Deep-Link Finder */}
      <LinkedInFinderCard company={job.company} />

      {/* 2. Referral Status Chips */}
      <div className="grid grid-cols-4 gap-1.5">
        {REFERRAL_STATUSES.map((s) => {
          const isSelected = status === s;
          const conf = STATUS_LABELS[s];
          return (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`py-1.5 px-2 text-[10px] uppercase tracking-wider border transition-colors cursor-pointer text-center ${
                isSelected
                  ? conf.activeClass
                  : 'border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary) hover:border-(--border-focus)'
              }`}
            >
              {conf.label}
            </button>
          );
        })}
      </div>

      {/* 3. AI Referral Pitch Drafter Toggle */}
      <div className="flex justify-between items-center text-xs">
        <button
          type="button"
          onClick={() => setShowPitchDrafter(!showPitchDrafter)}
          className="inline-flex items-center gap-1.5 text-[11px] text-(--accent-primary) hover:underline cursor-pointer"
        >
          <Sparkles className="w-3 h-3" />
          <span>{showPitchDrafter ? 'Hide Outreach Drafter' : 'Draft Referral Pitch with AI'}</span>
        </button>
      </div>

      {showPitchDrafter && (
        <LinkedInPitchGenerator
          company={job.company}
          role={job.role}
          recipientName={name}
          onRecipientNameChange={setName}
          onSetReferrer={handleSetReferrerFromPitch}
        />
      )}

      {/* 4. Contact & Notes Form when referral is active */}
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
