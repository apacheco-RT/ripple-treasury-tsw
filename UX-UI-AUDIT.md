# UX/UI Audit Report — Ripple Treasury TSW Prototype

**Date:** March 18, 2026
**Scope:** WCAG 2.2 AA, Nielsen's Heuristics, Material Design 3 Principles
**Auditor:** Agent Review — Full Code + Visual Inspection

---

## Executive Summary

The prototype demonstrates strong foundational accessibility work including skip-to-content links, ARIA landmarks, focus trapping in modals, keyboard navigation on table rows, and proper use of `aria-expanded`, `aria-pressed`, and `aria-modal`. However, several WCAG 2.2 AA gaps remain, particularly around color contrast, focus visibility, target sizing, and missing semantic elements. Heuristic and design-principle findings are generally moderate in severity.

---

## SECTION 1: WCAG 2.2 AA Findings

### 1.1 Color Contrast (1.4.3 / 1.4.11)

| Severity | Finding | Location |
|----------|---------|----------|
| **HIGH** | `text-slate-400` on dark backgrounds (~`#94a3b8` on `#1e293b`) yields ~3.4:1 ratio — fails 4.5:1 AA for normal text. Used extensively for labels, placeholder text, meta text, pagination text, filter labels, and table column descriptions. | FilterPanel labels, TablePagination, TableToolbar sort description, PaymentSummary transaction counts, StatusChip next-step text, expanded row `dt` labels |
| **HIGH** | `text-slate-500` (~`#64748b`) on dark backgrounds yields ~2.1:1 — fails AA. Used for placeholder text in TableToolbar search input (`placeholder:text-slate-500`). | TableToolbar.tsx line 73 |
| **MED** | `text-slate-300` (~`#cbd5e1`) on dark card backgrounds achieves ~7.8:1 — passes. However the dimmed state `opacity-[0.45]` on PaymentSummary cards reduces effective contrast below AA. | PaymentSummary.tsx dimmed cards (line 140, 196) |
| **MED** | Non-text contrast: The custom switch toggle track in "off" state (`bg-slate-600`) against the dark page background yields ~2.3:1 — below the 3:1 AA requirement for UI components. | FilterPanel.tsx line 103 |
| **LOW** | `border-slate-700/60` (semitransparent borders at ~0.6 opacity) may fail 3:1 non-text contrast against adjacent surfaces for input field boundaries. | All inputs and selects via `inpBar` |

### 1.2 Focus Visibility (2.4.7 / 2.4.11 / 2.4.12)

| Severity | Finding | Location |
|----------|---------|----------|
| **HIGH** | Focus ring uses `focus:ring-teal-500/50` (50% opacity teal) on dark backgrounds — the semi-transparent ring may not meet the 3:1 contrast requirement for focus indicators against all backgrounds. | All interactive elements globally |
| **MED** | Table header `<th>` elements are clickable for sorting (`onClick`) but use `cursor-pointer` only — no `role="button"` or `tabIndex`. They are not focusable via keyboard, meaning keyboard users cannot sort columns. | ResultsTable.tsx lines 194–229 |
| **MED** | ColumnPicker checkboxes use browser-default focus styling which may be invisible on dark backgrounds. | ColumnPicker.tsx line 34 |
| **LOW** | Payment summary "More/Less" toggle button has no visible focus outline distinct from its border. | PaymentSummary.tsx line 267 |

### 1.3 Target Size (2.5.8 — Level AA in WCAG 2.2)

| Severity | Finding | Location |
|----------|---------|----------|
| **MED** | Table row action icon buttons are 28×28px (`min-w-[28px] min-h-[28px]`). WCAG 2.2 requires 24×24px minimum (AA), so these pass. However, the clear selection `X` button in TableToolbar uses `min-w-[24px] min-h-[24px]` which is exactly the minimum with no padding gap. | TransactionRow.tsx action buttons, TableToolbar.tsx line 51 |
| **MED** | Radio buttons in advanced filters (`w-3.5 h-3.5` = 14×14px) fall below the 24×24px minimum target. The label wrapping helps but the clickable input itself is undersized. | FilterPanel.tsx line 232 |
| **LOW** | ColumnPicker checkbox inputs are `w-4 h-4` (16×16px). Label wrapping increases hit area but the input target itself is small. | ColumnPicker.tsx line 34 |

