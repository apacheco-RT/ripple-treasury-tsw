# Settlement Netting Dashboard — Swim Lane Rebuild

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the existing three-panel IntercompanySettlement page with a swim-lane dashboard that shows one row per entity pairing, with three columns (Entity Position | In-Flight | Completed) and an entity-scoped Action Creation modal.

**Architecture:** The existing 1,812-line `IntercompanySettlement.tsx` becomes a slim ~100-line orchestrator. All domain logic and UI is extracted into focused components under `client/src/components/netting/`. Mock data drives the prototype — no backend changes required. The `/netting` route in `App.tsx` is unchanged.

**Tech Stack:** React 18, TypeScript, Tailwind CSS v3, shadcn/ui (Radix Dialog + Select + Popover), Lucide icons, Framer Motion (already installed), wouter (routing already wired)

**Source of truth:** Ben Hipwell meeting 2026-03-24 + PRD v1.1 (`cross-entity-settlement-prd-v1.1.md`). Ben's meeting overrides PRD where they conflict.

---

## Scope Check

This plan is one subsystem: the UI prototype. It is self-contained. After Task 4 is committed (which creates the complete `EntityRow.tsx` skeleton with all three cell slots), Tasks 5 and 6 can run in parallel — they each only create their own cell file. Task 7 (ActionModal) can also run in parallel with Tasks 5 and 6.

---

## File Map

| Action | File | Responsibility |
|---|---|---|
| **Rewrite** | `client/src/pages/IntercompanySettlement.tsx` | Slim orchestrator: renders TreasuryShell + DashboardHeader + column headers + entity rows |
| **Create** | `client/src/components/netting/types.ts` | All TS types + mock data (no UI) |
| **Create** | `client/src/components/netting/DashboardHeader.tsx` | Date/time selector, trade type multi-select, USD badge |
| **Create** | `client/src/components/netting/ColumnHeaders.tsx` | The 3-column header row ("Entity Position / In-Flight / Completed") |
| **Create** | `client/src/components/netting/EntityRow.tsx` | One swim lane: 3-column grid, receives a single EntityPairing record |
| **Create** | `client/src/components/netting/PositionCell.tsx` | Left column: gross exposure, settled, open, tx drill-down |
| **Create** | `client/src/components/netting/InFlightCell.tsx` | Middle column: in-flight action list + Initiate Action button |
| **Create** | `client/src/components/netting/CompletedCell.tsx` | Right column: completed actions list + link to payments |
| **Create** | `client/src/components/netting/ActionModal.tsx` | Entity-scoped modal: account select, amount, submit → adds to in-flight |
| **Create** | `client/src/components/netting/FreshnessChip.tsx` | Reusable freshness state chip (fresh/watch/stale) |
| **No change** | `client/src/App.tsx` | `/netting` route already wired to IntercompanySettlement |
| **No change** | `client/src/components/TreasuryShell.tsx` | Shell stays; we just use it |

---

## Domain Reference (for all agents)

### Entity Pairings in Mock Data
- SA ↔ LTD (EUR, GBP)
- SA ↔ INC (USD)
- SA ↔ BVI (USD)
- INC ↔ BVI (USD)

### Banks
- LHV — EUR, GBP (GBP requires manual bank release — permanent constraint)
- Customers Bank — USD (24/7 instant, $500M exposure cap)
- Bank Frick — EUR, GBP, USD

### Transaction Types (15 types for filter)
Trade settlement, Creditcard settlement, Ripple settlement, Deposit settlement, OTC trade settlement, Derivatives settlement, Derivatives IF claim, Derivatives IF premium, Derivatives FEE sweep, Derivatives liquidation, Derivatives, Account transfers, Withdrawals

### Action Status Progression
`submitted` → `in_payments` → `first_signed` → `second_signed` → `sent_to_bank` → `confirmed` → (or) `failed`

### Status Badge Colors
- `submitted`: grey
- `in_payments`: blue
- `first_signed` / `second_signed`: indigo
- `sent_to_bank`: teal
- `confirmed`: green
- `failed`: red

### Data Freshness States (per panel)
- **Fresh** (< 3 min): no indicator or subtle green chip
- **Watch** (3–15 min): amber chip with timestamp
- **Stale** (> 15 min): red chip + inline alert

---

## Task 1: Types & Mock Data

**Files:**
- Create: `client/src/components/netting/types.ts`

No UI in this file. Pure TypeScript types + mock data arrays. All other tasks import from here.

- [ ] **Step 1.1: Create the types file**

