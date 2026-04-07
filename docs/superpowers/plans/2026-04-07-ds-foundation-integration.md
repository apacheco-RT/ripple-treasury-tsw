# DS-Foundation Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all handrolled status, currency, freshness, and amount components in the netting module with their `@ds-foundation/react` equivalents, and align `ActionStatus` types with ds-foundation's vocabulary.

**Architecture:** Rebase `feat/netting-swim-lane` onto `origin/main` first (picks up the vendored `@ds-foundation/react` package and token-mapped `design-tokens.ts`). Then migrate component-by-component: types first, then each netting cell file. The local `FreshnessChip.tsx` is deleted and replaced with a direct import from `@ds-foundation/react`.

**Tech Stack:** React, TypeScript, `@ds-foundation/react` (vendored 0.1.0), `@ds-foundation/tokens` CSS vars

---

## File Map

| File | Change |
|------|--------|
| `client/src/components/netting/types.ts` | Rename `ActionStatus` values; remove `getFreshnessState`; export type alias |
| `client/src/components/netting/FreshnessChip.tsx` | **Delete** — replace with ds-foundation import |
| `client/src/components/netting/PositionCell.tsx` | Use `CurrencyBadge`; use `FreshnessChip` from ds-foundation; apply token colors to MetricRow |
| `client/src/components/netting/InFlightCell.tsx` | Remove `STATUS_CONFIG`; use `StatusPill` from ds-foundation; use `MonoAmount` |
| `client/src/components/netting/CompletedCell.tsx` | Use `StatusRing` for header indicator; use `MonoAmount` for amounts; apply token color to total |
| `client/src/components/netting/ActionModal.tsx` | Update currency badge to use `CurrencyBadge`; update `status: "submitted"` (unchanged — already correct) |

---

## Task 1: Rebase onto remote main

**Goal:** Pick up the `@ds-foundation/react` vendor tgz, updated `package.json`, and token-mapped `design-tokens.ts` from `origin/main`.

**Files:** git working tree

- [ ] **Step 1: Fetch and rebase**

```bash
cd ~/Documents/Projects/replit-project
git fetch origin
git rebase origin/main
```

Expected: Clean rebase (netting files are all new; no conflicts with design-tokens.ts or package.json). If conflicts arise, accept `origin/main` version for `package.json` and `design-tokens.ts`.

- [ ] **Step 2: Verify vendor tgz is present**

```bash
ls vendor/
```

Expected output includes: `ds-foundation-react-0.1.0.tgz`

- [ ] **Step 3: Install dependencies**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm install
```

Expected: `added X packages` with no errors. `@ds-foundation/react` should resolve.

- [ ] **Step 4: Verify TypeScript resolves the import**

```bash
echo "import { FreshnessChip } from '@ds-foundation/react';" | npx tsc --noEmit --allowSyntheticDefaultImports --esModuleInterop --moduleResolution node --target ES2020 --jsx react /dev/stdin 2>&1 || true
```

If that's awkward, just run:
```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | head -20
```

Expected: No errors about `@ds-foundation/react` not being found (there may be pre-existing errors — those are OK at this stage).

- [ ] **Step 5: Commit checkpoint**

```bash
git add -A
git commit -m "chore: rebase onto main — pick up ds-foundation vendor + token uplift"
```

---

## Task 2: Align ActionStatus types with ds-foundation

**Goal:** Rename `first_signed` → `first_approval`, `second_signed` → `second_approval`, `confirmed` → `bank_confirmed` in `types.ts` and all usages. This unblocks using `StatusPill` directly.

**Files:**
- Modify: `client/src/components/netting/types.ts`
- Modify: `client/src/components/netting/ActionModal.tsx` (uses `status: "submitted"` — no change needed)
- Modify: `client/src/components/netting/InFlightCell.tsx` (uses `STATUS_CONFIG` keyed by `ActionStatus`)

- [ ] **Step 1: Update `ActionStatus` type in `types.ts`**

In `client/src/components/netting/types.ts`, replace lines 11–13:

```typescript
// Before
export type ActionStatus =
  | "submitted" | "in_payments" | "first_signed" | "second_signed"
  | "sent_to_bank" | "confirmed" | "failed";

// After
export type ActionStatus =
  | "submitted" | "in_payments" | "first_approval" | "second_approval"
  | "sent_to_bank" | "bank_confirmed" | "failed";
