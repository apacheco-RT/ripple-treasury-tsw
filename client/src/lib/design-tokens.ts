// Thin re-export wrapper — maps TSW token API to @ds-foundation/tokens CSS vars.
/**
 * Design Tokens — Ripple Treasury (TSW)
 *
 * Canonical source of truth for all design decisions.
 * Values are now re-exported as @ds-foundation/tokens CSS variable references.
 * Where no DS-foundation equivalent exists, original values are retained with
 * a @ds-component: custom comment.
 *
 * Shape (export names, property names) is identical to the original file —
 * all existing consumers continue to import from this file without changes.
 *
 * @ds-version: 0.2.2
 */

// @ds-adapter: tailwind | @ds-layer: token

// ─── Ripple Brand (baseline from brand.ripple.com) ────────────────────────────
export const brand = {
  blue:        'var(--ds-color-brand-primary)',         // brand.blue → --ds-color-brand-primary
  blueDark:    'var(--ds-color-brand-primary)',         // brand.blueDark → --ds-color-brand-primary (button primary default)
  blueDeeper:  'var(--ds-color-brand-primary-active)',  // brand.blueDeeper → --ds-color-brand-primary-active (hover/pressed)
  success:     'var(--ds-color-feedback-success-icon)', // brand.success → --ds-color-feedback-success-icon
  error:       'var(--ds-color-feedback-error-icon)',   // brand.error → --ds-color-feedback-error-icon
  warning:     'var(--ds-color-feedback-warning-icon)', // brand.warning → --ds-color-feedback-warning-icon
  textHeading: '#141A1F', // @ds-component: custom — no DS-foundation equivalent
  textBody:    '#454C52', // @ds-component: custom — no DS-foundation equivalent
} as const;

// ─── Surface / Background ─────────────────────────────────────────────────────
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.2 | @ds-layer: token
export const surface = {
  page:      'var(--ds-color-surface-page)',             // --ds-color-surface-page (dark theme = neutral-950)
  card:      'var(--ds-color-surface-default)',          // --ds-color-surface-default (dark theme = neutral-900)
  elevated:  'var(--ds-color-surface-raised)',           // --ds-color-surface-raised (dark theme = neutral-800; DS naming: surface-raised)
  inset:     'var(--ds-color-surface-sunken)',           // --ds-color-surface-sunken (form inputs / deep nested bg)
  section:   'var(--ds-color-surface-default)',          // alternating row bg — pairs with surface-page as base
  deep:      '#050b14',                                  // @ds-component: custom — no DS-foundation equivalent (darker than neutral-950)
  rowHover:  'var(--ds-color-interactive-selected-bg)',  // --ds-color-interactive-selected-bg (dark = blue-950)
  border:    'var(--ds-color-border-default)',           // --ds-color-border-default (dark = neutral-700)
} as const;

