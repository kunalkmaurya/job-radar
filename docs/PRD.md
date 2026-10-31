# Product Requirements Document (PRD): Job Radar Platform

## 1. Executive Summary

**Job Radar** is a high-speed career telemetry command center and multi-tenant job tracking platform. It allows software engineers to discover curated job openings from an administrative public feed, clone opportunities to a private pipeline with one click, and capture external job postings silently via Telegram, browser bookmarklet, or manual input.

Job links posted into Telegram channels are silently intercepted, scraped across all job portals (including JavaScript-rendered portals like Workday), parsed with an AI model (DeepSeek / OpenAI), and stored in **Neon PostgreSQL**. Each user gets an isolated tracking board with status workflows, referral management, timeline filtering, and analytics.

---

## 2. Key Goals & Principles

1. **Shared Public Feed & 1-Click Track**: Curated opportunities visible to all users; 1-click "Track" copies jobs to the user's private pipeline.
2. **Multi-Tenant Isolation**: Every user manages their own applications, notes, referral records, and statuses in strict privacy.
3. **Open Access Authentication**: Google OAuth and password authentication with automatic PostgreSQL account provisioning (`ALLOWED_EMAIL="*"`). Platform administrative controls reserved for `ADMIN_EMAIL`.
4. **Zero-Friction Ingestion**: Forward a link in Telegram or use the bookmarklet $\rightarrow$ job is silently scraped and saved.
5. **Universal Job Portal Scraping**: Handles client-side SPAs (Workday, Greenhouse, Lever, Ashby, LinkedIn) using two-tier scraping (Jina Reader markdown proxy + direct HTTP).
6. **Dual Feed Views**: High-speed switching between responsive Card grid view and high-density Table list view with configurable pagination.
7. **Complete Referral Management**: Track referral status (`none`, `asked`, `referred`, `declined`), referrer contacts, and notes.

---

## 3. System Architecture & Ingestion Pipeline

```
  ┌────────────────────────┐      ┌────────────────────────┐      ┌────────────────────────┐
  │ Telegram Channel Post  │      │   Manual Entry Modal   │      │ 1-Click PC Bookmarklet │
  │    (Link in channel)   │      │ (Paste Link or Type)   │      │   (From any browser)   │
  └───────────┬────────────┘      └───────────┬────────────┘      └───────────┬────────────┘
              │                               │                               │
              ▼                               ▼                               ▼
       [ Telegram Webhook ]          [ /api/jobs/manual ]            [ /api/jobs/bookmarklet ]
              │                               │                               │
              └───────────────────────┬───────┴───────────────────────────────┘
                                      │
                                      ▼
                      [ Duplicate Check & URL Normalizer ]
                                      │
                                      ▼
                      [ Robust Web Content Fetcher ]
                        ├── Tier 1: Markdown Reader Proxy (Jina Reader - Workday/SPAs)
                        └── Tier 2: Direct HTTP Fetch with Desktop User-Agent
                                      │
                                      ▼
                      [ Pluggable AI Extraction Engine ]
                        ├── Provider: DeepSeek (Default)
                        ├── Provider: OpenAI (ChatGPT)
                        └── Output: { company, role, link }
                                      │
                                      ▼
                      [ Neon DB (Serverless PostgreSQL) ]
                                      │
                                      ▼
                      [ Next.js Personal Dashboard ]
                        ├── Timeline Filtering & Stale Alerts
                        ├── 1-Click "Apply & Advance"
                        ├── Interview Notes & Follow-up Reminders
                        ├── Funnel Analytics Ribbon
                        └── 1-Click CSV Export
```

---

## 4. Ingestion Channels

### 4.1 Automated Telegram Ingestion

- **Mechanism**: Telegram Bot added as an Administrator in your private channel.
- **Trigger**: New channel post (`channel_post` update).
- **Behavior**: **100% Silent**. No bot reply, no reaction emoji. Ingestion runs asynchronously.
- **De-duplication**: If the link already exists in the database, the update is safely ignored.

