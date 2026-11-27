'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ChevronDown, CircleHelp, MessageCircle } from 'lucide-react';

export const FAQS = [
  {
    q: 'What can I keep track of?',
    a: 'Save job links, track each application stage, set follow-up dates, mark priorities, and keep notes and referral details with the opportunity they belong to.',
  },
  {
    q: 'How do I add a job?',
    a: 'Add a role manually, paste a job link, save it from your browser, or forward an opportunity from your phone. Job Radar helps you turn it into a useful pipeline entry.',
  },
  {
    q: 'Is this private?',
    a: 'Yes. Your workspace is designed to keep your applications, notes, contacts, and search activity personal to you.',
  },
  {
    q: 'Can I work with others?',
    a: 'You can share promising openings with a small job-search pod while keeping your personal application pipeline separate.',
  },
];

export function FaqAccordion() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <section
      id="faq"
      className="w-full px-6 py-24 border-t border-(--border-subtle) relative overflow-hidden"
    >
      <div className="absolute w-96 h-96 -top-36 -right-32 rounded-full bg-(--accent-primary-bg)/70 blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-10 lg:gap-20 relative">
        <div className="lg:pt-4">
          <div className="w-10 h-10 rounded-md bg-(--accent-primary-bg) border border-(--accent-border) text-(--accent-primary) flex items-center justify-center">
            <CircleHelp className="w-5 h-5" />
          </div>
          <p className="mt-6 text-xs text-(--accent-primary) uppercase tracking-widest font-semibold">
            Questions answered
          </p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight leading-tight text-(--text-primary)">
            Feel clear before you get started.
          </h2>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-(--text-secondary)">
            Everything you need to make your job search feel organized, private, and easier to move
            through.
          </p>
          <div className="mt-8 inline-flex items-center gap-2 text-xs font-semibold text-(--text-secondary)">
            <MessageCircle className="w-4 h-4 text-(--accent-primary)" />
            Built around your real search routine
          </div>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => (
            <div
              key={faq.q}
              className={`rounded-md border transition-all duration-200 ${
                openFaq === idx
                  ? 'border-(--accent-border) bg-(--accent-primary-bg)/35 shadow-lg shadow-blue-950/10'
                  : 'border-(--border-subtle) bg-(--bg-surface)/80 hover:border-(--border-strong) hover:bg-(--bg-surface)'
              }`}
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                aria-expanded={openFaq === idx}
                className="w-full p-5 sm:p-6 text-left flex items-center gap-4 cursor-pointer"
              >
                <span className="w-8 h-8 shrink-0 rounded-sm border border-(--border-subtle) bg-(--bg-app) text-[11px] font-bold text-(--accent-primary) flex items-center justify-center">
                  0{idx + 1}
                </span>
                <span className="flex-1 font-semibold text-sm sm:text-base text-(--text-primary)">
                  {faq.q}
                </span>
                <ChevronDown
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180 text-(--accent-primary)' : 'text-(--text-muted)'
                  }`}
                />
              </button>
              {openFaq === idx && (
                <div className="px-5 sm:px-6 pb-6 ml-12 sm:ml-14 text-sm text-(--text-secondary) leading-relaxed">
                  <div className="pt-1 border-t border-(--accent-border)/60">
                    <p className="pt-4">{faq.a}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          <div className="pt-2 flex items-center justify-between gap-4 text-xs text-(--text-muted)">
            <span>Ready when you are.</span>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-1 text-(--accent-primary) font-semibold hover:underline"
            >
              See how it works
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
