# TSW Phase 3 — DS Foundation Atom Contribution Design

## Goal

Contribute three components from TSW to `ds-foundation-rt`, cut a new `@ds-foundation/react` patch release, and update TSW to consume them from the package instead of local files.

## Scope

**ds-foundation-rt contributions (3 PRs):**
1. `DetailCard` — direct style conversion, no API change
2. `IconButton` — genericized variant system, style conversion
3. `StateBadge` — new component designed for DS Foundation (does not exist yet in TSW)

**TSW migration (1 PR):**
- Bump `@ds-foundation/react` to new version
- Delete `atoms/DetailCard.tsx`, `atoms/IconButton.tsx`
- Update `atoms/Badge.tsx` status variant to use `<StateBadge>`
- Add `getTxStatusIntent()` helper in `design-tokens.ts`
- Add `iconButtonVariants.ts` shim for TSW→DS variant name mapping
- Update all import paths

**Out of scope:**
- `atoms/Badge.tsx` stays local — it is a TSW domain molecule, not a generic primitive
- No changes to `atoms/StatusChip.tsx` or other TSW-specific atoms
- No ds-foundation-rt registry rebuild or CI pipeline changes beyond what each contribution PR triggers

---

## Architecture

### Two-repo structure

```
ds-foundation-rt/
└── packages/
    ├── react/src/
    │   ├── DetailCard.tsx        ← new (+ DetailCard.stories.tsx co-located)
    │   ├── IconButton.tsx        ← new (+ IconButton.stories.tsx co-located)
    │   ├── StateBadge.tsx        ← new (+ StateBadge.stories.tsx co-located)
    │   └── index.ts              ← updated barrel export
    └── registry/components/
        ├── detail-card.mdx       ← new
        ├── icon-button.mdx       ← new
        └── state-badge.mdx       ← new

payments-tsw-phase1/
└── client/src/
    ├── components/atoms/
    │   ├── DetailCard.tsx        ← deleted
    │   ├── IconButton.tsx        ← deleted
    │   └── Badge.tsx             ← StatusBadgeContent replaced with <StateBadge>
    └── lib/
        ├── design-tokens.ts      ← getTxStatusIntent() added
        └── iconButtonVariants.ts ← new TSW→DS variant name shim
```

> **Storybook note:** Stories are co-located with components in `packages/react/src/` (e.g. `StatusPill.stories.tsx` lives alongside `StatusPill.tsx`). There is no separate storybook package — `apps/storybook/` consumes stories from the react package automatically.

### Contribution commands

Each DS PR runs:
```bash
npm run typecheck       # TypeScript check across all packages
npm run ci:validate     # Token + registry validation
npx changeset           # Add patch changelog entry
```

(`npm run validate` does not exist — use the two commands above.)

### Contribution model

Each DS PR follows the pattern in `NEW_COMPONENTS.md`:
1. Add `ComponentName.tsx` + `ComponentName.stories.tsx` to `packages/react/src/`
2. Add MDX registry spec to `packages/registry/components/`
3. Add barrel export to `packages/react/src/index.ts`
4. Run `npm run typecheck && npm run ci:validate`
5. Run `npx changeset` (patch bump)
6. Open PR

---

## Component Specifications

### 1. DetailCard

**File:** `packages/react/src/DetailCard.tsx`

**Props:**
```typescript
export interface DetailCardProps {
  title: string;
  children: React.ReactNode;
}
```

> **`className` omitted intentionally.** Audit of all TSW call sites confirms `<DetailCard>` is always called with only `title` and `children` — `className` is never passed. The DS Foundation convention is no `className` prop (inline styles are fixed). This is a zero-regression drop.

**Rendering:**
- Container `<div>` with `--ds-color-surface-default` background, `--ds-color-border-default` border (50% opacity via `rgba`/`color-mix`), `--ds-radius-lg` corners, `16px` padding
- `<h4>` title: uppercase, `--ds-font-weight-medium`, `--ds-color-brand-primary` colour, `--ds-font-tracking-wide` letter spacing, `--ds-font-size-xs`, bottom border in `--ds-color-border-default` (50% opacity)
- Children rendered in the card body below the title