### 4.2 Manual Dashboard Ingestion

- Modal accessible via a prominent **"+ Add Job"** button on the dashboard:
  - **Tab 1 ("Quick Fetch")**: Paste a URL $\rightarrow$ backend scrapes & extracts company & role $\rightarrow$ one-click save.
  - **Tab 2 ("Manual Entry")**: Type Company Name, Role, and Link directly with no AI dependency.

### 4.3 1-Click Browser Bookmarklet

- A small JavaScript bookmarklet link saved to your desktop browser's bookmarks bar.
- When viewing a job on LinkedIn, Workday, or a career site, clicking the bookmarklet sends `window.location.href` directly to `/api/jobs/bookmarklet` with your session token, saving the job without opening Telegram.

---

## 5. Web Scraping & AI Extraction

### 5.1 Universal Web Scraping (Workday & Dynamic Portals)

- **Challenge**: Workday, LinkedIn, and modern enterprise ATS render job details using client-side JavaScript. Standard `fetch()` returns an empty shell.
- **Two-Tier Strategy**:
  1. **Tier 1 (Universal Reader Service)**: Routes the URL through **Jina Reader** (`https://r.jina.ai/<job-url>`), which renders JavaScript, bypasses bot walls, and returns clean Markdown.
  2. **Tier 2 (Direct HTTP Fetch)**: Direct fallback with browser `User-Agent` headers.
  3. **Fail-Safe Fallback**: If a page is behind a strict login wall, extracts the company name from the domain (e.g. `nvidia.wd5.myworkdayjobs.com` $\rightarrow$ "Nvidia"), saves the link, and flags the role as `"Review Role"` for manual edit.

### 5.2 Pluggable AI Extraction Layer

- **Default**: **DeepSeek** (`https://api.deepseek.com`, model: `deepseek-chat`).
- **Switchable**: **OpenAI** (`https://api.openai.com/v1`, model: `gpt-4o-mini`).
- Both providers share OpenAI-compatible SDKs.
- **Target Output**:

```json
{
  "company": "string",
  "role": "string",
  "link": "string"
}
```

_(Note: `location` and `exp` are stored with default `'N/A'` to avoid unnecessary latency and token usage today, ready for future activation)._

---

## 6. Personal Dashboard Features & UX

### 6.1 Timeline & Follow-Up Intelligence

- **Timeline Filters**: 1-click filtering by:
  - _All Jobs_
  - _Today_
  - _This Week_
  - _Past 30 Days_
  - _Custom Date Range_
- **Stale Application Warning**: Visual highlight/flag for any job in `"Applied"` status for more than 14 days without movement, signaling a follow-up is due.
- **Time-in-Stage Badges**: Dynamic badges on cards (e.g., `"Applied 5 days ago"`, `"In Interview for 2 days"`).

### 6.2 High-Speed Workflow & Quick Actions

- **1-Click "Apply & Advance"**: Clicking opens the external job URL in a new tab **and** advances status to `Applied`, stamping `applied_at` with the current timestamp.
- **Duplicate Prevention Warning**: Alerts you if a newly added link belongs to a company you already applied to within the last 30 days.
- **Bulk Operations**: Multi-select jobs to batch-advance status (e.g., move multiple to `Applied` or `Archived`).

### 6.3 Personal Notes & Interview Scratchpad

- **Slide-Over Drawer**: Click any job to open a minimal notes panel:
  - Referral contact (e.g., _"Referred by Rahul on LinkedIn"_).
  - Interview notes (recruiter calls, interview questions, tech discussions).
  - **Follow-up Date Picker**: Set an optional follow-up reminder date.

### 6.4 At-a-Glance Funnel Analytics Ribbon

A sleek, high-contrast metric counter across the top of the dashboard:

- **Total Jobs Captured** (e.g., `48`)
- **Applied This Week** (e.g., `12`)
- **Active Interviews** (e.g., `3`)
- **Response Rate %** (percentage of submitted applications reaching the interview stage).