```typescript
// client/src/components/netting/types.ts

export type Currency = "USD" | "EUR" | "GBP";
export type EntityCode = "SA" | "LTD" | "INC" | "BVI" | "BFS" | "ASIA";
export type TxType =
  | "Trade settlement" | "Creditcard settlement" | "Ripple settlement"
  | "Deposit settlement" | "OTC trade settlement" | "Derivatives settlement"
  | "Derivatives IF claim" | "Derivatives IF premium" | "Derivatives FEE sweep"
  | "Derivatives liquidation" | "Derivatives" | "Account transfers" | "Withdrawals";

export type ActionStatus =
  | "submitted" | "in_payments" | "first_signed" | "second_signed"
  | "sent_to_bank" | "confirmed" | "failed";

export type FreshnessState = "fresh" | "watch" | "stale";

export interface TxBreakdown {
  type: TxType;
  amount: number; // USD millions
}

export interface EntityPairing {
  id: string;                    // e.g. "SA-LTD-EUR"
  from: EntityCode;
  to: EntityCode;
  currency: Currency;
  grossExposure: number;         // USD millions since start point
  settled: number;               // already settled since start point
  open: number;                  // remaining (grossExposure - settled)
  breakdown: TxBreakdown[];      // per transaction type
  lastSettled: string;           // ISO datetime
  freshnessMinutes: number;      // minutes since data last refreshed
}

export interface Action {
  id: string;
  pairingId: string;             // references EntityPairing.id
  from: EntityCode;
  to: EntityCode;
  currency: Currency;
  amount: number;
  status: ActionStatus;
  accountFrom: string;           // e.g. "LHV London - GBP"
  accountTo: string;
  createdAt: string;             // ISO datetime
  updatedAt: string;
  failureReason?: string;
  requiresManualRelease: boolean; // true for all GBP
}

export interface BankAccount {
  id: string;
  entity: EntityCode;
  bank: string;                  // "LHV" | "Customers Bank" | "Bank Frick"
  currency: Currency;
  label: string;                 // display name e.g. "LHV London - GBP"
  balance: number;               // USD millions
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const SETTLEMENT_TYPES: TxType[] = [
  "Trade settlement", "Creditcard settlement", "Ripple settlement",
  "Deposit settlement", "OTC trade settlement", "Derivatives settlement",
  "Derivatives IF claim", "Derivatives IF premium", "Derivatives FEE sweep",
  "Derivatives liquidation", "Derivatives", "Account transfers", "Withdrawals",
];

export const MOCK_PAIRINGS: EntityPairing[] = [
  {
    id: "SA-LTD-EUR",
    from: "SA", to: "LTD", currency: "EUR",
    grossExposure: 480, settled: 340, open: 140,
    breakdown: [
      { type: "Trade settlement", amount: 310 },
      { type: "Deposit settlement", amount: 30 },
    ],
    lastSettled: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 2,
  },
  {
    id: "SA-LTD-GBP",
    from: "SA", to: "LTD", currency: "GBP",
    grossExposure: 120, settled: 40, open: 80,
    breakdown: [
      { type: "Trade settlement", amount: 120 },
    ],
    lastSettled: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 5, // watch state — amber chip
  },
  {
    id: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD",
    grossExposure: 620, settled: 420, open: 200,
    breakdown: [
      { type: "Trade settlement", amount: 380 },
      { type: "OTC trade settlement", amount: 40 },
    ],
    lastSettled: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 8,
  },
  {
    id: "SA-BVI-USD",
    from: "SA", to: "BVI", currency: "USD",
    grossExposure: 180, settled: 80, open: 100,
    breakdown: [
      { type: "Trade settlement", amount: 80 },
    ],
    lastSettled: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 18,
  },
  {
    id: "INC-BVI-USD",
    from: "INC", to: "BVI", currency: "USD",
    grossExposure: 95, settled: 95, open: 0,
    breakdown: [
      { type: "Trade settlement", amount: 95 },
    ],
    lastSettled: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    freshnessMinutes: 1,
  },
];

export const MOCK_ACTIONS: Action[] = [
  {
    id: "ACT-004", pairingId: "SA-LTD-GBP",
    from: "SA", to: "LTD", currency: "GBP", amount: 40,
    status: "submitted",
    accountFrom: "LHV Frankfurt - GBP", accountTo: "LHV London - GBP",
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    requiresManualRelease: true, // GBP — triggers amber warning in InFlightCell
  },
  {
    id: "ACT-001", pairingId: "SA-LTD-EUR",
    from: "SA", to: "LTD", currency: "EUR", amount: 160,
    status: "in_payments",
    accountFrom: "LHV Frankfurt - EUR", accountTo: "LHV London - EUR",
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
  {
    id: "ACT-002", pairingId: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD", amount: 120,
    status: "sent_to_bank",
    accountFrom: "Customers Bank SA - USD", accountTo: "Customers Bank INC - USD",
    createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
  {
    id: "ACT-003", pairingId: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD", amount: 80,
    status: "failed",
    accountFrom: "Bank Frick SA - USD", accountTo: "Customers Bank INC - USD",
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    failureReason: "Insufficient balance on Bank Frick SA - USD",
    requiresManualRelease: false,
  },
];

export const MOCK_COMPLETED_ACTIONS: Action[] = [
  {
    id: "ACT-C001", pairingId: "SA-LTD-EUR",
    from: "SA", to: "LTD", currency: "EUR", amount: 340,
    status: "confirmed",
    accountFrom: "LHV Frankfurt - EUR", accountTo: "LHV London - EUR",
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
  {
    id: "ACT-C002", pairingId: "SA-INC-USD",
    from: "SA", to: "INC", currency: "USD", amount: 420,
    status: "confirmed",
    accountFrom: "Customers Bank SA - USD", accountTo: "Customers Bank INC - USD",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    requiresManualRelease: false,
  },
];

export const MOCK_GBP_IN_FLIGHT: Action = {
  id: "ACT-004", pairingId: "SA-LTD-GBP",
  from: "SA", to: "LTD", currency: "GBP", amount: 40,
  status: "submitted",
  accountFrom: "LHV Frankfurt - GBP", accountTo: "LHV London - GBP",
  createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  requiresManualRelease: true, // GBP — permanent LHV constraint
};
// Add ACT-004 to MOCK_ACTIONS array below

export const MOCK_ACCOUNTS: BankAccount[] = [
  { id: "LHV-SA-EUR", entity: "SA", bank: "LHV", currency: "EUR", label: "LHV Frankfurt - EUR", balance: 280 },
  { id: "LHV-LTD-EUR", entity: "LTD", bank: "LHV", currency: "EUR", label: "LHV London - EUR", balance: 120 },
  { id: "LHV-SA-GBP", entity: "SA", bank: "LHV", currency: "GBP", label: "LHV Frankfurt - GBP", balance: 95 },
  { id: "LHV-LTD-GBP", entity: "LTD", bank: "LHV", currency: "GBP", label: "LHV London - GBP", balance: 48 },
  { id: "CB-SA-USD", entity: "SA", bank: "Customers Bank", currency: "USD", label: "Customers Bank SA - USD", balance: 310 },
  { id: "CB-INC-USD", entity: "INC", bank: "Customers Bank", currency: "USD", label: "Customers Bank INC - USD", balance: 180 },
  { id: "CB-BVI-USD", entity: "BVI", bank: "Customers Bank", currency: "USD", label: "Customers Bank BVI - USD", balance: 75 },
  { id: "BF-SA-USD", entity: "SA", bank: "Bank Frick", currency: "USD", label: "Bank Frick SA - USD", balance: 12 },
];

export function getFreshnessState(minutes: number): FreshnessState {
  if (minutes < 3) return "fresh";
  if (minutes <= 15) return "watch";
  return "stale";
}

export function formatAmount(amount: number, currency: Currency): string {
  const symbols: Record<Currency, string> = { USD: "$", EUR: "€", GBP: "£" };
  return `${symbols[currency]}${amount}M`;
}
```

