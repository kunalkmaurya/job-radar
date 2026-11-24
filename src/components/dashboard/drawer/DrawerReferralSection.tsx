'use client';

import React from 'react';
import { Users, Check, Wand2 } from 'lucide-react';
import { Job, ReferralStatus, REFERRAL_STATUSES, UpdateReferralData } from '@/types';
import { DrawerReferralForm } from './DrawerReferralForm';
import { LinkedInFinderCard } from './LinkedInFinderCard';
import { LinkedInPitchGenerator } from './LinkedInPitchGenerator';
import { useDrawerReferral } from './useDrawerReferral';

interface DrawerReferralSectionProps {
  job: Job;
  onUpdateReferral: (jobId: string, data: UpdateReferralData) => Promise<void>;
}

const STATUS_LABELS: Record<ReferralStatus, string> = {
  none: 'No Referral',
  asked: 'Asked',
  received: 'Got Referral',
  declined: 'Declined',
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
    <div className="space-y-3.5 p-4 border border-(--border-subtle) bg-(--bg-surface) rounded-md shadow-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-(--accent-primary)" />
          <h4 className="text-xs font-bold text-(--text-primary)">Referral & Network Outreach</h4>
        </div>
        {savedNotice && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
            <Check className="w-3 h-3" /> Saved
          </span>
        )}
      </div>

      <LinkedInFinderCard company={job.company} />

      <div className="p-1 bg-(--bg-app) border border-(--border-subtle) rounded-sm grid grid-cols-4 gap-1">
        {REFERRAL_STATUSES.map((s) => {
          const isSelected = status === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => handleStatusChange(s)}
              className={`h-7 px-1 text-xs rounded-xs transition-all cursor-pointer text-center flex items-center justify-center ${
                isSelected
                  ? 'bg-(--bg-surface) text-(--text-primary) font-semibold shadow-xs border border-(--border-subtle)'
                  : 'text-(--text-secondary) hover:text-(--text-primary) hover:bg-(--bg-surface)/60 border border-transparent'
              }`}
            >
              <span className="truncate">{STATUS_LABELS[s]}</span>
            </button>
          );
        })}
      </div>

      <div className="flex justify-between items-center text-xs pt-0.5">
        <button
          type="button"
          onClick={() => setShowPitchDrafter(!showPitchDrafter)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-(--accent-blue-bright) hover:underline cursor-pointer"
        >
          <Wand2 className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span>
            {showPitchDrafter ? 'Hide message drafter' : 'Draft referral outreach message'}
          </span>
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
