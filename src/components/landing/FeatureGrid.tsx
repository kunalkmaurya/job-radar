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
              Built for momentum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
              A clearer way to run your search.
            </h2>
          </div>
          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="text-xs font-semibold text-(--accent-primary) hover:underline flex items-center gap-1.5"
          >
            <span>Open your workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">Gentle reminders</div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Bring applications that need attention back to the top before they go cold.
            </p>
          </div>

          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">
              Notes that stay useful
            </div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Keep recruiter details, interview prep, and context beside each opportunity.
            </p>
          </div>

          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">Your preferred view</div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Scan a focused list or move opportunities through a visual pipeline.
            </p>
          </div>

          <div className="border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) p-6 space-y-3 rounded-md shadow-xs transition-all">
            <div className="w-8 h-8 rounded-sm bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div className="font-semibold text-sm text-(--text-primary)">
              Save opportunities fast
            </div>
            <p className="text-xs text-(--text-secondary) leading-relaxed">
              Add a role from a link or save it while browsing, without breaking your flow.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
