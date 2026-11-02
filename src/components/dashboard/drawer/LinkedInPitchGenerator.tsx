'use client';

import React, { useState } from 'react';
import { Sparkles, Copy, Check, MessageSquare, Loader2 } from 'lucide-react';
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
}: LinkedInPitchGeneratorProps) {
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
    <div className="border border-(--border-subtle) bg-(--bg-app) p-3 space-y-2.5 text-xs">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 font-semibold text-(--text-primary)">
          <Sparkles className="w-3.5 h-3.5 text-(--accent-primary)" />
          <span>Referral Pitch Drafter</span>
        </div>
        <div className="flex items-center gap-1">
          {(['peer', 'alumni', 'formal'] as ReferralTone[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => {
                setTone(t);
                setPitch(getDefaultReferralTemplate({ company, role, recipientName, tone: t }));
              }}
              className={`px-1.5 py-0.5 text-[10px] uppercase font-mono border transition-colors cursor-pointer ${
                tone === t
                  ? 'border-(--accent-primary) text-(--accent-primary) bg-(--accent-primary-bg)'
                  : 'border-(--border-subtle) text-(--text-muted) hover:text-(--text-primary)'
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
          className="flex-1 px-2.5 py-1.5 text-xs border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) placeholder:text-(--text-muted) focus:outline-none focus:border-(--border-focus)"
        />
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white text-[11px] font-medium transition-colors cursor-pointer disabled:opacity-60"
        >
          {isGenerating ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <Sparkles className="w-3 h-3" />
          )}
          <span>{isGenerating ? 'Drafting...' : 'AI Pitch'}</span>
        </button>
      </div>

      <textarea
        rows={6}
        value={pitch}
        onChange={(e) => setPitch(e.target.value)}
        className="w-full p-2.5 text-[11px] leading-relaxed border border-(--border-subtle) bg-(--bg-surface) text-(--text-primary) focus:outline-none focus:border-(--border-focus) resize-y min-h-[140px]"
      />

      <div className="flex items-center justify-between gap-2 pt-0.5">
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) text-[11px] font-medium transition-colors cursor-pointer"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-400" />
          ) : (
            <Copy className="w-3 h-3 text-(--text-muted)" />
          )}
          <span>{copied ? 'Copied to Clipboard' : 'Copy Pitch'}</span>
        </button>

        <a
          href={getLinkedInMessagingUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 border border-[#0A66C2]/40 bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 text-[#0A66C2] text-[11px] font-medium transition-colors"
        >
          <MessageSquare className="w-3 h-3" />
          <span>Open LinkedIn Chat</span>
        </a>
      </div>
    </div>
  );
}