### 1.4 Keyboard & Interaction (2.1.1 / 2.1.2)

| Severity | Finding | Location |
|----------|---------|----------|
| **HIGH** | Sortable `<th>` headers only have `onClick` — no `tabIndex`, no `role="button"`, no `onKeyDown`. Keyboard users cannot sort columns. | ResultsTable.tsx lines 194–229 |
| **MED** | The PaymentSummary card "More/Less" expand button stops propagation (`e.stopPropagation()`) but clicking the card body also filters — the interaction model may confuse users about which click region does what. | PaymentSummary.tsx lines 205–230 vs 262–277 |
| **LOW** | Filter panel "Advanced" toggle button works via keyboard, but the netting radio group has no `aria-describedby` linking it to a helper description. | FilterPanel.tsx lines 225–237 |

### 1.5 Semantics & ARIA (4.1.2 / 1.3.1)

| Severity | Finding | Location |
|----------|---------|----------|
| **MED** | Expanded filter panel labels (`<label>`) are not associated with their `<select>` elements via `htmlFor`/`id` — screen readers may not announce the label when the select is focused. | FilterPanel.tsx lines 164–198 |
| **MED** | The `<td>` wrapping the row checkbox has `onClick` with `e.stopPropagation()` but the `<td>` itself has no role or accessible name — screen readers see a generic table cell. | TransactionRow.tsx line 51 |
| **LOW** | Active filter chips in the filter bar (`aria-label` on containing `div`) — screen readers may not navigate to individual chip text. The chips are `<span>` not interactive elements. | FilterPanel.tsx line 112 |
| **LOW** | PaymentSummary dimmed cards use `opacity-[0.45]` to indicate inactive state — this is purely visual with no programmatic state communicated (e.g., `aria-disabled`). | PaymentSummary.tsx lines 140, 196 |

### 1.6 Motion & Animation (2.3.3 — Prefers Reduced Motion)

| Severity | Finding | Location |
|----------|---------|----------|
| **MED** | Framer Motion animations (row entrance stagger, card scale, expand/collapse) do not check `prefers-reduced-motion`. Users sensitive to motion cannot disable animations. | TransactionRow.tsx line 35, PaymentSummary.tsx line 196, FilterPanel.tsx expand panels |
| **LOW** | The loading spinner on refresh (`animate-spin`) runs indefinitely — acceptable but should be paired with an `aria-live` announcement. | TableToolbar.tsx line 88 |

---

## SECTION 2: Nielsen's Heuristic Findings

### H1 — Visibility of System Status

| Severity | Finding |
|----------|---------|
| **GOOD** | Sort indicator with `aria-sort`, live region for result count (`aria-live="polite"`), loading spinner on refresh, pulsing dot on active summary card. |
| **MED** | Approve/Reject bulk actions show no confirmation or success feedback after completing. The selected rows simply clear with no toast, banner, or `aria-live` announcement confirming the action succeeded. |
| **MED** | Column picker changes take effect immediately but there is no confirmation of which columns are now visible — especially important for screen reader users. |

### H2 — Match Between System and Real World

| Severity | Finding |
|----------|---------|
| **GOOD** | Status labels use domain-specific terminology (Needs Approval, Ready to Extract, Extracted, Confirmed). Sentence case used consistently. |
| **LOW** | "Trn. Number" and "Trn. Date" abbreviations in table headers may not be immediately clear. Consider "Transaction no." and "Transaction date" for clarity. |

### H3 — User Control and Freedom

| Severity | Finding |
|----------|---------|
| **GOOD** | Escape key closes all modals and the expanded filter panel. Clear all filters button resets state. |
| **MED** | Reject action has no "undo" — the modal states "cannot be re-approved without re-entry" but offers no undo period or soft-delete. In a real system this could be costly. |
| **LOW** | Once a PaymentSummary card is clicked to filter, the only way to clear is clicking the same card again or the small "X" in the active-filter chip — the relationship could be clearer. |

