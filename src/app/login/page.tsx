'use client';

import React, { useState, useEffect } from 'react';
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
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] font-sans antialiased">
      {/* Ambient Anthropic Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] blur-[150px] pointer-events-none opacity-25"
        style={{
          background:
            'radial-gradient(circle, #D96B43 0%, rgba(217, 107, 67, 0.25) 50%, transparent 80%)',
        }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] flex items-center justify-center p-1">
            <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase font-mono">JOB RADAR</span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-6">
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-7 shadow-2xl backdrop-blur-xl transition-all space-y-5">
          {/* Header & Tagline */}
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)] mb-1">
              <Sparkles className="w-3 h-3" />
              <span>Private Career Board</span>
            </div>
            <h1 className="text-2xl font-serif tracking-tight text-[var(--text-primary)]">
              Welcome back
            </h1>
            <p className="text-xs text-[var(--text-secondary)]">
              Sign in to manage your high-speed pipeline & Telegram ingestion
            </p>
          </div>

          {/* Email / Password Form */}
          <EmailPasswordForm />

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[var(--border-subtle)]" />
            <span className="absolute px-2 bg-[var(--bg-surface)] text-[10px] font-mono uppercase text-[var(--text-muted)]">
              or
            </span>
          </div>

          {/* Google OAuth Alternative */}
          <GoogleOAuthButton />

          {/* Security Footer */}
          <div className="flex items-center justify-center gap-1.5 text-[10px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
            <Lock className="w-3 h-3 text-[var(--accent-primary)]" />
            <span>Authorized Owner Whitelist Only</span>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center text-[11px] text-[var(--text-muted)] py-2 font-mono">
        <span>JOB RADAR • PRIVATE PIPELINE TELEMETRY</span>
      </footer>
    </div>
  );
}
