# UI/UX Design Specification: Personal Job Search & Tracking Board

## 1. Design Philosophy & Aesthetic Principles

The UI is designed for high-efficiency job seekers handling high volumes of applications. It draws inspiration from modern productivity power-tools like **Linear**, **Raycast**, and **Vercel**:

1. **Information Density with Zero Clutter**: When hundreds of jobs are captured, the layout remains scannable, clean, and organized.
2. **Dual View Flexibility**: **List View** is optimized for high volume scanning, sorting, and batch actions; **Kanban Board** is optimized for visual pipeline progression. A 1-click toggle switches seamlessly between them.
3. **Dual Theme (Dark & Light Modes)**: Both Dark and Light themes are engineered with curated HSL color tokens, meeting WCAG AA+ contrast standards.
4. **Instant Keyboard & 1-Click Affordance**: Actions like "Apply & Advance", searching, and opening notes require minimum clicks and zero page reloads.

---

## 2. Design System & Design Tokens

### 2.1 Theme Color Palettes (Dark & Light)

| Token Name | Dark Mode Value | Light Mode Value | Usage |
|---|---|---|---|
| `--bg-app` | `#0B0F17` (Deep Obsidian) | `#F8FAFC` (Crisp Off-White) | App viewport background |
| `--bg-surface` | `#131B2B` (Surface Card) | `#FFFFFF` (Pure White) | Cards, modals, drawers |
| `--bg-surface-hover` | `#1A2438` | `#F1F5F9` | Hover states on rows and cards |
| `--border-subtle` | `rgba(255, 255, 255, 0.08)` | `rgba(0, 0, 0, 0.08)` | Dividers, card borders |
| `--border-focus` | `#3B82F6` (Electric Blue) | `#2563EB` | Active inputs, selected states |
| `--text-primary` | `#F8FAFC` | `#0F172A` | Company names, headings, primary text |
| `--text-secondary` | `#94A3B8` | `#475569` | Role titles, metadata, subheadings |
| `--text-muted` | `#64748B` | `#94A3B8` | Timestamps, placeholders, inactive icons |

### 2.2 Status Color Coding

| Stage | Dark Mode (Pill / Badge) | Light Mode (Pill / Badge) | Meaning |
|---|---|---|---|
| **Saved** | Text: `#60A5FA` / Bg: `rgba(59, 130, 246, 0.15)` | Text: `#1D4ED8` / Bg: `#EFF6FF` | Newly captured, unapplied |
| **Applied** | Text: `#FBBF24` / Bg: `rgba(245, 158, 11, 0.15)` | Text: `#B45309` / Bg: `#FEF3C7` | Application submitted |
| **Interviewing** | Text: `#C084FC` / Bg: `rgba(168, 85, 247, 0.15)` | Text: `#7E22CE` / Bg: `#F3E8FF` | Active interview rounds |
| **Offer** | Text: `#34D399` / Bg: `rgba(16, 185, 129, 0.15)` | Text: `#047857` / Bg: `#D1FAE5` | Offer received |
| **Rejected** | Text: `#F87171` / Bg: `rgba(239, 68, 68, 0.15)` | Text: `#B91C1C` / Bg: `#FEE2E2` | Application closed |
| **Archived** | Text: `#94A3B8` / Bg: `rgba(148, 163, 184, 0.12)`| Text: `#475569` / Bg: `#F1F5F9` | Stale or withdrawn |

