<div align="center">

# Job Radar

### High-Speed Application Pipeline & Career Telemetry Command Center

A private, distraction-free command center for modern software engineers. Ingest job postings instantly from mobile via Telegram, auto-extract job specs using AI, manage referrals, track follow-ups, collaborate with peers in dedicated Job Pods, and visualize velocity across Table and Kanban views.

[![Next.js 16](https://img.shields.io/badge/Next.js-16.4.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.3.0-blue?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Drizzle ORM](https://img.shields.io/badge/ORM-Drizzle%200.45-green?style=flat-square&logo=databricks)](https://orm.drizzle.team/)
[![Neon Database](https://img.shields.io/badge/Database-Neon%20Serverless%20Postgres-00E599?style=flat-square&logo=postgresql)](https://neon.tech/)
[![TailwindCSS 4](https://img.shields.io/badge/Styling-Tailwind%20v4-38B2AC?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)

[Visual Walkthrough](#visual-walkthrough) • [Key Features](#key-features) • [Technical Architecture](#technical-architecture) • [Getting Started](#getting-started) • [Environment Setup](#environment-variables)

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

### 4. Dedicated Peer Job Pod Feed

Pool job opportunities with up to 6 peers straight from shared Telegram groups. Features docked bottom pagination and isolated opportunity tracking.
<div align="center">
  <img src="docs/screenshots/pod-feed.png" alt="Job Radar Peer Pod Feed" width="100%" />
</div>

---

### 5. Peer Pod Collaboration & Telegram Sync

Invite peers via unique invitation links (`/join?code=...`), connect private Telegram groups, test bot connectivity, and manage pod membership.
<div align="center">
  <img src="docs/screenshots/pod-modal.png" alt="Job Radar Pod Collaboration Modal" width="100%" />
</div>

---

### 6. Curated Explore Feed

Separate verified public opportunity feed with admin curation, 1-click pipeline import, search filtering, and responsive grid/list switcher.
<div align="center">
  <img src="docs/screenshots/explore-feed.png" alt="Job Radar Explore Feed" width="100%" />
</div>

---

### 7. Application Details & Referral Tracker Drawer

Slide-out drawer containing follow-up calendar reminder presets (`+3d`, `+1w`), complete referral tracking (referral status, referrer name, contact, notes), and markdown scratchpad.
<div align="center">
  <img src="docs/screenshots/job-details-drawer.png" alt="Job Radar Details & Referral Drawer" width="100%" />
</div>

---

### 8. Application Velocity & Conversion Analytics

14-day interactive timeline bar charts, application throughput counters, and multi-stage conversion funnel telemetry.
<div align="center">
  <img src="docs/screenshots/dashboard-analytics.png" alt="Job Radar Analytics Dashboard" width="100%" />
</div>

---

## Key Features

- **Peer Job Pods (Collaborative Pooling)**:
  - Create or join peer pods (up to 6 members) with secure invite codes (`/join?code=...`).
  - Connect a shared Telegram group: any job link posted by members is scraped and added to the shared Pod Feed.
  - Strict separation: Pod opportunities remain within the pod and never pollute the public feed.
  - 1-click tracking: Members can import any pod listing directly into their private pipeline.

- **Public Job Feed & 1-Click Tracking**:
  - **Explore Feed**: Curated public listings posted by administrators.
  - **Grid & List Switcher**: Seamless toggle between responsive cards and table view.
  - **Docked Bottom Pagination**: Anchored pagination bar ensures consistent viewport layout.

- **Multi-Channel Job Ingestion**:
  - **Telegram Bot Webhook**: Post raw job URLs to auto-extract company, role, location, and metadata via AI.
  - **Browser Bookmarklet**: Drag-and-drop bookmarklet to capture career pages directly from browser tabs.
  - **Auto-Fetch Modal**: Scrape role details on-demand with DeepSeek or OpenAI.
  - **Manual Fast Entry**: Keyboard-friendly dialog for manual submissions.

- **Complete Referral Tracking**:
  - Explicit pipeline tracking across 4 states: `No Referral`, `Asked`, `Got Referral`, `Declined`.
  - Store referrer contact information (LinkedIn, email, phone) and internal notes.
  - Color-coded referral tags in Table and Kanban cards.

- **Smart Sync & Performance**:
  - **Zero Network Spam**: Server-side ETag computation returns HTTP `304 Not Modified` when unchanged.
  - **Visibility-Aware Polling**: Sync timers pause when tabs are backgrounded.
  - **Instant Window-Focus Revalidation**: Immediate background refresh on refocus.

- **Data Sovereignty & Security**:
  - Whitelist-enforced authentication with signed 30-day JWT sessions in `HttpOnly` cookies.
  - Instant 1-click CSV export of your entire pipeline history.
  - Serverless PostgreSQL (Neon) with migrations managed via Drizzle Kit.

---

## Technical Architecture

```mermaid
graph TD
    subgraph Ingestion Channels
        TG[Telegram Mobile / Pod Group]
        BM[Browser Bookmarklet]
        FE[Dashboard UI / Auto-Fetch Modal]
    end

    subgraph Core Next.js 16 Application
        API_TG["/api/telegram-webhook"]
        API_POD["/api/workspaces/*"]
        API_JOBS["/api/jobs"]
        API_FEED["/api/feed/jobs"]
    end

    subgraph AI Extraction Layer
        LLM[DeepSeek-V3 / OpenAI API]
    end

    subgraph Storage Layer
        DB[(Neon Serverless PostgreSQL)]
        DRZ[Drizzle ORM Schema]
    end

    TG -->|Webhook / Poller| API_TG
    BM -->|Payload| API_JOBS
    FE -->|JSON Payload| API_JOBS

    API_TG -->|HTML Scrape & Parse| LLM
    API_JOBS -->|URL Auto-Fetch| LLM
    LLM -->|Parsed Job Metadata| API_TG
    API_TG -->|Workspace Scoped Insert| DRZ
    API_JOBS -->|Personal Insert| DRZ
    DRZ --> DB
```

---

## Tech Stack

| Layer              | Technology                                                                                           |
| ------------------ | ---------------------------------------------------------------------------------------------------- |
| **Framework**      | [Next.js 16.4](https://nextjs.org/) (App Router, Turbopack)                                          |
| **Language**       | [TypeScript 5](https://www.typescriptlang.org/)                                                      |
| **UI Library**     | [React 19](https://react.dev/)                                                                       |
| **Styling**        | [TailwindCSS 4](https://tailwindcss.com/) + Design Tokens                                            |
| **Icons**          | [Lucide React](https://lucide.dev/)                                                                  |
| **Database**       | [Neon Serverless PostgreSQL](https://neon.tech/)                                                     |
| **ORM**            | [Drizzle ORM](https://orm.drizzle.team/) & [Drizzle Kit](https://orm.drizzle.team/kit-docs/overview) |
| **Authentication** | [Jose](https://github.com/panva/jose) (JWT) + Google OAuth                                           |
| **AI Layer**       | DeepSeek-V3 / OpenAI GPT-4o-mini                                                                     |

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/kunalkmaurya/job-radar.git
cd job-radar
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

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

## Dashboard Shortcuts

| Key                   | Action                              |
| --------------------- | ----------------------------------- |
| `/`                   | Focus search bar                    |
| `Esc`                 | Close notes drawer / dismiss modals |
| `Click on Card / Row` | Open job details & referral drawer  |
| `Star`                | Toggle priority job status          |
