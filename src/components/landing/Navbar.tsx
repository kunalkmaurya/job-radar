'use client';

import React from 'react';
import Link from 'next/link';
import { Sun, Moon, ArrowRight } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isLoggedIn: boolean;
}

export function Navbar({ theme, onToggleTheme, isLoggedIn }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] flex items-center justify-center p-1 group-hover:border-[var(--accent-primary)] transition-colors">
            <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider uppercase">JOB RADAR</span>
            <span className="text-[10px] text-[var(--text-muted)] font-mono tracking-widest">
              AUTONOMOUS PIPELINE
            </span>
          </div>
        </Link>

        {/* Center Real Navigation Links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider uppercase">
          <a
            href="#interactive-showcase"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Specimen
          </a>
          <a
            href="#architecture"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Architecture
          </a>
          <a
            href="#comparison"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Comparison
          </a>
          <a
            href="#features"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            Ecosystem
          </a>
          <a
            href="#faq"
            className="text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
          >
            FAQ
          </a>
        </nav>

        {/* Right Actions: Theme Toggle & Launch Console */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-primary)] hover:bg-[var(--accent-primary-hover)] text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm active:scale-[0.99]"
          >
            <span>{isLoggedIn ? 'Open Board' : 'Launch Console'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
