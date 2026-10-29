'use client';

import React from 'react';
import { ArrowUpRight, FileText } from 'lucide-react';
import { ShowcaseItem } from './types';

interface SpecimenBoardViewProps {
  selectedItem: ShowcaseItem;
  simulatedStatus: string;
  onSelectStatus: (status: string) => void;
}

export function SpecimenBoardView({
  selectedItem,
  simulatedStatus,
  onSelectStatus,
}: SpecimenBoardViewProps) {
  return (
    <div className="space-y-6">
      {/* Board Row Specimen */}
      <div className="border border-[var(--border-subtle)] bg-[var(--bg-app)] p-6 transition-all hover:border-[var(--accent-primary)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Left Company & Role */}
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] font-bold text-base flex items-center justify-center shrink-0">
              {selectedItem.company.charAt(0)}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-bold text-base text-[var(--text-primary)]">
                  {selectedItem.company}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-muted)]">
                  {selectedItem.location}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
                  {selectedItem.salary}
                </span>
              </div>
              <div className="text-sm font-medium text-[var(--text-secondary)]">
                {selectedItem.role}
              </div>
            </div>
          </div>

          {/* Right Status Switcher & 1-Click Apply */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex items-center border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5 text-xs">
              {['Saved', 'Applied', 'Interview', 'Offer'].map((st) => (
                <button
                  key={st}
                  onClick={() => onSelectStatus(st)}
                  className={`px-2.5 py-1 transition-colors cursor-pointer ${
                    simulatedStatus === st
                      ? 'bg-[var(--accent-primary)] text-white font-semibold'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>

            <a
              href={selectedItem.url}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white text-xs font-semibold shadow-sm transition-all active:scale-[0.98]"
            >
              <span>Apply</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Skill Tags */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-[var(--border-subtle)]">
          <span className="text-[10px] font-mono text-[var(--text-muted)] mr-2 uppercase tracking-wider">
            Extracted Tags:
          </span>
          {selectedItem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-secondary)] text-[11px] font-mono"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Slide-over Notes Preview */}
        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)] flex items-start gap-2.5">
          <FileText className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[var(--text-primary)]">Private Scratchpad: </span>
            <span>{selectedItem.notes}</span>
          </div>
        </div>
      </div>

      {/* Telemetry Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1">
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">
            DOM Extraction
          </span>
          <span className="font-bold text-[var(--accent-primary)]">
            SPA Rendered (Jina Dual-Tier)
          </span>
        </div>
        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1">
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">
            LLM Reasoning
          </span>
          <span className="font-bold text-emerald-400">
            DeepSeek-V3 ({selectedItem.tokensUsed} tokens)
          </span>
        </div>
        <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1">
          <span className="text-[var(--text-muted)] block text-[10px] uppercase">
            Neon PostgreSQL
          </span>
          <span className="font-bold text-[#70A1D7]">Committed in {selectedItem.latencyMs}ms</span>
        </div>
      </div>
    </div>
  );
}
