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
      <div className="inline-flex items-center gap-2 px-3 py-1 border border-(--border-subtle) bg-(--accent-primary-bg) text-(--accent-primary) text-xs font-mono uppercase tracking-widest mb-8">
        <Sparkles className="w-3 h-3" />
        <span>Single-User Career Telemetry</span>
      </div>

      <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif tracking-tight font-normal leading-[1.08] max-w-4xl mx-auto text-(--text-primary)">
        The quiet command center <br className="hidden sm:inline" />
        for your <span className="italic font-normal text-(--accent-primary)">next ambition</span>.
      </h1>

      <p className="mt-8 text-base sm:text-lg md:text-xl text-(--text-secondary) max-w-2xl mx-auto font-normal leading-relaxed">
        Forward raw job URLs from your phone into a private Telegram channel. Job Radar silently
        parses complex JavaScript portals with AI—cataloging your pipeline on a serene,
        distraction-free board.
      </p>

      <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
        <Link
          href={isLoggedIn ? '/dashboard' : '/login'}
          className="w-full sm:w-auto px-8 py-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white font-medium text-xs tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <span>{isLoggedIn ? 'Return to Active Board' : 'Access Private Console'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <a
          href="#interactive-showcase"
          className="w-full sm:w-auto px-6 py-3.5 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-primary) font-medium text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2"
        >
          <span>Explore Live Specimen</span>
          <ChevronRight className="w-4 h-4 text-(--text-muted)" />
        </a>
      </div>

      <div className="mt-16 pt-8 border-t border-(--border-subtle) grid grid-cols-2 md:grid-cols-4 gap-6 text-left">
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-(--text-muted) uppercase tracking-wider">
            Channel Noise
          </div>
          <div className="text-xl font-serif text-(--text-primary)">0 dB Decibels</div>
          <div className="text-xs text-(--text-secondary)">Silent webhook ingestion</div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-(--text-muted) uppercase tracking-wider">
            Reasoning Engine
          </div>
          <div className="text-xl font-serif text-(--text-primary)">DeepSeek-V3</div>
          <div className="text-xs text-(--text-secondary)">Dual-tier headless parsing</div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-(--text-muted) uppercase tracking-wider">
            Storage Engine
          </div>
          <div className="text-xl font-serif text-(--text-primary)">Neon Serverless</div>
          <div className="text-xs text-(--text-secondary)">PostgreSQL & Drizzle ORM</div>
        </div>
        <div className="space-y-1">
          <div className="text-[11px] font-mono text-(--text-muted) uppercase tracking-wider">
            Privacy Guard
          </div>
          <div className="text-xl font-serif text-(--text-primary)">Strict Whitelist</div>
          <div className="text-xs text-(--text-secondary)">Owner Google OAuth only</div>
        </div>
      </div>
    </section>
  );
}
