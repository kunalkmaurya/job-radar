'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCT_LINKS, WORKSPACE_LINKS } from './footerData';

export function Footer() {
  return (
    <footer className="w-full border-t border-(--border-subtle) bg-(--bg-app) pt-16 pb-12">
      <div className="max-w-6xl mx-auto px-6 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 border border-(--border-subtle) bg-[var(--ds-background-selected,#E9F2FF)] dark:bg-[var(--ds-background-selected,#1C2B41)] flex items-center justify-center p-1 rounded-sm">
                <Image
                  src="/logo.png"
                  alt="Job Radar"
                  width={20}
                  height={20}
                  className="w-5 h-5 object-contain rounded-[2px]"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-sm tracking-wider uppercase">JOB RADAR</span>
                <span className="text-[10px] text-(--text-muted) tracking-widest">
                  YOUR JOB SEARCH, ORGANIZED
                </span>
              </div>
            </Link>
            <p className="text-xs text-(--text-secondary) max-w-sm leading-relaxed">
              A focused workspace for finding, tracking, and following through on your next role.
            </p>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] text-(--text-primary) uppercase tracking-wider font-semibold">
              Product
            </div>
            <ul className="space-y-2 text-xs text-(--text-secondary)">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="hover:text-(--accent-primary) transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="text-[11px] text-(--text-primary) uppercase tracking-wider font-semibold">
              Workspace
            </div>
            <ul className="space-y-2 text-xs text-(--text-secondary)">
              {WORKSPACE_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="hover:text-(--accent-primary) transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-(--border-subtle) flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-(--text-muted)">
          <div className="flex items-center gap-2">
            <span>© 2026 JOB RADAR</span>
            <span> | </span>
            <span>ALL RIGHTS RESERVED</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span>MADE FOR FOCUSED JOB SEEKERS</span>
            <span className="hidden md:inline"> | </span>
            <span className="text-(--accent-primary)">PRODUCTION</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
