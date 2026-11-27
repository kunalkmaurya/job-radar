'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Check } from 'lucide-react';

interface CtaSectionProps {
  isLoggedIn: boolean;
}

export function CtaSection({ isLoggedIn }: CtaSectionProps) {
  return (
    <section className="w-full px-6 py-28 border-t border-(--border-subtle) text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-(--accent-border) bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] text-[var(--ds-text-selected,#0C66E4)] text-xs font-semibold uppercase tracking-wider">
          <Check className="w-3.5 h-3.5" />
          <span>A better rhythm for your search</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-(--text-primary)">
          Give your next role the attention it deserves.
        </h2>

        <p className="text-sm sm:text-base text-(--text-secondary) max-w-lg mx-auto leading-relaxed">
          Stop switching between tabs, notes, and spreadsheets. Build a clear routine around the
          opportunities you want most.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="w-full sm:w-auto h-11 px-8 bg-(--accent-primary) hover:bg-(--accent-primary-hover) active:bg-(--accent-primary-active) text-(--accent-primary-text) font-semibold text-xs tracking-wider uppercase rounded-sm transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            <span>{isLoggedIn ? 'Go to dashboard' : 'Get started'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="#how-it-works"
            className="w-full sm:w-auto h-11 px-6 border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) text-xs font-semibold tracking-wider uppercase rounded-sm transition-colors flex items-center justify-center"
          >
            See the workflow
          </Link>
        </div>
      </div>
    </section>
  );
}
