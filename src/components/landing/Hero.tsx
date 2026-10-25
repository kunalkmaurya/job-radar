'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ChevronRight } from 'lucide-react';

interface HeroProps {
  isLoggedIn: boolean;
}

export function Hero({ isLoggedIn }: HeroProps) {
  return (
    <section className="relative z-10 w-full max-w-5xl mx-auto px-6 pt-20 pb-16 md:pt-28 md:pb-24 text-center">
      {/* Architectural Tagline Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] text-xs font-mono uppercase tracking-widest mb-8">
        <Sparkles className="w-3 h-3" />
        <span>Single-User Career Telemetry</span>
      </div>

      {/* Anthropic Literary Serif Headline */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight font-normal leading-[1.08] max-w-4xl mx-auto text-[var(--text-primary)]">
        The quiet command center <br className="hidden sm:inline" />
        for your <span className="italic font-normal text-[var(--accent-primary)]">next ambition</span>.
      </h1>

      {/* Editorial Subcopy */}
      <p className="mt-8 text-base sm:text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto font-normal leading-relaxed">
        Forward raw job URLs from your phone into a private Telegram channel.
        Job Radar silently parses complex JavaScript portals with AI—cataloging your pipeline
        on a serene, distraction-free board.
      </p>

      {/* Hero Actions */}
      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="w-full sm:w-auto px-8 py-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-medium text-xs tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>{isLoggedIn ? 'Return to Active Board' : 'Access Private Console'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="#interactive-showcase"
          className="w-full sm:w-auto px-6 py-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-medium text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
        >
          <span>Explore Live Specimen</span>
          <ChevronRight className="w-4 h-4 text-[var(--text-muted)]" />
        </a>
      </div>

      {/* Architectural Metric Strip */}
      <div className="mt-16 pt-8 border-t border-[var(--border-subtle)] grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Channel Noise
          </div>
          <div className="text-xl font-serif text-[var(--text-primary)]">0 dB Decibels</div>
          <div className="text-xs text-[var(--text-secondary)]">Silent webhook ingestion</div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Reasoning Engine
          </div>
          <div className="text-xl font-serif text-[var(--text-primary)]">DeepSeek-V3</div>
          <div className="text-xs text-[var(--text-secondary)]">Dual-tier headless parsing</div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Storage Engine
          </div>
          <div className="text-xl font-serif text-[var(--text-primary)]">Neon Serverless</div>
          <div className="text-xs text-[var(--text-secondary)]">PostgreSQL & Drizzle ORM</div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
            Privacy Guard
          </div>
          <div className="text-xl font-serif text-[var(--text-primary)]">Strict Whitelist</div>
          <div className="text-xs text-[var(--text-secondary)]">Owner Google OAuth only</div>
        </div>
      </div>
    </section>
  );
}
