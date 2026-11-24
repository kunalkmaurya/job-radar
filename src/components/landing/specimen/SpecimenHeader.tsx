'use client';

import React from 'react';
import { SpecimenTab, ShowcaseItem } from './types';

interface SpecimenHeaderProps {
  selectedItem: ShowcaseItem;
  activeTab: SpecimenTab;
  onSelectTab: (tab: SpecimenTab) => void;
}

const TABS: Array<{ id: SpecimenTab; label: string }> = [
  { id: 'board', label: 'Board Card' },
  { id: 'extraction', label: 'Semantic Schema' },
  { id: 'telegram', label: 'Telegram Ingest' },
];

export function SpecimenHeader({ selectedItem, activeTab, onSelectTab }: SpecimenHeaderProps) {
  return (
    <div className="px-5 py-3 border-b border-(--border-subtle) bg-(--bg-app)/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex items-center gap-1.5 shrink-0 select-none">
          <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-black/10 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-black/10 inline-block" />
          <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-black/10 inline-block" />
        </div>
        <div className="h-4 w-px bg-(--border-subtle) shrink-0" />
        <span className="text-(--text-secondary) font-mono text-[11px] truncate select-all">
          pipeline://stream/{selectedItem.company.toLowerCase()}
        </span>
      </div>

      <div className="inline-flex items-center p-0.5 border border-(--border-subtle) bg-(--bg-surface) rounded-sm shrink-0 self-start sm:self-auto">
        {TABS.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`h-7 px-3 text-xs font-semibold rounded-sm transition-colors cursor-pointer select-none ${
                isActive
                  ? 'bg-(--accent-primary-bg) text-(--accent-blue-bright) shadow-xs'
                  : 'text-(--text-secondary) hover:text-(--text-primary)'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
