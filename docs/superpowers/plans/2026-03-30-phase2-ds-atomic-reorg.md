# Phase 2: DS Atomic Reorganization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

> **HARD PREREQUISITE:** Phase 1 (`feat/ds-token-uplift`) must be merged to `main` before cutting this branch. Verify: `git log main --oneline | grep ds-token-uplift`. Do not start from `main` before Phase 1 merges — the reorg must operate on the DS-foundation token baseline.

**Goal:** Reorganize `client/src/components/` from a flat feature-domain structure into atomic design layers (atoms/molecules/organisms/templates), add DS contract annotations to every component, and produce `NEW_COMPONENTS.md` documenting all unmatched components for team review.

**Architecture:** Bottom-up migration — atoms first, then molecules, then organisms, then templates. Each layer is two commits: one for file moves, one for import path updates. TypeScript check gates each layer before the next begins. Barrel exports at each layer keep page-level imports clean. No visual changes — this is structural only.

**Tech Stack:** React 18, TypeScript 5.6, Vite 7, `npm run check` (tsc) as the gate between each layer

---

## Target Structure (Reference)

```
client/src/components/
├── atoms/
│   ├── ui/              ← Button, Form, Input, Label, Textarea, Toast, Toaster, Tooltip
│   └── shared/          ← Badge, IconButton
├── molecules/
│   ├── shared/          ← DetailCard, SectionHeader, StatusChip, FraudBadge, Skeleton
│   ├── results-table/   ← ColumnPicker, TablePagination, TransactionCard
│   └── fraud-spotlight/ ← FlaggedItemRow, RiskScoreBadge, VerificationActions
├── organisms/
│   ├── export/          ← CoverPage, ExportBadges, PrintBar, SectionA, SectionB, SectionC, SectionD, SectionE
│   ├── fraud-spotlight/ ← FlaggedItemDetail, FraudSpotlight, OverrideDialog
│   ├── home/            ← CompetitorCard, FeedbackSection, HeroSection, ResearchSection, RoadmapSection, StrategySection
│   ├── modals/          ← ApproveConfirmModal, ConfigurePrototypeModal, FraudGateModal, HoldModal, RejectModal
│   ├── navigation/      ← AppNav, Navigation, UnifiedNav
│   ├── research/        ← BacklogTable, HeuristicTable, PriorityList, RequirementsSection, ResearchHeader, ResearchHeaderSkeleton
│   ├── results-table/   ← AttachmentViewer, FilterPanel, PaymentRailDialog, PaymentSummary, PaymentSummarySkeleton, ProcessFlow, ResultsTable, ResultsTableSkeleton, TableToolbar, TransactionRow
│   └── specs/           ← SpecCard, SpecsHeader, SpecsHeaderSkeleton
└── templates/
    ├── home/            ← (layout wrappers if any extracted from Home page)
    └── export/          ← (layout wrappers if any extracted from ExportReport page)

client/src/pages/        ← UNCHANGED
├── Landing.tsx
├── Prototype.tsx
├── Home.tsx
├── ResearchReport.tsx
├── AnnotatedSpecs.tsx
├── ExportReport.tsx
└── not-found.tsx
```

---

## Files Created

| File | Purpose |
|---|---|
| `client/src/components/atoms/index.ts` | Flat barrel re-export for all atoms |
| `client/src/components/molecules/index.ts` | Flat barrel re-export for all molecules |
| `client/src/components/organisms/index.ts` | Flat barrel re-export for all organisms |
| `client/src/components/templates/index.ts` | Flat barrel re-export for all templates |
| `NEW_COMPONENTS.md` | Documents all unmatched components for DS registry review |

## Files Moved (60+ components total)

All moves are renames via `git mv` — git history preserved.

---

## Task 1: Cut Branch + Component Audit

- [ ] **Step 1: Verify Phase 1 is merged**

```bash
git fetch origin
git log origin/main --oneline | head -10
```

Confirm `feat/ds-token-uplift` merge commit is visible. If not — stop. Do not proceed.

- [ ] **Step 2: Cut branch from merged main**

```bash
git checkout main
git pull origin main
git checkout -b feat/ds-atomic-reorg
```

- [ ] **Step 3: Verify token baseline is in place**

```bash
grep 'ds-foundation/tokens' client/src/index.css
```

Expected: Two `@import` lines for `@ds-foundation/tokens/css` and `@ds-foundation/tokens/tailwind`. If not present, Phase 1 was not properly merged — stop.

- [ ] **Step 4: Produce the component assignment table**

Create `docs/superpowers/migration-notes/component-assignments.md`:

