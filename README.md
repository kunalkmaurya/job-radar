<div align="center">

# Job Radar
### High-Speed Application Pipeline & Career Telemetry Command Center

A private, distraction-free command center for modern software engineers. Ingest job postings instantly from mobile via Telegram, auto-extract job specs using AI, manage referrals, track follow-ups, and visualize application velocity across high-density Table and Kanban views.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle%200.45-green?style=flat-square&logo=databricks)](https://orm.drizzle.team/)
[![Neon Database](https://img.shields.io/badge/Database-Neon%20Serverless%20Postgres-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![TailwindCSS 4](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

[Explore Features](#key-features) • [Screenshots](#visual-walkthrough) • [Tech Stack](#technical-architecture) • [Getting Started](#getting-started) • [Environment Setup](#environment-variables)

</div>

---

## Visual Walkthrough

### 1. Minimalist Landing Page
Anthropic-inspired dark mode landing page featuring interactive live specimens, architectural pillars, comparison matrices, and FAQ accordions.
<div align="center">
  <img src="docs/screenshots/landing-page.png" alt="Job Radar Landing Page" width="100%" />
</div>

---

### 2. High-Density Pipeline Dashboard (Table View)
Fast, keyboard-friendly workspace with company avatars, referral status tags, custom status dropdowns, stale indicators, and one-click actions.
<div align="center">
  <img src="docs/screenshots/dashboard-table.png" alt="Job Radar Dashboard Table View" width="100%" />
</div>

---

### 3. Kanban Board View with Modular Column Pagination
Columnar pipeline across all hiring stages (`Saved`, `Applied`, `Interviewing`, `Offer`, `Rejected`) with customizable cards per column, star importance toggles, and direct note triggers.
<div align="center">
  <img src="docs/screenshots/dashboard-kanban.png" alt="Job Radar Kanban Board View" width="100%" />
</div>

---

### 4. Application Details & Referral Tracker Drawer
Slide-out drawer containing follow-up calendar reminder presets (`+3d`, `+1w`), complete referral tracking (referral status, referrer name, contact, notes), and markdown scratchpad.
<div align="center">
  <img src="docs/screenshots/job-details-drawer.png" alt="Job Radar Details & Referral Drawer" width="100%" />
</div>


---

### 5. Application Velocity & Conversion Analytics
14-day interactive timeline bar charts, application throughput counters, and multi-stage conversion funnel telemetry.
<div align="center">
  <img src="docs/screenshots/dashboard-analytics.png" alt="Job Radar Analytics Dashboard" width="100%" />
</div>

---

## Key Features

- **Multi-Channel Job Ingestion**:
  - **Telegram Webhook Bot**: Forward raw URLs from LinkedIn, Indeed, or company career pages on your mobile device into a private Telegram chat. The webhook triggers background extraction and instantly catalogs the job.
  - **1-Click Browser Bookmarklet**: Drag-and-drop bookmarklet into your browser bar to capture open tabs instantly.
  - **Auto-Fetch Modal**: Paste any URL into the dashboard to auto-scrape company and role metadata via AI.
  - **Manual Quick Entry**: Fast keyboard-friendly modal for manual tracking.

- **Complete Referral Tracking**:
  - Explicit referral pipeline tracking across 4 states: `No Referral`, `Asked`, `Got Referral`, and `Declined`.
  - Store referrer contact information (LinkedIn/email/phone) and internal notes.
  - Color-coded referral badges in both Table and Kanban cards.

- **Native SWR & HTTP 304 Smart Sync**:
  - **Zero Network Spam**: Uses server-side `ETag` metadata computation (`max(updatedAt)`, count) returning empty `304 Not Modified` responses when no jobs have changed.
  - **Visibility-Aware Polling**: Sync timers automatically halt when the browser tab is hidden or backgrounded.
  - **Instant Window-Focus Revalidation**: Immediate background update as soon as you refocus the workspace.
  - **Manual Sync Trigger**: On-demand Sync button in the top navigation.

- **Accidental Action Protection**:
  - Delete actions from table rows and detail drawers prompt a sleek confirmation modal with full job context before removing records from PostgreSQL.

- **Comprehensive Career Telemetry**:
  - 14-day application velocity histograms.
  - Ingested -> Submitted -> Interview -> Offer conversion funnels.
  - Stale application detector highlighting jobs with no status updates for >14 days.

- **Single-User Security**:
  - Whitelist-enforced single-user authentication.
  - Signed 30-day JWT sessions stored in secure `HttpOnly`, `SameSite=lax` cookies.
  - Optional Google OAuth 2.0 integration.

- **Data Sovereignty**:
  - Instant 1-click CSV export of your entire job search history.
  - Stored in serverless PostgreSQL (Neon) with migrations managed via Drizzle Kit.

---

## Technical Architecture

```mermaid
graph TD
    subgraph Ingestion Channels
        TG[Telegram Mobile Webhook]
        BM[Browser Bookmarklet]
        FE[Dashboard UI / Auto-Fetch Modal]
    end

    subgraph Core Application Next.js 16
        API_TG["/api/telegram-webhook"]
        API_JOBS["/api/jobs"]
        API_AUTH["/api/auth/*"]
        SYNC[Smart Revalidation Engine]
    end

    subgraph AI Extraction Layer
        LLM[DeepSeek-V3 / OpenAI API]
    end

    subgraph Storage Layer
        DB[(Neon Serverless PostgreSQL)]
        DRZ[Drizzle ORM Schema]
    end

    TG -->|Webhook POST| API_TG
    BM -->|URL Payload| API_JOBS
    FE -->|JSON Payload| API_JOBS

    API_TG -->|HTML Scrape & Prompt| LLM
    API_JOBS -->|URL Auto-Fetch| LLM

    LLM -->|Parsed Job Metadata| API_JOBS
    API_JOBS -->|Type-safe Queries| DRZ
    DRZ --> DB
    SYNC <-->|ETag 304 Polling| DB
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16.4](https://nextjs.org/) (App Router, Turbopack) |
| **Language** | [TypeScript 5](https://www.typescriptlang.org/) |
| **UI Library** | [React 19](https://react.dev/) |
| **Styling** | [TailwindCSS 4](https://tailwindcss.com/) + Custom CSS Design Tokens |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **Database** | [Neon Serverless PostgreSQL](https://neon.tech/) |
| **ORM** | [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |
| **Authentication** | [Jose](https://github.com/panva/jose) (JWT) + Google OAuth 2.0 |
| **AI Layer** | DeepSeek-V3 / OpenAI GPT-4o-mini |

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/kunalkmaurya/job-rader.git
cd job-rader
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy `.env.example` to `.env` (or configure directly):
```bash
cp .env.example .env
```

### 4. Push database schema to Neon
```bash
npx drizzle-kit push
```

### 5. Run the development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# 1. Database (Neon Serverless PostgreSQL)
DATABASE_URL="postgresql://user:password@ep-sample.us-east-2.aws.neon.tech/neondb?sslmode=require"

# 2. Authentication & Security
ALLOWED_EMAIL="your-email@example.com"
AUTH_PASSWORD="your-strong-password"
JWT_SECRET="super-secret-jwt-key-minimum-32-characters"

# Optional: Google OAuth (Google Cloud Console)
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# 3. Telegram Webhook Bot (Optional for mobile capture)
TELEGRAM_BOT_TOKEN="123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
TELEGRAM_WEBHOOK_SECRET="your-telegram-webhook-secret"

# 4. Pluggable AI Extraction Layer ("deepseek" | "openai")
LLM_PROVIDER="deepseek"

# DeepSeek Configuration
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"
DEEPSEEK_BASE_URL="https://api.deepseek.com"

# OpenAI Configuration
OPENAI_API_KEY="sk-your-openai-api-key"
OPENAI_BASE_URL="https://api.openai.com/v1"
```

---

## Dashboard Shortcuts

| Key | Action |
|---|---|
| `/` | Focus search bar |
| `Esc` | Close notes drawer / dismiss modals |
| `Click on Card / Row` | Open job details & referral drawer |
| `Star` | Toggle priority job status |

---

