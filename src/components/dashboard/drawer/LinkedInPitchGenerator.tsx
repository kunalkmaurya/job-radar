'use client';

import React, { useState } from 'react';
import { Wand2, Copy, Check, MessageSquare, Loader2 } from 'lucide-react';
import { ReferralTone, getDefaultReferralTemplate, getLinkedInMessagingUrl } from '@/lib/linkedin';

interface LinkedInPitchGeneratorProps {
  company: string;
  role: string;
  recipientName: string;
  onRecipientNameChange: (val: string) => void;
  onSetReferrer?: (name: string) => void;
}

export function LinkedInPitchGenerator({
  company,
  role,
  recipientName,
  onRecipientNameChange,
  onSetReferrer,
}: Readonly<LinkedInPitchGeneratorProps>) {
  const [tone, setTone] = useState<ReferralTone>('peer');
  const [pitch, setPitch] = useState(() =>
    getDefaultReferralTemplate({ company, role, recipientName, tone: 'peer' })
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/referral-pitch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ company, role, recipientName, tone }),
      });
      const data = await res.json();
      if (data.pitch) setPitch(data.pitch);
    } catch {
      setPitch(getDefaultReferralTemplate({ company, role, recipientName, tone }));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pitch);
      setCopied(true);
      if (recipientName && onSetReferrer) onSetReferrer(recipientName);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.warn('Copy failed:', err);
    }
  };

  return (
    <div className="border border-(--border-subtle) bg-(--bg-app) rounded-sm p-3 space-y-2.5 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-bold text-(--text-primary)">
          <Wand2 className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span>Message Drafter</span>
        </div>
        <div className="p-0.5 bg-(--bg-surface) border border-(--border-subtle) rounded-sm flex items-center gap-0.5">
          {(['peer', 'alumni', 'formal'] as ReferralTone[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTone(t);
                setPitch(getDefaultReferralTemplate({ company, role, recipientName, tone: t }));
              }}
              className={`px-2 py-0.5 text-[10px] uppercase font-semibold rounded-xs transition-colors cursor-pointer ${
                tone === t
                  ? 'bg-(--accent-primary) text-(--accent-primary-text) shadow-xs'
                  : 'text-(--text-muted) hover:text-(--text-primary)'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="text"
          value={recipientName}
          onChange={(e) => onRecipientNameChange(e.target.value)}
          placeholder="Contact name (e.g. Sarah)"
          className="flex-1 h-8 px-2.5 text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) placeholder:text-(--text-muted) rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 transition-all"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="h-8 inline-flex items-center gap-1.5 px-3 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) text-xs font-semibold rounded-sm transition-colors cursor-pointer disabled:opacity-60 shadow-xs"
        >
          {isGenerating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Wand2 className="w-3.5 h-3.5" />
          )}
          <span>{isGenerating ? 'Drafting...' : 'Draft'}</span>
        </button>
      </div>

      <textarea
        rows={6}
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        className="w-full p-2.5 text-[11px] leading-relaxed border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-2 focus:ring-(--accent-primary)/20 resize-y min-h-[130px] transition-all"
      />

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleCopy}
          className="h-8 inline-flex items-center gap-1.5 px-3 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) text-xs font-medium rounded-sm transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-emerald-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-(--text-muted)" />
          )}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>

        <a
          href={getLinkedInMessagingUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="h-8 inline-flex items-center gap-1.5 px-3 border border-[#0A66C2]/30 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-xs font-medium rounded-sm transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Chat</span>
        </a>
      </div>
    </div>
  );
}
