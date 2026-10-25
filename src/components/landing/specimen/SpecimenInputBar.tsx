'use client';

import React from 'react';

interface SpecimenInputBarProps {
  customInputUrl: string;
  onChangeUrl: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  latencyMs: number;
}

export function SpecimenInputBar({
  customInputUrl,
  onChangeUrl,
  onSubmit,
  latencyMs,
}: SpecimenInputBarProps) {
  return (
    <div className="px-6 py-3 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
      <form onSubmit={onSubmit} className="flex-1 w-full flex items-center gap-2">
        <span className="text-[var(--text-muted)] font-mono shrink-0">TRY URL:</span>
        <input
          type="text"
          placeholder="Paste any career URL or pick a preset above..."
          value={customInputUrl}
          onChange={(e) => onChangeUrl(e.target.value)}
          className="flex-1 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder-[var(--text-muted)] font-mono text-xs focus:outline-none focus:border-[var(--border-focus)]"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-medium transition-all shrink-0 cursor-pointer"
        >
          Parse
        </button>
      </form>

      <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)] shrink-0">
        <span className="w-1.5 h-1.5 bg-emerald-400" />
        <span>DeepSeek-V3 Inference: {latencyMs}ms</span>
      </div>
    </div>
  );
}
