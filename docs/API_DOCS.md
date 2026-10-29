# API Documentation: Personal Job Search & Tracking Board

## 1. API Architecture & Standards

All endpoints follow RESTful design principles and are served under the `/api` namespace by Next.js Route Handlers.

### General Conventions:

- **Base URL**: `/api`
- **Data Format**: `application/json` (requests and responses), except CSV export (`text/csv`).
- **Date Format**: ISO 8601 UTC timestamps (e.g., `2026-10-24T15:30:00.000Z`).
- **Standard Success Response Envelope**:
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```
- **Standard Error Response Envelope**:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "Human-readable explanation of error",
      "details": null
    }
  }
  ```

---

## 2. Authentication & Security

### 2.1 Session Cookie (`auth_token`)

- Protected endpoints require an `HttpOnly`, `SameSite=Lax`, `Secure` cookie named `auth_token`.
- Contains a signed JWT verified by Next.js Edge Middleware.
- The user's email in the JWT payload must match `process.env.ALLOWED_EMAIL`.

### 2.2 Telegram Webhook Security

- Telegram updates are validated using the header:
  ```http
  X-Telegram-Bot-Api-Secret-Token: <TELEGRAM_WEBHOOK_SECRET>
  ```
- Any request lacking this header or with an invalid secret is immediately rejected with `401 Unauthorized`.

---

## 3. Endpoints Overview

| Method     | Endpoint                | Description                                  | Auth Required   |
| ---------- | ----------------------- | -------------------------------------------- | --------------- |
| **GET**    | `/api/auth/google`      | Initiates Google OAuth redirect              | Public          |
| **GET**    | `/api/auth/callback`    | Google OAuth redirect callback               | Public          |
| **POST**   | `/api/auth/logout`      | Clears session cookie and logs out           | Session         |
| **GET**    | `/api/auth/me`          | Fetches authenticated owner profile          | Session         |
| **POST**   | `/api/telegram-webhook` | Ingests Telegram channel posts               | Telegram Secret |
| **POST**   | `/api/jobs/preview`     | Auto-scrapes & extracts company/role preview | Session         |
| **POST**   | `/api/jobs/manual`      | Creates a job entry manually                 | Session         |
| **POST**   | `/api/jobs/bookmarklet` | Ingests URL from browser bookmarklet         | Session         |
| **GET**    | `/api/jobs`             | Lists jobs with filters & search             | Session         |
| **GET**    | `/api/jobs/:id`         | Fetches details of a specific job            | Session         |
| **PATCH**  | `/api/jobs/:id`         | Updates job fields (status, notes, date)     | Session         |
| **POST**   | `/api/jobs/:id/apply`   | 1-Click "Apply & Advance" action             | Session         |
| **DELETE** | `/api/jobs/:id`         | Deletes a job record                         | Session         |
| **POST**   | `/api/jobs/bulk`        | Bulk updates status or bulk deletes          | Session         |
| **GET**    | `/api/analytics/funnel` | Aggregates funnel metrics for top ribbon     | Session         |
| **GET**    | `/api/jobs/export`      | Downloads application data as CSV            | Session         |

---

## 4. Authentication Endpoints

### 4.1 Initiate Google OAuth

`GET /api/auth/google`

Redirects the browser to Google's OAuth 2.0 consent screen requesting `openid`, `email`, and `profile` scopes.

---

### 4.2 Google OAuth Callback

`GET /api/auth/callback?code=...&state=...`

Exchanges authorization code for tokens, verifies profile with Google, checks if `email === ALLOWED_EMAIL`, sets signed JWT in `auth_token` cookie, and redirects to `/dashboard`.

#### Error Redirect:

If email does not match `ALLOWED_EMAIL`, clears cookie and redirects to `/login?error=UnauthorizedAccount`.

---

### 4.3 Get Authenticated Profile

`GET /api/auth/me`

#### Response:

```json
{
  "success": true,
  "data": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "kunal@example.com",
    "name": "Kunal Kumar",
    "image": "https://lh3.googleusercontent.com/..."
  }
}
```

---

### 4.4 Logout

`POST /api/auth/logout`

Expires the `auth_token` cookie and invalidates the session.

#### Response:

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

## 5. Ingestion Pipeline Endpoints

### 5.1 Telegram Silent Webhook

`POST /api/telegram-webhook`

Called automatically by Telegram when a new message is posted in your channel.

#### Headers:

```http
Content-Type: application/json
X-Telegram-Bot-Api-Secret-Token: your_secret_token_here
```

#### Request Body (Telegram Update):

