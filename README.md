# RT-Payments — Transaction Center

Interactive React prototype demonstrating a redesigned payment lifecycle interface for Ripple Treasury. Built on `@ds-foundation/react` + `@ds-foundation/tokens`, Tailwind CSS v4, and Space Grotesk typography.

## Pages

| Route | Description |
|---|---|
| `/` | Hub — landing page with project overview and navigation |
| `/prototype` | Transaction Center — payment approval workflow with filters, bulk actions, fraud scoring |
| `/netting` | Settlement Netting — intercompany settlement swim lane dashboard |
| `/research` | UX Research Report — Nielsen's heuristic evaluation with 17 findings |
| `/specs` | Annotated Specs — 10 prioritized recommendations with design tokens |
| `/export` | Export Report — print-friendly summary of all findings |

## Tech Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS v4, Framer Motion, Wouter, TanStack Query
- **Backend**: Express 5, Node.js, PostgreSQL 16 via Drizzle ORM
- **Validation**: Zod shared schemas
- **Design System**: `@ds-foundation/react` v0.1.0 (vendored) + `@ds-foundation/tokens` v0.2.2

## Local Setup

```bash
npm install
npm run dev       # http://localhost:5000
npm run check     # TypeScript check
npm run build     # Production build
```

The dev server requires a `DATABASE_URL` env var (the DB does not need to actually exist for frontend work):

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run dev
```

### `@ds-foundation/tokens` (GitHub Packages)

Create a `.npmrc` in the project root (gitignored — never commit):

```
@ds-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Set a PAT with `read:packages` scope before installing:

```bash
export NODE_AUTH_TOKEN=ghp_your_token_here
npm install
```

Create a token at: https://github.com/settings/tokens?scopes=read:packages

`@ds-foundation/react` is vendored at `vendor/ds-foundation-react-0.1.0.tgz` — no auth required for that package.

## Feature Flags

All prototype feature toggles default to OFF. Enable via URL params:

| Flag | Description |
|---|---|
| `rlusdStrip` | RLUSD Eligible Strip |
| `stablecoinRail` | Stablecoin Payment Rail |
| `selectPaymentRail` | Select Payment Rail Button |
| `riskColumn` | Risk Column in transaction table |
| `fraudSpotlight` | Fraud Protection Spotlight banner |

Example: `/prototype?rlusdStrip=1&fraudSpotlight=1`

## Theming

Light/dark toggle sets `data-theme="light"` or `data-theme="dark"` on `<html>`. DS-foundation semantic tokens swap automatically. Default is dark.

## Project Structure

```
client/src/
  pages/
    Landing.tsx                   Hub landing page
    Prototype.tsx                 Transaction Center (main prototype)
    IntercompanySettlement.tsx    Settlement Netting dashboard
    ResearchReport.tsx            UX research findings
    AnnotatedSpecs.tsx            Design recommendations
    ExportReport.tsx              Print-ready report
  components/
    netting/                      Intercompany settlement module
      types.ts                    Domain types, mock data, helpers
      EntityRow.tsx               Full row per entity pair (3-column layout)
      PositionCell.tsx            Net position metrics + freshness
      InFlightCell.tsx            In-flight settlement actions
      CompletedCell.tsx           Completed settlements summary
      DashboardHeader.tsx         Date filter + tx type filter
      ColumnHeaders.tsx           Column label row
      ActionModal.tsx             Initiate settlement dialog
    navigation/
      UnifiedNav.tsx              Top nav with theme toggle + config
      AppNav.tsx                  Product sub-navigation
    atoms/                        Shared atomic components
    molecules/                    Composed molecules
    organisms/                    Feature sections (FilterPanel, ResultsTable, modals)
    TreasuryShell.tsx             Page layout shell (nav + main)
    ui/                           Radix UI primitives (button, dialog, select, popover, checkbox, ...)
  lib/
    design-tokens.ts              DS-foundation token wrapper (CSS var references)
    types.ts                      Shared types, Filters, FeatureFlags
    mock-data.ts                  Transaction mock data
  hooks/                          use-theme, use-toast, use-focus-trap
server/                           Express backend
shared/                           Zod schemas shared between client and server
vendor/                           Vendored packages (ds-foundation-react-0.1.0.tgz)
docs/superpowers/                 Implementation plans, design specs, migration notes
```

