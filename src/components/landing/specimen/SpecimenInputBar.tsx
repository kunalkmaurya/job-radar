'use client';

import React from 'react';
import { ArrowRight, Link as LinkIcon, Activity } from 'lucide-react';

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
    <div className="px-5 py-3 border-b border-(--border-subtle) bg-(--bg-surface) flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
      <form onSubmit={onSubmit} className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-[11px] font-bold tracking-wider text-(--text-muted) uppercase shrink-0 select-none">
          TRY URL:
        </span>
        <div className="relative flex-1 min-w-0 flex items-center">
          <LinkIcon className="w-3.5 h-3.5 text-(--text-muted) absolute left-2.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Paste any career URL or pick a preset above..."
            value={customInputUrl}
            onChange={(e) => onChangeUrl(e.target.value)}
            className="w-full h-8 pl-8 pr-3 border border-(--border-subtle) bg-(--bg-app) text-(--text-primary) placeholder:text-(--text-muted) text-xs rounded-sm focus:outline-none focus:border-(--border-focus) focus:ring-1 focus:ring-(--accent-primary) transition-all"
          />
        </div>
        <button
          type="submit"
          className="h-8 px-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-(--accent-primary-text) font-semibold text-xs rounded-sm transition-colors shrink-0 cursor-pointer shadow-xs inline-flex items-center gap-1.5"
        >
          <span>Parse</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-sm border border-(--border-subtle) bg-(--bg-app) text-[11px] text-(--text-secondary) shrink-0 self-start md:self-auto select-none">
        <Activity className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
        <span className="text-(--text-muted)">Inference Latency:</span>
        <span className="font-mono font-semibold text-(--text-primary)">{latencyMs}ms</span>
      </div>
    </div>
  );
}
