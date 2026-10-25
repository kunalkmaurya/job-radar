'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, ArrowRight } from 'lucide-react';

interface CtaSectionProps {
  isLoggedIn: boolean;
}

export function CtaSection({ isLoggedIn }: CtaSectionProps) {
  return (
    <section className="w-full px-6 py-28 border-t border-[var(--border-subtle)] text-center relative overflow-hidden">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] text-xs font-mono uppercase tracking-widest">
          <Lock className="w-3.5 h-3.5" />
          <span>Strict Owner Whitelist Guard</span>
        </div>

        <h2 className="text-4xl sm:text-6xl font-serif tracking-tight text-[var(--text-primary)]">
          A quiet sanctuary for your career.
        </h2>

        <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Stop losing links across fragmented chats and messy spreadsheets.
          Deploy your personal radar and take back control of your application pipeline.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="w-full sm:w-auto px-8 py-3.5 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-medium text-xs tracking-widest uppercase transition-all shadow-sm flex items-center justify-center gap-2"
          >
            <span>{isLoggedIn ? 'Go to Active Board' : 'Sign In with Google'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full sm:w-auto px-6 py-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-medium tracking-widest uppercase transition-colors"
          >
            Direct Console URL
          </Link>
        </div>
      </div>
    </section>
  );
}