## Design System

### DS-Foundation Components Used

All netting module UI atoms come from `@ds-foundation/react`:

| Component | Used in | Purpose |
|---|---|---|
| `FreshnessChip` | `PositionCell` | Data staleness indicator (fresh / watch / stale) |
| `CurrencyBadge` | `PositionCell`, `ActionModal` | USD / EUR / GBP currency label |
| `MonoAmount` | `InFlightCell`, `CompletedCell` | Monospaced token-colored amount display |
| `StatusPill` | `InFlightCell` | Settlement instruction status badge |
| `StatusRing` | `CompletedCell` | Settlement completion indicator dot |
| `IconButton` | `UnifiedNav` | Icon-only interactive button |

### Token Reference

All colors use `var(--ds-color-*)` CSS custom properties from `@ds-foundation/tokens`. `design-tokens.ts` re-exports token references for TSW-specific domain values (risk levels, process stages, surface colors).

## Netting Dashboard

The Settlement Netting page (`/netting`) shows intercompany settlement positions between Bitstamp legal entities (SA, LTD, INC, BVI, BFS, ASIA).

**Layout:** Three-column swim lane per entity pair.

| Column | Component | Content |
|---|---|---|
| Net Position | `PositionCell` | Gross exposure, settled, open amounts + freshness + progress bar |
| In-Flight | `InFlightCell` | Active settlement instructions with status pills, failed pinned top |
| Completed | `CompletedCell` | Settled instructions for the day with total |

**Action flow:** "Initiate Action" opens `ActionModal` — select source/destination accounts, choose full or partial amount, submit creates a new in-flight action. GBP warns of required manual bank release (LHV has no CHAPS API).

**Types:** `ActionStatus` maps 1:1 to ds-foundation's `InstructionStatus` — values pass directly to `StatusPill`.

**Filters:** Date start point and transaction type filter applied client-side to mock data.

**Mock data:** 5 entity pairings (EUR, GBP, USD), 4 in-flight actions, 2 completed actions, 8 bank accounts across LHV / Customers Bank / Bank Frick.

## Changelog

### PR #4 — Settlement Netting + DS-Foundation Integration
- Added `/netting` route: full intercompany settlement swim lane dashboard
- Integrated `@ds-foundation/react` atoms throughout netting module (`FreshnessChip`, `CurrencyBadge`, `MonoAmount`, `StatusPill`, `StatusRing`)
- Aligned `ActionStatus` type with ds-foundation `InstructionStatus` vocabulary
- Added Radix-based UI stubs: dialog, select, popover, checkbox
- Added `TreasuryShell` layout wrapper

### PR #3 — DS Token Uplift
- Tailwind CSS v3 → v4
- `@ds-foundation/tokens` v0.2.2 wired via `@theme` preset
- `@ds-foundation/react` v0.1.0 vendored at `vendor/`
- All hardcoded hex values replaced with `var(--ds-color-*)` references
- `design-tokens.ts` rewritten as DS-foundation re-export wrapper
- `next-themes` replaced with `data-theme` attribute toggle

### PR #2 — DS Token Uplift (Phase 1)
- `@ds-foundation/tokens` installed from GitHub Packages
- Token mapping documented in `docs/superpowers/migration-notes/`

### PR #1 — Transaction Center Rename
- Renamed Transaction Status Workflow → Transaction Center throughout

## Database

Single table: `feedback` (id, name, email, message, isRead)

```bash
npm run db:push
```

## License

Proprietary — Ripple Treasury
