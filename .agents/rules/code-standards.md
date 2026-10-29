---
description: Enforce zero emojis, no unnecessary comments, max 350 lines per file, and post-change lint/format/type verification.
globs: 'src/**/*.{tsx,ts,css}'
---

# Code Cleanliness, Size Limits & Verification Rules

## 1. Global File Size Limit (Max 350 Lines)

- **Strict Limit**: No file in the codebase may ever exceed **350 lines of code**.
- **Component Limit Reminder**: UI components (`.tsx`) must still strictly adhere to the tighter **$\le$ 150-line limit** per `.agents/rules/component-limits.md`.
- Any non-component file (utility, route, schema, script) that approaches 350 lines must be split into modular domain modules.

## 2. Zero Emojis Across Entire Codebase

- **Strict Prohibition**: Never use emojis in UI copy, JSX, console logs, scripts, markdown comments, or code.
- Replace decorative unicode symbols or emojis with clean text, Lucide React icons, or standard alphanumeric labels.

## 3. No Unnecessary Comments

- Remove redundant, obvious, or boilerplate comments across the codebase (e.g., `// Status filter`, `// 30 days`, `// Verify session`, `// fallback`).
- Do **not** add decorative or narration comments when writing or editing code.
- Code should be clean and self-explanatory through meaningful naming.

## 4. Mandatory Post-Change Verification Cycle

After making any code changes, always verify:

1. **Formatting**: `npm run format:check` (or `npm run format`)
2. **Linting**: `npm run lint`
3. **Type Safety**: `npx tsc --noEmit`
4. **File Length**: Verify no modified file violates the line thresholds ($\le$ 150 for components, $\le$ 350 for all files).
