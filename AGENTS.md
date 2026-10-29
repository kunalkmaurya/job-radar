<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

## Development & Component Architecture Rules

### 1. Component Size Limit

- **Maximum 150 Lines per Component**: No UI component file should ever exceed 150 lines of code.
- If a component grows near or exceeds 150 lines, it must be decomposed into modular sub-components, separated data/mock files, custom hooks, or dedicated view components.
- Group related sub-components into feature folders (e.g. `src/components/landing/specimen/`).

### 2. Git Commit & Push Rule

- **No unprompted git commits or pushes**: Never commit or push to git without explicit instruction from the user.

### 3. Global File Size Limit (Max 350 Lines)

- **Maximum 350 Lines per File**: No file anywhere in the workspace may exceed 350 lines of code.

### 4. Zero Emojis & No Unnecessary Comments

- **No Emojis**: Never use emojis in UI copy, JSX, console logs, scripts, comments, or code.
- **No Unnecessary Comments**: Remove redundant, decorative, or trivial comments. Never introduce unnecessary comments during code edits.

### 5. Mandatory Verification Cycle After Changes

- After every change, always run and verify:
  1. `npm run format:check`
  2. `npm run lint`
  3. `npx tsc --noEmit`

<!-- END:nextjs-agent-rules -->