- [ ] **Step 1.2: Verify TypeScript compiles**

```bash
cd ~/Documents/Projects/replit-project && npm run check 2>&1 | head -20
```
Expected: no errors in the new file

- [ ] **Step 1.3: Commit**

```bash
cd ~/Documents/Projects/replit-project
git add client/src/components/netting/types.ts
git commit -m "feat(netting): add types and mock data for swim lane dashboard"
```

---

## Task 2: FreshnessChip Component

**Files:**
- Create: `client/src/components/netting/FreshnessChip.tsx`

Small, reusable. Build and commit it before it's needed by the cells.

- [ ] **Step 2.1: Create FreshnessChip**

```tsx
// client/src/components/netting/FreshnessChip.tsx
import { cn } from "@/lib/utils";
import { getFreshnessState, type FreshnessState } from "./types";

interface FreshnessChipProps {
  minutes: number;
  className?: string;
}

export function FreshnessChip({ minutes, className }: FreshnessChipProps) {
  const state = getFreshnessState(minutes);

  if (state === "fresh") return null;

  const configs: Record<Exclude<FreshnessState, "fresh">, { label: string; classes: string }> = {
    watch: {
      label: `Updated ${minutes}m ago`,
      classes: "bg-amber-50 text-amber-700 border border-amber-200",
    },
    stale: {
      label: `Stale — ${minutes}m ago`,
      classes: "bg-red-50 text-red-700 border border-red-200",
    },
  };

  const config = configs[state as "watch" | "stale"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium",
        config.classes,
        className
      )}
    >
      <span className={cn(
        "w-1.5 h-1.5 rounded-full",
        state === "watch" ? "bg-amber-500" : "bg-red-500"
      )} />
      {config.label}
    </span>
  );
}
```

- [ ] **Step 2.2: Verify TypeScript compiles**

```bash
cd ~/Documents/Projects/replit-project && npm run check 2>&1 | grep -E "error|FreshnessChip"
```
Expected: no errors

- [ ] **Step 2.3: Commit**

```bash
git add client/src/components/netting/FreshnessChip.tsx
git commit -m "feat(netting): add FreshnessChip component"
```

---

## Task 3: Dashboard Shell — Page Orchestrator + Header + Column Headers

**Files:**
- Rewrite: `client/src/pages/IntercompanySettlement.tsx`
- Create: `client/src/components/netting/DashboardHeader.tsx`
- Create: `client/src/components/netting/ColumnHeaders.tsx`

This task gives us the skeleton. The entity rows will render as empty placeholders until Tasks 4–6.

**⚠️ This task replaces the existing 1,812-line file. Back it up first:**

```bash
cp client/src/pages/IntercompanySettlement.tsx client/src/pages/IntercompanySettlement.tsx.bak
```

- [ ] **Step 3.1: Create DashboardHeader**

```tsx
// client/src/components/netting/DashboardHeader.tsx
import { useState } from "react";
import { Calendar, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { SETTLEMENT_TYPES, type TxType } from "./types";

interface DashboardHeaderProps {
  startPoint: Date;
  onStartPointChange: (date: Date) => void;
  selectedTypes: TxType[];
  onTypesChange: (types: TxType[]) => void;
}

export function DashboardHeader({
  startPoint, onStartPointChange, selectedTypes, onTypesChange,
}: DashboardHeaderProps) {
  const [filterOpen, setFilterOpen] = useState(false);

  const allSelected = selectedTypes.length === SETTLEMENT_TYPES.length;

  function toggleType(type: TxType) {
    if (selectedTypes.includes(type)) {
      onTypesChange(selectedTypes.filter((t) => t !== type));
    } else {
      onTypesChange([...selectedTypes, type]);
    }
  }

  function toggleAll() {
    onTypesChange(allSelected ? [] : [...SETTLEMENT_TYPES]);
  }

  // Format date for the input
  const dateValue = startPoint.toISOString().slice(0, 16);

  return (
    <div className="flex items-center gap-3 px-6 py-3 border-b border-gray-100 bg-white">
      {/* Start point selector */}
      <div className="flex items-center gap-2">
        <Calendar className="w-4 h-4 text-gray-400" />
        <label className="text-xs text-gray-500 font-medium">From</label>
        <input
          type="datetime-local"
          value={dateValue}
          onChange={(e) => onStartPointChange(new Date(e.target.value))}
          className="text-sm border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-purple-500"
        />
      </div>

      <div className="w-px h-5 bg-gray-200" />

      {/* Settlement type filter */}
      <Popover open={filterOpen} onOpenChange={setFilterOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs h-8">
            <Filter className="w-3.5 h-3.5" />
            {allSelected
              ? "All types"
              : `${selectedTypes.length} of ${SETTLEMENT_TYPES.length} types`}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <div className="space-y-2">
            <div className="flex items-center gap-2 pb-2 border-b">
              <Checkbox
                id="all-types"
                checked={allSelected}
                onCheckedChange={() => toggleAll()}
              />
              <label htmlFor="all-types" className="text-xs font-semibold text-gray-700 cursor-pointer">
                All types
              </label>
            </div>
            {SETTLEMENT_TYPES.map((type) => (
              <div key={type} className="flex items-center gap-2">
                <Checkbox
                  id={type}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => toggleType(type)}
                />
                <label htmlFor={type} className="text-xs text-gray-600 cursor-pointer">
                  {type}
                </label>
              </div>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Currency badge — fixed USD */}
      <div className="ml-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
        USD
      </div>
    </div>
  );
}
```

- [ ] **Step 3.2: Create ColumnHeaders**

