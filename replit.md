# Ripple Treasury — Transaction Center

## Overview
Interactive prototype for Ripple Treasury's Transaction Center. Includes heuristic evaluation, annotated specs, interactive prototype, and export report.

## Tech Stack
- **Frontend**: React 18, Vite 7, Tailwind CSS 3, shadcn/ui, Framer Motion, Wouter (routing), TanStack Query
- **Backend**: Express 5, Node.js
- **Database**: PostgreSQL 16 via Drizzle ORM
- **Validation**: Zod (shared schemas)
- **Runtime**: tsx for TypeScript execution

## File Structure
- `client/src/` — React frontend
  - `pages/` — Route components (Landing, Prototype, Home, etc.)
  - `components/` — Reusable UI components + shadcn `ui/` folder
    - `shared/` — Shared components: Badge (polymorphic: status/fraud/riskScore), IconButton (sm/md, 6 variants), DetailCard
    - `research/` — ResearchReport sub-components: ResearchHeader, HeuristicTable, BacklogTable, PriorityList, RequirementsSection, research-data
    - `home/` — Home sub-components: HeroSection, ResearchSection, StrategySection, RoadmapSection, FeedbackSection
    - `export/` — ExportReport sub-components: PrintBar, CoverPage, SectionA–E, ExportBadges, export-data
    - `specs/` — AnnotatedSpecs sub-components: SpecsHeader, SpecCard, specs-data
    - `ConfigurePrototypeModal.tsx` — Shared feature-flag configure modal (used by PageNav + Landing)
    - `FilterPanel.tsx` — Filter bar with quick search, date range, advanced filters
    - `FraudSpotlight.tsx` — Fraud Protection Spotlight banner with flagged transaction review
    - `FraudBadge.tsx` — Inline risk score badge
    - `StatusChip.tsx` — Transaction status chip with next-status arrow
    - `PaymentSummary.tsx` — Payment summary section (table + card views)
    - `ProcessFlow.tsx` — Process flow stage bar (Create → History)
    - `ResultsTable.tsx` — Transaction results table with bulk actions, pagination
    - `FraudGateModal.tsx` — Elevated-risk fraud gate confirmation modal
    - `RejectModal.tsx` — Payment rejection confirmation modal
    - `HoldModal.tsx` — Payment hold confirmation modal
  - `hooks/` — Custom hooks (use-feedback, use-theme, use-toast, use-focus-trap)
  - `lib/` — Utilities (queryClient, design-tokens, utils)
    - `design-tokens.ts` — Typed surface/risk/stage token constants (reconciled with CSS custom properties)
    - `types.ts` — Shared TypeScript types, constants (Txn, Filters, FeatureFlags, PROCESS_STAGES, prototypeFeatures)
    - `mock-data.ts` — Mock transaction data, fraud data, verification data, summary rows, helpers
- `server/` — Express backend (index.ts, routes.ts, storage.ts, db.ts, vite.ts, static.ts)
- `shared/` — Shared TypeScript (schema.ts, routes.ts)
- `attached_assets/` — Design documents

## Feature Flags
All prototype feature toggles default to **OFF**. Pass `=1` to enable via URL params:
- `rlusdStrip` — RLUSD Eligible Strip
- `stablecoinRail` — Stablecoin Payment Rail
- `selectPaymentRail` — Select Payment Rail Button
- `riskColumn` — Risk Column in transaction table
- `fraudSpotlight` — Fraud Protection Spotlight banner

Example: `/prototype?rlusdStrip=1&fraudSpotlight=1`

The Configure Prototype modal (accessible from the nav bar "Prototype" link or Hub card) manages these toggles.

## Routes
- `/` — Landing page (Hub)
- `/research` — Research Report
- `/specs` — Annotated Specs
- `/prototype` — Transaction Center
- `/strategy` — Design Strategy (Home)
- `/export` — Export Report (print-friendly)

