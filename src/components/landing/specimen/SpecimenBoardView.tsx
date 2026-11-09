'use client';

import React from 'react';
import { ExternalLink, FileText } from 'lucide-react';
import { ShowcaseItem } from './types';

interface SpecimenBoardViewProps {
  selectedItem: ShowcaseItem;
  simulatedStatus: string;
  onSelectStatus: (status: string) => void;
}

const STATUS_OPTIONS = ['Saved', 'Applied', 'Interview', 'Offer'];

export function SpecimenBoardView({
  selectedItem,
  simulatedStatus,
  onSelectStatus,
}: SpecimenBoardViewProps) {
  return (
    <div className="space-y-4">
      <div className="border border-(--border-subtle) bg-(--bg-surface) rounded-md p-5 space-y-4 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-11 h-11 border border-(--accent-border) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-bold text-base flex items-center justify-center shrink-0 rounded-sm">
              {selectedItem.company.charAt(0)}
            </div>
            <div className="space-y-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-bold text-base text-(--text-primary)">
                  {selectedItem.company}
                </span>
                <span className="text-[11px] font-medium px-2 py-0.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) rounded-sm">
                  {selectedItem.location}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-sm">
                  {selectedItem.salary}
                </span>
              </div>
              <div className="text-xs sm:text-sm font-medium text-(--text-secondary) truncate">
                {selectedItem.role}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start lg:self-auto">
            <div className="inline-flex items-center p-0.5 border border-(--border-subtle) bg-(--bg-app) rounded-sm text-xs">
              {STATUS_OPTIONS.map((st) => {
                const isSelected = simulatedStatus === st;
                return (
                  <button
                    key={st}
                    type="button"
                    onClick={() => onSelectStatus(st)}
                    className={`h-7 px-2.5 rounded-sm text-xs transition-colors cursor-pointer font-semibold select-none ${
                      isSelected
                        ? 'bg-(--accent-primary) text-(--accent-primary-text) shadow-xs'
                        : 'text-(--text-secondary) hover:text-(--text-primary)'
                    }`}
                  >
                    {st}
                  </button>
                );
              })}
            </div>

            <a
              href={selectedItem.url}
              target="_blank"
              rel="noreferrer"
              className="h-8 px-3 border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) text-xs font-semibold rounded-sm transition-colors inline-flex items-center gap-1.5 shadow-xs"
            >
              <span>Apply</span>
              <ExternalLink className="w-3.5 h-3.5 text-(--text-muted)" />
            </a>
          </div>
        </div>

        <div className="pt-3 border-t border-(--border-subtle) flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-(--text-muted) mr-1.5 select-none">
            Extracted Tags:
          </span>
          {selectedItem.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 border border-(--border-subtle) bg-(--bg-app) text-(--text-secondary) text-[11px] font-medium rounded-sm"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="p-3 border border-(--border-subtle) bg-(--bg-app) rounded-sm text-xs text-(--text-secondary) flex items-center gap-2.5 leading-relaxed">
          <FileText className="w-4 h-4 text-(--accent-primary) shrink-0" />
          <span className="truncate">{selectedItem.notes}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3.5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-(--text-muted)">
              DOM Extraction
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          </div>
          <div className="text-xs font-semibold text-(--text-primary) truncate">
            SPA Rendered (Jina Dual-Tier)
          </div>
        </div>

        <div className="p-3.5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-(--text-muted)">
              LLM Reasoning
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 truncate">
            DeepSeek-V3 ({selectedItem.tokensUsed} tokens)
          </div>
        </div>

        <div className="p-3.5 border border-(--border-subtle) bg-(--bg-surface) rounded-md space-y-1.5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-(--text-muted)">
              Neon PostgreSQL
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-(--accent-primary)" />
          </div>
          <div className="text-xs font-semibold text-(--accent-blue-bright) truncate">
            Committed in {selectedItem.latencyMs}ms
          </div>
        </div>
      </div>
    </div>
  );
}
