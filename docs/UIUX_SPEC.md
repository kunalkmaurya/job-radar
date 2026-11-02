# Job Radar — UI/UX Design System & Theme Specification

Target Audience: AI Agents and Engineers implementing user interfaces.
Enforcement Level: STRICT. All generated screens, components, and styling must adhere to this specification.

---

## 1. Core Visual Principles & Constraints

1. **Near-Sharp Corners (`rounded-xs`)**:
   - Every container, button, card, input, badge, modal, and dropdown MUST have a maximum border-radius of 2px to 3px (`rounded-xs`).
   - Standard Tailwind curves (`rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` for containers) are strictly prohibited.
2. **Zero Emojis Policy**:
   - Emojis are strictly banned from UI text, labels, status badges, buttons, tooltips, console logs, and code comments.
   - Use clean, precise SVG icons exclusively from `lucide-react` (14px to 16px, `strokeWidth={2}`).
3. **Engineering Aesthetic (Linear / Raycast / Datadog Inspired)**:
   - High information density, ultra-crisp borders, compact controls (`h-8` default, `h-9` medium).
   - Monospace typography for numeric data, metrics, counters, timestamps, IDs, and status pills.
4. **Dual-Theme Support**:
   - Default is Precision Dark (`#0A0D12`). Full fidelity in Precision Light (`#F8FAFC`).
   - Theme switches toggle the `.light` / `.dark` classes and `[data-theme]` attributes on the `<html>` root element.

---

## 2. Color Palette & Theme Tokens

### 2.1 Accent Colors (TypeScript Blue)

| Token               | Hex / Value                | Tailwind Class / Role                                         |
| :------------------ | :------------------------- | :------------------------------------------------------------ |
| Primary Accent      | `#3178C6`                  | `bg-[#3178C6]`, `text-[#3178C6]` (Primary CTA, active states) |
| Primary Hover       | `#235A97`                  | `hover:bg-[#235A97]`                                          |
| Primary Active      | `#1D4A7D`                  | `active:bg-[#1D4A7D]`                                         |
| Subtle Tint (Dark)  | `rgba(49, 120, 198, 0.15)` | `bg-[#3178C6]/15` (Pills, active nav, dropzones)              |
| Subtle Tint (Light) | `rgba(49, 120, 198, 0.10)` | `bg-[#3178C6]/10`                                             |
| Border Accent       | `rgba(49, 120, 198, 0.40)` | `border-[#3178C6]/40`                                         |
| Text Blue (Bright)  | `#5499EB`                  | `text-[#5499EB]` (Links, highlighted active labels)           |
| Selection           | `#3178C6` / `#FFFFFF`      | `selection:bg-[#3178C6] selection:text-white`                 |

### 2.2 Surface & Border Tokens

| Element        | Precision Dark (`dark`)              | Precision Light (`light`)            |
| :------------- | :----------------------------------- | :----------------------------------- |
| App Background | `#0A0D12` (`bg-[#0A0D12]`)           | `#F8FAFC` (`bg-[#F8FAFC]`)           |
| Card / Surface | `#12171F` (`bg-[#12171F]`)           | `#FFFFFF` (`bg-[#FFFFFF]`)           |
| Surface Hover  | `#18202C` (`hover:bg-[#18202C]`)     | `#F1F5F9` (`hover:bg-[#F1F5F9]`)     |
| Default Border | `#202937` (`border-[#202937]`)       | `#E2E8F0` (`border-[#E2E8F0]`)       |
| Border Hover   | `#2D3B4E` (`hover:border-[#2D3B4E]`) | `#CBD5E1` (`hover:border-[#CBD5E1]`) |
| Text Primary   | `#F1F5F9` (`text-[#F1F5F9]`)         | `#0F172A` (`text-[#0F172A]`)         |
| Text Secondary | `#94A3B8` (`text-[#94A3B8]`)         | `#475569` (`text-[#475569]`)         |
| Text Muted     | `#64748B` (`text-[#64748B]`)         | `#64748B` (`text-[#64748B]`)         |

### 2.3 Status & Pipeline Colors

| Stage / Key          | Background        | Text (Dark / Light)                 | Border                |
| :------------------- | :---------------- | :---------------------------------- | :-------------------- |
| Saved / Wishlist     | `bg-[#64748B]/15` | `text-[#94A3B8]` / `text-[#475569]` | `border-[#64748B]/30` |
| Applied              | `bg-[#3178C6]/15` | `text-[#5499EB]` / `text-[#3178C6]` | `border-[#3178C6]/40` |
| Screening            | `bg-[#6366F1]/15` | `text-[#818CF8]` / `text-[#4F46E5]` | `border-[#6366F1]/40` |
| Interview            | `bg-[#EAB308]/15` | `text-[#FACC15]` / `text-[#D97706]` | `border-[#EAB308]/40` |
| Offer                | `bg-[#10B981]/15` | `text-[#34D399]` / `text-[#059669]` | `border-[#10B981]/40` |
| Rejected             | `bg-[#EF4444]/15` | `text-[#F87171]` / `text-[#DC2626]` | `border-[#EF4444]/40` |
| Archived / Withdrawn | `bg-[#64748B]/15` | `text-[#94A3B8]` / `text-[#475569]` | `border-[#64748B]/30` |

