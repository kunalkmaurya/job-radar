---
description: UI/UX Design System & Precision Engineering Theme Specification
globs: 'src/**/*.{tsx,ts,css}'
---

# UI/UX Design System & Theme Specification

Target Audience: AI Agents and Engineers implementing user interfaces.
Enforcement Level: STRICT. All generated screens, components, and styling must adhere to this specification.

## 1. Core Visual Principles & Constraints

1. **Near-Sharp Corners (`rounded-xs`)**:
   - Every container, button, card, input, badge, modal, and dropdown MUST have a maximum border-radius of 2px to 3px (`rounded-xs`).
   - Standard Tailwind curves (`rounded-md`, `rounded-lg`, `rounded-xl`, `rounded-2xl`, `rounded-full` on containers) are strictly prohibited.
2. **Zero Emojis Policy**:
   - Emojis are strictly banned from UI text, labels, status badges, buttons, tooltips, console logs, and comments.
   - Use clean, precise SVG icons exclusively from `lucide-react` (14px to 16px, `strokeWidth={2}`).
3. **Engineering Aesthetic (Linear / Raycast / Datadog Inspired)**:
   - High information density, ultra-crisp borders, compact controls (`h-8` default, `h-9` medium).
   - Monospace typography for numeric data, metrics, counters, timestamps, IDs, and status pills.
4. **Dual-Theme Support**:
   - Default is Precision Dark (`#0A0D12`). Full fidelity in Precision Light (`#F8FAFC`).
   - Theme switches toggle the `.light` / `.dark` classes and `[data-theme]` attribute on the `<html>` root element.

## 2. Color Palette & Theme Tokens

### 2.1 Accent Colors (TypeScript Blue)

- Primary Accent: `#3178C6` (`bg-[#3178C6]`, `text-[#3178C6]`)
- Primary Hover: `#235A97` (`hover:bg-[#235A97]`)
- Primary Active: `#1D4A7D` (`active:bg-[#1D4A7D]`)
- Subtle Tint (Dark): `rgba(49, 120, 198, 0.15)` (`bg-[#3178C6]/15`)
- Subtle Tint (Light): `rgba(49, 120, 198, 0.10)` (`bg-[#3178C6]/10`)
- Border Accent: `rgba(49, 120, 198, 0.40)` (`border-[#3178C6]/40`)
- Text Blue (Bright): `#5499EB` (`text-[#5499EB]`)
- Selection: `#3178C6` / `#FFFFFF` (`selection:bg-[#3178C6] selection:text-white`)

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

- Saved / Wishlist: Background `rgba(100, 116, 139, 0.15)`, Text `#94A3B8` (Dark) / `#475569` (Light), Border `rgba(100, 116, 139, 0.30)`
- Applied: Background `rgba(49, 120, 198, 0.15)`, Text `#5499EB` (Dark) / `#3178C6` (Light), Border `rgba(49, 120, 198, 0.40)`
- Screening: Background `rgba(99, 102, 241, 0.15)`, Text `#818CF8` (Dark) / `#4F46E5` (Light), Border `rgba(99, 102, 241, 0.40)`
- Interview: Background `rgba(234, 179, 8, 0.15)`, Text `#FACC15` (Dark) / `#D97706` (Light), Border `rgba(234, 179, 8, 0.40)`
- Offer: Background `rgba(16, 185, 129, 0.15)`, Text `#34D399` (Dark) / `#059669` (Light), Border `rgba(16, 185, 129, 0.40)`
- Rejected: Background `rgba(239, 68, 68, 0.15)`, Text `#F87171` (Dark) / `#DC2626` (Light), Border `rgba(239, 68, 68, 0.40)`
- Archived: Background `rgba(100, 116, 139, 0.15)`, Text `#94A3B8` (Dark) / `#475569` (Light), Border `rgba(100, 116, 139, 0.30)`

## 3. Typography & Hierarchy

- Primary Sans: `Geist, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif`
- Tabular / Console Mono: `Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`
- Scale:
  - Metric totals: `24px / font-mono font-bold`
  - Page headers: `20px / font-bold tracking-tight`
  - Modal titles: `16px / font-semibold tracking-tight`
  - Card headings & table headers: `14px / font-semibold`
  - Standard body text & inputs: `12px / text-xs`
  - Pill counters & captions: `11px / text-[11px] font-mono`
  - Micro badges & tags: `10px / text-[10px] uppercase font-mono tracking-wider`

## 4. UI Components

- Buttons: `rounded-xs font-medium select-none shrink-0 transition-colors` with `h-8 px-3 text-xs` (sm) or `h-9 px-4 text-xs` (md)
- Inputs: `h-8 px-3 text-xs border border-[var(--border-subtle)] rounded-xs`
- Modal dialogs: `rounded-xs border border-[var(--border-subtle)] shadow-2xl`
- Icons: `lucide-react` exclusively (`w-3.5 h-3.5` for controls, `w-4 h-4` for nav)

## 5. Agent Verification Checklist

- No emojis anywhere in UI, code, or logs.
- All corners near-sharp `rounded-xs` (2px-3px).
- Precision Dark `#0A0D12` and Precision Light `#F8FAFC`.
- Primary accent `#3178C6` (TypeScript blue).
- Metrics and counters use `font-mono`.
- Max 150 lines per UI component, max 350 lines per file.
