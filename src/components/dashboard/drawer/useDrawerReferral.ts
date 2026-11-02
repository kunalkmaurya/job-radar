'use client';

import { useState } from 'react';
import { Job, ReferralStatus, UpdateReferralData } from '@/types';

export function useDrawerReferral(
  job: Job,
  onUpdateReferral: (jobId: string, data: UpdateReferralData) => Promise<void>
) {
  const [status, setStatus] = useState<ReferralStatus>(
    (job.referralStatus as ReferralStatus) || 'none'
  );
  const [name, setName] = useState(job.referrerName || '');
  const [contact, setContact] = useState(job.referrerContact || '');
  const [notes, setNotes] = useState(job.referralNotes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [savedNotice, setSavedNotice] = useState(false);
  const [showPitchDrafter, setShowPitchDrafter] = useState(true);

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
    const targetStatus = status === 'none' ? 'asked' : status;
    await onUpdateReferral(job.id, {
      referralStatus: targetStatus,
      referrerName: name,
      referrerContact: contact,
      referralNotes: notes,
    });
    setStatus(targetStatus);
    setIsSaving(false);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2000);
  };

  const handleSetReferrerFromPitch = (referrerName: string) => {
    setName(referrerName);
    if (status === 'none') {
      handleStatusChange('asked');
    }
  };

  return {
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
  };
}