```tsx
// client/src/components/netting/ColumnHeaders.tsx
export function ColumnHeaders() {
  return (
    <div className="grid grid-cols-[2fr_2fr_1.5fr] gap-0 border-b border-gray-100 bg-gray-50 sticky top-0 z-10">
      {[
        { label: "Entity Position", sub: "Exposure since start point" },
        { label: "In-Flight", sub: "Actions initiated" },
        { label: "Completed", sub: "Settled this period" },
      ].map((col, i) => (
        <div
          key={col.label}
          className={`px-5 py-2.5 ${i > 0 ? "border-l border-gray-100" : ""}`}
        >
          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
            {col.label}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{col.sub}</p>
        </div>
      ))}
    </div>
  );
}
```

- [ ] **Step 3.3: Rewrite IntercompanySettlement.tsx as slim orchestrator**

```tsx
// client/src/pages/IntercompanySettlement.tsx
import { useState } from "react";
import TreasuryShell from "@/components/TreasuryShell";
import { DashboardHeader } from "@/components/netting/DashboardHeader";
import { ColumnHeaders } from "@/components/netting/ColumnHeaders";
import {
  MOCK_PAIRINGS, MOCK_ACTIONS, MOCK_COMPLETED_ACTIONS,
  SETTLEMENT_TYPES, type TxType, type Action,
} from "@/components/netting/types";

// Placeholder row until EntityRow is built in Task 4
function PlaceholderRow({ id }: { id: string }) {
  return (
    <div className="grid grid-cols-[2fr_2fr_1.5fr] border-b border-gray-100 min-h-[80px]">
      {[0, 1, 2].map((i) => (
        <div key={i} className={`px-5 py-4 ${i > 0 ? "border-l border-gray-100" : ""}`}>
          <div className="h-3 w-24 bg-gray-100 rounded animate-pulse mb-2" />
          <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function IntercompanySettlement() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [startPoint, setStartPoint] = useState<Date>(today);
  const [selectedTypes, setSelectedTypes] = useState<TxType[]>([...SETTLEMENT_TYPES]);
  const [actions, setActions] = useState<Action[]>(MOCK_ACTIONS);

  return (
    <TreasuryShell solution="Payments" activeFeature="Settlement Netting">
      <div className="flex flex-col h-full">
        <DashboardHeader
          startPoint={startPoint}
          onStartPointChange={setStartPoint}
          selectedTypes={selectedTypes}
          onTypesChange={setSelectedTypes}
        />
        <div className="flex-1 overflow-auto">
          <ColumnHeaders />
          {MOCK_PAIRINGS.map((pairing) => (
            <PlaceholderRow key={pairing.id} id={pairing.id} />
          ))}
        </div>
      </div>
    </TreasuryShell>
  );
}
```

- [ ] **Step 3.4: Start dev server and verify page loads**

```bash
cd ~/Documents/Projects/replit-project && npm run dev
```
Navigate to: `http://localhost:5000/#/netting`

Expected:
- TreasuryShell sidebar renders
- Header shows date picker, type filter, USD badge
- Column headers row visible
- 4 placeholder rows (animated pulse)
- No console errors

- [ ] **Step 3.5: Commit**

```bash
git add client/src/pages/IntercompanySettlement.tsx \
        client/src/components/netting/DashboardHeader.tsx \
        client/src/components/netting/ColumnHeaders.tsx
git commit -m "feat(netting): dashboard shell with header, column headers, placeholder rows"
```

---

## Task 4: PositionCell — Left Column

**Files:**
- Create: `client/src/components/netting/PositionCell.tsx`

Can be built in parallel with Tasks 5 and 6 after Task 3 is committed.

- [ ] **Step 4.1: Create PositionCell**

```tsx
// client/src/components/netting/PositionCell.tsx
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { FreshnessChip } from "./FreshnessChip";
import { formatAmount, type EntityPairing } from "./types";

interface PositionCellProps {
  pairing: EntityPairing;
}

export function PositionCell({ pairing }: PositionCellProps) {
  const [expanded, setExpanded] = useState(false);
  const settledPct = pairing.grossExposure > 0
    ? Math.round((pairing.settled / pairing.grossExposure) * 100)
    : 0;

  return (
    <div className="px-5 py-4">
      {/* Entity pair label */}
      <div className="flex items-center gap-2 mb-3">
        <span className="text-sm font-semibold text-gray-900">
          {pairing.from} ↔ {pairing.to}
        </span>
        <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 border border-purple-100">
          {pairing.currency}
        </span>
        <FreshnessChip minutes={pairing.freshnessMinutes} className="ml-auto" />
      </div>

      {/* Metrics */}
      <div className="space-y-1.5">
        <MetricRow
          label="Gross exposure"
          value={formatAmount(pairing.grossExposure, pairing.currency)}
          valueClass="text-gray-700"
        />
        <MetricRow
          label="Settled"
          value={formatAmount(pairing.settled, pairing.currency)}
          valueClass="text-green-600"
        />
        <MetricRow
          label="Open"
          value={formatAmount(pairing.open, pairing.currency)}
          valueClass={pairing.open > 0 ? "text-amber-600 font-semibold" : "text-gray-400"}
        />
      </div>

      {/* Progress bar */}
      {pairing.grossExposure > 0 && (
        <div className="mt-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{settledPct}% settled</span>
            <span className="text-gray-300">
              Last: {new Date(pairing.lastSettled).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-400 rounded-full transition-all"
              style={{ width: `${settledPct}%` }}
            />
          </div>
        </div>
      )}

      {/* Transaction drill-down */}
      {pairing.breakdown.length > 0 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
        >
          {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          {expanded ? "Hide" : "Show"} transactions
        </button>
      )}

      {expanded && (
        <div className="mt-2 pl-2 border-l-2 border-gray-100 space-y-1">
          {pairing.breakdown.map((item) => (
            <div key={item.type} className="flex justify-between text-xs">
              <span className="text-gray-500">{item.type}</span>
              <span className="text-gray-700 font-medium">
                {formatAmount(item.amount, pairing.currency)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function MetricRow({
  label, value, valueClass,
}: { label: string; value: string; valueClass: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-gray-400">{label}</span>
      <span className={`text-sm font-medium tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}
