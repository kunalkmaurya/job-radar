'use client';

import React from 'react';

export function ArchitecturalPillars() {
  return (
    <section id="architecture" className="w-full px-6 py-28 border-t border-[var(--border-subtle)]">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-widest mb-2">
            Architectural Intent
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif tracking-tight text-[var(--text-primary)]">
            Designed around respect for your attention.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 space-y-4">
            <div className="w-8 h-8 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-xs">
              01
            </div>
            <h3 className="text-lg font-serif tracking-tight text-[var(--text-primary)]">
              Zero-Spam Silent Ingestion
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
              Most bot implementations flood your channel with celebratory replies or confirmation
              cards. Job Radar never sends a single message. It consumes the webhook in the
              background and stays completely silent.
            </p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 space-y-4">
            <div className="w-8 h-8 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-xs">
              02
            </div>
            <h3 className="text-lg font-serif tracking-tight text-[var(--text-primary)]">
              Headless SPA Decryption
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
              Workday, Greenhouse, Lever, and Ashby portals require client-side execution that
              breaks elementary scrapers. Our universal dual-tier engine renders the DOM
              effortlessly before extraction.
            </p>
          </div>

          <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 space-y-4">
            <div className="w-8 h-8 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] flex items-center justify-center font-mono font-bold text-xs">
              03
            </div>
            <h3 className="text-lg font-serif tracking-tight text-[var(--text-primary)]">
              Single-User Sanctuary
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-normal">
              Your application pipeline is confidential. There are no multi-tenant shared tables or
              public data feeds. A strict whitelist guards your session, writing directly to your
              private Neon PostgreSQL database.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
