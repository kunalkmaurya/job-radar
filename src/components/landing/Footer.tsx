'use client';

import React from 'react';
import Link from 'next/link';

export function Footer() {
  return (
    <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-app)] pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        {/* Top Grid: Brand & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Brand Identity Column */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] flex items-center justify-center p-1">
                <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wider uppercase">JOB RADAR</span>
                <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-widest">
                  AUTONOMOUS PIPELINE
                </span>
              </div>
            </Link>
            <p className="text-xs text-[var(--text-secondary)] max-w-sm leading-relaxed">
              Quietly capture job opportunities from Telegram channels, parse complex SPAs with headless AI, and curate your private pipeline.
            </p>
          </div>

          {/* Navigation Column 1: Product Navigation */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-[var(--text-primary)] uppercase tracking-wider font-semibold">
              Product
            </div>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              <li>
                <a href="#interactive-showcase" className="hover:text-[var(--accent-primary)] transition-colors">
                  Interactive Specimen
                </a>
              </li>
              <li>
                <a href="#architecture" className="hover:text-[var(--accent-primary)] transition-colors">
                  Architectural Intent
                </a>
              </li>
              <li>
                <a href="#comparison" className="hover:text-[var(--accent-primary)] transition-colors">
                  Paradigm Comparison
                </a>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--accent-primary)] transition-colors">
                  Ecosystem Features
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[var(--accent-primary)] transition-colors">
                  Inquiries & FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 2: Workspace Links */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-[var(--text-primary)] uppercase tracking-wider font-semibold">
              Workspace
            </div>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              <li>
                <Link href="/login" className="hover:text-[var(--accent-primary)] transition-colors">
                  Owner Sign In
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-[var(--accent-primary)] transition-colors">
                  Active Radar Console
                </Link>
              </li>
              <li>
                <a href="#features" className="hover:text-[var(--accent-primary)] transition-colors">
                  1-Click Bookmarklet
                </a>
              </li>
              <li>
                <a
                  href="https://t.me"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[var(--accent-primary)] transition-colors"
                >
                  Telegram Ingestion
                </a>
              </li>
            </ul>
          </div>

          {/* Navigation Column 3: Stack & Telemetry */}
          <div className="space-y-3">
            <div className="text-[11px] font-mono text-[var(--text-primary)] uppercase tracking-wider font-semibold">
              Architecture
            </div>
            <ul className="space-y-2 text-xs font-mono text-[var(--text-secondary)]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400" />
                <span>DeepSeek-V3 LLM</span>
              </li>
              <li>Neon PostgreSQL</li>
              <li>Jina Dual-Tier DOM</li>
              <li>Google OAuth Guard</li>
              <li>0 dB Silent Webhook</li>
            </ul>
          </div>
        </div>

        {/* Bottom Colophon Strip */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>© 2026 JOB RADAR</span>
            <span>•</span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-6 text-[11px]">
            <span>CRAFTED BY KUNAL MAURYA</span>
            <span className="hidden md:inline">•</span>
            <span className="text-[var(--accent-primary)]">v3.4 PRODUCTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