```

- [ ] **Step 4.2: Create complete EntityRow.tsx with all three cell slots**

**Important:** Create the full `EntityRow.tsx` now with all three slots defined. Tasks 5 and 6 will only create their own cell files — they will NOT modify this file. This prevents merge conflicts when Tasks 5 and 6 run in parallel.

```tsx
// client/src/components/netting/EntityRow.tsx
// NOTE: InFlightCell and CompletedCell are imported here but not built yet.
// Tasks 5 and 6 create those files. This file does NOT need to change after Task 4.
import { PositionCell } from "./PositionCell";
import { InFlightCell } from "./InFlightCell";
import { CompletedCell } from "./CompletedCell";
import { type EntityPairing, type Action } from "./types";

interface EntityRowProps {
  pairing: EntityPairing;
  inflightActions: Action[];
  completedActions: Action[];
  onInitiateAction: (pairingId: string) => void;
}

export function EntityRow({ pairing, inflightActions, completedActions, onInitiateAction }: EntityRowProps) {
  const urgency = pairing.open > 150
    ? "border-l-4 border-l-red-400"
    : pairing.open > 50
    ? "border-l-4 border-l-amber-400"
    : "border-l-4 border-l-transparent";

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr] border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${urgency}`}>
      <PositionCell pairing={pairing} />
      <InFlightCell
        actions={inflightActions}
        onInitiateAction={() => onInitiateAction(pairing.id)}
      />
      <CompletedCell actions={completedActions} />
    </div>
  );
}
```

**Tasks 5 and 6 only need to create their respective cell files.** The `EntityRow.tsx` imports will resolve once those files exist. TypeScript will error until Tasks 5 and 6 are complete — that is expected and will not affect Task 4's commit.

To unblock the dev server after Task 4 while Tasks 5/6 are pending, create stub files:

```bash
# Stubs so the dev server compiles while Tasks 5 & 6 are in progress
echo 'export function InFlightCell() { return null; }' > client/src/components/netting/InFlightCell.tsx
echo 'export function CompletedCell() { return null; }' > client/src/components/netting/CompletedCell.tsx
```

Tasks 5 and 6 will overwrite these stubs with real implementations.
```

- [ ] **Step 4.3: Update IntercompanySettlement.tsx to use EntityRow**

Replace the `PlaceholderRow` imports and usage with `EntityRow`:

In `IntercompanySettlement.tsx`, replace PlaceholderRow with:

```tsx
import { EntityRow } from "@/components/netting/EntityRow";

// ... inside the render, replace PlaceholderRow with:
{MOCK_PAIRINGS.map((pairing) => (
  <EntityRow
    key={pairing.id}
    pairing={pairing}
    inflightActions={actions.filter((a) => a.pairingId === pairing.id && a.status !== "confirmed")}
    completedActions={MOCK_COMPLETED_ACTIONS.filter((a) => a.pairingId === pairing.id)}
    onInitiateAction={(id) => console.log("Initiate action for", id)}
  />
))}
```

- [ ] **Step 4.4: Visual check**

Navigate to `http://localhost:5000/#/netting`

Expected:
- Each row shows entity pair name (SA ↔ LTD), currency badge
- Three metrics: Gross exposure, Settled, Open
- Progress bar
- "Show transactions" toggle works
- Freshness chips: SA-BVI-USD shows **red stale chip** (18 min), SA-INC-USD shows **amber watch chip** (8 min), SA-LTD-GBP shows **amber watch chip** (5 min), SA-LTD-EUR and INC-BVI-USD show nothing (< 3 min)

- [ ] **Step 4.5: Commit**

```bash
git add client/src/components/netting/PositionCell.tsx \
        client/src/components/netting/EntityRow.tsx \
        client/src/pages/IntercompanySettlement.tsx
git commit -m "feat(netting): PositionCell left column with metrics, drill-down, freshness"
```

---

## Task 5: InFlightCell — Middle Column

**Files:**
- Create: `client/src/components/netting/InFlightCell.tsx` ← only file you touch

Can be built in parallel with Task 6 once Task 4 is committed. `EntityRow.tsx` already imports `InFlightCell` — your file just needs to exist with the correct export name.

- [ ] **Step 5.1: Create InFlightCell**

```tsx
// client/src/components/netting/InFlightCell.tsx
import { Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatAmount, type Action, type ActionStatus } from "./types";

interface InFlightCellProps {
  actions: Action[];
  onInitiateAction: () => void;
}

const STATUS_CONFIG: Record<ActionStatus, { label: string; dot: string; text: string }> = {
  submitted:    { label: "Submitted",      dot: "bg-gray-400",   text: "text-gray-500" },
  in_payments:  { label: "In Payments",    dot: "bg-blue-500",   text: "text-blue-600" },
  first_signed: { label: "1st Approved",   dot: "bg-indigo-500", text: "text-indigo-600" },
  second_signed:{ label: "2nd Approved",   dot: "bg-indigo-600", text: "text-indigo-700" },
  sent_to_bank: { label: "Sent to Bank",   dot: "bg-teal-500",   text: "text-teal-600" },
  confirmed:    { label: "Confirmed",      dot: "bg-green-500",  text: "text-green-600" },
  failed:       { label: "Failed",         dot: "bg-red-500",    text: "text-red-600" },
};

export function InFlightCell({ actions, onInitiateAction }: InFlightCellProps) {
  // Failed actions pinned to top
  const sorted = [
    ...actions.filter((a) => a.status === "failed"),
    ...actions.filter((a) => a.status !== "failed"),
  ];

  return (
    <div className="px-5 py-4 border-l border-gray-100">
      {sorted.length === 0 ? (
        <p className="text-xs text-gray-300 mb-3">No actions in progress</p>
      ) : (
        <div className="space-y-2 mb-3">
          {sorted.map((action) => {
            const cfg = STATUS_CONFIG[action.status];
            const isFailed = action.status === "failed";
            return (
              <div
                key={action.id}
                className={`rounded-md p-2 ${isFailed ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}
              >
                <div className="flex items-center gap-1.5">
                  {isFailed
                    ? <AlertCircle className="w-3 h-3 text-red-500 shrink-0" />
                    : <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
                  }
                  <span className={`text-xs font-medium ${cfg.text}`}>{cfg.label}</span>
                  <span className="ml-auto text-xs font-semibold tabular-nums text-gray-700">
                    {formatAmount(action.amount, action.currency)}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 ml-4 truncate">
                  {action.accountFrom} → {action.accountTo}
                </p>
                {isFailed && action.failureReason && (
                  <p className="text-xs text-red-500 mt-1 ml-4">{action.failureReason}</p>
                )}
                {action.requiresManualRelease && (
                  <p className="text-xs text-amber-600 mt-1 ml-4 font-medium">
                    ⚠ Requires manual bank release
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full gap-1.5 text-xs h-7 border-dashed text-gray-500 hover:text-purple-600 hover:border-purple-300"
        onClick={onInitiateAction}
      >
        <Plus className="w-3 h-3" />
        Initiate Action
      </Button>
    </div>
  );
}
```

- [ ] **Step 5.2: Visual check**

Navigate to `http://localhost:5000/#/netting`

