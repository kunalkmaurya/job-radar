'use client';

import React from 'react';

export function ComparisonMatrix() {
  return (
    <section id="comparison" className="w-full px-6 py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/30">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="max-w-2xl">
          <div className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-widest mb-1.5">
            The Paradigm Shift
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-[var(--text-primary)]">
            Why manual spreadsheets and generic bots fall short.
          </h2>
        </div>

        <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[var(--border-subtle)] bg-[var(--bg-app)] font-mono text-[var(--text-muted)]">
                <th className="py-3.5 px-6 font-semibold uppercase">Feature / Capability</th>
                <th className="py-3.5 px-6 font-semibold uppercase">Manual Spreadsheets</th>
                <th className="py-3.5 px-6 font-semibold uppercase">Generic Job Bots</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-[var(--accent-primary)] bg-[var(--accent-primary-bg)]">
                  Job Radar Sanctuary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border-subtle)] font-mono">
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-[var(--text-primary)]">
                  Ingestion Friction
                </td>
                <td className="py-4 px-6 text-[var(--text-muted)]">High (Manual copy/paste)</td>
                <td className="py-4 px-6 text-[var(--text-muted)]">Medium (Slash commands)</td>
                <td className="py-4 px-6 text-[var(--text-primary)] bg-[var(--accent-primary-bg)] font-bold">
                  Zero (1-tap Telegram forward)
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-[var(--text-primary)]">
                  Chat Channel Decibels
                </td>
                <td className="py-4 px-6 text-[var(--text-muted)]">N/A</td>
                <td className="py-4 px-6 text-red-400">High (Floods with cards & text)</td>
                <td className="py-4 px-6 text-emerald-400 bg-[var(--accent-primary-bg)] font-bold">
                  0 dB (Completely silent webhook)
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-[var(--text-primary)]">
                  Workday & SPA Parsing
                </td>
                <td className="py-4 px-6 text-[var(--text-muted)]">Manual reading</td>
                <td className="py-4 px-6 text-red-400">Fails on JS client hydration</td>
                <td className="py-4 px-6 text-[var(--text-primary)] bg-[var(--accent-primary-bg)] font-bold">
                  Dual-Tier Headless DOM Reader
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-[var(--text-primary)]">
                  Data Privacy & Whitelist
                </td>
                <td className="py-4 px-6 text-[var(--text-muted)]">Local or public drive link</td>
                <td className="py-4 px-6 text-red-400">Multi-tenant shared telemetry</td>
                <td className="py-4 px-6 text-[var(--text-primary)] bg-[var(--accent-primary-bg)] font-bold">
                  Strict Owner Google Whitelist
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-[var(--text-primary)]">
                  Follow-Up & Stale Alerts
                </td>
                <td className="py-4 px-6 text-[var(--text-muted)]">Easy to forget & lose track</td>
                <td className="py-4 px-6 text-[var(--text-muted)]">Rarely offered</td>
                <td className="py-4 px-6 text-emerald-400 bg-[var(--accent-primary-bg)] font-bold">
                  Automated &gt;7 day cadence chips
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
