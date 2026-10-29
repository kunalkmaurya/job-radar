'use client';

import React from 'react';
import { SpecimenTab, ShowcaseItem } from './types';

interface SpecimenHeaderProps {
  selectedItem: ShowcaseItem;
  activeTab: SpecimenTab;
  onSelectTab: (tab: SpecimenTab) => void;
}

export function SpecimenHeader({ selectedItem, activeTab, onSelectTab }: SpecimenHeaderProps) {
  return (
    <div className="px-6 py-3.5 border-b border-(--border-subtle) bg-(--bg-app)/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs ">
      <div className="flex items-center gap-2 text-(--text-muted)">
        <span className="w-2.5 h-2.5 bg-(--border-subtle)" />
        <span className="w-2.5 h-2.5 bg-(--border-subtle)" />
        <span className="w-2.5 h-2.5 bg-(--border-subtle)" />
        <span className="ml-2 text-(--text-secondary) font-semibold truncate">
          pipeline://stream/{selectedItem.company.toLowerCase()}
        </span>
      </div>

      {/* View Perspective Tabs */}
      <div className="flex items-center gap-1 border border-(--border-subtle) bg-(--bg-app) p-1 rounded-xs">
        <button
          onClick={() => onSelectTab('board')}
          className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
            activeTab === 'board'
              ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
              : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-muted) hover:text-(--text-secondary)'
          }`}
        >
          Board Card
        </button>
        <button
          onClick={() => onSelectTab('extraction')}
          className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
            activeTab === 'extraction'
              ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
              : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-muted) hover:text-(--text-secondary)'
          }`}
        >
          DeepSeek Schema
        </button>
        <button
          onClick={() => onSelectTab('telegram')}
          className={`px-3 py-1 text-xs font-medium transition-colors cursor-pointer border rounded-xs ${
            activeTab === 'telegram'
              ? 'border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright) font-semibold shadow-xs'
              : 'border-(--border-subtle) bg-(--bg-surface) text-(--text-muted) hover:text-(--text-secondary)'
          }`}
        >
          Telegram Ingest
        </button>
      </div>
    </div>
  );
}
