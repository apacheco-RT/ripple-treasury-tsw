# Ripple Treasury — Transaction Status Workflow (TSW)

Interactive React prototype demonstrating a redesigned payment lifecycle interface for Ripple Treasury, built with Material Design 3 patterns, Ripple brand colors, and Space Grotesk typography.

## Pages

| Route | Description |
|---|---|
| `/` | Hub — landing page with project overview and navigation |
| `/research` | UX Research Report — Nielsen's heuristic evaluation with 17 findings |
| `/specs` | Annotated Specs — 10 prioritized recommendations with design tokens |
| `/prototype` | Interactive Prototype — transaction approval workflow with filters, bulk actions, risk scoring |
| `/strategy` | Design Strategy — approach, principles, and roadmap |
| `/export` | Export Report — print-friendly summary of all findings |

## Tech Stack

- **Frontend**: React 18, Vite 7, Tailwind CSS 3, Framer Motion, Wouter, TanStack Query
- **Backend**: Express 5, Node.js, PostgreSQL 16 via Drizzle ORM
- **Validation**: Zod shared schemas
- **Design System**: Material Design 3 tokens, Space Grotesk font, Ripple Treasury brand palette

## Getting Started

```bash
npm install
npm run dev
```

The development server starts on port 5000.

## Feature Flags

All prototype feature toggles default to OFF. Enable via URL params (`=1`):

| Flag | Description |
|---|---|
| `rlusdStrip` | RLUSD Eligible Strip |
| `stablecoinRail` | Stablecoin Payment Rail |
| `selectPaymentRail` | Select Payment Rail Button |
| `riskColumn` | Risk Column in transaction table |
| `fraudSpotlight` | Fraud Protection Spotlight banner |

Example: `/prototype?rlusdStrip=1&fraudSpotlight=1`

## Project Structure

```
client/src/
  pages/          Route components
  components/
    shared/       Badge, IconButton, DetailCard
    research/     Research Report sub-components
    home/         Hub sub-components
    export/       Export Report sub-components
    specs/        Annotated Specs sub-components
    results-table/ Transaction table components
    ui/           shadcn/ui primitives
  hooks/          Custom React hooks
  lib/            Utilities, design tokens, types, mock data
  data/           Shared report data
server/           Express backend
shared/           Shared TypeScript schemas
```

## Build

```bash
npm run build
```

## Database

Single table: `feedback` (id, name, email, message, isRead)

```bash
npm run db:push
```

## License

Proprietary - Ripple Treasury