**Styling:** Inline `style` objects only — no Tailwind, no `className` prop.

**Accessibility:**
- `<h4>` provides semantic heading structure; no ARIA roles required

**TSW migration:**
1. Delete `atoms/DetailCard.tsx`
2. Update all 8 import sites (`TransactionCard.tsx` × 4, `TransactionRow.tsx` × 4):
   ```
   @/components/atoms/DetailCard → @ds-foundation/react
   ```
   No call-site prop changes needed — API is identical.

---

### 2. IconButton

**File:** `packages/react/src/IconButton.tsx`

**Design principle:** All variants share a neutral rest state (`--ds-color-text-secondary`). The variant colour applies on hover only. This matches the existing TSW behaviour exactly.

**Props:**
```typescript
export type IconButtonVariant = 'info' | 'success' | 'primary' | 'warning' | 'danger' | 'neutral';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;   // Default: 'neutral'
  size?: IconButtonSize;         // Default: 'md'
  icon?: React.ReactNode;
  children?: React.ReactNode;    // Optional label text beside icon
}
```

> **Extends `React.ButtonHTMLAttributes<HTMLButtonElement>`** — this passes through `ref` (via `forwardRef`), `title`, `aria-expanded`, `aria-label`, `disabled`, `onClick`, `className`, and all other native button attributes. Required because TSW call sites use `ref` (ColumnPicker), `title` (TransactionRow), and `aria-expanded` (ColumnPicker).

> **Implemented with `React.forwardRef`** — matches the TSW original pattern.

**Variant → token mapping (hover state — rest is always `text-secondary`):**
| variant | hover text | hover background | focus ring |
|---------|-----------|-----------------|------------|
| `info` | `--ds-color-feedback-info-text` | `--ds-color-feedback-info-bg` | `--ds-color-feedback-info-border` |
| `success` | `--ds-color-feedback-success-text` | `--ds-color-feedback-success-bg` | `--ds-color-feedback-success-border` |
| `primary` | `--ds-color-brand-primary` | `--ds-color-brand-primary-subtle` | `--ds-color-brand-primary` |
| `warning` | `--ds-color-feedback-warning-text` | `--ds-color-feedback-warning-bg` | `--ds-color-feedback-warning-border` |
| `danger` | `--ds-color-feedback-error-text` | `--ds-color-feedback-error-bg` | `--ds-color-feedback-error-border` |
| `neutral` | `--ds-color-text-primary` | `--ds-color-surface-raised` | `--ds-color-brand-primary` |

**Size mapping:**
| size | icon-only padding | icon-only min size | with-text padding | with-text min height |
|------|-------------------|-------------------|-------------------|---------------------|
| `sm` | `4px` | `24×24px` | `4px 8px` | `24px` |
| `md` | `6px` | `28×28px` | `6px 12px` | `28px` |

**Rendering:**
- `React.forwardRef` wrapping a `<button>` element
- `flex row`, `--ds-radius-lg` border radius
- Transitions: `color` and `background-color` on hover (use `transition` CSS)
- Focus ring: `2px solid` focus-ring token from variant, `2px offset`
- Disabled: `opacity: 0.3`, `cursor: not-allowed`
- Inline styles for colours/layout; accepts `className` from spread for any Tailwind consumer overrides

**TSW migration:**
1. Delete `atoms/IconButton.tsx`
2. Update imports across 5 files: `TransactionRow.tsx`, `TransactionCard.tsx`, `TableToolbar.tsx`, `TablePagination.tsx`, `ColumnPicker.tsx`:
   ```
   @/components/atoms/IconButton → @ds-foundation/react
   ```