```markdown
# Component Atomic Layer Assignments

## Atoms

### atoms/ui/
| File | Current Path | DS Equivalent |
|---|---|---|
| button.tsx | components/ui/button.tsx | @ds-component: button |
| form.tsx | components/ui/form.tsx | @ds-component: form |
| input.tsx | components/ui/input.tsx | @ds-component: input |
| label.tsx | components/ui/label.tsx | @ds-component: label |
| textarea.tsx | components/ui/textarea.tsx | @ds-component: textarea |
| toast.tsx | components/ui/toast.tsx | @ds-component: toast |
| toaster.tsx | components/ui/toaster.tsx | @ds-component: toaster |
| tooltip.tsx | components/ui/tooltip.tsx | @ds-component: tooltip |

### atoms/shared/
| File | Current Path | DS Equivalent |
|---|---|---|
| Badge.tsx | components/shared/Badge.tsx | @ds-component: badge |
| IconButton.tsx | components/shared/IconButton.tsx | @ds-component: icon-button |

## Molecules

### molecules/shared/
| File | Current Path | DS Equivalent |
|---|---|---|
| DetailCard.tsx | components/shared/DetailCard.tsx | @ds-component: custom |
| SectionHeader.tsx | components/SectionHeader.tsx | @ds-component: custom |
| StatusChip.tsx | components/StatusChip.tsx | @ds-component: custom |
| FraudBadge.tsx | components/FraudBadge.tsx | @ds-component: custom |
| Skeleton.tsx | components/Skeleton.tsx | @ds-component: skeleton |

### molecules/results-table/
| File | Current Path | DS Equivalent |
|---|---|---|
| ColumnPicker.tsx | components/results-table/ColumnPicker.tsx | @ds-component: custom |
| TablePagination.tsx | components/results-table/TablePagination.tsx | @ds-component: custom |
| TransactionCard.tsx | components/results-table/TransactionCard.tsx | @ds-component: custom |

### molecules/fraud-spotlight/
| File | Current Path | DS Equivalent |
|---|---|---|
| FlaggedItemRow.tsx | components/fraud-spotlight/FlaggedItemRow.tsx | @ds-component: custom |
| RiskScoreBadge.tsx | components/fraud-spotlight/RiskScoreBadge.tsx | @ds-component: custom |
| VerificationActions.tsx | components/fraud-spotlight/VerificationActions.tsx | @ds-component: custom |

## Organisms

### organisms/results-table/
| File | Current Path |
|---|---|
| AttachmentViewer.tsx | components/results-table/AttachmentViewer.tsx |
| FilterPanel.tsx | components/FilterPanel.tsx |
| PaymentRailDialog.tsx | components/results-table/PaymentRailDialog.tsx |
| PaymentSummary.tsx | components/PaymentSummary.tsx |
| PaymentSummarySkeleton.tsx | components/PaymentSummarySkeleton.tsx |
| ProcessFlow.tsx | components/ProcessFlow.tsx |
| ResultsTable.tsx | components/ResultsTable.tsx |
| ResultsTableSkeleton.tsx | components/ResultsTableSkeleton.tsx |
| TableToolbar.tsx | components/results-table/TableToolbar.tsx |
| TransactionRow.tsx | components/results-table/TransactionRow.tsx |

### organisms/fraud-spotlight/
| File | Current Path |
|---|---|
| FlaggedItemDetail.tsx | components/fraud-spotlight/FlaggedItemDetail.tsx |
| FraudSpotlight.tsx | components/FraudSpotlight.tsx |
| OverrideDialog.tsx | components/fraud-spotlight/OverrideDialog.tsx |

### organisms/navigation/
| File | Current Path |
|---|---|
| AppNav.tsx | components/AppNav.tsx |
| Navigation.tsx | components/Navigation.tsx |
| UnifiedNav.tsx | components/UnifiedNav.tsx |

### organisms/home/
| File | Current Path |
|---|---|
| CompetitorCard.tsx | components/CompetitorCard.tsx |
| FeedbackSection.tsx | components/home/FeedbackSection.tsx |
| HeroSection.tsx | components/home/HeroSection.tsx |
| ResearchSection.tsx | components/home/ResearchSection.tsx |
| RoadmapSection.tsx | components/home/RoadmapSection.tsx |
| StrategySection.tsx | components/home/StrategySection.tsx |

### organisms/research/
| File | Current Path |
|---|---|
| BacklogTable.tsx | components/research/BacklogTable.tsx |
| HeuristicTable.tsx | components/research/HeuristicTable.tsx |
| PriorityList.tsx | components/research/PriorityList.tsx |
| RequirementsSection.tsx | components/research/RequirementsSection.tsx |
| ResearchHeader.tsx | components/research/ResearchHeader.tsx |
| ResearchHeaderSkeleton.tsx | components/research/ResearchHeaderSkeleton.tsx |

### organisms/specs/
| File | Current Path |
|---|---|
| SpecCard.tsx | components/specs/SpecCard.tsx |
| SpecsHeader.tsx | components/specs/SpecsHeader.tsx |
| SpecsHeaderSkeleton.tsx | components/specs/SpecsHeaderSkeleton.tsx |

### organisms/export/
| File | Current Path |
|---|---|
| CoverPage.tsx | components/export/CoverPage.tsx |
| ExportBadges.tsx | components/export/ExportBadges.tsx |
| PrintBar.tsx | components/export/PrintBar.tsx |
| SectionA.tsx | components/export/SectionA.tsx |
| SectionB.tsx | components/export/SectionB.tsx |
| SectionC.tsx | components/export/SectionC.tsx |
| SectionD.tsx | components/export/SectionD.tsx |
| SectionE.tsx | components/export/SectionE.tsx |

### organisms/modals/
| File | Current Path |
|---|---|
| ApproveConfirmModal.tsx | components/ApproveConfirmModal.tsx |
| ConfigurePrototypeModal.tsx | components/ConfigurePrototypeModal.tsx |
| FraudGateModal.tsx | components/FraudGateModal.tsx |
| HoldModal.tsx | components/HoldModal.tsx |
| RejectModal.tsx | components/RejectModal.tsx |

## Moved but not to a domain subfolder
| File | Destination | Reason |
|---|---|---|
| ErrorBoundary.tsx | atoms/shared/ | Utility wrapper — belongs with atoms |
| components/research/research-data.tsx | lib/data/ | Data file, not a component |
| components/specs/specs-data.tsx | lib/data/ | Data file, not a component |
```