```json
{
  "update_id": 10002495,
  "channel_post": {
    "message_id": 142,
    "chat": {
      "id": -1001987654321,
      "title": "My Job Radar",
      "type": "channel"
    },
    "date": 1729784500,
    "text": "Check this opening: https://boards.greenhouse.io/stripe/jobs/6543210"
  }
}
```

#### Response:

Immediate `HTTP 200` (< 200ms). Webhook initiates scraping and AI extraction asynchronously.

```json
{
  "ok": true
}
```

---

### 5.2 Auto-Scrape Link Preview

`POST /api/jobs/preview`

Scrapes a given URL and runs AI extraction without immediately writing to the database. Used by the Dashboard modal when pasting a link.

#### Request Body:

```json
{
  "link": "https://jobs.lever.co/linear/12345"
}
```

#### Response (Success):

```json
{
  "success": true,
  "data": {
    "company": "Linear",
    "role": "Senior Frontend Engineer",
    "link": "https://jobs.lever.co/linear/12345",
    "location": "N/A",
    "exp": "N/A"
  }
}
```

---

### 5.3 Manual Job Creation

`POST /api/jobs/manual`

Directly inserts a job into the database.

#### Request Body:

```json
{
  "company": "Datadog",
  "role": "Staff Platform Engineer",
  "link": "https://careers.datadoghq.com/detail/1234",
  "status": "Saved",
  "notes": "Referral from Alex",
  "follow_up_date": "2026-11-01"
}
```

#### Response (201 Created):

```json
{
  "success": true,
  "data": {
    "id": "c3a4f6d8-912b-4832-8431-7b02c81523a1",
    "company": "Datadog",
    "role": "Staff Platform Engineer",
    "link": "https://careers.datadoghq.com/detail/1234",
    "status": "Saved",
    "location": "N/A",
    "exp": "N/A",
    "notes": "Referral from Alex",
    "follow_up_date": "2026-11-01",
    "applied_at": null,
    "source": "manual",
    "created_at": "2026-10-24T15:35:00.000Z"
  }
}
```

#### Error Response (409 Conflict - Duplicate Link):

```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_JOB",
    "message": "This job link has already been saved."
  }
}
```

---

### 5.4 Browser Bookmarklet Ingestion

`POST /api/jobs/bookmarklet`

Triggered by the desktop browser bookmarklet.

#### Query Parameters / Body:

```json
{
  "url": "https://apple.wd3.myworkdayjobs.com/en-US/Apple_Jobs/job/Software-Engineer_REQ-12345"
}
```

#### Response (200 OK):

```json
{
  "success": true,
  "message": "Job link received and queued for ingestion",
  "url": "https://apple.wd3.myworkdayjobs.com/..."
}
```

---

## 6. Job Management Endpoints

### 6.1 List Jobs (with Filtering & Search)

`GET /api/jobs`

#### Query Parameters:

| Parameter  | Type      | Required | Default | Description                                                                                      |
| ---------- | --------- | -------- | ------- | ------------------------------------------------------------------------------------------------ |
| `timeline` | `string`  | No       | `'all'` | `'today'`, `'this_week'`, `'past_30_days'`, `'all'`                                              |
| `status`   | `string`  | No       | _None_  | Filter by stage: `'Saved'`, `'Applied'`, `'Interviewing'`, `'Offer'`, `'Rejected'`, `'Archived'` |
| `search`   | `string`  | No       | _None_  | Case-insensitive search on `company` or `role`                                                   |
| `stale`    | `boolean` | No       | `false` | If `true`, returns only jobs in `'Applied'` for > 14 days                                        |
| `page`     | `number`  | No       | `1`     | Page number                                                                                      |
| `limit`    | `number`  | No       | `50`    | Results per page (max `100`)                                                                     |

#### Example Request:

`GET /api/jobs?timeline=this_week&status=Saved&search=engineer`

#### Response:

```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "c3a4f6d8-912b-4832-8431-7b02c81523a1",
        "company": "Stripe",
        "role": "Backend Engineer",
        "link": "https://stripe.com/jobs/123",
        "status": "Saved",
        "location": "N/A",
        "exp": "N/A",
        "notes": "",
        "follow_up_date": null,
        "applied_at": null,
        "source": "telegram",
        "created_at": "2026-10-24T12:00:00.000Z",
        "updated_at": "2026-10-24T12:00:00.000Z"
      }
    ],
    "pagination": {
      "total": 1,
      "page": 1,
      "limit": 50,
      "total_pages": 1
    }
  }
}
```

---

### 6.2 Get Single Job

`GET /api/jobs/:id`

#### Response:

