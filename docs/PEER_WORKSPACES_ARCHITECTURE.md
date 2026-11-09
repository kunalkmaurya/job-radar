# Peer Workspaces & Collaborative Job Pods Architecture

## 1. System Overview

Job Radar transforms from a single-player application tracker into a collaborative **Job Pod** platform for cohorts of up to 6 peers hunting for jobs together.

### Core Principles

1. **Shared Discovery, Private Execution**: Sourcing and job discovery are shared within the Pod (or sourced globally), while application status, notes, follow-up reminders, and referral outreach remain strictly private to each individual member.
2. **Zero-Friction Telegram Onboarding**: Group chats link via native Telegram `?startgroup=POD_CODE` deep links or a 1-line `/connect POD_CODE` command. No manual numeric chat IDs are required.
3. **Personal First, Pod Ready**: Solo users experience an unencumbered personal dashboard. Pod creation and peer invitations occur on-demand without mandatory multi-step wizards.
4. **Simple Activity Attribution**: Discovered jobs display subtle attribution (for example, "Shared by Kunal") without invasive tracking or clutter.

---

## 2. Entity Relationship Model

```
┌────────────────────────────────┐       ┌────────────────────────────────┐
│             users              │       │           workspaces           │
├────────────────────────────────┤       ├────────────────────────────────┤
│ id: uuid (PK)                  │◄──────┤ id: uuid (PK)                  │
│ email: varchar(255)            │       │ name: varchar(255)             │
│ name: varchar(255)             │       │ ownerId: uuid (FK -> users.id) │
│ role: varchar(50)              │       │ inviteCode: varchar(64) UNIQUE │
│ jobDigestFrequency: varchar    │       │ memberLimit: integer (def: 6)  │
│ createdAt / updatedAt          │       │ telegramChatId: varchar(100)   │
└───────────────┬────────────────┘       │ createdAt / updatedAt          │
                │                        └───────────────┬────────────────┘
                │                                        │
                ▼                                        ▼
┌────────────────────────────────┐       ┌────────────────────────────────┐
│       workspace_members        │       │          public_jobs           │
├────────────────────────────────┤       ├────────────────────────────────┤
│ id: uuid (PK)                  │       │ id: uuid (PK)                  │
│ workspaceId: uuid (FK -> ws)   │       │ company, role, link, location  │
│ userId: uuid (FK -> users)     │       │ workspaceId: uuid (NULL=global)│
│ role: varchar(32)              │       │ postedBy: uuid (FK -> users)   │
│ joinedAt: timestamp            │       │ submittedByName: varchar(255)  │
└────────────────────────────────┘       └───────────────┬────────────────┘
                                                         │ (cloned via "Track")
                                                         ▼
                                         ┌────────────────────────────────┐
                                         │              jobs              │
                                         ├────────────────────────────────┤
                                         │ id: uuid (PK)                  │
                                         │ publicJobId: uuid (FK)         │
                                         │ userId: uuid (FK -> users.id)  │
                                         │ status, notes, referralStatus  │
                                         │ appliedAt, followUpDate        │
                                         └────────────────────────────────┘
```

---

## 3. Telegram Ingestion & Handshake Flow

### 1-Click Group Connection Handshake

1. **Initiation**: The Pod owner clicks **"Connect Telegram Group"** in Workspace Settings.
2. **Deep Link Generation**: The client provides a native deep link:
   `https://t.me/<BOT_USERNAME>?startgroup=<INVITE_CODE>`
3. **Group Selection**: The user selects their peer group inside Telegram.
4. **Webhook Processing**: Telegram sends the bot addition event containing `chat.id` and payload `INVITE_CODE`.
5. **Association**: The backend updates `workspaces.telegramChatId = chat.id`.
6. **Confirmation**: The bot sends a message confirming the pod link.

### Message Processing Pipeline

1. A group member posts a URL (e.g., LinkedIn, Greenhouse, Lever, Ashby, Indeed).
2. The webhook resolves `message.chat.id` to the matching `workspaces` record.
3. The scraper and extraction engine parses role, company, salary, and location.
4. The job is inserted into `public_jobs` with `workspaceId = workspace.id` and `submittedByName = senderName`.
5. The job is immediately visible in the **Explore** feed of all Pod members.

---

## 4. Invite & Membership Lifecycle

- **Invite URL**: `https://<domain>/join?code=<INVITE_CODE>`
- **Member Cap Enforcement**: Each pod enforces `memberLimit = 6`. Attempting to join a full pod returns an HTTP 409 error.
- **Onboarding Route**:
  - Authenticated user: Added immediately to `workspace_members`.
  - Unauthenticated user: Directed through registration with `inviteCode` preserved in session, automatically added upon account creation.

---

## 5. Feed Resolution Architecture

When fetching opportunities in `/api/feed/jobs`:

1. Resolve the requesting user's active `workspaceId`.
2. Query `public_jobs` matching either:
   - `workspaceId = userWorkspaceId` (Pod-specific opportunities)
   - `workspaceId IS NULL` (Global curated tech jobs)
3. Return results sorted by `createdAt DESC`.
4. Render attribution badge (`Shared by <submittedByName>`) when `submittedByName` is present.
