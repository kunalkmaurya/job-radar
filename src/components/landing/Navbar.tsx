'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, ChevronRight } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isLoggedIn: boolean;
}

export function Navbar({ theme, onToggleTheme, isLoggedIn }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border-subtle) bg-(--bg-surface)/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-(--accent-border) bg-(--accent-primary-bg) flex items-center justify-center p-1 rounded-sm transition-colors">
            <Image
              src="/logo.png"
              alt="Job Radar"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded-sm"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-xs tracking-wider uppercase text-(--text-primary)">
              JOB RADAR
            </span>
            <span className="text-[10px] text-(--text-muted) tracking-widest font-semibold">
              YOUR JOB SEARCH, ORGANIZED
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-semibold tracking-wider uppercase">
          <a
            href="#how-it-works"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            Workflow
          </a>
          <a
            href="#how-it-works"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            How it works
          </a>
          <a
            href="#features"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            Features
          </a>
          <a
            href="#faq"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            FAQ
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="h-8 w-8 inline-flex items-center justify-center border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) hover:border-(--border-strong) text-(--text-secondary) hover:text-(--text-primary) rounded-sm transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="h-8 inline-flex items-center gap-2 px-3.5 bg-(--accent-primary) hover:bg-(--accent-primary-hover) active:bg-(--accent-primary-active) text-(--accent-primary-text) font-semibold text-xs tracking-wider uppercase rounded-sm transition-colors shadow-xs"
          >
            <span>{isLoggedIn ? 'Open dashboard' : 'Get started'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