### H4 — Consistency and Standards

| Severity | Finding |
|----------|---------|
| **GOOD** | M3 tokens applied consistently across shapes, heights, spacing, and state layers. Sentence case enforced. |
| **MED** | Two different search inputs exist: the quick-search in FilterPanel and the table-search in TableToolbar. Both filter the same data with different scopes but their visual treatment is nearly identical, which may confuse users about which one is active. |
| **MED** | The `--m3-input-height` (56px) is still used in TableToolbar search but `--m3-input-height-dense` (40px) is used in FilterPanel. Inconsistent heights within the same interaction zone. |

### H5 — Error Prevention

| Severity | Finding |
|----------|---------|
| **GOOD** | FraudGateModal intercepts bulk approval of high-risk items and shows specific flagged transactions with risk scores. |
| **LOW** | The "Approve all anyway (not recommended)" button in FraudGateModal uses a soft warning style — could benefit from a required confirmation step (e.g., type "APPROVE" to confirm). |

### H6 — Recognition Rather Than Recall

| Severity | Finding |
|----------|---------|
| **GOOD** | Active filter chips shown when filter panel is collapsed. Sort state visible in column headers. Active summary card highlighted with pulsing indicator. |
| **LOW** | Keyboard shortcuts (Enter to apply, Esc to close) shown only in expanded filter panel — not discoverable for collapsed state. |

### H7 — Flexibility and Efficiency of Use

| Severity | Finding |
|----------|---------|
| **GOOD** | Saved search presets, quick date ranges, "My items" toggle, column picker, multiple sort options. |
| **MED** | No bulk-select-by-status shortcut (e.g., "Select all Needs Approval" without first filtering). |

### H8 — Aesthetic and Minimalist Design

| Severity | Finding |
|----------|---------|
| **GOOD** | Clean dark UI, progressive disclosure via expandable panels, cards with expand/collapse. |
| **LOW** | Five action icon buttons per transaction row (View, Confirm, Complete, Re-extract, Fail) may overwhelm — consider contextual actions based on current status. |

### H9 — Help Users Recognize, Diagnose, and Recover from Errors

| Severity | Finding |
|----------|---------|
| **GOOD** | Empty state provides clear message and action button ("Clear all filters"). FraudGateModal explains exactly which transactions are flagged and why. |

### H10 — Help and Documentation

| Severity | Finding |
|----------|---------|
| **LOW** | No tooltips on action buttons beyond `title` attributes. Consider more detailed help for risk scores, status meanings, and workflow stages. |

---

## SECTION 3: Design Principle Findings

### 3.1 Visual Hierarchy

| Severity | Finding |
|----------|---------|
| **GOOD** | Clear section hierarchy: page title → filters → payment summary → transaction table. Summary cards use icons and count emphasis effectively. |
| **MED** | In the table, all five action buttons have equal visual weight — there's no primary action emphasis. The most common action (View) should be visually distinct. |

### 3.2 Information Density

| Severity | Finding |
|----------|---------|
| **GOOD** | Expanded row detail cards are well-organized in a 4-column grid with semantic grouping (Payment details, Dates, Account info, Additional info). |
| **MED** | The filter bar packs many controls into one row (search, date type, 2 date inputs, preset, toggle, more filters, clear) which wraps on smaller viewports. Consider a more structured layout at medium breakpoints. |

### 3.3 Responsive Design

| Severity | Finding |
|----------|---------|
| **MED** | The transaction table uses `overflow-x-auto` for horizontal scrolling but the expanded detail grid (`grid-cols-2 md:grid-cols-4`) may be too dense on tablet viewports (768–1024px). |
| **LOW** | Filter bar `flex-wrap` causes controls to stack without clear visual grouping at medium widths. |

### 3.4 Color System

| Severity | Finding |
|----------|---------|
| **GOOD** | Status colors are semantically mapped (amber=needs attention, teal=ready, rose=error/void). Risk badge uses a clear three-tier system (emerald/amber/rose). |
| **MED** | The left border urgency indicator on table rows (`border-l-2`) uses four colors (rose, orange, amber, transparent). The orange vs. amber distinction is subtle and may be hard to differentiate for users with color vision deficiency. |

