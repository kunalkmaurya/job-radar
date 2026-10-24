'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import {
  Zap,
  Search,
  Plus,
  Download,
  Bookmark,
  Sun,
  Moon,
  ExternalLink,
  Calendar,
  Clock,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Trash2,
  X,
  Sparkles,
  TrendingUp,
  Briefcase,
  Users,
  Target,
  ArrowUpRight,
  LogOut,
  Shield,
} from 'lucide-react';
import { Job, JOB_STATUSES, JobStatus, TimelineFilter } from '@/types';

// Static mock initial data for demo and preview
const INITIAL_MOCK_JOBS: Job[] = [
  {
    id: '1',
    company: 'Stripe',
    role: 'Staff Infrastructure Engineer',
    link: 'https://stripe.com/jobs/12345',
    location: 'N/A',
    exp: 'N/A',
    status: 'Saved',
    notes: 'Referred by Sarah on LinkedIn. Focus on distributed systems and Go.',
    followUpDate: null,
    appliedAt: null,
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-24T18:00:00Z'),
    updatedAt: new Date('2026-10-24T18:00:00Z'),
  },
  {
    id: '2',
    company: 'Datadog',
    role: 'Senior Backend Systems Lead',
    link: 'https://careers.datadoghq.com/detail/67890',
    location: 'N/A',
    exp: 'N/A',
    status: 'Applied',
    notes: 'Applied via Greenhouse. Recruiter message sent to John.',
    followUpDate: '2026-10-30',
    appliedAt: new Date('2026-10-21T10:00:00Z'),
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-21T10:00:00Z'),
    updatedAt: new Date('2026-10-21T10:00:00Z'),
  },
  {
    id: '3',
    company: 'Linear',
    role: 'Fullstack Product Engineer',
    link: 'https://jobs.lever.co/linear/11223',
    location: 'N/A',
    exp: 'N/A',
    status: 'Interviewing',
    notes: 'Technical screen scheduled for Thursday at 2 PM PST.',
    followUpDate: '2026-10-29',
    appliedAt: new Date('2026-10-17T14:00:00Z'),
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-16T12:00:00Z'),
    updatedAt: new Date('2026-10-22T09:00:00Z'),
  },
  {
    id: '4',
    company: 'Nvidia',
    role: 'AI Infrastructure Specialist',
    link: 'https://nvidia.wd5.myworkdayjobs.com/detail/44556',
    location: 'N/A',
    exp: 'N/A',
    status: 'Applied',
    notes: 'Workday application submitted. Stale check warning demo.',
    followUpDate: null,
    appliedAt: new Date('2026-10-08T11:00:00Z'), // > 14 days ago (Stale!)
    source: 'telegram',
    userId: null,
    createdAt: new Date('2026-10-08T11:00:00Z'),
    updatedAt: new Date('2026-10-08T11:00:00Z'),
  },
  {
    id: '5',
    company: 'Vercel',
    role: 'Edge Runtime Engineer',
    link: 'https://vercel.com/careers/edge-7788',
    location: 'N/A',
    exp: 'N/A',
    status: 'Offer',
    notes: 'Offer letter received! Reviewing compensation package.',
    followUpDate: null,
    appliedAt: new Date('2026-10-04T16:00:00Z'),
    source: 'manual',
    userId: null,
    createdAt: new Date('2026-10-02T10:00:00Z'),
    updatedAt: new Date('2026-10-23T15:00:00Z'),
  },
];

function formatDate(dateInput: Date | string | null | undefined): string {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = d.getUTCDate();
  const month = months[d.getUTCMonth()];
  const year = d.getUTCFullYear();
  return `${day} ${month} ${year}`;
}

