'use client';

import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface AddJobAutoFetchTabProps {
  onSuccess: () => Promise<void>;
  onClose: () => void;
}

export function AddJobAutoFetchTab({ onSuccess, onClose }: AddJobAutoFetchTabProps) {
  const [fetchUrl, setFetchUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const handleAutoFetch = async () => {
    if (!fetchUrl) return;
    setIsScraping(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: fetchUrl }),
      });
      const json = await res.json();
      if (json.success) {
        await onSuccess();
        onClose();
        setFetchUrl('');
      } else {
        alert(json.error?.message || 'Failed to extract job details.');
      }
    } catch (err) {
      console.error('Auto fetch failed:', err);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
        Paste any job URL from Workday, Greenhouse, Lever, LinkedIn, or company career sites.
      </p>
      <input
        type="url"
        placeholder="https://..."
        value={fetchUrl}
        onChange={(e) => setFetchUrl(e.target.value)}
        className="w-full px-3.5 py-2.5 text-xs border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--border-focus)]"
      />
      <button
        onClick={handleAutoFetch}
        disabled={!fetchUrl || isScraping}
        className="w-full flex items-center justify-center gap-2 py-2.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-sm cursor-pointer"
      >
        <Sparkles className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
        <span>{isScraping ? 'Extracting with AI...' : 'Scrape & Extract Details'}</span>
      </button>
    </div>
  );
}
