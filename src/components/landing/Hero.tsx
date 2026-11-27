'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';

interface HeroProps {
  isLoggedIn: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 pb-12 md:pt-28 md:pb-14 text-center">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-(--accent-border) bg-(--accent-primary-bg)/80 text-(--accent-blue-bright) text-[11px] font-semibold uppercase tracking-[0.14em] rounded-full mb-7 shadow-sm">
        <Check className="w-3.5 h-3.5" />
        <span>Stay focused on the roles that matter</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-[-0.055em] leading-[0.98] max-w-4xl mx-auto text-(--text-primary)">
        A job search that feels <br className="hidden sm:inline" />
        <span className="text-(--accent-primary)">less scattered, more strategic.</span>
      </h1>

      <p className="mt-6 text-base sm:text-lg text-(--text-secondary) max-w-2xl mx-auto font-normal leading-relaxed">
        Save every opportunity, see what needs attention, and move forward with a plan instead of a
        pile of tabs.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="w-full sm:w-auto h-11 px-8 bg-(--accent-primary) hover:bg-(--accent-primary-hover) active:bg-(--accent-primary-active) text-(--accent-primary-text) font-semibold text-xs tracking-wider uppercase rounded-sm transition-all shadow-lg shadow-blue-500/20 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus) flex items-center justify-center gap-2"
        >
          <span>{isLoggedIn ? 'Return to dashboard' : 'Organize your search'}</span>
          <ChevronRight className="w-4 h-4" />
        </Link>

        <a
          href="#how-it-works"
          className="w-full sm:w-auto h-11 px-6 border border-(--border-subtle) hover:border-(--border-strong) bg-(--bg-surface)/60 hover:bg-(--bg-surface-hover) text-(--text-primary) font-semibold text-xs tracking-wider uppercase rounded-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--border-focus) flex items-center justify-center gap-2"
        >
          <span>See how it feels</span>
          <ChevronRight className="w-4 h-4 text-(--text-muted)" />
        </a>
      </div>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-medium text-(--text-muted)">
        <span>Keep every role in one place</span>
        <span className="hidden sm:block w-1 h-1 rounded-full bg-(--accent-primary)" />
        <span>Follow up with confidence</span>
        <span className="hidden sm:block w-1 h-1 rounded-full bg-(--accent-primary)" />
        <span>Your search stays personal</span>
      </div>
    </section>
  );
}
