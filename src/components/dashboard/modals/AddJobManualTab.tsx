'use client';

import React, { useState } from 'react';
import { Job, JOB_STATUSES, JobStatus, ReferralStatus } from '@/types';

interface AddJobManualTabProps {
  onJobAdded: (job: Job) => void;
  onClose: () => void;
}

export function AddJobManualTab({ onJobAdded, onClose }: AddJobManualTabProps) {
  const [manualForm, setManualForm] = useState({
    company: '',
    role: '',
    link: '',
    status: 'Saved' as JobStatus,
    referralStatus: 'none' as ReferralStatus,
    referrerName: '',
    notes: '',
  });

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
      if (json.success && json.data) {
        onJobAdded(json.data);
      }
    } catch (err) {
      console.error('Failed to create job:', err);
    }
    onClose();
    setManualForm({
      company: '',
      role: '',
      link: '',
      status: 'Saved',
      referralStatus: 'none',
      referrerName: '',
      notes: '',
    });
  };

  return (
    <form onSubmit={handleManualSubmit} className="space-y-3.5 text-xs">
      <div>
        <label className="block text-[var(--text-secondary)] mb-1 font-medium">Company Name</label>
        <input
          type="text"
          required
          placeholder="e.g. Stripe"
          value={manualForm.company}
          onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
          className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
        />
      </div>
      <div>
        <label className="block text-[var(--text-secondary)] mb-1 font-medium">Role Title</label>
        <input
          type="text"
          required
          placeholder="e.g. Staff Infrastructure Engineer"
          value={manualForm.role}
          onChange={(e) => setManualForm({ ...manualForm, role: e.target.value })}
          className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
        />
      </div>
      <div>
        <label className="block text-[var(--text-secondary)] mb-1 font-medium">
          Job Application Link
        </label>
        <input
          type="url"
          required
          placeholder="https://..."
          value={manualForm.link}
          onChange={(e) => setManualForm({ ...manualForm, link: e.target.value })}
          className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)]"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-[var(--text-secondary)] mb-1 font-medium">
            Initial Status
          </label>
          <select
            value={manualForm.status}
            onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as JobStatus })}
            className="w-full px-3 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none cursor-pointer text-xs"
          >
            {JOB_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-[var(--text-secondary)] mb-1 font-medium">
            Referral Status
          </label>
          <select
            value={manualForm.referralStatus}
            onChange={(e) =>
              setManualForm({ ...manualForm, referralStatus: e.target.value as ReferralStatus })
            }
            className="w-full px-3 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none cursor-pointer text-xs"
          >
            <option value="none">No Referral</option>
            <option value="asked">Asked</option>
            <option value="received">Received</option>
            <option value="declined">Declined</option>
          </select>
        </div>
      </div>

      {manualForm.referralStatus !== 'none' && (
        <div>
          <label className="block text-[var(--text-secondary)] mb-1 font-medium">
            Referrer Name (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Alex Smith"
            value={manualForm.referrerName}
            onChange={(e) => setManualForm({ ...manualForm, referrerName: e.target.value })}
            className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--border-focus)] text-xs"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-semibold transition-all shadow-sm mt-2 cursor-pointer"
      >
        Save Job to Board
      </button>
    </form>
  );
}
