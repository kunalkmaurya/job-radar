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
      <p className="text-xs text-(--text-secondary) leading-relaxed">
        Paste any job URL from Workday, Greenhouse, Lever, LinkedIn, or company career sites.
      </p>
      <input
        type="url"
        placeholder="https://..."
        value={fetchUrl}
        onChange={(e) => setFetchUrl(e.target.value)}
        className="w-full h-8 px-3 text-xs border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) placeholder-(--text-muted) rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
      />
      <button
        onClick={handleAutoFetch}
        disabled={!fetchUrl || isScraping}
        className="w-full h-8 flex items-center justify-center gap-2 bg-(--accent-primary) hover:bg-(--accent-primary-hover) disabled:opacity-50 text-(--accent-primary-text) text-xs font-semibold rounded-sm transition-colors shadow-xs cursor-pointer"
      >
        <Sparkles className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
        <span>{isScraping ? 'Extracting...' : 'Extract'}</span>
      </button>
    </div>
  );
}
