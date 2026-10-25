'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Sun, Moon, Sparkles, Send, BarChart3, Lock } from 'lucide-react';

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

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between p-6 overflow-hidden bg-[var(--bg-app)] text-[var(--text-primary)] font-sans antialiased">
      {/* Warm Ambient Anthropic Light Glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] blur-[150px] pointer-events-none opacity-30"
        style={{ background: 'radial-gradient(circle, #D96B43 0%, rgba(217, 107, 67, 0.25) 50%, transparent 80%)' }}
      />

      {/* Top Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-[var(--accent-primary-bg)] border border-[var(--border-subtle)] flex items-center justify-center p-1">
            <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-bold text-base tracking-wider uppercase">JOB RADAR</span>
        </div>

        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] transition-colors text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>

      {/* Main Center Card */}
      <main className="relative z-10 w-full max-w-md mx-auto my-auto py-8">
        <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-8 shadow-2xl backdrop-blur-xl transition-all space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] text-[var(--accent-primary)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Private Career Workspace</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-3xl font-serif tracking-tight text-[var(--text-primary)] mb-2">
              Welcome back
            </h1>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Quietly capture job links from Telegram, extract details with AI, and manage your private career board.
            </p>
          </div>

          {/* Feature Highlights */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <div className="w-6 h-6 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                <Sparkles className="w-3 h-3" />
              </div>
              <span>Headless AI extraction across Workday, Lever & Greenhouse</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <div className="w-6 h-6 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                <Send className="w-3 h-3" />
              </div>
              <span>100% silent ingestion (Zero bot chat or noise)</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
              <div className="w-6 h-6 border border-[var(--border-subtle)] bg-[var(--accent-primary-bg)] flex items-center justify-center text-[var(--accent-primary)] shrink-0">
                <BarChart3 className="w-3 h-3" />
              </div>
              <span>Funnel metrics, stale application alerts & 1-click apply</span>
            </div>
          </div>

          {/* Google OAuth Login Button */}
          <div className="pt-2">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-[var(--text-primary)] text-[var(--bg-app)] font-medium text-xs uppercase tracking-wider hover:opacity-90 active:scale-[0.99] transition-all cursor-pointer shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continue with Google</span>
            </button>
          </div>

          {/* Security Note */}
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
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