- [ ] **Step 5: Commit audit**

```bash
git add docs/superpowers/migration-notes/component-assignments.md
git commit -m "docs: component atomic layer assignment audit"
```

---

## Task 2: Move Atoms

- [ ] **Step 1: Create atom directories**

```bash
mkdir -p client/src/components/atoms/ui
mkdir -p client/src/components/atoms/shared
```

- [ ] **Step 2: Move atoms/ui files**

```bash
git mv client/src/components/ui/button.tsx client/src/components/atoms/ui/button.tsx
git mv client/src/components/ui/form.tsx client/src/components/atoms/ui/form.tsx
git mv client/src/components/ui/input.tsx client/src/components/atoms/ui/input.tsx
git mv client/src/components/ui/label.tsx client/src/components/atoms/ui/label.tsx
git mv client/src/components/ui/textarea.tsx client/src/components/atoms/ui/textarea.tsx
git mv client/src/components/ui/toast.tsx client/src/components/atoms/ui/toast.tsx
git mv client/src/components/ui/toaster.tsx client/src/components/atoms/ui/toaster.tsx
git mv client/src/components/ui/tooltip.tsx client/src/components/atoms/ui/tooltip.tsx
```

- [ ] **Step 3: Move atoms/shared files**

```bash
git mv client/src/components/shared/Badge.tsx client/src/components/atoms/shared/Badge.tsx
git mv client/src/components/shared/IconButton.tsx client/src/components/atoms/shared/IconButton.tsx
git mv client/src/components/ErrorBoundary.tsx client/src/components/atoms/shared/ErrorBoundary.tsx
```

- [ ] **Step 4: Commit the moves**

```bash
git commit -m "refactor(atoms): move atom components to atoms/ layer"
```

- [ ] **Step 5: Update all import paths for moved atoms**

```bash
# Find all imports referencing the old paths
grep -rn "from.*components/ui/" client/src --include='*.tsx' --include='*.ts'
grep -rn "from.*components/shared/Badge\|from.*components/shared/IconButton\|from.*components/ErrorBoundary" client/src --include='*.tsx' --include='*.ts'
```

Update each occurrence:
- `@/components/ui/button` → `@/components/atoms/ui/button`
- `@/components/ui/input` → `@/components/atoms/ui/input`
- (etc. for all ui atoms)
- `@/components/shared/Badge` → `@/components/atoms/shared/Badge`
- `@/components/shared/IconButton` → `@/components/atoms/shared/IconButton`
- `@/components/ErrorBoundary` → `@/components/atoms/shared/ErrorBoundary`

- [ ] **Step 6: TypeScript gate**

```bash
npm run check
```

Expected: Zero errors. If errors exist, fix them before proceeding to molecules.

- [ ] **Step 7: Commit import path updates**

```bash
git add -A
git commit -m "refactor(atoms): update all import paths to atoms/ layer"
```

---

## Task 3: Move Molecules

- [ ] **Step 1: Create molecule directories**

```bash
mkdir -p client/src/components/molecules/shared
mkdir -p client/src/components/molecules/results-table
mkdir -p client/src/components/molecules/fraud-spotlight
```

- [ ] **Step 2: Move molecules/shared**

```bash
git mv client/src/components/shared/DetailCard.tsx client/src/components/molecules/shared/DetailCard.tsx
git mv client/src/components/SectionHeader.tsx client/src/components/molecules/shared/SectionHeader.tsx
git mv client/src/components/StatusChip.tsx client/src/components/molecules/shared/StatusChip.tsx
git mv client/src/components/FraudBadge.tsx client/src/components/molecules/shared/FraudBadge.tsx
git mv client/src/components/Skeleton.tsx client/src/components/molecules/shared/Skeleton.tsx
```

- [ ] **Step 3: Move molecules/results-table**

```bash
git mv client/src/components/results-table/ColumnPicker.tsx client/src/components/molecules/results-table/ColumnPicker.tsx
git mv client/src/components/results-table/TablePagination.tsx client/src/components/molecules/results-table/TablePagination.tsx
git mv client/src/components/results-table/TransactionCard.tsx client/src/components/molecules/results-table/TransactionCard.tsx
```

- [ ] **Step 4: Move molecules/fraud-spotlight**

