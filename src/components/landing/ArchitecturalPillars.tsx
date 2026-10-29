'use client';

import React from 'react';

export function ArchitecturalPillars() {
  return (
    <section id="architecture" className="w-full px-6 py-28 border-t border-(--border-subtle)">
      <div className="max-w-5xl mx-auto space-y-16">
        <div className="max-w-2xl">
          <div className="text-xs text-(--accent-primary) uppercase tracking-widest mb-2">
            Architectural Intent
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
            Designed around respect for your attention.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-(--border-subtle) bg-(--bg-surface) p-8 space-y-4">
            <div className="w-8 h-8 border border-(--border-subtle) bg-(--accent-primary-bg) text-(--accent-primary) flex items-center justify-center font-bold text-xs">
              01
            </div>
            <h3 className="text-base font-semibold tracking-tight text-(--text-primary)">
              Zero-Spam Silent Ingestion
            </h3>
            <p className="text-xs text-(--text-secondary) leading-relaxed font-normal">
              Most bot implementations flood your channel with celebratory replies or confirmation
              cards. Job Radar never sends a single message. It consumes the webhook in the
              background and stays completely silent.
            </p>
          </div>

          <div className="border border-(--border-subtle) bg-(--bg-surface) p-8 space-y-4">
            <div className="w-8 h-8 border border-(--border-subtle) bg-(--accent-primary-bg) text-(--accent-primary) flex items-center justify-center font-bold text-xs">
              02
            </div>
            <h3 className="text-base font-semibold tracking-tight text-(--text-primary)">
              Headless SPA Decryption
            </h3>
            <p className="text-xs text-(--text-secondary) leading-relaxed font-normal">
              Workday, Greenhouse, Lever, and Ashby portals require client-side execution that
              breaks elementary scrapers. Our universal dual-tier engine renders the DOM
              effortlessly before extraction.
            </p>
          </div>

          <div className="border border-(--border-subtle) bg-(--bg-surface) p-8 space-y-4">
            <div className="w-8 h-8 border border-(--border-subtle) bg-(--accent-primary-bg) text-(--accent-primary) flex items-center justify-center font-bold text-xs">
              03
            </div>
            <h3 className="text-base font-semibold tracking-tight text-(--text-primary)">
              Single-User Sanctuary
            </h3>
            <p className="text-xs text-(--text-secondary) leading-relaxed font-normal">
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