### 3.5 Typography

| Severity | Finding |
|----------|---------|
| **GOOD** | Space Grotesk applied consistently. `font-medium` (500) for labels, `font-bold` reserved for badges. Monospace for IDs and account numbers. |
| **LOW** | Expanded row section headers use `text-[10px]` (`PAYMENT DETAILS`, `DATES`, etc.) — at 10px, this is below the M3 `--m3-label-sm` (11px) minimum and may be hard to read. |

---

## SECTION 4: Priority Summary

### Critical (Must Fix for AA Compliance)
1. **Color contrast on `text-slate-400` labels** — use `text-slate-300` minimum on dark backgrounds for body text
2. **Sortable `<th>` headers need keyboard access** — add `tabIndex={0}`, `role="columnheader"` (implicit), and `onKeyDown`
3. **Focus indicator contrast** — use `focus:ring-teal-400` (full opacity) instead of `focus:ring-teal-500/50`

### High Priority
4. Associate filter panel `<label>` elements with their `<select>` inputs via `htmlFor`/`id`
5. Add `prefers-reduced-motion` media query to disable Framer Motion animations
6. Fix switch toggle off-state contrast (`bg-slate-600` → `bg-slate-500`)
7. Provide success feedback after bulk approve/reject actions

### Medium Priority
8. Standardize input heights (TableToolbar search still uses 56px)
9. Increase radio button target size (wrap in larger hit area)
10. Add `aria-disabled` to dimmed PaymentSummary cards
11. Distinguish primary action (View) from secondary actions in table rows
12. Resolve duplicate search input confusion (filter bar vs. table toolbar)

### Low Priority
13. Expand section header font size from 10px to 11px minimum
14. Add tooltips or help text for risk scores and workflow stages
15. Consider contextual (status-aware) action buttons per row
16. Improve color differentiation between orange and amber urgency borders

---

## Appendix: Component Checklist

| Component | Skip Link | ARIA Landmarks | Focus Trap | Keyboard Nav | Color Contrast | Target Size |
|-----------|:---------:|:--------------:|:----------:|:------------:|:--------------:|:-----------:|
| UnifiedNav | ✅ | ✅ `<header>` | ✅ Modal | ✅ Esc, Tab | ⚠️ slate-400 | ✅ |
| FilterPanel | — | ✅ `<section>` | — | ✅ Esc | ⚠️ slate-400 labels | ⚠️ Radio 14px |
| PaymentSummary | — | ✅ `<section>` | — | ✅ Enter/Space | ⚠️ Dimmed opacity | ✅ |
| ResultsTable | — | ✅ `<section>` | — | ⚠️ No th keyboard | ⚠️ slate-400 | ✅ 28px |
| TransactionRow | — | — | — | ✅ Enter/Space | ✅ | ✅ 28px |
| TableToolbar | — | ✅ `role="toolbar"` | — | ✅ | ⚠️ placeholder slate-500 | ⚠️ Clear 24px |
| TablePagination | — | ✅ `<nav>` | — | ✅ | ⚠️ slate-400 | ✅ |
| FraudGateModal | — | ✅ dialog | ✅ | ✅ Esc, autoFocus | ✅ | ✅ |
| RejectModal | — | ✅ dialog | ✅ | ✅ Esc, autoFocus | ✅ | ✅ |
| PaymentRailDialog | — | ✅ dialog | ✅ | ✅ Esc | ✅ | ✅ |
| AttachmentViewer | — | ✅ dialog | — | ✅ Esc | ✅ | ✅ |
| ColumnPicker | — | ✅ dialog | — | ✅ Esc | ⚠️ dark checkbox | ⚠️ 16px |
| FraudBadge | — | — | — | — | ✅ | — |
| StatusChip | — | — | — | — | ⚠️ next-step text | — |

**Legend:** ✅ Pass | ⚠️ Needs attention | — Not applicable