```

- [ ] **Step 2: Update `MOCK_ACTIONS` and `MOCK_COMPLETED_ACTIONS` in `types.ts`**

Scan `MOCK_ACTIONS` and `MOCK_COMPLETED_ACTIONS` for any `status` values that use the old names. Current mock data uses: `"submitted"`, `"in_payments"`, `"sent_to_bank"`, `"failed"`, `"confirmed"`.

Update `"confirmed"` → `"bank_confirmed"` in `MOCK_COMPLETED_ACTIONS` (lines 162–181):

```typescript
// ACT-C001 and ACT-C002: change status
status: "bank_confirmed",
```

- [ ] **Step 3: Type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | grep -i "ActionStatus\|first_signed\|second_signed\|confirmed" || echo "No ActionStatus errors"
```

Expected: No errors referencing old type values. (TypeScript will flag any remaining usages in `InFlightCell.tsx` — those get fixed in Task 4.)

- [ ] **Step 4: Commit**

```bash
git add client/src/components/netting/types.ts
git commit -m "refactor(netting): align ActionStatus to ds-foundation InstructionStatus vocabulary"
```

---

## Task 3: Replace FreshnessChip

**Goal:** Delete the handrolled `FreshnessChip.tsx` and import from `@ds-foundation/react`. Update `PositionCell` to pass a `Date` and `FreshnessState` instead of `minutes: number`.

**Files:**
- Delete: `client/src/components/netting/FreshnessChip.tsx`
- Modify: `client/src/components/netting/types.ts` (remove `getFreshnessState`; add helper that converts minutes → Date)
- Modify: `client/src/components/netting/PositionCell.tsx`

**DS-Foundation API:**
```typescript
import { FreshnessChip, deriveFreshnessState } from '@ds-foundation/react';
// FreshnessChip props: { state: 'fresh' | 'watch' | 'stale', timestamp: Date, onRefresh?: () => void }
// deriveFreshnessState(date: Date): FreshnessState — 5 min = watch, 15 min = stale
```

**Note on thresholds:** The handrolled chip uses 3 min / 15 min. DS-foundation uses 5 min / 15 min. The 5-min threshold is fine for this prototype — accept the DS-foundation thresholds.

- [ ] **Step 1: Remove `getFreshnessState` from `types.ts` and add a timestamp helper**

In `client/src/components/netting/types.ts`:

Remove the `getFreshnessState` function (lines 194–198):
```typescript
// DELETE this:
export function getFreshnessState(minutes: number): FreshnessState {
  if (minutes < 3) return "fresh";
  if (minutes <= 15) return "watch";
  return "stale";
}
```

Also remove the `FreshnessState` type (line 15) — it's now imported from ds-foundation:
```typescript
// DELETE this line:
export type FreshnessState = "fresh" | "watch" | "stale";
```

Add a helper to convert `freshnessMinutes` to a `Date` (used by `PositionCell`):
```typescript
/** Convert freshnessMinutes offset to a Date for use with FreshnessChip */
export function freshnessMinutesToDate(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}
```

- [ ] **Step 2: Delete `FreshnessChip.tsx`**

```bash
rm client/src/components/netting/FreshnessChip.tsx
```

- [ ] **Step 3: Update `PositionCell.tsx`**

Replace the import and usage in `client/src/components/netting/PositionCell.tsx`:

```typescript
// Remove:
import { FreshnessChip } from "./FreshnessChip";
// Add:
import { FreshnessChip, deriveFreshnessState } from "@ds-foundation/react";
// Also update the types import to include the new helper:
import { formatAmount, freshnessMinutesToDate, type EntityPairing } from "./types";
```

Replace the `<FreshnessChip>` usage (line 25):
```tsx
// Before:
<FreshnessChip minutes={pairing.freshnessMinutes} className="ml-auto" />

// After:
<FreshnessChip
  state={deriveFreshnessState(freshnessMinutesToDate(pairing.freshnessMinutes))}
  timestamp={freshnessMinutesToDate(pairing.freshnessMinutes)}
  className="ml-auto"
/>
```

> Note: `FreshnessChip` from ds-foundation doesn't accept `className`. Remove it — the chip has `ml-auto` positioning handled by the flex container. Add `style={{ marginLeft: 'auto' }}` if needed, or wrap in a `<span className="ml-auto">`.

Final usage:
```tsx
<span className="ml-auto">
  <FreshnessChip
    state={deriveFreshnessState(freshnessMinutesToDate(pairing.freshnessMinutes))}
    timestamp={freshnessMinutesToDate(pairing.freshnessMinutes)}
  />
</span>
```

- [ ] **Step 4: Type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | grep -i "FreshnessChip\|freshnessMinutes\|getFreshnessState" || echo "No freshness errors"
```

Expected: No errors about `FreshnessChip` or `getFreshnessState`.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/netting/FreshnessChip.tsx client/src/components/netting/types.ts client/src/components/netting/PositionCell.tsx
git commit -m "feat(netting): replace handrolled FreshnessChip with @ds-foundation/react"
```

