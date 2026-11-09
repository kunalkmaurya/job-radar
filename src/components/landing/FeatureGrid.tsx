'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, FileText, Layers, Compass, ArrowRight } from 'lucide-react';

interface FeatureGridProps {
  isLoggedIn: boolean;
}

export function FeatureGrid({ isLoggedIn }: FeatureGridProps) {
  return (
    <section id="features" className="w-full px-6 py-24 border-t border-(--border-subtle)">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center px-2 py-0.5 rounded-sm text-[11px] font-semibold tracking-wider uppercase bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] border border-(--accent-border) mb-2">
              Ecosystem
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
              Every detail engineered for momentum.
            </h2>
          </div>
          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="text-xs font-semibold text-(--accent-primary) hover:underline flex items-center gap-1.5"
          >
            <span>Launch workspace console</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">Stale Alerts</div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Applications inactive for more than 7 days automatically surface with follow-up
              nudges.
            </p>
          </div>

          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">Slide-Over Scratchpad</div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Jot recruiter contacts, interview talking points, and target compensation right inside
              the drawer.
            </p>
          </div>

          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">Dual View Modes</div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Toggle seamlessly between an ultra-dense enterprise list and an intuitive Kanban
              board.
            </p>
          </div>

          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">1-Click Bookmarklet</div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Browse on desktop? Drag our bookmarklet to your browser bar to save jobs directly from
              LinkedIn.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
