'use client';

import React from 'react';
import { SpecimenTab, ShowcaseItem } from './types';

interface SpecimenHeaderProps {
  selectedItem: ShowcaseItem;
  activeTab: SpecimenTab;
  onSelectTab: (tab: SpecimenTab) => void;
}

export function SpecimenHeader({
  selectedItem,
  activeTab,
  onSelectTab,
}: SpecimenHeaderProps) {
  return (
    <div className="px-6 py-3.5 border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
      <div className="flex items-center gap-2 text-[var(--text-muted)]">
        <span className="w-2.5 h-2.5 bg-[var(--border-subtle)]" />
        <span className="w-2.5 h-2.5 bg-[var(--border-subtle)]" />
        <span className="w-2.5 h-2.5 bg-[var(--border-subtle)]" />
        <span className="ml-2 text-[var(--text-secondary)] font-semibold truncate">
          pipeline://stream/{selectedItem.company.toLowerCase()}
        </span>
      </div>

      {/* View Perspective Tabs */}
      <div className="flex items-center gap-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-0.5">
        <button
          onClick={() => onSelectTab('board')}
          className={`px-3 py-1 transition-colors cursor-pointer ${
            activeTab === 'board'
              ? 'bg-[var(--accent-primary)] text-white font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Board Card
        </button>
        <button
          onClick={() => onSelectTab('extraction')}
          className={`px-3 py-1 transition-colors cursor-pointer ${
            activeTab === 'extraction'
              ? 'bg-[var(--accent-primary)] text-white font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          DeepSeek Schema
        </button>
        <button
          onClick={() => onSelectTab('telegram')}
          className={`px-3 py-1 transition-colors cursor-pointer ${
            activeTab === 'telegram'
              ? 'bg-[var(--accent-primary)] text-white font-semibold'
              : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
          }`}
        >
          Telegram Ingest
        </button>
      </div>
    </div>
  );
}