## Theme System
- **Mechanism**: `data-theme="dark"|"light"` on `<html>`. Managed by `client/src/hooks/use-theme.ts` with `localStorage('theme')` persistence.
- **URL override**: `?theme=light` or `?theme=dark` for testing.
- **Default**: `dark`
- **DS tokens**: `vendor/ds-foundation-tokens/tailwind.css` — light mode `:root` defaults; dark overrides in `[data-theme="dark"]` block in `index.css`.
- **Brand primary**: `#2563eb` (blue-600) in light; `#38bdf8` (sky-400) in dark.
- **Nav stays dark** in both modes via `.nav-dark` class with DS token override block.
- **CSS safety net**: `[data-theme="light"] .text-white { color: #0f172a !important; }` with whitelist for colored-bg elements.
- **Text-on-brand**: `--ds-color-text-on-brand: #ffffff` — white text on brand primary buttons in both modes.

## Material Design 3 Tokens
All UI components use M3 CSS custom properties defined in `index.css`:
- **Shape scale**: `--m3-shape-xs` (4px), `--m3-shape-sm` (8px), `--m3-shape-md` (12px), `--m3-shape-lg` (16px), `--m3-shape-xl` (28px), `--m3-shape-full` (9999px)
- **Component sizing**: `--m3-button-height` (40px), `--m3-chip-height` (32px), `--m3-input-height` (40px), `--m3-switch-w/h` (52/32px)
- **State layers**: `--m3-state-hover` (white/8), `--m3-state-focus` (white/12), `--m3-state-pressed` (white/12)
- **Mapping**: Dialogs → XL (28px), Cards → MD (12px), Chips → SM (8px), Inputs → XS (4px), Buttons → Full (pill)
- All components reference these tokens via `rounded-(--m3-shape-*)` instead of hardcoded Tailwind radius classes
- Ripple Treasury brand colors and fonts (Space Grotesk) are preserved

## Accessibility (WCAG 2.2 AA)
- Skip-to-content links in UnifiedNav and AppNav
- `<main id="main-content">` landmark on all 8 pages
- `focus-visible:ring-2 focus-visible:ring-teal-400` (full opacity) on all interactive elements for 3:1+ contrast
- Escape key closes all dropdowns, modals, and mobile menus
- `aria-label`, `aria-expanded`, `aria-sort`, `role="status"` throughout
- Sortable `<th>` headers have `tabIndex={0}`, `role="button"`, and `onKeyDown` for full keyboard access
- `htmlFor`/`id` associations on all filter panel label+select/input pairs
- `aria-disabled` on dimmed PaymentSummary cards/rows
- `MotionConfig reducedMotion="user"` wraps the app for Framer Motion; `@media (prefers-reduced-motion: reduce)` in CSS for native animations
- Minimum text contrast: body text uses `text-slate-300`/`text-slate-400` (not `text-slate-500`/`text-slate-600`) on dark backgrounds; all secondary/subtle text ≥ 4.5:1 contrast ratio
- CSS text tokens: `--text-primary`, `--text-secondary`, `--text-tertiary` with Tailwind mapping `text-tsw-text-{primary,secondary,tertiary}`
- Section headers use `text-[11px]` minimum (M3 `--m3-label-sm` = 11px)
- Switch off-state uses `bg-slate-500` for 3:1 non-text contrast
- Radio buttons `w-4 h-4` with `min-h-[24px]` label wrapping for target size compliance
- Empty state in ResultsTable with "Clear All Filters" CTA
- Success confirmation on feedback form submission

## Development
- `npm run dev` — Start dev server on port 5000
- `npm run build` — Build for production
- `npm run db:push` — Sync Drizzle schema to database

## Download / Export
- **Download button** (↓ icon in UnifiedNav top-right): Hits `GET /api/download-prototype` which runs a fresh Vite build, inlines all CSS/JS/images into a single self-contained HTML file, injects `window.__STANDALONE_PROTOTYPE__=true` so the React router renders the Prototype page directly (bypassing URL routing), and sends it as `ripple-treasury-prototype.html`.
- **Build caching**: The built HTML is cached in memory for 10 minutes; concurrent build requests are rejected with 429.
- **Rate limited**: Max 3 downloads per 5 minutes via `downloadLimiter`.
- **Project ZIP**: `GET /download/project-zip` — streams the full project source as a ZIP (excludes node_modules, .git, dist, etc.).

## Database
Single table: `feedback` (id, name, email, message, isRead)
API endpoint: `POST /api/feedback` (rate-limited: 10 requests per 15 minutes via express-rate-limit)