```bash
git mv client/src/components/fraud-spotlight/FlaggedItemRow.tsx client/src/components/molecules/fraud-spotlight/FlaggedItemRow.tsx
git mv client/src/components/fraud-spotlight/RiskScoreBadge.tsx client/src/components/molecules/fraud-spotlight/RiskScoreBadge.tsx
git mv client/src/components/fraud-spotlight/VerificationActions.tsx client/src/components/molecules/fraud-spotlight/VerificationActions.tsx
```

- [ ] **Step 5: Commit moves**

```bash
git commit -m "refactor(molecules): move molecule components to molecules/ layer"
```

- [ ] **Step 6: Update all import paths for moved molecules**

```bash
grep -rn "from.*components/shared/DetailCard\|from.*components/SectionHeader\|from.*components/StatusChip\|from.*components/FraudBadge\|from.*components/Skeleton" client/src --include='*.tsx' --include='*.ts'
grep -rn "from.*components/results-table/ColumnPicker\|from.*components/results-table/TablePagination\|from.*components/results-table/TransactionCard" client/src --include='*.tsx' --include='*.ts'
grep -rn "from.*components/fraud-spotlight/FlaggedItemRow\|from.*components/fraud-spotlight/RiskScoreBadge\|from.*components/fraud-spotlight/VerificationActions" client/src --include='*.tsx' --include='*.ts'
```

Update each to the new `molecules/` path.

- [ ] **Step 7: TypeScript gate**

```bash
npm run check
```

Expected: Zero errors. Fix before proceeding.

- [ ] **Step 8: Commit import path updates**

```bash
git add -A
git commit -m "refactor(molecules): update all import paths to molecules/ layer"
```

---

## Task 4: Move Organisms

- [ ] **Step 1: Create organism directories**

```bash
mkdir -p client/src/components/organisms/results-table
mkdir -p client/src/components/organisms/fraud-spotlight
mkdir -p client/src/components/organisms/navigation
mkdir -p client/src/components/organisms/home
mkdir -p client/src/components/organisms/research
mkdir -p client/src/components/organisms/specs
mkdir -p client/src/components/organisms/export
mkdir -p client/src/components/organisms/modals
```

- [ ] **Step 2: Move organisms/results-table**

```bash
git mv client/src/components/results-table/AttachmentViewer.tsx client/src/components/organisms/results-table/AttachmentViewer.tsx
git mv client/src/components/FilterPanel.tsx client/src/components/organisms/results-table/FilterPanel.tsx
git mv client/src/components/results-table/PaymentRailDialog.tsx client/src/components/organisms/results-table/PaymentRailDialog.tsx
git mv client/src/components/PaymentSummary.tsx client/src/components/organisms/results-table/PaymentSummary.tsx
git mv client/src/components/PaymentSummarySkeleton.tsx client/src/components/organisms/results-table/PaymentSummarySkeleton.tsx
git mv client/src/components/ProcessFlow.tsx client/src/components/organisms/results-table/ProcessFlow.tsx
git mv client/src/components/ResultsTable.tsx client/src/components/organisms/results-table/ResultsTable.tsx
git mv client/src/components/ResultsTableSkeleton.tsx client/src/components/organisms/results-table/ResultsTableSkeleton.tsx
git mv client/src/components/results-table/TableToolbar.tsx client/src/components/organisms/results-table/TableToolbar.tsx
git mv client/src/components/results-table/TransactionRow.tsx client/src/components/organisms/results-table/TransactionRow.tsx
```

- [ ] **Step 3: Move organisms/fraud-spotlight**

```bash
git mv client/src/components/fraud-spotlight/FlaggedItemDetail.tsx client/src/components/organisms/fraud-spotlight/FlaggedItemDetail.tsx
git mv client/src/components/FraudSpotlight.tsx client/src/components/organisms/fraud-spotlight/FraudSpotlight.tsx
git mv client/src/components/fraud-spotlight/OverrideDialog.tsx client/src/components/organisms/fraud-spotlight/OverrideDialog.tsx
```

- [ ] **Step 4: Move organisms/navigation**

```bash
git mv client/src/components/AppNav.tsx client/src/components/organisms/navigation/AppNav.tsx
git mv client/src/components/Navigation.tsx client/src/components/organisms/navigation/Navigation.tsx
git mv client/src/components/UnifiedNav.tsx client/src/components/organisms/navigation/UnifiedNav.tsx
```

- [ ] **Step 5: Move organisms/home**

```bash
git mv client/src/components/CompetitorCard.tsx client/src/components/organisms/home/CompetitorCard.tsx
git mv client/src/components/home/FeedbackSection.tsx client/src/components/organisms/home/FeedbackSection.tsx
git mv client/src/components/home/HeroSection.tsx client/src/components/organisms/home/HeroSection.tsx
git mv client/src/components/home/ResearchSection.tsx client/src/components/organisms/home/ResearchSection.tsx
git mv client/src/components/home/RoadmapSection.tsx client/src/components/organisms/home/RoadmapSection.tsx
git mv client/src/components/home/StrategySection.tsx client/src/components/organisms/home/StrategySection.tsx
```