---

## Task 4: CurrencyBadge + MonoAmount color tokens in PositionCell

**Goal:** Replace the purple hardcoded currency `<span>` with `CurrencyBadge`. Apply ds-foundation token colors to `MetricRow` values instead of hardcoded Tailwind classes.

**Files:**
- Modify: `client/src/components/netting/PositionCell.tsx`

**DS-Foundation APIs:**
```typescript
import { CurrencyBadge } from '@ds-foundation/react';
// CurrencyBadge props: { currency: 'USD' | 'EUR' | 'GBP' }
```

**Note on MonoAmount:** The netting MetricRows display amounts as `$480M` (millions-abbreviated) using `formatAmount()`. `MonoAmount` uses `Intl.NumberFormat` and doesn't support the M-suffix. We preserve the M format but apply token colors via `style` instead of hardcoded Tailwind.

- [ ] **Step 1: Add `CurrencyBadge` import**

In `client/src/components/netting/PositionCell.tsx`, update the ds-foundation import line:
```typescript
import { FreshnessChip, deriveFreshnessState, CurrencyBadge } from "@ds-foundation/react";
```

- [ ] **Step 2: Replace the currency badge span (line 22–24)**

```tsx
// Before:
<span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 border border-purple-100">
  {pairing.currency}
</span>

// After:
<CurrencyBadge currency={pairing.currency} />
```

- [ ] **Step 3: Update `MetricRow` to use token colors**

The `MetricRow` function (lines 98–107) accepts a `valueClass` string. Replace the three call-site `valueClass` values in `PositionCell` with token-based inline styles, and update `MetricRow` to accept `valueStyle` instead.

Replace the `MetricRow` function signature and body:
```tsx
function MetricRow({
  label, value, valueStyle,
}: { label: string; value: string; valueStyle?: React.CSSProperties }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className="text-sm font-medium tabular-nums" style={valueStyle}>{value}</span>
    </div>
  );
}
```

Update the three call sites in `PositionCell`:
```tsx
<MetricRow
  label="Gross exposure"
  value={formatAmount(pairing.grossExposure, pairing.currency)}
  valueStyle={{ color: 'var(--ds-color-text-primary)' }}
/>
<MetricRow
  label="Settled"
  value={formatAmount(pairing.settled, pairing.currency)}
  valueStyle={{ color: 'var(--ds-color-feedback-success-icon)' }}
/>
<MetricRow
  label="Open"
  value={formatAmount(pairing.open, pairing.currency)}
  valueStyle={pairing.open === 0
    ? { color: 'var(--ds-color-feedback-success-icon)', fontSize: '0.75rem' }
    : { color: 'var(--ds-color-feedback-warning-text)', fontWeight: 600 }}
/>
```

Also update the "Fully settled" indicator (line 49–53):
```tsx
// Before:
<div className="mt-2 flex items-center gap-1 text-xs text-green-600">

// After:
<div className="mt-2 flex items-center gap-1 text-xs" style={{ color: 'var(--ds-color-feedback-success-text)' }}>
```

