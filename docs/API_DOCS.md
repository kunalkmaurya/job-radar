# API Documentation: Job Radar Platform

## 1. Standards & Conventions

All endpoints follow REST principles and are served under the `/api` namespace.

- **Base URL**: `/api`
- **Data Format**: `application/json` (requests and responses)
- **Timestamps**: ISO 8601 UTC strings (e.g., `2026-10-31T15:30:00.000Z`)
- **Success Envelope**:
  ```json
  { "success": true, "data": { ... } }
  ```
- **Error Envelope**:
  ```json
  { "success": false, "error": { "code": "ERROR_CODE", "message": "Details" } }
  ```

---

## 2. Authentication & Authorization

- **Session Cookie**: `auth_token` (HTTP-only, Secure, SameSite=Lax) containing a signed 30-day JWT.
- **Roles**:
  - `admin`: Full administrative access (posting public feed jobs, telemetry). Configured via `ADMIN_EMAIL`.
  - `user`: Standard user managing their private pipeline and tracking public opportunities.
- **Open Access**: Enabled when `ALLOWED_EMAIL="*"` or when email matches allowlist.

---

## 3. Endpoints Overview

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/auth/google` | Initiates Google OAuth redirect | Public |
| **GET** | `/api/auth/callback` | Handles Google OAuth callback | Public |
| **POST** | `/api/auth/login` | Email/password credential login | Public |
| **POST** | `/api/auth/logout` | Clears session cookie | Authenticated |
| **GET** | `/api/auth/me` | Returns current user profile & role | Authenticated |
| **GET** | `/api/jobs` | Fetches personal pipeline jobs | Authenticated |
| **POST** | `/api/jobs` | Creates a new personal job (auto-scrape or manual) | Authenticated |
| **PATCH** | `/api/jobs/[id]` | Updates status, notes, referral info, or reminder | Authenticated |
| **DELETE** | `/api/jobs/[id]` | Deletes a job application from private board | Authenticated |
| **GET** | `/api/feed/jobs` | Fetches public feed jobs with `isTracked` state | Authenticated |
| **POST** | `/api/feed/jobs` | Posts a new job to the public feed | Admin Only |
| **POST** | `/api/feed/jobs/[id]/track` | Clones a public job to personal pipeline | Authenticated |
| **POST** | `/api/telegram-webhook` | Ingests job links from Telegram channels | Webhook Secret |

---

## 4. Authentication Endpoints

### `POST /api/auth/login`
Logs in using email and workspace password.
- **Request Body**:
  ```json
  { "email": "user@example.com", "password": "access-password" }
  ```
- **Response `200`**: Sets `auth_token` cookie and returns `{ "success": true, "redirect": "/dashboard" }`.

### `GET /api/auth/me`
Fetches the active user session.
- **Response `200`**:
  ```json
  {
    "success": true,
    "data": {
      "sub": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "name": "Alex Dev",
      "role": "user"
    }
  }
  ```

---

## 5. Personal Pipeline Endpoints

### `GET /api/jobs`
Fetches all jobs belonging to the authenticated user (`jobs.user_id = session.sub`).
- **Query Parameters**:
  - `timeline`: `all` (default) \| `today` \| `this_week` \| `past_30_days`
  - `status`: Filter by status (`Saved`, `Applied`, `Interviewing`, `Offer`, `Rejected`, `Archived`)
- **Response `200`**:
  ```json
  {
    "success": true,
    "data": {
      "jobs": [
        {
          "id": "uuid",
          "publicJobId": "uuid-or-null",
          "company": "Stripe",
          "role": "Backend Engineer",
          "link": "https://stripe.com/jobs/123",
          "status": "Saved",
          "isImportant": false,
          "referralStatus": "none",
          "notes": "",
          "createdAt": "2026-10-31T10:00:00Z"
        }
      ],
      "total": 1
    }
  }
  ```

### `POST /api/jobs`
Creates a job in the user's private pipeline.
- **Manual Mode**:
  ```json
  {
    "company": "Figma",
    "role": "Systems Engineer",
    "link": "https://figma.com/careers/123",
    "status": "Saved"
  }
  ```
- **Auto-Extract Mode**:
  ```json
  { "link": "https://figma.com/careers/123" }
  ```
- Scrapes the URL with Jina Reader and parses company/role with DeepSeek/OpenAI.

### `PATCH /api/jobs/[id]`
Updates an application in the user's private pipeline.
- **Request Body**:
  ```json
  {
    "status": "Applied",
    "notes": "Spoke to team lead; round 1 scheduled",
    "followUpDate": "2026-11-05",
    "isImportant": true,
    "referralStatus": "referred",
    "referrerName": "Sarah Connor",
    "referrerContact": "sarah@linkedin"
  }
  ```

### `DELETE /api/jobs/[id]`
Permanently removes a job application from the private pipeline.

---

## 6. Public Feed Endpoints

### `GET /api/feed/jobs`
Fetches public feed opportunities, sorted chronologically with tracking detection.
- **Query Parameters**:
  - `search`: Filter by company, role, or location prefix.
- **Response `200`**:
  ```json
  {
    "success": true,
    "data": {
      "jobs": [
        {
          "id": "c1f7a244-6721-4f33-8a33-2895fa8f19da",
          "company": "Apple",
          "role": "Software Engineer",
          "link": "https://jobs.apple.com/...",
          "location": "Cupertino, CA",
          "exp": "Mid-Senior",
          "source": "admin",
          "isTracked": false,
          "createdAt": "2026-10-31T14:00:00Z"
        }
      ],
      "total": 76
    }
  }
  ```

### `POST /api/feed/jobs` (Admin Only)
Posts a new curated job opportunity to the public feed.
- **Request Body**:
  ```json
  {
    "company": "Vercel",
    "role": "Staff Frontend Engineer",
    "link": "https://vercel.com/careers/...",
    "location": "Remote",
    "exp": "5+ years"
  }
  ```

### `POST /api/feed/jobs/[id]/track`
Clones a public job into the authenticated user's private pipeline.
- Automatically associates `public_job_id` and sets `status = 'Saved'`.
- **Response `200`**:
  ```json
  {
    "success": true,
    "message": "Job successfully added to your personal dashboard",
    "data": { "id": "new-job-uuid", "status": "Saved", ... }
  }
  ```

---

## 7. Ingestion Webhook

### `POST /api/telegram-webhook`
Receives Telegram channel updates.
- **Header**: `X-Telegram-Bot-Api-Secret-Token: <SECRET>`
- If `chat.id` belongs to a registered user (`telegram_chat_id`), links are ingested into their personal board.
- If unassigned or admin channel, links are scraped and ingested into `public_jobs`.
