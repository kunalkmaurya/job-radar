'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQS = [
  {
    q: 'How does Telegram ingestion work without making any noise?',
    a: 'Traditional Telegram bots post confirmation cards, typing animations, or celebratory stickers whenever you interact with them. Job Radar is strictly zero-decibel: it receives your private channel webhook payload asynchronously, processes the URL headless in the background, updates your database, and remains completely silent. Your channel stays 100% quiet.',
  },
  {
    q: 'Can it parse complex Single-Page Apps (Workday, Greenhouse, Lever)?',
    a: 'Yes. Modern enterprise portals build their job descriptions dynamically via JavaScript after page load, causing naive HTTP requests to receive blank templates. Job Radar employs a dual-tier strategy: fast DOM inspection backed by headless Chromium execution (via Jina reader and Puppeteer fallbacks) to ensure full DOM hydration before DeepSeek extraction.',
  },
  {
    q: 'How is my career data protected?',
    a: 'Job Radar is engineered as a single-user personal sanctuary. Authentication enforces a strict server-side email whitelist (only your authorized Google account can issue sessions). All job URLs, recruiter contacts, and salary records reside in your isolated Neon PostgreSQL serverless database with zero telemetry sharing.',
  },
  {
    q: 'What happens when I find a job on desktop instead of Telegram?',
    a: 'We provide a zero-install 1-click browser bookmarklet. Drag it once into your browser bookmarks bar. Whenever you are reading a job opening on LinkedIn, Ashby, or Workday, click the bookmarklet to push the URL directly into your pipeline with zero context switching.',
  },
];

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section id="faq" className="w-full px-6 py-24 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
      <div className="max-w-3xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <div className="text-xs font-mono text-[var(--accent-primary)] uppercase tracking-widest">
            Clarity & Specifications
          </div>
          <h2 className="text-3xl sm:text-4xl font-serif tracking-tight text-[var(--text-primary)]">
            Frequently Answered Inquiries
          </h2>
        </div>

        <div className="divide-y divide-[var(--border-subtle)] border border-[var(--border-subtle)] bg-[var(--bg-surface)]">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="transition-colors">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[var(--bg-surface-hover)]"
              >
                <span className="font-medium text-sm text-[var(--text-primary)]">{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-[var(--text-muted)] shrink-0 transition-transform ${
                    openFaq === idx ? 'rotate-180 text-[var(--accent-primary)]' : ''
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 pb-5 pt-1 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-subtle)]/50">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