- [ ] **Step 4: Type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | grep "PositionCell" || echo "No PositionCell errors"
```

- [ ] **Step 5: Commit**

```bash
git add client/src/components/netting/PositionCell.tsx
git commit -m "feat(netting): use CurrencyBadge + ds-foundation token colors in PositionCell"
```

---

## Task 5: StatusPill + MonoAmount in InFlightCell

**Goal:** Replace `STATUS_CONFIG` (hardcoded Tailwind dot+text) with `StatusPill` from ds-foundation. Replace amount display with `MonoAmount`.

**Files:**
- Modify: `client/src/components/netting/InFlightCell.tsx`

**DS-Foundation APIs:**
```typescript
import { StatusPill, MonoAmount } from '@ds-foundation/react';
// StatusPill props: { status: InstructionStatus }
// MonoAmount props: { value: number, currency: 'USD'|'EUR'|'GBP', size?: 'sm'|'md'|'lg', color?: AmountColor }
```

**Note on ActionStatus alignment:** After Task 2, `ActionStatus` now matches `InstructionStatus` exactly. `StatusPill` accepts `InstructionStatus` — pass `action.status` directly (TypeScript will verify the structural match).

**Note on MonoAmount format:** Amounts in InFlightCell (e.g. `action.amount = 160`) will render as `$160.0` instead of `$160M`. This is the correct change — action amounts are specific instruction values, not summary millions. Remove `formatAmount` usage here.

- [ ] **Step 1: Update imports**

```typescript
// Remove:
import { formatAmount, type Action, type ActionStatus } from "./types";
// Add:
import { type Action, type ActionStatus } from "./types";
import { StatusPill, MonoAmount } from "@ds-foundation/react";
```

- [ ] **Step 2: Remove `STATUS_CONFIG` entirely (lines 10–18)**

Delete the entire `STATUS_CONFIG` constant block.

- [ ] **Step 3: Update the action row render**

Replace the action card body (lines 35–65) with:

```tsx
{sorted.map((action) => {
  const isFailed = action.status === "failed";
  return (
    <div
      key={action.id}
      className={`rounded-md p-2 ${isFailed ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}
    >
      <div className="flex items-center gap-1.5">
        {isFailed && <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />}
        <StatusPill status={action.status} />
        <span className="ml-auto">
          <MonoAmount value={action.amount} currency={action.currency} size="sm" />
        </span>
      </div>
      <p className="text-xs text-gray-400 mt-0.5 ml-4 truncate">
        {action.accountFrom} → {action.accountTo}
      </p>
      {isFailed && action.failureReason && (
        <p className="text-xs mt-1 ml-4" style={{ color: 'var(--ds-color-feedback-error-text)' }}>
          {action.failureReason}
        </p>
      )}
      {action.requiresManualRelease && (
        <p className="text-xs mt-1 ml-4 font-medium" style={{ color: 'var(--ds-color-feedback-warning-text)' }}>
          ⚠ Requires manual bank release
        </p>
      )}
    </div>
  );
})}
```

- [ ] **Step 4: Type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | grep "InFlightCell\|StatusPill\|ActionStatus" || echo "No InFlightCell errors"
```

- [ ] **Step 5: Commit**

```bash
git add client/src/components/netting/InFlightCell.tsx
git commit -m "feat(netting): use StatusPill + MonoAmount in InFlightCell"
```

---

## Task 6: StatusRing + MonoAmount in CompletedCell

**Goal:** Replace `<CheckCircle>` header indicator with `StatusRing`, apply token color to count text and total amount, use `MonoAmount` for individual action amounts.

**Files:**
- Modify: `client/src/components/netting/CompletedCell.tsx`

**DS-Foundation APIs:**
```typescript
import { StatusRing, MonoAmount } from '@ds-foundation/react';
// StatusRing props: { urgency: 'critical'|'watch'|'clear'|'skip', size?: 'sm'|'md' }
// urgency="clear" = success green dot
```

- [ ] **Step 1: Update imports**

```typescript
// Before:
import { CheckCircle, ExternalLink } from "lucide-react";
import { formatAmount, type Action, type Currency } from "./types";

// After:
import { ExternalLink } from "lucide-react";
import { type Action, type Currency } from "./types";
import { StatusRing, MonoAmount } from "@ds-foundation/react";
```

- [ ] **Step 2: Update the header indicator (lines 19–24)**

```tsx
// Before:
<div className="flex items-center gap-1.5 mb-2">
  <CheckCircle className="w-3.5 h-3.5 text-green-500" />
  <span className="text-xs font-semibold text-green-600">
    {actions.length} settlement{actions.length !== 1 ? "s" : ""}
  </span>
</div>

// After:
<div className="flex items-center gap-1.5 mb-2">
  <StatusRing urgency="clear" size="sm" />
  <span className="text-xs font-semibold" style={{ color: 'var(--ds-color-feedback-success-text)' }}>
    {actions.length} settlement{actions.length !== 1 ? "s" : ""}
  </span>
</div>
```

- [ ] **Step 3: Replace individual action amount displays (lines 28–35)**

```tsx
// Before:
<span className="text-xs font-semibold tabular-nums text-gray-700">
  {formatAmount(action.amount, action.currency)}
</span>

// After:
<MonoAmount value={action.amount} currency={action.currency} size="sm" />
```

- [ ] **Step 4: Replace total amount display (lines 40–46)**

```tsx
// Before:
<span className="text-xs font-bold text-gray-800 tabular-nums">
  {formatAmount(total, currency as Currency)}
</span>

// After:
<MonoAmount value={total} currency={currency as Currency} size="sm" color="success" />
```

- [ ] **Step 5: Type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | grep "CompletedCell\|StatusRing\|MonoAmount" || echo "No CompletedCell errors"
```

- [ ] **Step 6: Commit**

```bash
git add client/src/components/netting/CompletedCell.tsx
git commit -m "feat(netting): use StatusRing + MonoAmount in CompletedCell"
```

---

## Task 7: CurrencyBadge in ActionModal

**Goal:** Replace the hardcoded purple currency badge in the dialog title with `CurrencyBadge`.

**Files:**
- Modify: `client/src/components/netting/ActionModal.tsx`

- [ ] **Step 1: Add ds-foundation import**

```typescript
// Add at top:
import { CurrencyBadge } from "@ds-foundation/react";
```

- [ ] **Step 2: Replace the inline badge (lines 77–79)**

```tsx
// Before:
<span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 border border-purple-100">
  {pairing.from} ↔ {pairing.to}
</span>

// After (entity pair label is TSW-specific, keep as-is but use CurrencyBadge for currency):
<span className="text-sm text-gray-500 font-normal">{pairing.from} ↔ {pairing.to}</span>
<CurrencyBadge currency={pairing.currency} />
```

- [ ] **Step 3: Type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1 | grep "ActionModal" || echo "No ActionModal errors"
```

- [ ] **Step 4: Final full type-check**

```bash
DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run check 2>&1
```

Expected: 0 errors. If errors remain, fix before proceeding.

- [ ] **Step 5: Commit**

```bash
git add client/src/components/netting/ActionModal.tsx
git commit -m "feat(netting): use CurrencyBadge in ActionModal title"
```

---

## Task 8: Push branch and open PR

- [ ] **Step 1: Push branch**

```bash
git push -u origin feat/netting-swim-lane
```

- [ ] **Step 2: Verify commits**

```bash
git log origin/main..HEAD --oneline
```

Expected: Tasks 1–7 commits visible.

- [ ] **Step 3: Open PR**

```bash
gh pr create \
  --title "feat(netting): integrate @ds-foundation/react atoms into netting module" \
  --body "$(cat <<'EOF'
## Summary
- Rebased onto main to pick up vendored \`@ds-foundation/react\` and token uplift
- Aligned \`ActionStatus\` types with ds-foundation \`InstructionStatus\` vocabulary (\`first_signed\` → \`first_approval\`, \`confirmed\` → \`bank_confirmed\`)
- Replaced handrolled \`FreshnessChip\` with ds-foundation component (deleted local copy)
- Replaced purple hardcoded currency spans with \`CurrencyBadge\` (PositionCell, ActionModal)
- Applied ds-foundation token CSS vars to MetricRow colors in PositionCell
- Replaced \`STATUS_CONFIG\` dot+text badges with \`StatusPill\` in InFlightCell
- Replaced \`CheckCircle\` with \`StatusRing urgency="clear"\` in CompletedCell header
- Replaced \`formatAmount()\` string returns with \`MonoAmount\` in InFlightCell and CompletedCell

## Test plan
- [ ] Start dev server: \`DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy" npm run dev\`
- [ ] Navigate to \`/netting\` — dashboard loads without errors
- [ ] FreshnessChip: pairing with \`freshnessMinutes: 5\` shows "Watch" chip; \`freshnessMinutes: 18\` shows "Stale" chip; \`freshnessMinutes: 1\` renders nothing
- [ ] CurrencyBadge: each pairing header shows currency as a styled badge (USD/EUR/GBP)
- [ ] StatusPill: in-flight actions show correct pill colors (blue=in_payments, green=sent_to_bank/confirmed, red=failed)
- [ ] StatusRing: CompletedCell header shows green dot instead of CheckCircle icon
- [ ] MonoAmount: amounts render with monospaced font; no "M" suffix (numeric values)
- [ ] \`npm run check\` exits with 0 errors

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Self-Review

**Spec coverage check:**
- ✅ Rebase / vendor tgz — Task 1
- ✅ `ActionStatus` type alignment — Task 2
- ✅ `FreshnessChip` replacement — Task 3
- ✅ `CurrencyBadge` in PositionCell — Task 4
- ✅ Token colors in MetricRow — Task 4
- ✅ `StatusPill` in InFlightCell — Task 5
- ✅ `MonoAmount` in InFlightCell — Task 5
- ✅ `StatusRing` in CompletedCell — Task 6
- ✅ `MonoAmount` in CompletedCell — Task 6
- ✅ `CurrencyBadge` in ActionModal — Task 7
- ✅ PR — Task 8

**Placeholder scan:** No TBDs or vague steps. All code shown in full.

**Type consistency:** `ActionStatus` renamed in Task 2 before `StatusPill` used in Task 5. `freshnessMinutesToDate` added in Task 3 before used in PositionCell. `CurrencyBadge` imported fresh in both Task 4 and Task 7 (no shared import mutation). All consistent.