Expected:
- SA ↔ LTD (GBP) row: shows "Submitted £40M" action with amber "⚠ Requires manual bank release" warning
- SA ↔ LTD (EUR) row: shows "In Payments €160M" action
- SA ↔ INC row: shows failed action pinned at top (red background, failure reason text), plus "Sent to Bank $120M"
- SA ↔ BVI and INC ↔ BVI rows: "No actions in progress" + dashed Initiate Action button
- "Initiate Action" button present on all rows

- [ ] **Step 5.3: Commit**

```bash
git add client/src/components/netting/InFlightCell.tsx
git commit -m "feat(netting): InFlightCell middle column with status badges and initiate CTA"
```

---

## Task 6: CompletedCell — Right Column

**Files:**
- Create: `client/src/components/netting/CompletedCell.tsx` ← only file you touch

Can be built in parallel with Task 5 once Task 4 is committed. `EntityRow.tsx` already imports `CompletedCell` — your file just needs to exist with the correct export name.

- [ ] **Step 6.1: Create CompletedCell**

```tsx
// client/src/components/netting/CompletedCell.tsx
import { CheckCircle, ExternalLink } from "lucide-react";
import { formatAmount, type Action } from "./types";

interface CompletedCellProps {
  actions: Action[];
}

export function CompletedCell({ actions }: CompletedCellProps) {
  const total = actions.reduce((sum, a) => sum + a.amount, 0);
  // Only renders totals when actions.length > 0, so currency is always defined here
  const currency = actions[0]?.currency as Currency | undefined;

  return (
    <div className="px-5 py-4 border-l border-gray-100">
      {actions.length === 0 ? (
        <p className="text-xs text-gray-300">No completed settlements</p>
      ) : (
        <>
          <div className="flex items-center gap-1.5 mb-2">
            <CheckCircle className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-semibold text-green-600">
              {actions.length} settlement{actions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-1.5 mb-3">
            {actions.map((action) => (
              <div key={action.id} className="flex items-center justify-between">
                <span className="text-xs text-gray-400 truncate max-w-[100px]">
                  {action.accountFrom.split(" - ")[0]}
                </span>
                <span className="text-xs font-semibold tabular-nums text-gray-700">
                  {formatAmount(action.amount, action.currency)}
                </span>
              </div>
            ))}
          </div>

          {currency && total > 0 && (
            <div className="pt-2 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400">Total</span>
              <span className="text-xs font-bold text-gray-800 tabular-nums">
                {formatAmount(total, currency as Currency)}
              </span>
            </div>
          )}

          <button className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors">
            <ExternalLink className="w-3 h-3" />
            View in Payments
          </button>
        </>
      )}
    </div>
  );
}
```

- [ ] **Step 6.2: Visual check**

Navigate to `http://localhost:5000/#/netting`

Expected:
- SA ↔ LTD (EUR) row: shows 1 settlement, €340M total, "View in Payments" link
- SA ↔ INC row: shows 1 settlement, $420M total
- SA ↔ BVI, INC ↔ BVI, SA ↔ LTD (GBP) rows: "No completed settlements"
- All three columns visible and aligned in each row

- [ ] **Step 6.3: Commit**

```bash
git add client/src/components/netting/CompletedCell.tsx
git commit -m "feat(netting): CompletedCell right column with totals and payments link"
```

---

## Task 7: ActionModal — Initiate Action Flow

**Files:**
- Create: `client/src/components/netting/ActionModal.tsx`
- Modify: `client/src/pages/IntercompanySettlement.tsx`

- [ ] **Step 7.1: Create ActionModal**

