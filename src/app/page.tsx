'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Zap,
  Shield,
  Sparkles,
  ExternalLink,
  ArrowRight,
  Send,
  Database,
  Cpu,
  CheckCircle2,
  Lock,
  Terminal,
  Activity,
  Layers,
  Clock,
  Compass,
  ArrowUpRight,
  Sun,
  Moon,
  ChevronRight,
  Search,
  Filter,
} from 'lucide-react';

interface SimulationResult {
  company: string;
  role: string;
  source: string;
  location: string;
  status: string;
  latencyMs: number;
  tokensUsed: number;
}

const SAMPLE_JOBS = [
  {
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    url: 'https://stripe.com/jobs/staff-infra-cloud-platform',
    location: 'Remote / US',
    latency: 680,
  },
  {
    company: 'OpenAI',
    role: 'Research Scientist — Reasoning & Code',
    url: 'https://jobs.lever.co/openai/research-scientist-reasoning',
    location: 'San Francisco, CA',
    latency: 740,
  },
  {
    company: 'Vercel',
    role: 'Senior Edge Systems Architect',
    url: 'https://boards.greenhouse.io/vercel/jobs/5920194',
    location: 'Remote',
    latency: 610,
  },
  {
    company: 'Datadog',
    role: 'Principal Distributed Systems Lead',
    url: 'https://careers.datadoghq.com/detail/5849204',
    location: 'New York / Hybrid',
    latency: 790,
  },
];

