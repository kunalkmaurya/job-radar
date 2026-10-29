'use client';

import React from 'react';

export function ComparisonMatrix() {
  return (
    <section
      id="comparison"
      className="w-full px-6 py-24 border-t border-(--border-subtle) bg-(--bg-surface)/30"
    >
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="max-w-2xl">
          <div className="text-xs text-(--accent-primary) uppercase tracking-widest mb-1.5">
            The Paradigm Shift
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-(--text-primary)">
            Why manual spreadsheets and generic bots fall short.
          </h2>
        </div>

        <div className="border border-(--border-subtle) bg-(--bg-surface) overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-(--border-subtle) bg-(--bg-app) text-(--text-muted)">
                <th className="py-3.5 px-6 font-semibold uppercase">Feature / Capability</th>
                <th className="py-3.5 px-6 font-semibold uppercase">Manual Spreadsheets</th>
                <th className="py-3.5 px-6 font-semibold uppercase">Generic Job Bots</th>
                <th className="py-3.5 px-6 font-semibold uppercase text-(--accent-primary) bg-(--accent-primary-bg)">
                  Job Radar Sanctuary
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-(--border-subtle) ">
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-(--text-primary)">
                  Ingestion Friction
                </td>
                <td className="py-4 px-6 text-(--text-muted)">High (Manual copy/paste)</td>
                <td className="py-4 px-6 text-(--text-muted)">Medium (Slash commands)</td>
                <td className="py-4 px-6 text-(--text-primary) bg-(--accent-primary-bg) font-bold">
                  Zero (1-tap Telegram forward)
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-(--text-primary)">
                  Chat Channel Decibels
                </td>
                <td className="py-4 px-6 text-(--text-muted)">N/A</td>
                <td className="py-4 px-6 text-red-400">High (Floods with cards & text)</td>
                <td className="py-4 px-6 text-emerald-400 bg-(--accent-primary-bg) font-bold">
                  0 dB (Completely silent webhook)
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-(--text-primary)">
                  Workday & SPA Parsing
                </td>
                <td className="py-4 px-6 text-(--text-muted)">Manual reading</td>
                <td className="py-4 px-6 text-red-400">Fails on JS client hydration</td>
                <td className="py-4 px-6 text-(--text-primary) bg-(--accent-primary-bg) font-bold">
                  Dual-Tier Headless DOM Reader
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-(--text-primary)">
                  Data Privacy & Whitelist
                </td>
                <td className="py-4 px-6 text-(--text-muted)">Local or public drive link</td>
                <td className="py-4 px-6 text-red-400">Multi-tenant shared telemetry</td>
                <td className="py-4 px-6 text-(--text-primary) bg-(--accent-primary-bg) font-bold">
                  Strict Owner Google Whitelist
                </td>
              </tr>
              <tr>
                <td className="py-4 px-6 font-sans font-semibold text-(--text-primary)">
                  Follow-Up & Stale Alerts
                </td>
                <td className="py-4 px-6 text-(--text-muted)">Easy to forget & lose track</td>
                <td className="py-4 px-6 text-(--text-muted)">Rarely offered</td>
                <td className="py-4 px-6 text-emerald-400 bg-(--accent-primary-bg) font-bold">
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
