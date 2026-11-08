'use client';

import React from 'react';
import { Mail, Check, Loader2, Save } from 'lucide-react';
import { useDigestPreferences, DIGEST_OPTIONS } from './useDigestPreferences';

interface ProfileEmailDigestCardProps {
  userEmail?: string;
}

export function ProfileEmailDigestCard({ userEmail }: ProfileEmailDigestCardProps) {
  const { frequency, setFrequency, loading, savedNotice, initialLoading, handleSave } =
    useDigestPreferences();

  return (
    <form
      onSubmit={handleSave}
      className="border border-(--border-subtle) bg-(--bg-surface) p-5 shadow-sm space-y-4"
    >
      <div className="flex items-center justify-between border-b border-(--border-subtle) pb-3">
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4 text-(--accent-primary)" />
          <h3 className="text-xs uppercase tracking-wider font-bold text-(--text-primary)">
            Email Job Digest Preferences
          </h3>
        </div>
        {savedNotice && (
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <Check className="w-3.5 h-3.5" /> Saved
          </span>
        )}
      </div>

      <p className="text-xs text-(--text-secondary) leading-relaxed">
        Choose your delivery cadence for curated opportunities sent to{' '}
        <span className="font-medium text-(--text-primary)">{userEmail || 'your email'}</span>.
      </p>

      {initialLoading ? (
        <div className="py-6 flex justify-center">
          <Loader2 className="w-5 h-5 animate-spin text-(--text-muted)" />
        </div>
      ) : (
        <div className="space-y-2">
          {DIGEST_OPTIONS.map((opt) => {
            const isSelected = frequency === opt.id;
            return (
              <label
                key={opt.id}
                onClick={() => setFrequency(opt.id)}
                className={`flex items-start gap-3 p-3 border transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-(--accent-primary) bg-(--accent-primary-bg)'
                    : 'border-(--border-subtle) bg-(--bg-app) hover:border-(--border-focus)'
                }`}
              >
                <input
                  type="radio"
                  name="jobDigestFrequency"
                  value={opt.id}
                  checked={isSelected}
                  onChange={() => setFrequency(opt.id)}
                  className="mt-0.5 accent-(--accent-primary) cursor-pointer"
                />
                <div className="space-y-0.5 text-xs">
                  <div className="font-semibold text-(--text-primary)">{opt.label}</div>
                  <div className="text-[11px] text-(--text-secondary) leading-normal">
                    {opt.desc}
                  </div>
                </div>
              </label>
            );
          })}
        </div>
      )}

      <div className="pt-2 flex justify-end">
        <button
          type="submit"
          disabled={loading || initialLoading}
          className="flex items-center gap-1.5 px-4 py-2 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-xs font-semibold shadow-sm transition-all cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Frequency</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