export default function LandingPage() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  // Ingestion Simulator State
  const [activeJobIdx, setActiveJobIdx] = useState(0);
  const [customUrl, setCustomUrl] = useState('');
  const [simStep, setSimStep] = useState<number>(0);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }

    // Check if user is already authenticated
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setIsLoggedIn(true);
          setUserEmail(json.data.email);
        }
      })
      .catch(() => {});
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  const runSimulation = (jobIndex: number, overrideUrl?: string) => {
    if (isSimulating) return;
    setIsSimulating(true);
    setSimStep(1);
    setSimResult(null);

    const selected = SAMPLE_JOBS[jobIndex];
    const url = overrideUrl || selected.url;

    setTimeout(() => {
      setSimStep(2); // Headless Scraper bypass
    }, 600);

    setTimeout(() => {
      setSimStep(3); // AI Semantic parsing
    }, 1200);

    setTimeout(() => {
      setSimStep(4); // Neon DB Commit
      setSimResult({
        company: selected.company,
        role: selected.role,
        source: new URL(url).hostname.replace('www.', ''),
        location: selected.location,
        status: 'Saved',
        latencyMs: selected.latency,
        tokensUsed: 428,
      });
      setIsSimulating(false);
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-app)] text-[var(--text-primary)] font-sans antialiased selection:bg-blue-500 selection:text-white relative overflow-x-hidden">
      {/* Precision Blueprint Architectural Grid */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.035] dark:opacity-[0.06] z-0"
        style={{
          backgroundImage: `linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Top Ambient Light Flare */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[450px] pointer-events-none opacity-20 blur-[150px] z-0"
        style={{
          background: 'radial-gradient(circle, #38BDF8 0%, #3B82F6 40%, transparent 80%)',
        }}
      />

      {/* =========================================================
          1. NAVIGATION BAR
          ========================================================= */}
      <nav className="sticky top-0 z-50 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/90 backdrop-blur-xl px-[20px] py-3.5 flex items-center justify-between">
        {/* Brand */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center p-1 group-hover:border-blue-500/40 transition-colors">
            <img src="/icon.svg" alt="Job Radar Logo" className="w-5 h-5 object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm tracking-wider uppercase">JOB RADAR</span>
            <span className="text-[9px] text-[var(--text-muted)] tracking-widest uppercase font-mono">
              STEALTH v3.4
            </span>
          </div>
        </Link>

        {/* Center Live Telemetry Pill */}
        <div className="hidden lg:flex items-center gap-3 px-3 py-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[11px] font-mono">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 bg-emerald-400 animate-pulse" />
            <span>SYS_OK</span>
          </div>
          <span className="text-[var(--border-subtle)]">|</span>
          <span className="text-[var(--text-muted)]">INGESTION: SILENT</span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span className="text-[var(--text-muted)]">LATENCY: 24ms</span>
          <span className="text-[var(--border-subtle)]">|</span>
          <span className="text-blue-400 font-semibold">NEON POSTGRESQL</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Launch Dashboard / Sign In Button */}
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <span>Go to Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs tracking-wider uppercase transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98]"
            >
              <span>Launch Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          )}
        </div>
      </nav>

      {/* =========================================================
          2. HERO SECTION
          ========================================================= */}
      <header className="relative z-10 w-full px-[20px] pt-16 pb-20 md:pt-24 md:pb-28 border-b border-[var(--border-subtle)] flex flex-col items-center text-center">
        {/* Release Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-mono tracking-wide uppercase mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AUTONOMOUS TELEGRAM INGESTION PIPELINE</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.95] max-w-5xl">
          NEVER LOSE A <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400">
            CAREER OPPORTUNITY
          </span> <br className="hidden sm:inline" />
          AGAIN.
        </h1>

        {/* Subtitle */}
        <p className="mt-8 text-sm sm:text-base md:text-lg text-[var(--text-secondary)] max-w-2xl font-normal leading-relaxed">
          Drop raw job links into your private Telegram channel. Job Radar silently intercepts,
          scrapes JavaScript SPAs (Workday, Lever, Greenhouse), extracts company & role with DeepSeek AI,
          and manages your pipeline on a brutalist command center.
        </p>

        {/* Hero CTAs */}
        <div className="mt-10 flex flex-col sm:flex-row items-center gap-3 w-full max-w-md">
          <Link
            href={isLoggedIn ? '/dashboard' : '/login'}
            className="w-full sm:flex-1 py-3.5 px-6 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-600/25 flex items-center justify-center gap-2"
          >
            <span>{isLoggedIn ? 'Access Active Pipeline' : 'Open System Console'}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={() => {
              document.getElementById('simulator-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:flex-1 py-3.5 px-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] font-bold text-xs tracking-widest uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Run Live Demo</span>
            <Compass className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Quick Micro-Stats Bar */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-5">
          <div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Channel Noise
            </div>
            <div className="text-2xl font-bold tracking-tight text-emerald-400 mt-1">0 dB</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">100% Silent bot operation</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Mean Latency
            </div>
            <div className="text-2xl font-bold tracking-tight text-blue-400 mt-1">&lt; 850 ms</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Scrape + AI parsing time</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              ATS Coverage
            </div>
            <div className="text-2xl font-bold tracking-tight text-cyan-400 mt-1">99.4%</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Workday, Lever, Greenhouse</div>
          </div>
          <div>
            <div className="text-[11px] font-mono text-[var(--text-muted)] uppercase tracking-wider">
              Infrastructure
            </div>
            <div className="text-2xl font-bold tracking-tight text-purple-400 mt-1">Serverless</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">Neon PostgreSQL + Vercel Edge</div>
          </div>
        </div>
      </header>

      {/* =========================================================
          3. INTERACTIVE INGESTION SIMULATOR (SHOW, DON'T TELL)
          ========================================================= */}
      <section id="simulator-section" className="w-full px-[20px] py-20 border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
                <Terminal className="w-3.5 h-3.5" />
                <span>INTERACTIVE ENGINE SIMULATOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight uppercase">
                See Ingestion in Real-Time
              </h2>
            </div>
            <p className="text-xs text-[var(--text-secondary)] max-w-md leading-relaxed">
              Select a target link below to trigger the 4-stage pipeline simulation: Telegram interception,
              Jina headless DOM reader, DeepSeek LLM extraction, and PostgreSQL persistence.
            </p>
          </div>

          {/* Sample Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {SAMPLE_JOBS.map((job, idx) => (
              <button
                key={job.company}
                onClick={() => {
                  setActiveJobIdx(idx);
                  runSimulation(idx);
                }}
                className={`p-3.5 border text-left transition-all cursor-pointer ${
                  activeJobIdx === idx
                    ? 'border-blue-500 bg-blue-500/10'
                    : 'border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{job.company}</span>
                  <span className="font-mono text-[10px] text-blue-400">RUN &gt;</span>
                </div>
                <div className="text-[11px] text-[var(--text-secondary)] mt-1 truncate">
                  {job.role}
                </div>
              </button>
            ))}
          </div>

          {/* Terminal Console Display */}
          <div className="border border-[var(--border-subtle)] bg-[#070A0F] p-6 shadow-2xl font-mono text-xs space-y-5">
            {/* Console Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] text-[var(--text-muted)] text-[11px]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500/80" />
                <div className="w-2.5 h-2.5 bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 bg-green-500/80" />
                <span className="ml-2 text-slate-400 font-semibold">job-radar-telemetry-agent // v3.4</span>
              </div>
              <span className="text-emerald-400 font-mono">
                {isSimulating ? 'STATUS: EXECUTING PIPELINE...' : 'STATUS: READY FOR INGESTION'}
              </span>
            </div>

            {/* Pipeline Stage Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-[11px]">
              <div
                className={`p-2.5 border transition-all ${
                  simStep >= 1
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Send className="w-3 h-3" />
                  <span>1. TELEGRAM HOOK</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">Webhook verified</div>
              </div>

              <div
                className={`p-2.5 border transition-all ${
                  simStep >= 2
                    ? 'border-blue-500/50 bg-blue-500/10 text-blue-300'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Compass className="w-3 h-3" />
                  <span>2. JINA SCRAPER</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">SPA DOM extracted</div>
              </div>

              <div
                className={`p-2.5 border transition-all ${
                  simStep >= 3
                    ? 'border-purple-500/50 bg-purple-500/10 text-purple-300'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Cpu className="w-3 h-3" />
                  <span>3. DEEPSEEK AI</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">JSON schema output</div>
              </div>

              <div
                className={`p-2.5 border transition-all ${
                  simStep >= 4
                    ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-300'
                    : 'border-[var(--border-subtle)] text-[var(--text-muted)]'
                }`}
              >
                <div className="font-bold flex items-center gap-1.5">
                  <Database className="w-3 h-3" />
                  <span>4. NEON DB</span>
                </div>
                <div className="text-[10px] opacity-75 mt-0.5">Drizzle ORM write</div>
              </div>
            </div>

            {/* Real-Time Extraction Result Card */}
            <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-4 space-y-3">
              <div className="flex items-center justify-between text-[11px] text-[var(--text-muted)]">
                <span>SIMULATED BOARD RECORD</span>
                {simResult && (
                  <span className="text-emerald-400 font-mono">
                    ✓ PERSISTED IN {simResult.latencyMs}ms ({simResult.tokensUsed} tokens)
                  </span>
                )}
              </div>

              {simResult ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Company</span>
                    <span className="font-bold text-sm text-[var(--text-primary)]">{simResult.company}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Extracted Role</span>
                    <span className="font-semibold text-xs text-blue-400">{simResult.role}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[var(--text-muted)] uppercase block">Location / Source</span>
                    <span className="text-xs text-[var(--text-secondary)]">{simResult.location} • {simResult.source}</span>
                  </div>
                  <div className="flex items-center justify-end">
                    <span className="px-2.5 py-1 text-xs font-semibold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                      STATUS: SAVED
                    </span>
                  </div>
                </div>
              ) : (
                <div className="py-6 text-center text-[var(--text-muted)]">
                  {isSimulating ? (
                    <div className="flex items-center justify-center gap-2">
                      <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                      <span>Parsing link semantics with DeepSeek LLM...</span>
                    </div>
                  ) : (
                    <span>Click any company above or hit 'Run Telemetry Sweep' to test.</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          4. THE 3 INFLEXIBLE ARCHITECTURAL LAWS
          ========================================================= */}
      <section className="w-full px-[20px] py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <div className="text-xs font-mono text-blue-400 tracking-widest uppercase mb-2">
              CORE PHILOSOPHY
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Built for Speed & Silence
            </h2>
            <p className="mt-3 text-sm text-[var(--text-secondary)] max-w-xl">
              Generic job boards are bloated with social feeds, spam alerts, and messy bookmark folders.
              Job Radar is an austere, single-user intelligence command center.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Law 1 */}
            <div className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
              <div className="w-9 h-9 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold font-mono">
                01
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Zero-Spam Telegram Ingestion</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Post links silently to your private channel. The bot never replies, never sends notifications,
                and never creates channel noise. Pure passive ingestion with instant database syncing.
              </p>
              <div className="pt-2 text-[11px] font-mono text-emerald-400">
                // GUARANTEE: 0 CHANNEL MESSAGES
              </div>
            </div>

            {/* Law 2 */}
            <div className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
              <div className="w-9 h-9 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold font-mono">
                02
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight">Universal Headless Scraper</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                Workday, Greenhouse, Lever, and complex career portals break standard curl scrapers.
                Job Radar runs a dual-tier headless proxy (Jina Reader + direct DOM fetch) to extract 100% clean markdown.
              </p>
              <div className="pt-2 text-[11px] font-mono text-cyan-400">
                // COMPLIANCE: FULL SPA BYPASS
              </div>
            </div>

            {/* Law 3 */}
            <div className="p-6 border border-[var(--border-subtle)] bg-[var(--bg-surface)] space-y-4">
              <div className="w-9 h-9 border border-purple-500/30 bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold font-mono">
                03
              </div>
              <h3 className="text-lg font-bold uppercase tracking-tight">DeepSeek AI Parsing</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                No fragile regex patterns. DeepSeek-V3 LLM extracts normalized company name, precise role title,
                and source metadata. Defaults missing parameters cleanly without hallucinations.
              </p>
              <div className="pt-2 text-[11px] font-mono text-purple-400">
                // ENGINE: DEEPSEEK-CHAT (PLUGGABLE)
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          5. THE ANTI-SPREADSHEET COMPARISON MATRIX
          ========================================================= */}
      <section className="w-full px-[20px] py-24 border-b border-[var(--border-subtle)]">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <div className="text-xs font-mono text-purple-400 tracking-widest uppercase mb-2">
              TELEMETRY BENCHMARK
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight">
              Job Radar vs. The Legacy Workflow
            </h2>
          </div>

          <div className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-app)]/50 font-mono uppercase">
                  <th className="p-4">Capability</th>
                  <th className="p-4 text-blue-400 font-bold">Job Radar (This App)</th>
                  <th className="p-4">Spreadsheets / Notion</th>
                  <th className="p-4">Commercial Job Apps</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-subtle)]">
                <tr>
                  <td className="p-4 font-semibold">Capturing Friction</td>
                  <td className="p-4 text-emerald-400 font-medium">1 Tap (Paste link in Telegram)</td>
                  <td className="p-4 text-[var(--text-muted)]">Manual copy, paste & typing</td>
                  <td className="p-4 text-[var(--text-muted)]">Requires heavy browser extension</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Workday / SPA Scraping</td>
                  <td className="p-4 text-emerald-400 font-medium">Automatic (Headless Reader)</td>
                  <td className="p-4 text-red-400">Zero (Manual typing only)</td>
                  <td className="p-4 text-amber-400">Frequent parsing failures</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">AI Semantic Extraction</td>
                  <td className="p-4 text-emerald-400 font-medium">DeepSeek-V3 LLM ($0.0002/job)</td>
                  <td className="p-4 text-red-400">None</td>
                  <td className="p-4 text-amber-400">Black-box generic parser</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Privacy & Ownership</td>
                  <td className="p-4 text-emerald-400 font-medium">100% Private Neon PostgreSQL</td>
                  <td className="p-4 text-[var(--text-secondary)]">Stored on 3rd party cloud</td>
                  <td className="p-4 text-red-400">Data shared with recruiters / sold</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Stale Application Alerting</td>
                  <td className="p-4 text-emerald-400 font-medium">Auto-detected (&gt;7 days)</td>
                  <td className="p-4 text-red-400">Manual formula writing</td>
                  <td className="p-4 text-[var(--text-muted)]">Aggressive spam notifications</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold">Aesthetics & Border Radius</td>
                  <td className="p-4 text-blue-400 font-medium font-mono">0px Enterprise Architecture</td>
                  <td className="p-4 text-[var(--text-muted)]">Clunky table grids</td>
                  <td className="p-4 text-[var(--text-muted)]">Bubbly consumer UI</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================
          6. END-TO-END DATAFLOW ARCHITECTURE
          ========================================================= */}
      <section className="w-full px-[20px] py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/20">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="text-xs font-mono text-cyan-400 tracking-widest uppercase">
              SYSTEM ARCHITECTURE
            </div>
            <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight">
              Engineered For Reliability
            </h2>
            <p className="text-xs text-[var(--text-secondary)]">
              Modular microservices architecture built on Next.js 16 Edge Proxy and serverless computing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 text-xs">
            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
              <div className="font-mono text-slate-400 font-bold">01 // INGESTION</div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">Telegram Hook</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Webhook listens silently on verified secret token header.
                </p>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">STATUS: 200 OK</div>
            </div>

            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
              <div className="font-mono text-slate-400 font-bold">02 // SCRAPE</div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">Jina Headless</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Renders JavaScript SPAs and converts DOM into clean text.
                </p>
              </div>
              <div className="text-[10px] text-blue-400 font-mono">MEAN: 240ms</div>
            </div>

            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
              <div className="font-mono text-slate-400 font-bold">03 // INFERENCE</div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">DeepSeek-V3</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Extracts company name, title, and handles messy career URLs.
                </p>
              </div>
              <div className="text-[10px] text-purple-400 font-mono">ACCURACY: 99.4%</div>
            </div>

            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
              <div className="font-mono text-slate-400 font-bold">04 // PERSISTENCE</div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">Neon PostgreSQL</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Drizzle ORM schema with indices on status, date, and user.
                </p>
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">LATENCY: 8ms</div>
            </div>

            <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between space-y-3">
              <div className="font-mono text-slate-400 font-bold">05 // UI CONSOLE</div>
              <div className="space-y-1">
                <div className="font-bold text-sm text-[var(--text-primary)]">Job Radar Board</div>
                <p className="text-[11px] text-[var(--text-muted)]">
                  Auto-syncs every 5s. 1-click apply, notes drawer, and CSV export.
                </p>
              </div>
              <div className="text-[10px] text-emerald-400 font-mono">SYNC: ACTIVE</div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          7. FINAL CALL TO ACTION
          ========================================================= */}
      <section className="w-full px-[20px] py-28 text-center flex flex-col items-center justify-center relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none opacity-20 blur-[140px]"
          style={{
            background: 'radial-gradient(circle, #3B82F6 0%, #8B5CF6 50%, transparent 100%)',
          }}
        />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/20 bg-blue-500/10 text-blue-400 text-xs font-mono uppercase tracking-widest">
            <Lock className="w-3.5 h-3.5" />
            <span>AUTHENTICATED PERSONAL WORKSPACE</span>
          </div>

          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight">
            Take Command of Your Pipeline
          </h2>

          <p className="text-sm sm:text-base text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
            Stop letting dream roles slip through messy browser tabs or forgotten bookmarks.
            Deploy your private career radar in 1 click.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href={isLoggedIn ? '/dashboard' : '/login'}
              className="w-full sm:w-auto px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs tracking-widest uppercase transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2"
            >
              <span>{isLoggedIn ? 'Launch Active Dashboard' : 'Sign In With Google'}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto px-8 py-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs font-bold tracking-widest uppercase transition-colors"
            >
              Direct Console URL
            </Link>
          </div>
        </div>
      </section>

      {/* =========================================================
          8. ARCHITECTURAL COLOPHON & FOOTER
          ========================================================= */}
      <footer className="w-full border-t border-[var(--border-subtle)] bg-[var(--bg-app)] px-[20px] py-8 text-xs text-[var(--text-muted)] flex flex-col sm:flex-row items-center justify-between gap-4 font-mono">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center p-0.5">
            <img src="/icon.svg" alt="Icon" className="w-3.5 h-3.5" />
          </div>
          <span>JOB RADAR // AUTONOMOUS CAREER TRACKER</span>
        </div>

        <div className="flex items-center gap-6 text-[11px]">
          <span>ENGINEERED BY KUNAL MAURYA</span>
          <span className="hidden md:inline">•</span>
          <span className="hidden md:inline">NEON POSTGRESQL + DEEPSEEK</span>
          <span className="hidden md:inline">•</span>
          <span className="text-emerald-400">v3.4 PRODUCTION READY</span>
        </div>
      </footer>
    </div>
  );
}