```tsx
// client/src/components/netting/ActionModal.tsx
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  MOCK_ACCOUNTS, formatAmount,
  type EntityPairing, type Action, type BankAccount,
} from "./types";

interface ActionModalProps {
  pairing: EntityPairing | null;
  open: boolean;
  onClose: () => void;
  onSubmit: (action: Omit<Action, "id" | "createdAt" | "updatedAt">) => void;
}

export function ActionModal({ pairing, open, onClose, onSubmit }: ActionModalProps) {
  const [accountFromId, setAccountFromId] = useState("");
  const [accountToId, setAccountToId] = useState("");
  const [amountMode, setAmountMode] = useState<"full" | "partial">("full");
  const [partialAmount, setPartialAmount] = useState("");

  if (!pairing) return null;

  const fromAccounts = MOCK_ACCOUNTS.filter(
    (a) => a.entity === pairing.from && a.currency === pairing.currency
  );
  const toAccounts = MOCK_ACCOUNTS.filter(
    (a) => a.entity === pairing.to && a.currency === pairing.currency
  );

  const selectedFrom = MOCK_ACCOUNTS.find((a) => a.id === accountFromId);
  const amount = amountMode === "full"
    ? pairing.open
    : Number(partialAmount) || 0;

  const isGBP = pairing.currency === "GBP";
  const balanceExceeded = selectedFrom && amount > selectedFrom.balance;
  const canSubmit = accountFromId && accountToId && amount > 0 && !balanceExceeded;

  function handleSubmit() {
    if (!canSubmit || !selectedFrom) return;
    const accountTo = MOCK_ACCOUNTS.find((a) => a.id === accountToId);
    onSubmit({
      pairingId: pairing.id,
      from: pairing.from,
      to: pairing.to,
      currency: pairing.currency,
      amount,
      status: "submitted",
      accountFrom: selectedFrom.label,
      accountTo: accountTo?.label ?? accountToId,
      requiresManualRelease: isGBP,
    });
    // Reset
    setAccountFromId("");
    setAccountToId("");
    setAmountMode("full");
    setPartialAmount("");
    onClose();
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            Initiate Settlement
            <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-purple-50 text-purple-700 border border-purple-100">
              {pairing.from} ↔ {pairing.to}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Open exposure context */}
          <div className="bg-gray-50 rounded-md px-3 py-2 text-xs text-gray-600">
            Open exposure: <span className="font-semibold text-gray-900">
              {formatAmount(pairing.open, pairing.currency)}
            </span>
          </div>

          {isGBP && (
            <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded-md">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700">
                GBP requires manual bank release (permanent — LHV has no CHAPS API).
              </p>
            </div>
          )}

          {/* From account */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">From account ({pairing.from})</Label>
            <Select value={accountFromId} onValueChange={setAccountFromId}>
              <SelectTrigger className="text-sm h-9">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {fromAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    <span>{acc.label}</span>
                    <span className="text-gray-400 ml-2 text-xs">
                      {formatAmount(acc.balance, acc.currency)}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedFrom && (
              <p className="text-xs text-gray-400">
                Available: {formatAmount(selectedFrom.balance, selectedFrom.currency)}
              </p>
            )}
          </div>

          {/* To account */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">To account ({pairing.to})</Label>
            <Select value={accountToId} onValueChange={setAccountToId}>
              <SelectTrigger className="text-sm h-9">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                {toAccounts.map((acc) => (
                  <SelectItem key={acc.id} value={acc.id}>
                    {acc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-1.5">
            <Label className="text-xs font-medium">Amount</Label>
            <div className="flex gap-2 mb-2">
              {(["full", "partial"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setAmountMode(mode)}
                  className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                    amountMode === mode
                      ? "bg-purple-600 text-white border-purple-600"
                      : "bg-white text-gray-600 border-gray-200 hover:border-purple-300"
                  }`}
                >
                  {mode === "full"
                    ? `Full — ${formatAmount(pairing.open, pairing.currency)}`
                    : "Partial"
                  }
                </button>
              ))}
            </div>
            {amountMode === "partial" && (
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
                  {pairing.currency === "USD" ? "$" : pairing.currency === "EUR" ? "€" : "£"}
                </span>
                <Input
                  type="number"
                  inputMode="numeric"
                  placeholder="Amount in millions"
                  value={partialAmount}
                  onChange={(e) => setPartialAmount(e.target.value)}
                  className="pl-7 text-sm h-9"
                />
              </div>
            )}
            {balanceExceeded && (
              <p className="text-xs text-red-500">
                Exceeds available balance by {formatAmount(amount - (selectedFrom?.balance ?? 0), pairing.currency)}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button
              size="sm"
              disabled={!canSubmit}
              onClick={handleSubmit}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              Submit Action
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

- [ ] **Step 7.2: Wire ActionModal into IntercompanySettlement.tsx**

Add modal state and wire up the `onInitiateAction` callback:

```tsx
// Add import:
import { ActionModal } from "@/components/netting/ActionModal";
import type { Action } from "@/components/netting/types";

// Add state inside the component:
const [modalPairingId, setModalPairingId] = useState<string | null>(null);
const modalPairing = MOCK_PAIRINGS.find((p) => p.id === modalPairingId) ?? null;

function handleNewAction(actionData: Omit<Action, "id" | "createdAt" | "updatedAt">) {
  const newAction: Action = {
    ...actionData,
    id: `ACT-${Date.now()}`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  setActions((prev) => [...prev, newAction]);
}

// Update EntityRow's onInitiateAction:
onInitiateAction={(id) => setModalPairingId(id)}

// Add before closing </TreasuryShell>:
<ActionModal
  pairing={modalPairing}
  open={modalPairingId !== null}
  onClose={() => setModalPairingId(null)}
  onSubmit={handleNewAction}
/>
```

- [ ] **Step 7.3: Visual check — full flow**

Navigate to `http://localhost:5000/#/netting`

Expected flow:
1. Click "Initiate Action" on SA ↔ BVI row
2. Modal opens, titled "Initiate Settlement SA ↔ BVI", shows open exposure ($100M)
3. Select from/to accounts — see balances displayed
4. Toggle "Partial" — amount input appears
5. Enter amount exceeding balance — see red error message, Submit disabled
6. Toggle back to "Full" — Submit enabled
7. Click "Submit Action" — modal closes
8. SA ↔ BVI in-flight column now shows new "Submitted" action

- [ ] **Step 7.4: Commit**

```bash
git add client/src/components/netting/ActionModal.tsx \
        client/src/pages/IntercompanySettlement.tsx
git commit -m "feat(netting): ActionModal with account selection, balance check, submits to in-flight"
```

---

## Task 8: Mobile Responsive Pass

**Files:**
- Modify: `client/src/components/netting/ColumnHeaders.tsx`
- Modify: `client/src/components/netting/EntityRow.tsx`
- Modify: `client/src/components/netting/DashboardHeader.tsx`

- [ ] **Step 8.1: Make EntityRow stack vertically on mobile**

In `EntityRow.tsx`, change the grid to stack on small screens:

```tsx
// Change the outer div class from:
className="grid grid-cols-[2fr_2fr_1.5fr] border-b ..."

// To:
className="grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr] border-b ..."
```

Update border logic in each cell to show top border on mobile instead of left border:

In `InFlightCell.tsx`, change:
```tsx
className="px-5 py-4 border-l border-gray-100"
// to:
className="px-5 py-4 border-t sm:border-t-0 sm:border-l border-gray-100"
```

Apply same pattern to `CompletedCell.tsx`.

- [ ] **Step 8.2: Hide ColumnHeaders on mobile**

In `ColumnHeaders.tsx`, add `hidden sm:grid`:

```tsx
<div className="hidden sm:grid grid-cols-[2fr_2fr_1.5fr] ...">
```

- [ ] **Step 8.3: Stack DashboardHeader controls on mobile**

In `DashboardHeader.tsx`, change the outer div to wrap:

```tsx
className="flex flex-wrap items-center gap-3 px-4 sm:px-6 py-3 border-b border-gray-100 bg-white"
```

- [ ] **Step 8.4: Visual check at 390px**

Open browser DevTools → set device width to 390px (iPhone 14 viewport).

Navigate to `http://localhost:5000/#/netting`

Expected:
- Column headers hidden
- Each entity row stacks: Position on top, then In-Flight, then Completed
- DashboardHeader controls wrap to two lines
- No horizontal scroll
- All text legible, touch targets reasonable size

- [ ] **Step 8.5: Commit**

```bash
git add client/src/components/netting/EntityRow.tsx \
        client/src/components/netting/ColumnHeaders.tsx \
        client/src/components/netting/DashboardHeader.tsx \
        client/src/components/netting/InFlightCell.tsx \
        client/src/components/netting/CompletedCell.tsx
git commit -m "feat(netting): mobile responsive — columns stack at <640px, header wraps"
```

---

## Task 9: Polish — Empty States, Interaction Refinements

**Files:**
- Modify: various netting components

Final pass before demo-ready.

- [ ] **Step 9.1: Add "all settled" empty state to PositionCell**

If `pairing.open === 0`, render a green "Fully settled" badge instead of the open metric in amber:

```tsx
// In PositionCell.tsx, the open MetricRow value class logic:
valueClass={pairing.open === 0
  ? "text-green-500 text-xs" // smaller, de-emphasized
  : "text-amber-600 font-semibold"}

// And add below the progress bar when open === 0:
{pairing.open === 0 && (
  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
    <CheckCircle className="w-3 h-3" />
    Fully settled
  </div>
)}
```

Add the CheckCircle import to PositionCell.tsx: `import { ChevronDown, ChevronRight, CheckCircle } from "lucide-react";`

- [ ] **Step 9.2: Add row-level urgency left border**

In `EntityRow.tsx`, add a left color border based on open exposure:

```tsx
// Derive urgency from pairing
const urgency = pairing.open > 150
  ? "border-l-4 border-l-red-400"
  : pairing.open > 50
  ? "border-l-4 border-l-amber-400"
  : "border-l-4 border-l-transparent";

// Apply to outer div:
className={`grid grid-cols-1 sm:grid-cols-[2fr_2fr_1.5fr] border-b border-gray-100 hover:bg-gray-50/50 transition-colors ${urgency}`}
```

- [ ] **Step 9.3: Wire up "View in Payments" placeholder**

In `CompletedCell.tsx`, make the link log a message (it links to a different module):

```tsx
<button
  onClick={() => console.log("Navigate to Payments module")}
  className="mt-3 flex items-center gap-1 text-xs text-gray-400 hover:text-purple-600 transition-colors"
>
```

- [ ] **Step 9.4: Final visual check — full desktop view**

Navigate to `http://localhost:5000/#/netting`

Verify the full checklist:
- [ ] SA ↔ LTD row: red/amber left border (open €140M), In-Flight shows "In Payments €160M", Completed shows "1 settlement €340M"
- [ ] SA ↔ INC row: red border (open $200M), In-Flight shows failed action pinned top + "Sent to Bank $120M", Completed shows "1 settlement $420M"
- [ ] SA ↔ LTD (GBP) row: amber border (open £80M), In-Flight shows "Submitted £40M" with manual release warning, Completed empty, amber watch chip (5 min)
- [ ] SA ↔ BVI row: amber border (open $100M), In-Flight empty + dashed button, Completed empty, red stale chip (18 min)
- [ ] INC ↔ BVI row: no border (open $0), shows "Fully settled" green badge, no freshness chip (1 min = fresh)
- [ ] Header: date picker, filter popover, USD badge
- [ ] Initiate Action → modal → submit → appears in In-Flight as "Submitted"
- [ ] No console errors

- [ ] **Step 9.5: Final commit**

```bash
git add -p  # stage all modified netting files
git commit -m "feat(netting): polish — urgency borders, fully settled state, empty states"
```

---

## Agent Parallelization Guide

After Task 3 is committed, Tasks 4, 5, and 6 can run in parallel across three agents:

| Agent | Task | Dependency | Files touched |
|---|---|---|---|
| Agent A | Task 4: PositionCell + EntityRow | Task 3 committed | `PositionCell.tsx`, `EntityRow.tsx`, stub files |
| Agent B | Task 5: InFlightCell | Task 4 committed | `InFlightCell.tsx` only |
| Agent C | Task 6: CompletedCell | Task 4 committed | `CompletedCell.tsx` only |
| Agent D | Task 7: ActionModal | Task 4 committed | `ActionModal.tsx`, `IntercompanySettlement.tsx` |
| Main | Task 8: Mobile + Task 9: Polish | Tasks 5+6+7 merged | Various |

Tasks 5, 6, and 7 can all run in parallel once Task 4 is merged — they each touch different files with no overlap.

---

## Definition of Done

The dashboard is demo-ready when:
- All 4 entity pairings render with correct mock data
- Three columns visible on desktop, stack on mobile (390px)
- Transaction drill-down expands/collapses
- Initiate Action modal opens per-row, validates balance, submits to in-flight
- Failed actions appear pinned with failure reason
- Stale/watch freshness chips appear correctly
- No TypeScript errors (`npm run check` passes clean)
- No console errors in browser

---

*Plan authored: 2026-03-24 | Source: Ben Hipwell meeting + PRD v1.1 | Target: `/netting` route in replit-project*
