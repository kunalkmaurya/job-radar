---
description: Enforce architectural modularity and a strict 150-line limit across all UI and component files.
globs: 'src/**/*.{tsx,ts}'
---

# Component Architecture & Size Limit Rule (Max 150 Lines)

## 1. Core Principle & Hard Constraint

- **Hard Limit**: No UI component or view file (`.tsx`) may exceed **150 lines of code**.
- **Soft Warning Threshold**: When a component crosses **120 lines**, it must be evaluated for decomposition before adding new logic or UI elements.
- **No Line-Count Cheating**: Do **not** compress multi-line JSX, remove readability formatting, collapse imports onto single lines, or chain expressions solely to bypass the limit. Code reduction must be achieved through genuine **architectural decomposition**.

---

## 2. The 4-Pillar Decomposition Strategy

When a component approaches 120–150 lines, decompose it following this hierarchy:

```
┌────────────────────────────────────────────────────────┐
│                   Component Shell                      │
│             (Thin Orchestrator <= 150 Lines)           │
└───────┬──────────────┬──────────────┬───────────┬──────┘
        │              │              │           │
        ▼              ▼              ▼           ▼
   [Types/Data]    [Custom Hook]  [Sub-Views]  [Helpers]
    types.ts        useFeature.ts  subfolder/   helpers.ts
```

### Pillar 1: Extract Types, Schemas & Static Data

- Move TypeScript interfaces, type aliases, Zod schemas, status configs, and static/mock dataset definitions out of the component file.
- Place in a co-located `types.ts`, `data.ts`, or `statusConfig.ts`.

### Pillar 2: Decouple Logic into Custom Hooks

- Extract all complex state orchestrations, `useEffect` routines, multi-step callbacks, and API fetches into dedicated custom hooks (e.g. `hooks/use<Feature>.ts`, `use<SubFeature>.ts`).
- The UI component should only consume clean state primitives and action handlers from the hook.

### Pillar 3: Slice UI into Co-Located Sub-Components

- Break large JSX trees into focused, single-responsibility sub-components in a dedicated feature subfolder.
- **Feature Folder Structure Standard**:
  ```
  src/components/<feature>/
  ├── <FeatureView>.tsx        # Main orchestrator / shell (<= 150 lines)
  ├── index.ts                 # Clean barrel export
  ├── types.ts                 # Scoped types & props interfaces
  ├── helpers.ts               # Pure formatting & data manipulation
  ├── hooks/                   # Custom hooks for state & async handlers
  │   └── use<Feature>.ts
  ├── modals/                  # Feature modals & dialogs
  └── subcomponents/           # Atomic section pieces
      ├── <FeatureHeader>.tsx
      ├── <FeatureBody>.tsx
      └── <FeatureRow>.tsx
  ```

### Pillar 4: Pure Helpers & Computational Utilities

- Extract formatting algorithms, date calculations, metric aggregations, and string parsers into a co-located `helpers.ts` or `<feature>Helpers.ts`.
- Keep UI components purely declarative.

---

## 3. Real-World Architectural Blueprint

Follow the established patterns in this repository:

| Feature Area            | Orchestrator (<= 150 Lines) | Decomposed Sub-Units                                                                                                                                                                |
| ----------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Pipeline Workspace**  | `PipelineView.tsx`          | `JobStatusTabs.tsx`, `TimelineBar.tsx`, `AnalyticsRibbon.tsx`, `ControlBar.tsx`, `JobListView.tsx`, `JobKanbanView.tsx`                                                             |
| **Job Details Drawer**  | `NotesDrawer.tsx`           | `drawer/DrawerHeader.tsx`, `drawer/DrawerFollowUp.tsx`, `drawer/DrawerReferralSection.tsx`, `drawer/DrawerNotesSection.tsx`                                                         |
| **Analytics Dashboard** | `AnalyticsView.tsx`         | `AnalyticsVelocityCards.tsx`, `AnalyticsVelocityChart.tsx`, `AnalyticsFunnelFlow.tsx`, `AnalyticsWeeklyRhythm.tsx`, `AnalyticsSourceBreakdown.tsx`, `AnalyticsCompanyBreakdown.tsx` |
| **Settings Engine**     | `SettingsView.tsx`          | `SettingsLLMConfig.tsx`, `SettingsTelegramConfig.tsx`, `SettingsThemeAppearance.tsx`, `SettingsPipelineAutomation.tsx`, `SettingsAccessDataBackup.tsx`                              |
| **Landing Specimen**    | `InteractiveSpecimen.tsx`   | `specimen/SpecimenHeader.tsx`, `specimen/SpecimenInputBar.tsx`, `specimen/SpecimenTelegramView.tsx`, `specimen/SpecimenBoardView.tsx`, `specimen/SpecimenSchemaView.tsx`            |

---

## 4. Enforcement Checklist for Developers & AI Agents

Before saving any component file:

- [ ] Is the total line count strictly $\le$ 150 lines?
- [ ] Are all types and props interfaces imported from a separate `types.ts` or definitions file?
- [ ] Is complex business/fetch logic isolated inside a custom hook under `hooks/`?
- [ ] Are modals, slide-overs, and popovers separated into dedicated modal files?
- [ ] Is there an `index.ts` file providing clean barrel exports for the feature?
- [ ] Are all child components placed in logical subdirectories rather than cluttering root component folders?