### 6.5 Export & Portability

- **1-Click CSV Export**: Download all applications, timestamps, links, and notes as a CSV file for offline backup or spreadsheets.

---

## 7. Authentication & Multi-Tenancy

- **Provider**: **Google OAuth** and Direct Credentials.
- **Session Strategy**: **JWT (JSON Web Token)** stored in secure `HttpOnly`, `SameSite=Lax` cookies.
- **Open Access**: Enabled via `ALLOWED_EMAIL="*"`. All users can authenticate and receive a dedicated user account.
- **Role Hierarchy**:
  - `admin`: Curates public job feed, triggers batch ingestion, and accesses telemetry (`ADMIN_EMAIL="kunalkrraj@gmail.com"`).
  - `user`: Personal job search board with complete isolation of pipeline and notes.
- **Webhook Security**: Telegram endpoint (`/api/telegram-webhook`) verified with `X-Telegram-Bot-Api-Secret-Token`.

---

## 8. Database Schema (Neon PostgreSQL)

```sql
-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255),
    image TEXT,
    role VARCHAR(50) NOT NULL DEFAULT 'user',
    telegram_chat_id VARCHAR(100) UNIQUE,
    ingest_token VARCHAR(64) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Public Feed Table
CREATE TABLE public_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    link TEXT NOT NULL UNIQUE,
    location VARCHAR(255) NOT NULL DEFAULT 'N/A',
    exp VARCHAR(100) NOT NULL DEFAULT 'N/A',
    source VARCHAR(50) NOT NULL DEFAULT 'admin',
    posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Personal Scoped Jobs Table
CREATE TABLE jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    public_job_id UUID REFERENCES public_jobs(id) ON DELETE SET NULL,
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    link TEXT NOT NULL,
    location VARCHAR(255) NOT NULL DEFAULT 'N/A',
    exp VARCHAR(100) NOT NULL DEFAULT 'N/A',
    status VARCHAR(50) NOT NULL DEFAULT 'Saved',
    notes TEXT NOT NULL DEFAULT '',
    follow_up_date DATE,
    applied_at TIMESTAMP WITH TIME ZONE,
    is_important BOOLEAN NOT NULL DEFAULT FALSE,
    referral_status VARCHAR(50) NOT NULL DEFAULT 'none',
    referrer_name VARCHAR(255),
    referrer_contact VARCHAR(255),
    referral_notes TEXT NOT NULL DEFAULT '',
    source VARCHAR(50) NOT NULL DEFAULT 'telegram',
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

---

## 9. Implementation Roadmap

### Phase 1: Authentication & Ingestion Pipeline

- [ ] Initialize Next.js (TypeScript) project.
- [ ] Configure Neon DB connection with Drizzle ORM.
- [ ] Setup Google OAuth & JWT authentication with `ALLOWED_EMAIL` restriction.
- [ ] Run database migrations for `users` and `jobs` schema.
- [ ] Build the Universal Scraper (supporting Workday and standard ATS).
- [ ] Implement the Pluggable LLM Extractor (DeepSeek + OpenAI).
- [ ] Implement silent Telegram Webhook handler (`/api/telegram-webhook`).
- [ ] Implement Manual Job Creation API (`/api/jobs/manual`).
- [ ] Implement Bookmarklet endpoint (`/api/jobs/bookmarklet`).

### Phase 2: Personal Dashboard & Tracking Features

- [ ] Header Funnel Analytics ribbon (Total, Applied, Interviews, Response Rate).
- [ ] Timeline filters (_All, Today, This Week, Last 30 Days, Custom Range_).
- [ ] Job Board / Table views with quick status changers.
- [ ] 1-Click "Apply & Advance" action.
- [ ] Stale application alerts (> 14 days in Applied) and time-in-stage counters.
- [ ] Slide-over Personal Notes & Interview Scratchpad drawer.
- [ ] 1-Click CSV Export.
- [ ] Manual "+ Add Job" modal with Auto-Fetch and Manual tabs.