function DashboardContent() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_MOCK_JOBS);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
  const [timelineFilter, setTimelineFilter] = useState<TimelineFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [staleOnlyFilter, setStaleOnlyFilter] = useState(false);
  const [nowTime, setNowTime] = useState<number>(1729792800000); // Stable timestamp for SSR

  // Modals & Drawer State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isBookmarkletModalOpen, setIsBookmarkletModalOpen] = useState(false);
  const [selectedDrawerJob, setSelectedDrawerJob] = useState<Job | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ email?: string; name?: string; role?: string } | null>(null);

  // Add Job Form State
  const [addTab, setAddTab] = useState<'fetch' | 'manual'>('fetch');
  const [fetchUrl, setFetchUrl] = useState('');
  const [isScraping, setIsScraping] = useState(false);
  const [manualForm, setManualForm] = useState({
    company: '',
    role: '',
    link: '',
    status: 'Saved' as JobStatus,
    notes: '',
  });

  // Drawer Notes Auto-save State
  const [drawerNotes, setDrawerNotes] = useState('');
  const [drawerFollowUp, setDrawerFollowUp] = useState('');
  const [isSavingNotes, setIsSavingNotes] = useState(false);

  // Initialize client-side time, theme, and load real jobs from Neon DB
  const fetchJobs = async () => {
    try {
      const res = await fetch('/api/jobs');
      const json = await res.json();
      if (json.success && json.data?.jobs) {
        if (json.data.jobs.length > 0) {
          setJobs(json.data.jobs);
        }
      }
    } catch (err) {
      console.error('Failed to fetch jobs from Neon DB:', err);
    }
  };

  useEffect(() => {
    setNowTime(Date.now());
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    // Initial fetch from Neon DB
    fetchJobs();

    // Fetch authenticated user profile
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCurrentUser(json.data);
        }
      })
      .catch((err) => console.error('Failed to fetch user:', err));

    // Auto-refresh every 5 seconds to show newly ingested jobs from Telegram!
    const interval = setInterval(fetchJobs, 5000);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('theme', nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Keyboard shortcut: '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        document.getElementById('job-search-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update Drawer contents when a job is clicked
  useEffect(() => {
    if (selectedDrawerJob) {
      setDrawerNotes(selectedDrawerJob.notes || '');
      setDrawerFollowUp(selectedDrawerJob.followUpDate || '');
    }
  }, [selectedDrawerJob]);

  // Stale Jobs Calculator (> 14 days in Applied)
  const isJobStale = (job: Job): boolean => {
    if (job.status !== 'Applied' || !job.appliedAt) return false;
    const diffDays = (nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24);
    return diffDays > 14;
  };

  const staleCount = useMemo(() => {
    return jobs.filter(isJobStale).length;
  }, [jobs, nowTime]);

  // Funnel Analytics Metrics
  const metrics = useMemo(() => {
    const totalJobs = jobs.length;
    const oneWeekAgo = nowTime - 1000 * 60 * 60 * 24 * 7;
    const appliedThisWeek = jobs.filter(
      (j) => j.appliedAt && new Date(j.appliedAt).getTime() >= oneWeekAgo
    ).length;
    const interviewingCount = jobs.filter((j) => j.status === 'Interviewing').length;
    const offerCount = jobs.filter((j) => j.status === 'Offer').length;

    const totalApplied = jobs.filter((j) =>
      ['Applied', 'Interviewing', 'Offer', 'Rejected'].includes(j.status)
    ).length;

    const responseRate =
      totalApplied > 0
        ? Math.round(((interviewingCount + offerCount) / totalApplied) * 100)
        : 0;

    return { totalJobs, appliedThisWeek, interviewingCount, offerCount, responseRate };
  }, [jobs, nowTime]);

  // Filtered Jobs
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesCompany = job.company.toLowerCase().includes(query);
        const matchesRole = job.role.toLowerCase().includes(query);
        if (!matchesCompany && !matchesRole) return false;
      }

      // 2. Stale Filter
      if (staleOnlyFilter && !isJobStale(job)) {
        return false;
      }

      // 3. Timeline Filter
      const createdTime = new Date(job.createdAt).getTime();
      if (timelineFilter === 'today') {
        const startOfDay = new Date(nowTime).setHours(0, 0, 0, 0);
        if (createdTime < startOfDay) return false;
      } else if (timelineFilter === 'this_week') {
        const sevenDaysAgo = nowTime - 1000 * 60 * 60 * 24 * 7;
        if (createdTime < sevenDaysAgo) return false;
      } else if (timelineFilter === 'past_30_days') {
        const thirtyDaysAgo = nowTime - 1000 * 60 * 60 * 24 * 30;
        if (createdTime < thirtyDaysAgo) return false;
      }

      return true;
    });
  }, [jobs, searchQuery, staleOnlyFilter, timelineFilter, nowTime]);

  // 1-Click "Apply & Advance"
  const handleApplyAndAdvance = async (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(job.link, '_blank');
    const appliedAt = new Date(nowTime);
    setJobs((prev) =>
      prev.map((j) =>
        j.id === job.id ? { ...j, status: 'Applied' as JobStatus, appliedAt, updatedAt: appliedAt } : j
      )
    );
    if (selectedDrawerJob?.id === job.id) {
      setSelectedDrawerJob({ ...selectedDrawerJob, status: 'Applied', appliedAt });
    }
    try {
      await fetch(`/api/jobs/${job.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Applied', appliedAt: appliedAt.toISOString() }),
      });
    } catch (err) {
      console.error('Failed to sync apply status:', err);
    }
  };

  // Status Change Dropdown
  const handleStatusChange = async (jobId: string, newStatus: JobStatus, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const appliedAt = newStatus === 'Applied' ? new Date(nowTime) : undefined;
    setJobs((prev) =>
      prev.map((j) => {
        if (j.id === jobId) {
          return {
            ...j,
            status: newStatus,
            appliedAt: appliedAt || j.appliedAt,
            updatedAt: new Date(nowTime),
          };
        }
        return j;
      })
    );
    if (selectedDrawerJob?.id === jobId) {
      setSelectedDrawerJob({ ...selectedDrawerJob, status: newStatus });
    }
    try {
      await fetch(`/api/jobs/${jobId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          ...(appliedAt ? { appliedAt: appliedAt.toISOString() } : {}),
        }),
      });
    } catch (err) {
      console.error('Failed to sync status:', err);
    }
  };

  // Delete Job
  const handleDeleteJob = async (jobId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setJobs((prev) => prev.filter((j) => j.id !== jobId));
    if (selectedDrawerJob?.id === jobId) {
      setSelectedDrawerJob(null);
    }
    try {
      await fetch(`/api/jobs/${jobId}`, { method: 'DELETE' });
    } catch (err) {
      console.error('Failed to delete job:', err);
    }
  };



  // Save Notes in Drawer
  const handleSaveDrawerNotes = async () => {
    if (!selectedDrawerJob) return;
    setIsSavingNotes(true);
    try {
      await fetch(`/api/jobs/${selectedDrawerJob.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          notes: drawerNotes,
          followUpDate: drawerFollowUp || null,
        }),
      });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === selectedDrawerJob.id
            ? {
                ...j,
                notes: drawerNotes,
                followUpDate: drawerFollowUp || null,
                updatedAt: new Date(nowTime),
              }
            : j
        )
      );
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setIsSavingNotes(false);
    }
  };

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Company', 'Role', 'Status', 'Link', 'Notes', 'Follow Up', 'Applied At', 'Created At'];
    const rows = jobs.map((j) => [
      `"${j.company}"`,
      `"${j.role}"`,
      `"${j.status}"`,
      `"${j.link}"`,
      `"${(j.notes || '').replace(/"/g, '""')}"`,
      `"${j.followUpDate || ''}"`,
      `"${j.appliedAt ? new Date(j.appliedAt).toISOString() : ''}"`,
      `"${new Date(j.createdAt).toISOString()}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `job_tracker_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Add Job Form Submit
  const handleAddJobSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualForm.company || !manualForm.role || !manualForm.link) return;

    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(manualForm),
      });
      const json = await res.json();
      if (json.success && json.data) {
        setJobs((prev) => [json.data, ...prev]);
      }
    } catch (err) {
      console.error('Failed to create job:', err);
    }
    setIsAddModalOpen(false);
    setManualForm({ company: '', role: '', link: '', status: 'Saved', notes: '' });
  };

  // Auto-Fetch with AI
  const handleAutoFetch = async () => {
    if (!fetchUrl) return;
    setIsScraping(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: fetchUrl }),
      });
      const json = await res.json();
      if (json.success) {
        await fetchJobs();
        setIsAddModalOpen(false);
        setFetchUrl('');
      } else {
        alert(json.error?.message || 'Failed to extract job details.');
      }
    } catch (err) {
      console.error('Auto fetch failed:', err);
    } finally {
      setIsScraping(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-app)] text-[var(--text-primary)]">
      {/* 1. TOP NAVIGATION BAR */}
      <header className="sticky top-0 z-30 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-app)]/85 backdrop-blur-xl px-[20px] py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-500/10 border border-blue-500/20 flex items-center justify-center p-1">
            <img src="/icon.svg" alt="Job Radar" className="w-5 h-5 object-contain" />
          </div>
          <span className="font-bold text-base tracking-tight">JOB RADAR</span>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Bookmarklet Helper */}
          <button
            onClick={() => setIsBookmarkletModalOpen(true)}
            title="1-Click Browser Bookmarklet"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Bookmarklet</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            title="Export CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:bg-[var(--bg-surface-hover)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Export</span>
          </button>

          {/* Add Job Button */}
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Job</span>
          </button>

          {/* Profile Dropdown Popover */}
          <div className="relative">
            <button
              id="profile-avatar-button"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title="User Account & Profile"
              className="w-8 h-8 border border-[var(--border-subtle)] bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-semibold text-xs flex items-center justify-center cursor-pointer transition-colors"
            >
              {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'K'}
            </button>

            {isProfileOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-72 z-50 border border-[var(--border-subtle)] bg-[var(--bg-surface)] shadow-2xl p-4 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-100">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 border border-blue-500/30 bg-blue-500/20 text-blue-300 font-bold text-sm flex items-center justify-center">
                      {currentUser?.email ? currentUser.email.charAt(0).toUpperCase() : 'K'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm text-[var(--text-primary)] truncate">
                        {currentUser?.name || (currentUser?.email ? currentUser.email.split('@')[0] : 'Workspace Owner')}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] truncate">
                        {currentUser?.email || 'kunalkrraj@gmail.com'}
                      </div>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Shield className="w-3 h-3" />
                    <span>Authorized Owner</span>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] space-y-1.5 text-[11px] text-[var(--text-muted)]">
                    <div className="flex items-center justify-between">
                      <span>Access Level</span>
                      <span className="text-[var(--text-secondary)] font-medium">Single-User Personal</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Auth Provider</span>
                      <span className="text-[var(--text-secondary)] font-medium">Google OAuth 2.0</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)]">
                    <button
                      id="logout-button"
                      onClick={async () => {
                        try {
                          await fetch('/api/auth/logout', { method: 'POST' });
                        } catch (err) {
                          console.error('Logout failed:', err);
                        } finally {
                          window.location.href = '/login';
                        }
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 text-xs font-semibold text-red-400 hover:text-white hover:bg-red-500/20 border border-transparent hover:border-red-500/30 transition-all text-left cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out of Job Radar</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <div className="w-full px-[20px] py-6 space-y-6 flex-1">
        {/* 2. FUNNEL ANALYTICS RIBBON */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="text-xs font-medium">Total Captured</span>
              <Briefcase className="w-4 h-4 text-blue-400" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight">{metrics.totalJobs}</div>
            <span className="text-[11px] text-[var(--text-muted)] mt-1">All-time applications tracked</span>
          </div>

          <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="text-xs font-medium">Applied This Week</span>
              <TrendingUp className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-amber-400">
              {metrics.appliedThisWeek}
            </div>
            <span className="text-[11px] text-amber-500/80 mt-1">Active weekly momentum</span>
          </div>

          <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="text-xs font-medium">Active Interviews</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-purple-400">
              {metrics.interviewingCount}
            </div>
            <span className="text-[11px] text-[var(--text-muted)] mt-1">In interview pipeline</span>
          </div>

          <div className="p-4 border border-[var(--border-subtle)] bg-[var(--bg-surface)] flex flex-col justify-between">
            <div className="flex items-center justify-between text-[var(--text-secondary)]">
              <span className="text-xs font-medium">Response Rate</span>
              <Target className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2 text-2xl font-bold tracking-tight text-emerald-400">
              {metrics.responseRate}%
            </div>
            <span className="text-[11px] text-[var(--text-muted)] mt-1">Interview conversion ratio</span>
          </div>
        </section>

        {/* 3. CONTROL & FILTER BAR */}
        <section className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="flex flex-1 items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                id="job-search-input"
                type="text"
                placeholder="Search company or role... (Press '/' to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Stale Jobs Alert Chip */}
            {staleCount > 0 && (
              <button
                onClick={() => setStaleOnlyFilter(!staleOnlyFilter)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border transition-colors ${
                  staleOnlyFilter
                    ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                    : 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/15'
                }`}
              >
                <AlertTriangle className="w-3.5 h-3.5 animate-pulse" />
                <span>{staleCount} Stale {staleCount === 1 ? 'Job' : 'Jobs'}</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            {/* Timeline Filter Segmented Tabs */}
            <div className="flex items-center p-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs">
              {(['all', 'today', 'this_week', 'past_30_days'] as TimelineFilter[]).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setTimelineFilter(tab)}
                  className={`px-2.5 py-1 capitalize transition-all ${
                    timelineFilter === tab
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {tab.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center p-1 border border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs">
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 transition-all ${
                  viewMode === 'list'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-2.5 py-1 transition-all ${
                  viewMode === 'kanban'
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Board
              </button>
            </div>
          </div>
        </section>

        {/* 4. PRIMARY CONTENT AREA: LIST VIEW */}
        {viewMode === 'list' ? (
          <section className="border border-[var(--border-subtle)] bg-[var(--bg-surface)] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[var(--border-subtle)] text-[var(--text-muted)] bg-[var(--bg-surface)]/50">
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Company</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Role</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Status</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider">Timeline / Age</th>
                    <th className="py-3 px-4 font-semibold uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-subtle)]">
                  {filteredJobs.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[var(--text-muted)]">
                        No job applications match your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredJobs.map((job) => {
                      const stale = isJobStale(job);
                      return (
                        <tr
                          key={job.id}
                          onClick={() => setSelectedDrawerJob(job)}
                          className="hover:bg-[var(--bg-surface-hover)] cursor-pointer transition-colors"
                        >

                          {/* Company */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs flex items-center justify-center">
                                {job.company.charAt(0)}
                              </div>
                              <span className="font-semibold text-sm text-[var(--text-primary)]">
                                {job.company}
                              </span>
                            </div>
                          </td>

                          {/* Role */}
                          <td className="py-3.5 px-4 text-[var(--text-secondary)]">
                            <div className="flex items-center gap-2">
                              <span>{job.role}</span>
                              <span className="text-[10px] px-1.5 py-0.5 bg-[var(--border-subtle)] text-[var(--text-muted)]">
                                {job.location}
                              </span>
                            </div>
                          </td>

                          {/* Status Dropdown */}
                          <td className="py-3.5 px-4" onClick={(e) => e.stopPropagation()}>
                            <select
                              value={job.status}
                              onChange={(e) => handleStatusChange(job.id, e.target.value as JobStatus)}
                              className="px-2.5 py-1 text-xs font-medium border border-transparent cursor-pointer focus:outline-none"
                              style={{
                                color: `var(--status-${job.status.toLowerCase()}-text, #60A5FA)`,
                                backgroundColor: `var(--status-${job.status.toLowerCase()}-bg, rgba(59,130,246,0.15))`,
                              }}
                            >
                              {JOB_STATUSES.map((status) => (
                                <option
                                  key={status}
                                  value={status}
                                  className="bg-[var(--bg-surface)] text-[var(--text-primary)]"
                                >
                                  {status}
                                </option>
                              ))}
                            </select>
                          </td>

                          {/* Timeline / Age */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                              {stale && <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />}
                              <span suppressHydrationWarning>
                                {job.status === 'Applied' && job.appliedAt
                                  ? `Applied ${Math.round(
                                      (nowTime - new Date(job.appliedAt).getTime()) / (1000 * 60 * 60 * 24)
                                    )}d ago`
                                  : `Added ${formatDate(job.createdAt)}`}
                              </span>
                            </div>
                          </td>

                          {/* Quick Actions */}
                          <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center justify-end gap-1.5">
                              {job.status === 'Saved' && (
                                <button
                                  onClick={(e) => handleApplyAndAdvance(job, e)}
                                  className="flex items-center gap-1 px-2.5 py-1 bg-blue-600/10 border border-blue-500/30 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-medium"
                                >
                                  <span>Apply</span>
                                  <ArrowUpRight className="w-3 h-3" />
                                </button>
                              )}

                              <button
                                onClick={() => setSelectedDrawerJob(job)}
                                title="Open Notes"
                                className="p-1.5 hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              >
                                <FileText className="w-4 h-4" />
                              </button>

                              <a
                                href={job.link}
                                target="_blank"
                                rel="noreferrer"
                                title="Open Link"
                                className="p-1.5 hover:bg-[var(--bg-surface-hover)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </a>

                              <button
                                onClick={(e) => handleDeleteJob(job.id, e)}
                                title="Delete"
                                className="p-1.5 hover:bg-red-500/10 text-[var(--text-muted)] hover:text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>
        ) : (
          /* 5. ALTERNATIVE: KANBAN BOARD VIEW */
          <section className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
            {JOB_STATUSES.filter((s) => s !== 'Archived').map((colStatus) => {
              const columnJobs = filteredJobs.filter((j) => j.status === colStatus);
              return (
                <div
                  key={colStatus}
                  className="border border-[var(--border-subtle)] bg-[var(--bg-surface)]/60 p-3 flex flex-col space-y-3 min-h-[500px]"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                    <span className="text-xs font-semibold uppercase tracking-wider">{colStatus}</span>
                    <span className="text-xs px-2 py-0.5 bg-[var(--border-subtle)] text-[var(--text-secondary)]">
                      {columnJobs.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {columnJobs.map((job) => (
                      <div
                        key={job.id}
                        onClick={() => setSelectedDrawerJob(job)}
                        className="p-3.5 border border-[var(--border-subtle)] bg-[var(--bg-surface)] hover:border-blue-500/40 cursor-pointer transition-all shadow-sm space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-sm">{job.company}</span>
                          <a
                            href={job.link}
                            target="_blank"
                            rel="noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] line-clamp-1">{job.role}</p>
                        <div className="flex items-center justify-between pt-1 text-[11px] text-[var(--text-muted)]">
                          <span>{job.status === 'Applied' && isJobStale(job) ? '⚠️ Stale' : 'Active'}</span>
                          {job.status === 'Saved' ? (
                            <button
                              onClick={(e) => handleApplyAndAdvance(job, e)}
                              className="text-blue-400 hover:underline flex items-center gap-0.5"
                            >
                              Apply ↗
                            </button>
                          ) : (
                            <span className="hover:text-[var(--text-primary)]">Notes 📝</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}
      </div>



      {/* 7. SLIDE-OVER NOTES DRAWER */}
      {selectedDrawerJob && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedDrawerJob(null)}
          />

          <div className="relative w-full max-w-md bg-[var(--bg-surface)] border-l border-[var(--border-subtle)] p-6 shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-200">
            <div className="space-y-6">
              {/* Drawer Header */}
              <div className="flex items-start justify-between pb-4 border-b border-[var(--border-subtle)]">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">{selectedDrawerJob.company}</h2>
                  <p className="text-xs text-[var(--text-secondary)] mt-0.5">{selectedDrawerJob.role}</p>
                </div>
                <button
                  onClick={() => setSelectedDrawerJob(null)}
                  className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Status & Apply Link */}
              <div className="flex items-center gap-3">
                <select
                  value={selectedDrawerJob.status}
                  onChange={(e) => handleStatusChange(selectedDrawerJob.id, e.target.value as JobStatus)}
                  className="px-3 py-1.5 text-xs font-semibold border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none"
                >
                  {JOB_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

                <a
                  href={selectedDrawerJob.link}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:underline px-3 py-1.5 border border-blue-500/20 bg-blue-500/10"
                >
                  <span>Open Career Link</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Follow-up Date Picker */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Follow-up Reminder Date</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={drawerFollowUp}
                    onChange={(e) => {
                      setDrawerFollowUp(e.target.value);
                      handleSaveDrawerNotes();
                    }}
                    className="flex-1 px-3 py-1.5 text-xs border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => {
                      const d = new Date(nowTime + 1000 * 60 * 60 * 24 * 3).toISOString().split('T')[0];
                      setDrawerFollowUp(d);
                    }}
                    className="px-2 py-1.5 border border-[var(--border-subtle)] text-[11px] hover:bg-[var(--bg-surface-hover)]"
                  >
                    +3d
                  </button>
                  <button
                    onClick={() => {
                      const d = new Date(nowTime + 1000 * 60 * 60 * 24 * 7).toISOString().split('T')[0];
                      setDrawerFollowUp(d);
                    }}
                    className="px-2 py-1.5 border border-[var(--border-subtle)] text-[11px] hover:bg-[var(--bg-surface-hover)]"
                  >
                    +1w
                  </button>
                </div>
              </div>

              {/* Notes Scratchpad */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[var(--text-secondary)] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Personal Notes & Scratchpad</span>
                  </label>
                  {isSavingNotes && <span className="text-[10px] text-blue-400">Saving...</span>}
                </div>
                <textarea
                  rows={8}
                  value={drawerNotes}
                  onChange={(e) => setDrawerNotes(e.target.value)}
                  onBlur={handleSaveDrawerNotes}
                  placeholder="Jot down referral contacts, phone screen discussion points, recruiter email, or expected compensation..."
                  className="w-full p-3 text-xs border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500 leading-relaxed"
                />
              </div>

              {/* Activity Info */}
              <div className="p-3 border border-[var(--border-subtle)] bg-[var(--bg-app)] space-y-1 text-[11px] text-[var(--text-muted)]">
                <div>Captured: {formatDate(selectedDrawerJob.createdAt)}</div>
                {selectedDrawerJob.appliedAt && (
                  <div>Applied: {formatDate(selectedDrawerJob.appliedAt)}</div>
                )}
                <div>Source: {selectedDrawerJob.source}</div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className="pt-4 border-t border-[var(--border-subtle)] flex items-center justify-between">
              <button
                onClick={() => handleDeleteJob(selectedDrawerJob.id)}
                className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Job</span>
              </button>
              <button
                onClick={handleSaveDrawerNotes}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs"
              >
                Save Notes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 8. "+ ADD JOB" MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />

          <div className="relative w-full max-w-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl z-10 space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base">Add New Job Opening</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tab Switcher */}
            <div className="flex p-1 bg-[var(--bg-app)] border border-[var(--border-subtle)] text-xs">
              <button
                onClick={() => setAddTab('fetch')}
                className={`flex-1 py-1.5 font-medium transition-all ${
                  addTab === 'fetch' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-secondary)]'
                }`}
              >
                Auto-Fetch Link
              </button>
              <button
                onClick={() => setAddTab('manual')}
                className={`flex-1 py-1.5 font-medium transition-all ${
                  addTab === 'manual' ? 'bg-blue-600 text-white shadow-sm' : 'text-[var(--text-secondary)]'
                }`}
              >
                Manual Entry
              </button>
            </div>

            {addTab === 'fetch' ? (
              <div className="space-y-4">
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Paste any job URL from Workday, Greenhouse, Lever, LinkedIn, or company career sites.
                </p>
                <input
                  type="url"
                  placeholder="https://..."
                  value={fetchUrl}
                  onChange={(e) => setFetchUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleAutoFetch}
                  disabled={!fetchUrl || isScraping}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold transition-all shadow-md"
                >
                  {isScraping ? (
                    <>
                      <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      <span>Extracting with AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Scrape & Extract Details</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <form onSubmit={handleAddJobSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">Company Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Stripe"
                    value={manualForm.company}
                    onChange={(e) => setManualForm({ ...manualForm, company: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">Role Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Staff Infrastructure Engineer"
                    value={manualForm.role}
                    onChange={(e) => setManualForm({ ...manualForm, role: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">Job Application Link</label>
                  <input
                    type="url"
                    required
                    placeholder="https://..."
                    value={manualForm.link}
                    onChange={(e) => setManualForm({ ...manualForm, link: e.target.value })}
                    className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[var(--text-secondary)] mb-1 font-medium">Initial Status</label>
                  <select
                    value={manualForm.status}
                    onChange={(e) => setManualForm({ ...manualForm, status: e.target.value as JobStatus })}
                    className="w-full px-3.5 py-2 border border-[var(--border-subtle)] bg-[var(--bg-app)] text-[var(--text-primary)] focus:outline-none"
                  >
                    {JOB_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all shadow-md mt-2"
                >
                  Save Job to Board
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 9. BOOKMARKLET HELPER MODAL */}
      {isBookmarkletModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsBookmarkletModalOpen(false)} />

          <div className="relative w-full max-w-md border border-[var(--border-subtle)] bg-[var(--bg-surface)] p-6 shadow-2xl z-10 space-y-4 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-blue-400" />
                <span>1-Click Browser Bookmarklet</span>
              </h3>
              <button onClick={() => setIsBookmarkletModalOpen(false)} className="text-[var(--text-muted)] hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[var(--text-secondary)] leading-relaxed">
              Drag this button to your browser bookmarks bar. When viewing any job on LinkedIn or Workday, click it to save instantly:
            </p>

            <div className="p-4 border border-dashed border-blue-500/40 bg-blue-500/10 text-center">
              <a
                href="javascript:(function(){const url=encodeURIComponent(window.location.href);alert('Job link captured for Job Radar: ' + window.location.href);})();"
                onClick={(e) => e.preventDefault()}
                className="inline-block px-4 py-2 bg-blue-600 text-white font-semibold shadow cursor-grab active:cursor-grabbing"
              >
                + Add to Job Radar
              </a>
              <span className="block text-[10px] text-[var(--text-muted)] mt-2">
                (Drag and drop into your Bookmarks Bar)
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[var(--bg-app)] flex items-center justify-center text-xs text-[var(--text-muted)]">Loading workspace...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