### 2.3 Typography Stack
- **Primary Font**: `Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Monospace Font** (Dates & Links): `JetBrains Mono, Menlo, monospace`
- **Scale**:
  - `Display / H1`: 24px (Bold, tracking: -0.02em)
  - `H2 (Section Header)`: 18px (Semi-bold, tracking: -0.01em)
  - `Body / Primary`: 14px (Medium/Regular, line-height: 1.5)
  - `Caption / Badges`: 12px (Medium, tracking: 0.01em)

---

## 3. Screen Structure & Layout Hierarchy

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  ⚡ JOB RADAR    [ 🟢 Telegram Active ]       [☀️/🌙] [Bookmarklet] [Export] [+ Add Job] [User] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [ Total Jobs: 142 ]   [ Applied This Week: 18 ]   [ Active Interviews: 4 ]   [ Response: 28% ]│
├────────────────────────────────────────────────────────────────────────────────────────┤
│  [ 🔍 Search company or role... ]  [ All | Today | This Week | 30d ]  [ ⚠️ 3 Stale ] [ ☰ List | 📋 Board ] │
├────────────────────────────────────────────────────────────────────────────────────────┤
│                                                                                        │
│  TABLE / LIST VIEW (High-Volume Default)                                               │
│  [ ]  COMPANY          ROLE                      STATUS        APPLIED     ACTIONS     │
│  ────────────────────────────────────────────────────────────────────────────────────  │
│  [ ]  Stripe           Staff Infra Engineer      [Saved ▾]     --          [Apply ↗] [📝]│
│  [ ]  Datadog          Backend Systems Lead      [Applied ▾]   3 days ago  [View ↗]  [📝]│
│  [ ]  Linear           Frontend Engineer         [Interview ▾] 1 week ago  [View ↗]  [📝]│
│  [ ]  Vercel           Edge Runtime Specialist   [Applied ▾]   18 days ago⚠️[View ↗] [📝]│
│                                                                                        │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Component Specifications

### 4.1 Top Navigation Bar
- **App Branding**: Clean lightning bolt icon + `JOB RADAR`.
- **Telegram Webhook Status**: Interactive badge `🟢 Telegram Active`. Clicking opens a small tooltip showing:
  - Last synced: *"2 minutes ago"*
  - Channel name: *"My Job Channel"*
- **Theme Switcher**: Smooth button toggling between `Dark` and `Light` mode (stores preference in `localStorage`).
- **Bookmarklet Helper Button**: Opens a quick modal with the drag-to-bookmarks script.
- **Export CSV Button**: 1-click download of all records.
- **"+ Add Job" Glowing Button**: Accent-colored primary button (`#3B82F6` hover `#2563EB`).
- **User Avatar**: Google account profile image with a sleek dropdown for account info and Logout.

---

### 4.2 Funnel Analytics Ribbon
Four modern cards across the header with micro-sparklines or subtle gradient borders:
1. **Total Jobs**: All-time tracked jobs count.
2. **Applied This Week**: Shows weekly momentum with a mini trend badge (e.g. `+5 vs last week`).
3. **Active Interviews**: Current count of opportunities in the pipeline.
4. **Response Rate %**: Dynamically computed interview-to-application ratio.

---

### 4.3 Filter & Control Bar
- **Search Input**: Live instant search as you type (matches company or role, with keyboard shortcut `/` to focus).
- **Timeline Segmented Tabs**:
  - `All` (default)
  - `Today`
  - `This Week`
  - `Past 30 Days`
- **Stale Alert Chip**: Appears only when jobs in `Applied` have had no update for > 14 days:
  - Yellow badge: `⚠️ 3 Stale Applications`. Clicking it instantly filters the list to those 3 jobs for quick follow-up.
- **View Toggle**: Segmented button: `[ ☰ List View ]` | `[ 📋 Kanban Board ]`.

---

### 4.4 High-Density List View (Primary for High Volumes)

When tracking 50–200+ jobs, the list view allows high-speed scanning without endless scrolling:
- **Table Columns**:
  1. **Selection Checkbox**: For bulk actions (bulk mark applied, bulk archive).
  2. **Company**: Company logo/initials + bold name.
  3. **Role**: Clean title + subtle `location` & `exp` badges (e.g. `N/A`).
  4. **Status**: Interactive dropdown pill. Clicking allows changing status with 1 click without opening a modal.
  5. **Timeline / Age**: Relative timestamp (`"Added 2h ago"`, `"Applied 4d ago"`). If stale (> 14 days), displays an amber warning icon.
  6. **Quick Actions**:
     - **"Apply & Advance ↗"** (for `Saved` jobs): Opens external link and updates status to `Applied`.
     - **"Notes 📝"**: Opens the slide-over drawer.
     - **"Open Link ↗"** (for already applied jobs).