```json
{
  "success": true,
  "data": {
    "id": "c3a4f6d8-912b-4832-8431-7b02c81523a1",
    "company": "Stripe",
    "role": "Backend Engineer",
    "link": "https://stripe.com/jobs/123",
    "status": "Saved",
    "location": "N/A",
    "exp": "N/A",
    "notes": "Recruiter message on LinkedIn",
    "follow_up_date": "2026-11-05",
    "applied_at": null,
    "source": "telegram",
    "created_at": "2026-10-24T12:00:00.000Z",
    "updated_at": "2026-10-24T12:00:00.000Z"
  }
}
```

---

### 6.3 Update Job Details

`PATCH /api/jobs/:id`

Updates editable fields on a job record.

#### Request Body (Any subset of fields):

```json
{
  "status": "Interviewing",
  "notes": "First round with Engineering Director completed on Thursday.",
  "follow_up_date": "2026-11-03"
}
```

#### Response:

```json
{
  "success": true,
  "data": {
    "id": "c3a4f6d8-912b-4832-8431-7b02c81523a1",
    "company": "Stripe",
    "role": "Backend Engineer",
    "status": "Interviewing",
    "notes": "First round with Engineering Director completed on Thursday.",
    "follow_up_date": "2026-11-03",
    "updated_at": "2026-10-24T15:40:00.000Z"
  }
}
```

---

### 6.4 1-Click "Apply & Advance" Action

`POST /api/jobs/:id/apply`

Specialized endpoint for the 1-click action on job cards. Sets `status = 'Applied'` and stamps `applied_at = NOW()`.

#### Response:

```json
{
  "success": true,
  "data": {
    "id": "c3a4f6d8-912b-4832-8431-7b02c81523a1",
    "status": "Applied",
    "applied_at": "2026-10-24T15:42:00.000Z",
    "updated_at": "2026-10-24T15:42:00.000Z"
  }
}
```

---

### 6.5 Delete Job

`DELETE /api/jobs/:id`

Removes a job entry from the board.

#### Response:

```json
{
  "success": true,
  "message": "Job deleted successfully"
}
```

---

### 6.6 Bulk Actions

`POST /api/jobs/bulk`

Performs batch operations on multiple jobs simultaneously.

#### Request Body (Batch Status Update):

```json
{
  "ids": ["c3a4f6d8-...", "e8b2a1c0-..."],
  "action": "update_status",
  "status": "Archived"
}
```

#### Request Body (Batch Delete):

```json
{
  "ids": ["c3a4f6d8-...", "e8b2a1c0-..."],
  "action": "delete"
}
```

#### Response:

```json
{
  "success": true,
  "affected_rows": 2
}
```

---

## 7. Analytics & Export Endpoints

### 7.1 Funnel Analytics Ribbon

`GET /api/analytics/funnel`

Returns calculated application stats displayed across the dashboard header.

#### Response:

```json
{
  "success": true,
  "data": {
    "total_jobs": 48,
    "applied_this_week": 14,
    "interviewing_count": 4,
    "offer_count": 1,
    "response_rate_percentage": 27.8
  }
}
```

---

### 7.2 1-Click CSV Export

`GET /api/jobs/export`

Exports all stored jobs and tracking details as a downloadable CSV file.

#### Headers Returned:

```http
Content-Type: text/csv; charset=utf-8
Content-Disposition: attachment; filename="job_applications_2026-10-24.csv"
```

#### CSV Sample Content:

```csv
ID,Company,Role,Link,Location,Exp,Status,Notes,Follow Up Date,Applied At,Created At
c3a4f6d8-...,Stripe,Backend Engineer,https://stripe.com/jobs/123,N/A,N/A,Applied,"Referral by Sarah",2026-11-01,2026-10-24 15:42:00,2026-10-24 12:00:00
```

---

## 8. HTTP Status Codes & Error Definitions

| Status Code            | Meaning                      | Common Scenario                             |
| ---------------------- | ---------------------------- | ------------------------------------------- |
| **200 OK**             | Request succeeded            | Standard GET / PATCH response               |
| **201 Created**        | Resource created             | Manual job entry inserted                   |
| **400 Bad Request**    | Invalid payload              | Zod schema validation failed                |
| **401 Unauthorized**   | Missing/invalid auth         | Missing JWT cookie or bad Telegram secret   |
| **403 Forbidden**      | Authenticated but disallowed | Google email does not match `ALLOWED_EMAIL` |
| **404 Not Found**      | Resource missing             | Job ID does not exist                       |
| **409 Conflict**       | Duplicate resource           | Job link already exists in database         |
| **500 Internal Error** | Server failure               | Database or external service exception      |