- [ ] **Step 6: Move organisms/research**

```bash
git mv client/src/components/research/BacklogTable.tsx client/src/components/organisms/research/BacklogTable.tsx
git mv client/src/components/research/HeuristicTable.tsx client/src/components/organisms/research/HeuristicTable.tsx
git mv client/src/components/research/PriorityList.tsx client/src/components/organisms/research/PriorityList.tsx
git mv client/src/components/research/RequirementsSection.tsx client/src/components/organisms/research/RequirementsSection.tsx
git mv client/src/components/research/ResearchHeader.tsx client/src/components/organisms/research/ResearchHeader.tsx
git mv client/src/components/research/ResearchHeaderSkeleton.tsx client/src/components/organisms/research/ResearchHeaderSkeleton.tsx
```

- [ ] **Step 7: Move organisms/specs**

```bash
git mv client/src/components/specs/SpecCard.tsx client/src/components/organisms/specs/SpecCard.tsx
git mv client/src/components/specs/SpecsHeader.tsx client/src/components/organisms/specs/SpecsHeader.tsx
git mv client/src/components/specs/SpecsHeaderSkeleton.tsx client/src/components/organisms/specs/SpecsHeaderSkeleton.tsx
```

- [ ] **Step 8: Move organisms/export**

```bash
git mv client/src/components/export/CoverPage.tsx client/src/components/organisms/export/CoverPage.tsx
git mv client/src/components/export/ExportBadges.tsx client/src/components/organisms/export/ExportBadges.tsx
git mv client/src/components/export/PrintBar.tsx client/src/components/organisms/export/PrintBar.tsx
git mv client/src/components/export/SectionA.tsx client/src/components/organisms/export/SectionA.tsx
git mv client/src/components/export/SectionB.tsx client/src/components/organisms/export/SectionB.tsx
git mv client/src/components/export/SectionC.tsx client/src/components/organisms/export/SectionC.tsx
git mv client/src/components/export/SectionD.tsx client/src/components/organisms/export/SectionD.tsx
git mv client/src/components/export/SectionE.tsx client/src/components/organisms/export/SectionE.tsx
```

- [ ] **Step 9: Move organisms/modals**

```bash
git mv client/src/components/ApproveConfirmModal.tsx client/src/components/organisms/modals/ApproveConfirmModal.tsx
git mv client/src/components/ConfigurePrototypeModal.tsx client/src/components/organisms/modals/ConfigurePrototypeModal.tsx
git mv client/src/components/FraudGateModal.tsx client/src/components/organisms/modals/FraudGateModal.tsx
git mv client/src/components/HoldModal.tsx client/src/components/organisms/modals/HoldModal.tsx
git mv client/src/components/RejectModal.tsx client/src/components/organisms/modals/RejectModal.tsx
```

- [ ] **Step 10: Commit all organism moves**

```bash
git commit -m "refactor(organisms): move organism components to organisms/ layer"
```

- [ ] **Step 11: Update all import paths for moved organisms**

```bash
# Find all stale imports — run each grep and update paths
grep -rn "from.*components/FilterPanel\|from.*components/ResultsTable\|from.*components/ProcessFlow\|from.*components/PaymentSummary\|from.*components/FraudSpotlight" client/src --include='*.tsx' --include='*.ts'
grep -rn "from.*components/AppNav\|from.*components/Navigation\|from.*components/UnifiedNav" client/src --include='*.tsx' --include='*.ts'
grep -rn "from.*components/results-table/\|from.*components/fraud-spotlight/\|from.*components/home/\|from.*components/research/\|from.*components/specs/\|from.*components/export/" client/src --include='*.tsx' --include='*.ts'
grep -rn "from.*components/ApproveConfirmModal\|from.*components/FraudGateModal\|from.*components/RejectModal\|from.*components/HoldModal\|from.*components/ConfigurePrototypeModal" client/src --include='*.tsx' --include='*.ts'
```

Update each to the new `organisms/` path.

- [ ] **Step 12: TypeScript gate**

```bash
npm run check
```

Expected: Zero errors. Fix before proceeding.

- [ ] **Step 13: Commit import path updates**

```bash
git add -A
git commit -m "refactor(organisms): update all import paths to organisms/ layer"
```

---

## Task 5: Move Data Files + Handle Templates