3. Create `client/src/lib/iconButtonVariants.ts`:
   ```typescript
   import type { IconButtonVariant } from '@ds-foundation/react';

   const TSW_VARIANT_MAP = {
     view:      'info',      // TSW view: hover=info palette
     confirm:   'success',   // TSW confirm: hover=success palette
     complete:  'primary',   // TSW complete: hover=brand-primary palette
     reextract: 'warning',   // TSW reextract: hover=warning palette
     fail:      'danger',    // TSW fail: hover=error/danger palette
     default:   'neutral',   // TSW default: hover=white/neutral
   } as const;

   export type TswIconButtonVariant = keyof typeof TSW_VARIANT_MAP;
   export const toIconButtonVariant = (v: TswIconButtonVariant): IconButtonVariant =>
     TSW_VARIANT_MAP[v];
   ```
4. At any call site passing a TSW-specific variant string, wrap with `toIconButtonVariant()`. Call sites not passing `variant` (using the default) need no change.

---

### 3. StateBadge

**File:** `packages/react/src/StateBadge.tsx`

A new component designed for DS Foundation. Not directly extracted from TSW — it is the right generic primitive that TSW's `StatusBadgeContent` will delegate to.

**Props:**
```typescript
export type StateBadgeIntent = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type StateBadgeSize = 'sm' | 'md';

export interface StateBadgeProps {
  state: string;                 // Current state display label
  intent: StateBadgeIntent;      // Drives colour from DS feedback tokens
  nextState?: string;            // Optional — renders "→ nextState" when provided
  size?: StateBadgeSize;         // Default: 'md'
}
```

**Intent → token mapping:**
| intent | background | border | text |
|--------|-----------|--------|------|
| `info` | `--ds-color-feedback-info-bg` | `--ds-color-feedback-info-border` | `--ds-color-feedback-info-text` |
| `warning` | `--ds-color-feedback-warning-bg` | `--ds-color-feedback-warning-border` | `--ds-color-feedback-warning-text` |
| `success` | `--ds-color-feedback-success-bg` | `--ds-color-feedback-success-border` | `--ds-color-feedback-success-text` |
| `error` | `--ds-color-feedback-error-bg` | `--ds-color-feedback-error-border` | `--ds-color-feedback-error-text` |
| `neutral` | `--ds-color-surface-sunken` | `--ds-color-border-default` | `--ds-color-text-secondary` |

**Size:**
| size | padding | font size |
|------|---------|-----------|
| `sm` | `2px 6px` | `--ds-font-size-xs` |
| `md` | `3px 8px` | `--ds-font-size-sm` |

**Rendering:**
- Pill container: `--ds-radius-lg`, `1px solid` border from intent, inline background
- `state` label: uppercase, `--ds-font-weight-medium`
- When `nextState` provided: `state` + `→` separator (in `--ds-color-text-tertiary`) + `nextState` — all inside the pill
  - The `→` is a text character (`→`), not a Lucide icon. This is a deliberate design improvement over the TSW layout (which rendered state and next-state as separate elements with an ArrowRight icon between them). Putting both inside one pill is cleaner and more composable.

**Accessibility:**
- `role="status"` on the container
- `aria-label` computed as: `"Status: {state}"` or `"Status: {state}, next: {nextState}"`

**TSW usage (Badge.tsx after migration):**

Replace `StatusBadgeContent` with `<StateBadge>`. The `overdue` boolean stays in TSW's `Badge.tsx` wrapper — if `overdue`, bypass `StateBadge` entirely and render the existing overdue markup (clock icon + error styling). `StateBadge` is only used for non-overdue states.

```tsx
import { StateBadge } from '@ds-foundation/react';
import { getTxStatusIntent } from '@/lib/design-tokens';

// In Badge.tsx, variant === 'status' branch:
if (overdue) {
  // existing overdue rendering (clock icon + error styling) — unchanged
} else {
  return <StateBadge state={status} intent={getTxStatusIntent(status)} nextState={next} />;
}
```

