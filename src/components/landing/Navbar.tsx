'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sun, Moon, ArrowRight, ChevronRight } from 'lucide-react';

interface NavbarProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  isLoggedIn: boolean;
}

export function Navbar({ theme, onToggleTheme, isLoggedIn }: NavbarProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-(--border-subtle) bg-(--bg-app)/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 border border-(--border-subtle) bg-(--accent-primary-bg) flex items-center justify-center p-1 group-hover:border-(--accent-primary) transition-colors rounded-xs">
            <Image
              src="/logo.png"
              alt="Job Radar"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded-xs"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider uppercase">JOB RADAR</span>
            <span className="text-[10px] text-(--text-muted) tracking-widest">
              AUTONOMOUS PIPELINE
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider uppercase">
          <a
            href="#interactive-showcase"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            Specimen
          </a>
          <a
            href="#architecture"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            Architecture
          </a>
          <a
            href="#comparison"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            Comparison
          </a>
          <a
            href="#features"
            className="text-(--text-secondary) hover:text-(--accent-primary) transition-colors"
          >
            Ecosystem
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
            className="p-2 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) text-(--text-secondary) hover:text-(--text-primary) transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="flex items-center gap-2 px-4 py-2 bg-(--accent-primary) hover:bg-(--accent-primary-hover) text-white font-medium text-xs tracking-wider uppercase transition-all shadow-sm active:scale-[0.99]"
          >
            <span>{isLoggedIn ? 'Open Board' : 'Launch Console'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </header>
  );
}