- [ ] **Step 1: Move data files out of components/**

These are not components — they're data modules that ended up in the components tree:

```bash
mkdir -p client/src/lib/data
git mv client/src/components/research/research-data.tsx client/src/lib/data/research-data.tsx
git mv client/src/components/specs/specs-data.tsx client/src/lib/data/specs-data.tsx
```

- [ ] **Step 2: Update imports for data files**

```bash
grep -rn "research-data\|specs-data" client/src --include='*.tsx' --include='*.ts'
```

Update each import to `@/lib/data/research-data` and `@/lib/data/specs-data`.

- [ ] **Step 3: Assess templates layer**

```bash
# Check if Home page sections are layout wrappers or content-bearing organisms
cat client/src/pages/Home.tsx
```

If `Home.tsx` directly renders `HeroSection`, `RoadmapSection` etc. without an intermediate layout wrapper, the `templates/` layer has no current inhabitants — create the folders but leave them empty for now. Do not invent wrapper components that don't already exist.

```bash
mkdir -p client/src/components/templates/home
mkdir -p client/src/components/templates/export
```

- [ ] **Step 4: TypeScript gate**

```bash
npm run check
```

Expected: Zero errors.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor: move data files to lib/data/, create templates/ layer"
```

---

## Task 6: DS Contract Annotations

Add header comments to every moved component. Work layer by layer.

- [ ] **Step 1: Annotate atoms/ui/**

For each file in `client/src/components/atoms/ui/`, add to the top of the file (after any existing `'use client'` directives):

```ts
// @ds-component: button | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: atom
```

Replace `button` with the component name (input, label, etc.).

```bash
# Files to annotate:
ls client/src/components/atoms/ui/
ls client/src/components/atoms/shared/
```

- [ ] **Step 2: Annotate molecules/**

For molecules that map to a DS-foundation component (Badge, Skeleton):
```ts
// @ds-component: badge | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: molecule
```

For molecules with no DS-foundation equivalent (StatusChip, RiskScoreBadge, etc.):
```ts
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: molecule
```

- [ ] **Step 3: Annotate organisms/**

All organisms use `@ds-component: custom` (none have DS-foundation equivalents yet):
```ts
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.0 | @ds-layer: organism
```

- [ ] **Step 4: TypeScript check (annotations are comments — should be zero impact)**

```bash
npm run check
```

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "docs: add DS contract annotations to all uplifted components"
```

---

## Task 7: Create NEW_COMPONENTS.md

- [ ] **Step 1: Create NEW_COMPONENTS.md at repo root**

```markdown
# NEW_COMPONENTS.md

Components and tokens in Payments-TSW with no current DS-foundation equivalent.
These are candidates for contribution to the DS-foundation registry via the
design contribution branch. Each entry requires team review before submission.

---

## Tokens

### Risk Level Color System
**Type:** Token set
**Layer:** Foundation
**Description:** Semantic colors for transaction risk severity levels.
**Current values:**
- `critical`: #dc2626 (red-600)
- `high`: #f97316 (orange-500)
- `medium`: #eab308 (yellow-500)
- `low`: #22c55e (green-500)
- `none`: #6b7280 (gray-500)
**Proposed DS token path:** `color.risk.*`
**Rationale:** Risk severity is a cross-product pattern in fintech — not TSW-specific.

### Process Stage Color System
**Type:** Token set
**Layer:** Foundation
**Description:** Semantic colors for payment processing stages.
**Current values:**
- `create`: #6366f1 (violet-500)
- `antifraud`: #f97316 (orange-500)
- `approvals`: #3b82f6 (blue-500)
- `status`: #22c55e (green-500)
- `history`: #6b7280 (gray-500)
**Proposed DS token path:** `color.process.*`
**Rationale:** Multi-stage payment processing is a shared pattern across Ripple Treasury products.

---

## Components

### RiskScoreBadge
**Layer:** molecule
**Location:** `client/src/components/molecules/fraud-spotlight/RiskScoreBadge.tsx`
**Description:** Displays a numeric risk score (0–100) with severity-coded background and label. States: critical / high / medium / low / none.
**Tokens used:** `color.risk.*` (domain-specific), `radius.badge`, `typography.size.xs`
**DS annotation:** `@ds-component: custom`
**Rationale:** Risk scoring UI is a reusable fintech pattern.

### StatusChip
**Layer:** molecule
**Location:** `client/src/components/molecules/shared/StatusChip.tsx`
**Description:** Compact status indicator for transaction states (pending, processing, completed, failed, held, etc.). Variant per status.
**Tokens used:** `color.feedback.*`, `radius.pill`, `typography.size.xs`
**DS annotation:** `@ds-component: custom`
**Rationale:** Status indicators are a universal pattern across all Ripple Treasury product surfaces.

### FraudBadge
**Layer:** molecule
**Location:** `client/src/components/molecules/shared/FraudBadge.tsx`
**Description:** Compact badge indicating fraud risk presence on a transaction row.
**Tokens used:** `color.risk.critical`, `color.risk.high`
**DS annotation:** `@ds-component: custom`
**Rationale:** Shares visual language with RiskScoreBadge — likely part of the same risk UI component family.

### ProcessFlow
**Layer:** organism
**Location:** `client/src/components/organisms/results-table/ProcessFlow.tsx`
**Description:** Horizontal multi-stage visualization of a payment's journey through processing stages (create → antifraud → approvals → status → history). Active stage highlighted.
**Tokens used:** `color.process.*`, `spacing.*`, `typography.*`
**DS annotation:** `@ds-component: custom`
**Rationale:** Multi-stage process visualization is a shared pattern in payment and workflow products.

### PaymentSummary
**Layer:** organism
**Location:** `client/src/components/organisms/results-table/PaymentSummary.tsx`
**Description:** Summary stats panel showing aggregate transaction metrics (total count, total value, pending count, etc.).
**Tokens used:** `color.surface.*`, `typography.*`, `spacing.*`
**DS annotation:** `@ds-component: custom`
**Rationale:** Summary stat panels are a common fintech dashboard pattern.

### FraudGateModal
**Layer:** organism
**Location:** `client/src/components/organisms/modals/FraudGateModal.tsx`
**Description:** Domain-specific modal that gates payment approval when fraud risk is detected. Requires explicit override with audit reason.
**DS annotation:** `@ds-component: custom`
**Rationale:** Domain-specific — may not generalize to DS registry. Include for team assessment.

### OverrideDialog
**Layer:** organism
**Location:** `client/src/components/organisms/fraud-spotlight/OverrideDialog.tsx`
**Description:** Dialog for submitting a fraud override decision with reason code and justification.
**DS annotation:** `@ds-component: custom`
**Rationale:** Domain-specific workflow dialog. Include for team assessment.

### ApproveConfirmModal
**Layer:** organism
**Location:** `client/src/components/organisms/modals/ApproveConfirmModal.tsx`
**Description:** Confirmation dialog for approving a payment transaction.
**DS annotation:** `@ds-component: custom`
**Rationale:** Generic confirm pattern — the base confirm dialog pattern may be worth contributing.

### RejectModal
**Layer:** organism
**Location:** `client/src/components/organisms/modals/RejectModal.tsx`
**Description:** Dialog for rejecting a payment with required reason selection.
**DS annotation:** `@ds-component: custom`
**Rationale:** Domain-specific variant of a reject/decline pattern.

### HoldModal
**Layer:** organism
**Location:** `client/src/components/organisms/modals/HoldModal.tsx`
**Description:** Dialog for placing a payment on hold with reason and notes.
**DS annotation:** `@ds-component: custom`
**Rationale:** Domain-specific workflow dialog.
```

- [ ] **Step 2: Commit**

```bash
git add NEW_COMPONENTS.md
git commit -m "docs: create NEW_COMPONENTS.md with all unmatched component and token candidates"
```

---

## Task 8: Barrel Exports

- [ ] **Step 1: Create atoms/index.ts**

```ts
// client/src/components/atoms/index.ts
// Flat re-export of all atom components. Named exports only.

export { Button, buttonVariants } from './ui/button'
export { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from './ui/form'
export { Input } from './ui/input'
export { Label } from './ui/label'
export { Textarea } from './ui/textarea'
export { Toast, ToastAction, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from './ui/toast'
export { Toaster } from './ui/toaster'
export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip'
export { Badge } from './shared/Badge'
export { IconButton } from './shared/IconButton'
export { ErrorBoundary } from './shared/ErrorBoundary'
```

- [ ] **Step 2: Create molecules/index.ts**

```ts
// client/src/components/molecules/index.ts
export { DetailCard } from './shared/DetailCard'
export { SectionHeader } from './shared/SectionHeader'
export { StatusChip } from './shared/StatusChip'
export { FraudBadge } from './shared/FraudBadge'
export { Skeleton } from './shared/Skeleton'
export { ColumnPicker } from './results-table/ColumnPicker'
export { TablePagination } from './results-table/TablePagination'
export { TransactionCard } from './results-table/TransactionCard'
export { FlaggedItemRow } from './fraud-spotlight/FlaggedItemRow'
export { RiskScoreBadge } from './fraud-spotlight/RiskScoreBadge'
export { VerificationActions } from './fraud-spotlight/VerificationActions'
```

- [ ] **Step 3: Create organisms/index.ts**

```ts
// client/src/components/organisms/index.ts
// results-table
export { AttachmentViewer } from './results-table/AttachmentViewer'
export { FilterPanel } from './results-table/FilterPanel'
export { PaymentRailDialog } from './results-table/PaymentRailDialog'
export { PaymentSummary } from './results-table/PaymentSummary'
export { PaymentSummarySkeleton } from './results-table/PaymentSummarySkeleton'
export { ProcessFlow } from './results-table/ProcessFlow'
export { ResultsTable } from './results-table/ResultsTable'
export { ResultsTableSkeleton } from './results-table/ResultsTableSkeleton'
export { TableToolbar } from './results-table/TableToolbar'
export { TransactionRow } from './results-table/TransactionRow'
// fraud-spotlight
export { FlaggedItemDetail } from './fraud-spotlight/FlaggedItemDetail'
export { FraudSpotlight } from './fraud-spotlight/FraudSpotlight'
export { OverrideDialog } from './fraud-spotlight/OverrideDialog'
// navigation
export { AppNav } from './navigation/AppNav'
export { Navigation } from './navigation/Navigation'
export { UnifiedNav } from './navigation/UnifiedNav'
// home
export { CompetitorCard } from './home/CompetitorCard'
export { FeedbackSection } from './home/FeedbackSection'
export { HeroSection } from './home/HeroSection'
export { ResearchSection } from './home/ResearchSection'
export { RoadmapSection } from './home/RoadmapSection'
export { StrategySection } from './home/StrategySection'
// research
export { BacklogTable } from './research/BacklogTable'
export { HeuristicTable } from './research/HeuristicTable'
export { PriorityList } from './research/PriorityList'
export { RequirementsSection } from './research/RequirementsSection'
export { ResearchHeader } from './research/ResearchHeader'
export { ResearchHeaderSkeleton } from './research/ResearchHeaderSkeleton'
// specs
export { SpecCard } from './specs/SpecCard'
export { SpecsHeader } from './specs/SpecsHeader'
export { SpecsHeaderSkeleton } from './specs/SpecsHeaderSkeleton'
// export
export { CoverPage } from './export/CoverPage'
export { ExportBadges } from './export/ExportBadges'
export { PrintBar } from './export/PrintBar'
export { SectionA } from './export/SectionA'
export { SectionB } from './export/SectionB'
export { SectionC } from './export/SectionC'
export { SectionD } from './export/SectionD'
export { SectionE } from './export/SectionE'
// modals
export { ApproveConfirmModal } from './modals/ApproveConfirmModal'
export { ConfigurePrototypeModal } from './modals/ConfigurePrototypeModal'
export { FraudGateModal } from './modals/FraudGateModal'
export { HoldModal } from './modals/HoldModal'
export { RejectModal } from './modals/RejectModal'
```

- [ ] **Step 4: Create templates/index.ts**

```ts
// client/src/components/templates/index.ts
// Empty — templates layer created for future use. Contents added as layout
// wrappers are extracted from pages during feature development.
export {}
```

- [ ] **Step 5: TypeScript check on barrels**

```bash
npm run check
```

Fix any re-export errors (wrong component names, missing named exports). Check each component file exports by name if there are errors.

- [ ] **Step 6: Commit**

```bash
git add client/src/components/atoms/index.ts client/src/components/molecules/index.ts client/src/components/organisms/index.ts client/src/components/templates/index.ts
git commit -m "feat: add flat barrel exports at each atomic layer"
```

---

## Task 9: Final Verification

- [ ] **Step 1: Full TypeScript check**

```bash
npm run check
```

Expected: Zero errors.

- [ ] **Step 2: Run dev server and walk all routes**

```bash
npm run dev
```

Walk each route and enable each feature flag:
- `/` — Landing
- `/research`
- `/specs`
- `/prototype`
- `/strategy`
- `/export`
- `/prototype?rlusdStrip=1`
- `/prototype?fraudSpotlight=1`
- `/prototype?riskColumn=1`
- `/prototype?stablecoinRail=1`
- `/prototype?selectPaymentRail=1`

Expected: All routes render identically to Phase 1 output (no visual changes from this branch).

- [ ] **Step 3: Confirm no orphaned files**

```bash
# These directories should be empty or removed after the moves
ls client/src/components/ui/ 2>/dev/null
ls client/src/components/shared/ 2>/dev/null
ls client/src/components/home/ 2>/dev/null
ls client/src/components/research/ 2>/dev/null
ls client/src/components/specs/ 2>/dev/null
ls client/src/components/export/ 2>/dev/null
ls client/src/components/fraud-spotlight/ 2>/dev/null
ls client/src/components/results-table/ 2>/dev/null
```

Remove any empty directories:
```bash
find client/src/components -type d -empty -not -path '*/templates/*' -delete
```

- [ ] **Step 4: Confirm every component has a @ds-layer annotation**

```bash
# Count components without annotation
grep -rL '@ds-layer' client/src/components --include='*.tsx' | grep -v index.ts
```

Expected: Zero results. Any files listed need their annotation added.

- [ ] **Step 5: Confirm NEW_COMPONENTS.md is complete**

Open `NEW_COMPONENTS.md` and verify each candidate from the spec is documented.

- [ ] **Step 6: Final commit if any cleanup was needed**

```bash
git add -A
git commit -m "chore: remove empty legacy component directories, final cleanup"
```

- [ ] **Step 7: Push branch**

```bash
git push -u origin feat/ds-atomic-reorg
```

- [ ] **Step 8: Open PR**

Title: `feat: Phase 2 — atomic design reorganization`

PR description:
- Summary of structural changes
- Link to spec: `docs/superpowers/specs/2026-03-30-ds-foundation-uplift-design.md`
- Link to component assignment table: `docs/superpowers/migration-notes/component-assignments.md`
- Link to `NEW_COMPONENTS.md` — note this is the handoff for the DS contribution branch
- Confirmation: zero TypeScript errors, all routes pass, all feature flags work

---

## Phase 2 Success Criteria Checklist

Before merging:

- [ ] `npm run check` — zero TypeScript errors
- [ ] All 6 routes render correctly
- [ ] All 5 feature flags render correctly
- [ ] `grep -rL '@ds-layer' client/src/components --include='*.tsx'` returns zero results
- [ ] `NEW_COMPONENTS.md` exists at repo root with all 12 candidates documented
- [ ] Barrel `index.ts` exists at `atoms/`, `molecules/`, `organisms/`, `templates/`
- [ ] No orphaned files remain in `components/ui/`, `components/shared/`, `components/home/`, `components/research/`, `components/specs/`, `components/export/`, `components/results-table/`, `components/fraud-spotlight/`
