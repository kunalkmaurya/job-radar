'use client';

import React, { useState } from 'react';
import { Job, JOB_STATUSES, JobStatus, ReferralStatus } from '@/types';

interface AddJobManualTabProps {
  onJobAdded: (job: Job) => void;
  onClose: () => void;
}

const INITIAL_FORM = {
  company: '',
  role: '',
  link: '',
  location: '',
  exp: '',
  status: 'Saved' as JobStatus,
  referralStatus: 'none' as ReferralStatus,
  referrerName: '',
  notes: '',
};

export function AddJobManualTab({ onJobAdded, onClose }: AddJobManualTabProps) {
  const [manualForm, setManualForm] = useState(INITIAL_FORM);

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.company || !manualForm.role || !manualForm.link) return;
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });
      const json = await res.json();
      if (json.success && json.data) onJobAdded(json.data);
    } catch (err) {
      console.error('Failed to create job:', err);
    }
    onClose();
    setManualForm(INITIAL_FORM);
  };

  return (
    <form onSubmit={handleManualSubmit} className="space-y-2.5 text-xs">
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-(--text-secondary) mb-1 font-semibold">Company *</label>
          <input
            type="text"
            required
            placeholder="e.g. Stripe"
            value={manualForm.company}
            onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
            className="w-full h-8 px-2.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm focus:outline-none focus:border-(--border-focus)"
          />
        </div>
        <div>
          <label className="block text-(--text-secondary) mb-1 font-semibold">Role *</label>
          <input
            type="text"
            required
            placeholder="e.g. Backend Engineer"
            value={manualForm.role}
            onChange={(e) => setManualForm({ ...manualForm, role: e.target.value })}
            className="w-full h-8 px-2.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm focus:outline-none focus:border-(--border-focus)"
          />
        </div>
      </div>
      <div>
        <label className="block text-(--text-secondary) mb-1 font-semibold">
          Application URL *
        </label>
        <input
          type="url"
          required
          placeholder="https://..."
          value={manualForm.link}
          onChange={(e) => setManualForm({ ...manualForm, link: e.target.value })}
          className="w-full h-8 px-2.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm focus:outline-none focus:border-(--border-focus)"
        />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-(--text-secondary) mb-1 font-semibold">Location</label>
          <input
            type="text"
            placeholder="e.g. Remote / Flexible"
            value={manualForm.location}
            onChange={(e) => setManualForm({ ...manualForm, location: e.target.value })}
            className="w-full h-8 px-2.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm focus:outline-none focus:border-(--border-focus)"
          />
        </div>
        <div>
          <label className="block text-(--text-secondary) mb-1 font-semibold">Experience</label>
          <input
            type="text"
            placeholder="e.g. Senior (5+ yrs)"
            value={manualForm.exp}
            onChange={(e) => setManualForm({ ...manualForm, exp: e.target.value })}
            className="w-full h-8 px-2.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm focus:outline-none focus:border-(--border-focus)"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <div>
          <label className="block text-(--text-secondary) mb-1 font-semibold">Status</label>
          <select
            value={manualForm.status}
            onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as JobStatus })}
            className="w-full h-8 px-2 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm cursor-pointer"
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-(--text-secondary) mb-1 font-semibold">Referral</label>
          <select
            value={manualForm.referralStatus}
            onChange={(e) =>
              setManualForm({ ...manualForm, referralStatus: e.target.value as ReferralStatus })
            }
            className="w-full h-8 px-2 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) rounded-sm cursor-pointer"
          >
            <option value="none">No Referral</option>
            <option value="asked">Asked</option>
            <option value="received">Received</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>
      <button
        type="submit"
        className="w-full h-8 mt-1 inline-flex items-center justify-center bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold text-xs rounded-sm transition-colors shadow-xs cursor-pointer"
      >
        Save
      </button>
    </form>
  );
}
