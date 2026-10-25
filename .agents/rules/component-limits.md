---
description: Enforce maximum 150 lines of code per component file across the codebase.
globs: ["src/components/**/*.tsx", "src/components/**/*.ts"]
---

# Component Size Limit (Max 150 Lines)

- **Strict Constraint**: No component file in the workspace should exceed 150 lines of code.
- **Decomposition Pattern**: When a component approaches 150 lines:
  1. Extract data structures, static mocks, and types into `types.ts` or `data.ts`.
  2. Extract sub-views or complex UI sections into child components in a subfolder (e.g. `src/components/<feature>/<subfeature>/`).
  3. Extract complex business logic or async handlers into dedicated custom hooks or utility helpers.
- **Goal**: Maintain extreme modularity, readability, and ease of maintenance across all features.