// ─── Risk Levels ──────────────────────────────────────────────────────────────
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.2 | @ds-layer: token
// Used by: FraudBadge, row highlighting, Fraud Spotlight gradient, filter chips.
// Scores: 0–100 from fraud engine. Visual breakpoints: 70+ = high, 40–69 = medium.
export const risk = {
  // @ds-component: custom — no DS-foundation equivalent
  critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', solid: '#ef4444', label: 'Critical' },
  // @ds-component: custom — no DS-foundation equivalent
  high:     { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', solid: '#f97316', label: 'High' },
  // @ds-component: custom — no DS-foundation equivalent
  medium:   { bg: '#fffbeb', border: '#fde68a', text: '#b45309', solid: '#f59e0b', label: 'Medium' },
  // @ds-component: custom — no DS-foundation equivalent
  low:      { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', solid: '#22c55e', label: 'Low' },
  // @ds-component: custom — no DS-foundation equivalent
  none:     { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', solid: '#94a3b8', label: 'Clear'  },
} as const;

// Threshold above which bulk approve is intercepted by the fraud gate.
export const FRAUD_GATE_THRESHOLD = 70;

// ─── Process Flow Stages ──────────────────────────────────────────────────────
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.2 | @ds-layer: token
// Maps to the 5 stages in the horizontal pipeline chip component.
export const processStage = {
  // @ds-component: custom — no DS-foundation equivalent
  create:    { color: '#6366f1', bg: '#eef2ff', label: 'Create',     order: 1 },
  // @ds-component: custom — no DS-foundation equivalent
  antiFraud: { color: '#f97316', bg: '#fff7ed', label: 'Anti Fraud', order: 2 },
  // @ds-component: custom — no DS-foundation equivalent
  approvals: { color: '#8b5cf6', bg: '#f5f3ff', label: 'Approvals',  order: 3 },
  // @ds-component: custom — no DS-foundation equivalent
  status:    { color: '#0ea5e9', bg: '#f0f9ff', label: 'Status',     order: 4 },
  // @ds-component: custom — no DS-foundation equivalent
  history:   { color: '#64748b', bg: '#f8fafc', label: 'History',    order: 5 },
} as const;

export type ProcessStageKey = keyof typeof processStage;

// ─── Transaction Statuses ─────────────────────────────────────────────────────
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.2 | @ds-layer: token
// Display labels for status badges in the results table.
export const txStatus = {
  // @ds-component: custom — no DS-foundation equivalent
  pending:        { color: '#b45309', bg: '#fffbeb', label: 'Pending'           },
  // @ds-component: custom — no DS-foundation equivalent
  processing:     { color: '#0369a1', bg: '#f0f9ff', label: 'Processing'        },
  // @ds-component: custom — no DS-foundation equivalent
  readyToApprove: { color: '#7c3aed', bg: '#f5f3ff', label: 'Ready to Approve'  },
  // @ds-component: custom — no DS-foundation equivalent
  approved:       { color: '#166534', bg: '#f0fdf4', label: 'Approved'          },
  // @ds-component: custom — no DS-foundation equivalent
  rejected:       { color: '#dc2626', bg: '#fef2f2', label: 'Rejected'          },
  // @ds-component: custom — no DS-foundation equivalent
  onHold:         { color: '#92400e', bg: '#fef3c7', label: 'On Hold'           },
  // @ds-component: custom — no DS-foundation equivalent
  escalated:      { color: '#1d4ed8', bg: '#eff6ff', label: 'Escalated'         },
  // @ds-component: custom — no DS-foundation equivalent
  cancelled:      { color: '#374151', bg: '#f9fafb', label: 'Cancelled'         },
} as const;

export type TxStatusKey = keyof typeof txStatus;

// ─── Fraud Spotlight ──────────────────────────────────────────────────────────
// @ds-component: custom | @ds-adapter: tailwind | @ds-version: 0.2.2 | @ds-layer: token
export const fraudSpotlight = {
  gradientFrom: '#f43f5e', // @ds-component: custom — no DS-foundation equivalent (Rose 500)
  gradientVia:  '#F06844', // @ds-component: custom — no DS-foundation equivalent (Orange-red mid)
  gradientTo:   '#fb923c', // @ds-component: custom — no DS-foundation equivalent (Orange 400)
  topN:          10,       // Show top N high-risk transactions
} as const;

// ─── Filter Presets ───────────────────────────────────────────────────────────
// The default filter state when no user customisation exists.
export const filterPresets = {
  myDailyQueue: {
    id:      'my-daily-queue',
    label:   'My Daily Queue',
    summary: 'Today · Pending · Assigned to me',
    filters: {
      dateRange:   'today',
      status:      ['pending'],
      assignedToMe: true,
    },
  },
} as const;

// ─── Typography ───────────────────────────────────────────────────────────────
// TT Ripple is Ripple's custom typeface — selfhosted when design system is supplied.
// fontSans overrides DS var with Ripple brand stack falling back to DS font family.
export const typography = {
  fontSans: '"TT Ripple", "Space Grotesk", var(--ds-font-family-sans)', // Ripple brand fonts prepended; DS var as fallback
  fontMono: 'var(--ds-font-family-mono)',                                // --ds-font-family-mono (near-exact match)
  scale: {
    xs:   { size: 'var(--ds-font-size-xs)',  lineHeight: '1rem',    weight: 400 }, // --ds-font-size-xs = 0.75rem
    sm:   { size: '0.8125rem',               lineHeight: '1.125rem', weight: 400 }, // @ds-component: custom — no DS-foundation equivalent (13px table cells)
    base: { size: 'var(--ds-font-size-sm)',  lineHeight: '1.25rem',  weight: 400 }, // --ds-font-size-sm = 0.875rem (DS calls it sm; TSW calls it base)
    md:   { size: 'var(--ds-font-size-md)',  lineHeight: '1.5rem',   weight: 400 }, // --ds-font-size-md = 1rem
    lg:   { size: 'var(--ds-font-size-lg)',  lineHeight: '1.75rem',  weight: 600 }, // --ds-font-size-lg = 1.125rem
    xl:   { size: 'var(--ds-font-size-xl)',  lineHeight: '1.75rem',  weight: 700 }, // --ds-font-size-xl = 1.25rem
    '2xl':{ size: 'var(--ds-font-size-2xl)', lineHeight: '2rem',     weight: 700 }, // --ds-font-size-2xl = 1.5rem
  },
  tableHeader: { size: '0.6875rem', weight: 700, letterSpacing: '0.06em', transform: 'uppercase' }, // @ds-component: custom — no DS-foundation equivalent (11px/uppercase/wide tracking)
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  pagePadding:    'var(--ds-spacing-6)',            // --ds-spacing-6 = 1.5rem (24px) — exact match
  sectionGap:     'var(--ds-spacing-3)',            // --ds-spacing-3 = 0.75rem (12px) — exact match
  cardPadding:    'var(--ds-spacing-4)',            // --ds-spacing-4 = 1rem (16px) — exact match
  tableRowH:      'var(--ds-component-height-lg)',  // --ds-component-height-lg ≈ 3rem (48px); TSW is 2.75rem (44px WCAG 2.5.8); closest DS step
  minTouchTarget: 'var(--ds-component-height-xs)', // --ds-component-height-xs = 1.5rem (24px) — exact match
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  pill:  'var(--ds-radius-full)', // --ds-radius-full = 9999px (both produce pill shape; value differs, visual result identical)
  card:  'var(--ds-radius-xl)',   // --ds-radius-xl = 0.75rem (12px) — exact match
  input: 'var(--ds-radius-lg)',   // --ds-radius-lg = 0.5rem (8px) — exact match
  badge: 'var(--ds-radius-sm)',   // --ds-radius-sm = 0.25rem (4px) — exact match
  sm:    'var(--ds-radius-xs)',   // --ds-radius-xs = 0.125rem (2px); TSW is 0.1875rem (3px) — closest DS step
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  panel:    'var(--ds-shadow-sm)',  // --ds-shadow-sm ≈ 0px 1px 3px 0px rgba(0,0,0,0.07); TSW is two-layer, DS is single-layer
  dropdown: 'var(--ds-shadow-md)',  // --ds-shadow-md = 0px 4px 6px -1px rgba(0,0,0,0.1) — near-exact first layer
  modal:    'var(--ds-shadow-xl)',  // --ds-shadow-xl first layer matches geometry; TSW opacity 0.15 vs DS 0.1
} as const;

// ─── Z-Index Scale ────────────────────────────────────────────────────────────
// NOTE: DS-foundation z-index values differ from original TSW values.
// overlay: 20 → 300, dropdown: 30 → 100, sticky: 40 → 200, modal: 50 → 400, toast: 60 → 600.
// Verify no stacking conflicts after this change.
export const zIndex = {
  base:     'var(--ds-z-index-base)',     // DS = 0 — exact match
  raised:   'var(--ds-z-index-raised)',   // DS = 10 — exact match
  overlay:  'var(--ds-z-index-overlay)',  // DS = 300 (was 20)
  dropdown: 'var(--ds-z-index-dropdown)', // DS = 100 (was 30)
  sticky:   'var(--ds-z-index-sticky)',   // DS = 200 (was 40)
  modal:    'var(--ds-z-index-modal)',    // DS = 400 (was 50)
  toast:    'var(--ds-z-index-toast)',    // DS = 600 (was 60)
} as const;

// ─── Text tokens ──────────────────────────────────────────────────────────────
// CSS custom properties: --text-primary, --text-secondary, --text-tertiary.
// Tailwind utilities: text-tsw-text-primary, text-tsw-text-secondary, text-tsw-text-tertiary.
export const textTokens = {
  dark: {
    primary:   'var(--ds-color-text-primary)',   // --ds-color-text-primary dark = neutral-50 (#f8fafc) — exact match
    secondary: 'var(--ds-color-text-secondary)', // --ds-color-text-secondary dark = neutral-400 (#94a3b8) — exact match
    tertiary:  'var(--ds-color-text-tertiary)',  // --ds-color-text-tertiary dark = neutral-600; TSW #8e9eb0 has no exact match — semantic fallback
  },
  light: {
    primary:   'var(--ds-color-text-primary)',   // --ds-color-text-primary light = neutral-900 (#0f172a) — exact match
    secondary: 'var(--ds-color-text-secondary)', // --ds-color-text-secondary light = neutral-600 (#475569); TSW is neutral-500 (#64748b) — close semantic match
    tertiary:  'var(--ds-color-text-tertiary)',  // --ds-color-text-tertiary light = neutral-400; TSW #4b5563 ≈ neutral-600 range — semantic fallback
  },
} as const;

// ─── WCAG 2.2 Reference ───────────────────────────────────────────────────────
// Keep these values in sync with spacing.tableRowH and spacing.minTouchTarget.
export const a11y = {
  minTargetSize:      24,  // px — 2.5.8 Target Size (Minimum) AA
  minTargetSizeEnh:   44,  // px — 2.5.5 Target Size (Enhanced) AAA
  contrastNormal:     4.5, // ratio — 1.4.3 Contrast (Minimum) AA
  contrastLarge:      3.0, // ratio — 1.4.3 large text (≥18pt/14pt bold)
  focusNotObscured:   true,// 2.4.11 Focus Not Obscured (Minimum) — new in WCAG 2.2
} as const;
