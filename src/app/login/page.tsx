'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Sun, Moon, Sparkles, Lock } from 'lucide-react';
import { EmailPasswordForm } from '@/components/auth/EmailPasswordForm';
import { GoogleOAuthButton } from '@/components/auth/GoogleOAuthButton';

export default function LoginPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(nextTheme);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 overflow-hidden bg-(--bg-app) text-(--text-primary) font-sans antialiased">
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] blur-[150px] pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(circle, #3178C6 0%, rgba(49, 120, 198, 0.25) 50%, transparent 80%)',
        }}
      />

      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-(--accent-primary-bg) border border-(--border-subtle) flex items-center justify-center p-1 rounded-xs">
            <Image
              src="/logo.png"
              alt="Job Radar"
              width={20}
              height={20}
              className="w-5 h-5 object-contain rounded-xs"
            />
          </div>
          <span className="font-bold text-base tracking-wider uppercase">JOB RADAR</span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 border border-(--border-subtle) bg-(--bg-surface) hover:bg-(--bg-surface-hover) transition-colors text-(--text-secondary) hover:text-(--text-primary) cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="border border-(--border-subtle) bg-(--bg-surface) p-7 shadow-2xl backdrop-blur-xl transition-all space-y-5">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] border border-(--border-subtle) bg-(--accent-primary-bg) text-(--accent-primary) mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Career Board & Job Tracker</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-(--text-primary)">
              Welcome back
            </h1>
            <p className="text-xs text-(--text-secondary)">
              Sign in to manage your high-speed pipeline and explore opportunities
            </p>
          </div>

          <EmailPasswordForm />

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-(--border-subtle)" />
            <span className="absolute px-2 bg-(--bg-surface) text-[10px] uppercase text-(--text-muted)">
              or
            </span>
          </div>

          <GoogleOAuthButton />

          <div className="flex items-center justify-center gap-1.5 text-[10px] text-(--text-muted) pt-2 border-t border-(--border-subtle)">
            <Lock className="w-3 h-3 text-(--accent-primary)" />
            <span>Open Access • Instant Sign In</span>
          </div>
        </div>
      </main>

      <footer className="relative z-10 w-full text-center text-[11px] text-(--text-muted) py-2 ">
        <span>JOB RADAR • CAREER SEARCH & TRACKING PLATFORM</span>
      </footer>
    </div>
  );
}