---

## 3. Typography & Hierarchy

### 3.1 Typefaces

- **Primary Sans**: `Geist`, `-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`.
- **Tabular / Console Mono**: `Roboto Mono`, `ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`.
  - Used for: Status badges, metric numbers, timestamps, currency values, IDs, pill counters, user handles.

### 3.2 Type Scale

- `24px / font-mono font-bold`: Dashboard metric totals (`metrics.total`).
- `20px / font-bold tracking-tight`: Top page headers (`h1`).
- `16px / font-semibold tracking-tight`: Modal titles (`h2`).
- `14px / font-semibold`: Card headings, table column titles.
- `12px / text-xs`: Standard body text, inputs, buttons, navigation items.
- `11px / text-[11px]`: Counter pills, table dates, captions, sub-labels.
- `10px / text-[10px] uppercase font-mono tracking-wider`: Micro badges, card dates, next-stage triggers.

---

## 4. UI Component Specifications

### 4.1 Buttons

All buttons specify `rounded-xs font-medium select-none shrink-0 transition-colors`:

- `sm`: `h-8 px-3 text-xs gap-1.5`
- `md`: `h-9 px-4 text-xs gap-2`
- `icon-sm`: `h-8 w-8 p-0 text-xs`
- `primary`: `bg-[#3178C6] text-white hover:bg-[#235A97] active:bg-[#1D4A7D] shadow-xs`
- `secondary`: `bg-[#18202C] text-[#F1F5F9] hover:bg-[#202937] border border-[#202937]`
- `outline`: `border border-[#202937] bg-transparent text-[#F1F5F9] hover:bg-[#12171F] hover:border-[#3178C6]`
- `danger`: `bg-[#EF4444] text-white hover:bg-[#DC2626] active:bg-[#B91C1C]`
- `ghost`: `text-[#94A3B8] hover:text-[#F1F5F9] hover:bg-[#18202C]`

### 4.2 Badges & Chips

```tsx
<span className="inline-flex items-center font-medium border rounded-xs uppercase tracking-wider px-1.5 py-0.5 text-[10px]">
  {label}
</span>
```

### 4.3 Inputs & Select Dropdowns

- Input: `w-full h-8 px-3 text-xs bg-[#0A0D12] text-[#F1F5F9] border border-[#202937] rounded-xs placeholder:text-xs placeholder:text-[#64748B] focus:outline-none focus:border-[#3178C6] focus:ring-1 focus:ring-[#3178C6]`
- Select: `h-8 pl-2.5 pr-7 text-xs bg-[#0A0D12] text-[#F1F5F9] border border-[#202937] rounded-xs focus:outline-none focus:border-[#3178C6] cursor-pointer`

### 4.4 Custom Scrollbar

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: var(--bg-app);
}
::-webkit-scrollbar-thumb {
  background: var(--border-subtle);
  border-radius: 2px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--accent-primary);
}
```

---

## 5. Icon Usage Guidelines

Use `lucide-react` icons exclusively with standardized sizing:

- `w-3.5 h-3.5`: Default button icons, search icons, input adornments, modal close.
- `w-4 h-4`: Navigation sidebar icons, metric banner icons, modal warning icons.
- `w-3 h-3`: Micro metadata icons.

---

## 6. Public Job Feed Specification

### 6.1 View Mode Switcher

- **Controls**: Dual toggle (`LayoutGrid` for Cards, `List` for Table) placed within `FeedHeader`.
- **Active State**: `border-(--accent-primary) bg-(--accent-primary-bg) text-(--accent-blue-bright)`.
- **Inactive State**: `border-(--border-subtle) bg-(--bg-surface) text-(--text-secondary) hover:text-(--text-primary)`.

### 6.2 Grid (Card) vs. List (Table)

- **Grid View**: 3-column responsive layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5`).
- **Table View**: High-density horizontal table (`overflow-x-auto min-w-[720px]`) with monogram initials box, company, role, location, experience, date, and inline actions.

### 6.3 1-Click Track Button State Machine

- **Untracked**: Solid primary button (`bg-(--accent-primary)`) with `Plus` icon and "Track" label.
- **Tracking (Loading)**: `Loader2` spinner with `opacity-50` and disabled state.
- **Tracked**: Muted emerald badge (`bg-(--status-offer-bg) text-(--status-offer-text) border-(--status-offer-border)`) with `Check` icon.

---

## 7. Verification Checklist

- NO EMOJIS anywhere across UI, logs, comments, or scripts.
- NEAR-SHARP CORNERS: All border-radii capped at 2px to 3px (`rounded-xs`).
- BACKGROUND CODES: Precision Dark `#0A0D12` / `#12171F` / `#202937`, Precision Light `#F8FAFC` / `#FFFFFF` / `#E2E8F0`.
- ACCENT COLOR: Primary action `#3178C6`, hover `#235A97`, active `#1D4A7D`.
- TYPOGRAPHY: Counts, metrics, badges, and timestamps use `font-mono`.
- COMPACT HEIGHTS: Primary buttons and inputs use `h-8` or `h-9`.