- **Zebra Hover Effect**: Subtle highlight on hover (`--bg-surface-hover`).
- **Bulk Action Bar**: When $\ge 1$ checkboxes are checked, a floating bottom bar appears:
  > *"3 jobs selected  |  [Mark as Applied]  [Move to Archive]  [Delete]  [Cancel]"*

---

### 4.5 Kanban Board View (Visual Pipeline)

Five responsive columns:
1. **Saved**
2. **Applied**
3. **Interviewing**
4. **Offer**
5. **Rejected**

#### Job Card Design:
- **Card Header**: Company avatar + Company Name + 3-dot menu.
- **Card Body**: Role title (large and crisp).
- **Card Footer**:
  - Time badge (e.g. `4d ago`).
  - Stale alert indicator if in Applied > 14 days.
  - Primary button:
    - If `Saved`: **"Apply & Advance ↗"** (opens URL + advances card).
    - If `Applied`/`Interviewing`: **"Notes 📝"** button showing preview if notes exist.
- **Drag-and-Drop / Move**: Smooth drag between columns or click the status badge to advance.

---

### 4.6 Slide-Over Notes Drawer (Interview & Follow-up Scratchpad)

Clicking any job row or card smoothly slides out a 450px panel from the right edge:
- **Header**:
  - Company Name & Role Title.
  - External job URL button.
  - Status selector dropdown.
- **Follow-up Date Picker**:
  - Date input with quick preset buttons: `[ +3 Days ]` `[ +1 Week ]` `[ Clear ]`.
- **Notes Scratchpad**:
  - Clean text area supporting markdown/bullet points.
  - Placeholder: *"Add referral contact, recruiter phone screen notes, or compensation details..."*
  - **Auto-save**: Saves automatically 500ms after you stop typing with a subtle *"Saved ✓"* indicator.
- **Activity & Timestamps**:
  - Shows when the job was ingested (`created_at`) and when it was applied to (`applied_at`).

---

### 4.7 "+ Add Job" Modal

Clean modal with 2 tabs:
- **Tab 1: Auto-Fetch (Paste Link)**:
  - Input field for Job URL.
  - Button: `"Scrape & Extract"` with a sleek animated loading shimmer.
  - Instant preview of extracted **Company** and **Role** with an option to edit before clicking `"Add to Board"`.
- **Tab 2: Manual Entry**:
  - 3 clean fields:
    - Company Name (Required)
    - Role Title (Required)
    - Job Link URL (Required)
  - Optional: Status dropdown (defaults to `Saved`) and initial Notes.

---

## 5. Micro-Interactions & Animation States

1. **Card Hover**: Subtle 2px elevation and 1px border glow.
2. **1-Click Apply & Advance**:
   - Opens the external job link in a new tab.
   - The card/row smoothly animates from `Saved` to `Applied` with an optimistic transition.
   - Shows a subtle toast: *"Moved to Applied (Timestamped)"*.
3. **Toast Notifications**:
   - Modern floating pill at bottom-center (e.g. *"Job saved successfully"*, *"Link copied"*, *"CSV downloaded"*).
4. **Skeleton Loaders**:
   - Smooth pulse shimmer while jobs are loading on initial page render.
5. **Stale Job Visual Accent**:
   - Subtle warm amber pulse on the date pill for jobs applied > 14 days ago to draw immediate attention.

---

## 6. Responsive Breakpoints

- **Desktop ($\ge 1280px$)**: Full 4-card analytics ribbon, complete list columns, 5-column Kanban board.
- **Laptop / Tablet ($768px - 1279px$)**: 2x2 analytics grid, compact list view, horizontally scrollable Kanban board.
- **Mobile ($< 768px$)**: Single-column view, list view with collapsible details, bottom navigation bar.