**TSW helper (`design-tokens.ts`):**
```typescript
import type { StateBadgeIntent } from '@ds-foundation/react';

export function getTxStatusIntent(status: string): StateBadgeIntent {
  switch (status) {
    case 'Pending':
    case 'On Hold':
    case 'Under Review':
    case 'Needs Approval':    return 'warning';
    case 'Processing':
    case 'Ready to Approve':
    case 'Escalated':
    case 'Ready to Extract':
    case 'Extracted':
    case 'Confirmed':
    case 'Draft':             return 'info';
    case 'Approved':          return 'success';
    case 'Rejected':
    case 'Failed':            return 'error';
    case 'Cancelled':
    case 'Void':
    default:                  return 'neutral';
  }
}
```

> `Ready to Extract` maps to `info` (the DS Foundation has no `primary`/brand intent for StateBadge). This is a minor colour shift — brand-primary blue → feedback-info blue. Acceptable given it keeps StateBadge purely semantic.

---

## Delivery Sequence

### PR 1 — ds-foundation-rt: DetailCard
Lowest risk. Proves the contribution workflow end-to-end.
- `packages/react/src/DetailCard.tsx`
- `packages/react/src/DetailCard.stories.tsx`
- `packages/registry/components/detail-card.mdx`
- `packages/react/src/index.ts` barrel update
- `npm run typecheck && npm run ci:validate`
- `npx changeset` — patch

### PR 2 — ds-foundation-rt: IconButton
- `packages/react/src/IconButton.tsx`
- `packages/react/src/IconButton.stories.tsx`
- `packages/registry/components/icon-button.mdx`
- `packages/react/src/index.ts` barrel update
- `npm run typecheck && npm run ci:validate`
- `npx changeset` — patch

### PR 3 — ds-foundation-rt: StateBadge
New component — most review surface.
- `packages/react/src/StateBadge.tsx`
- `packages/react/src/StateBadge.stories.tsx`
- `packages/registry/components/state-badge.mdx`
- `packages/react/src/index.ts` barrel update
- `npm run typecheck && npm run ci:validate`
- `npx changeset` — patch

### PR 4 — TSW: package bump + local atom removal
After all three DS PRs are merged and a new `@ds-foundation/react` version is published:
- Bump `@ds-foundation/react` in `package.json`
- Delete `client/src/components/atoms/DetailCard.tsx`
- Delete `client/src/components/atoms/IconButton.tsx`
- Update all 8 DetailCard import paths (`TransactionCard.tsx` × 4, `TransactionRow.tsx` × 4)
- Update all 5 IconButton import paths (`TransactionRow.tsx`, `TransactionCard.tsx`, `TableToolbar.tsx`, `TablePagination.tsx`, `ColumnPicker.tsx`)
- Create `client/src/lib/iconButtonVariants.ts`
- Update `client/src/components/atoms/Badge.tsx` — replace `StatusBadgeContent` with `<StateBadge>` (keep overdue path)
- Add `getTxStatusIntent()` to `client/src/lib/design-tokens.ts`
- `npm run check` — zero TypeScript errors

---

## Acceptance Criteria

**Each DS PR:**
- `npm run typecheck` passes — zero errors
- `npm run ci:validate` passes — registry build clean
- Component renders correctly in Storybook — all states, light + dark mode
- Inline styles only — zero Tailwind classes, zero `cn()` usage
- WCAG 2.2 AA contrast verified for each intent/variant combination

**TSW migration PR:**
- `npm run check` — zero TypeScript errors
- `rg "@/components/atoms/DetailCard|@/components/atoms/IconButton" client/src/` — zero results
- `StatusBadgeContent` removed from `Badge.tsx`
- Overdue rendering path in `Badge.tsx` unchanged
- Visual regression: non-overdue status badges look identical to pre-migration; `Ready to Extract` acceptable minor colour shift (brand-primary → info blue)
