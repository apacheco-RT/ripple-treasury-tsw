/**
 * Design Tokens — Ripple Treasury (TSW)
 *
 * Canonical source of truth for all design decisions.
 * Mirrors tailwind.config.ts and index.css. Edit here first,
 * then propagate changes to the CSS and Tailwind layers.
 *
 * When the official Ripple design system is supplied, update
 * `brand` and `typography` values below and they will cascade.
 */

// ─── Ripple Brand (baseline from brand.ripple.com) ────────────────────────────
// Replace with official design registry tokens when available.
export const brand = {
  blue:        '#1E90FF', // Primary brand blue — links, focus rings, active states
  blueDark:    '#0071E5', // Button primary default
  blueDeeper:  '#0043A7', // Button primary hover/pressed
  success:     '#53C922', // Positive confirmation
  error:       '#ED346A', // Destructive actions, errors
  warning:     '#F9731C', // Warnings, caution states
  textHeading: '#141A1F', // Page/section headings (light bg)
  textBody:    '#454C52', // Body copy (light bg)
} as const;

// ─── Surface / Background ─────────────────────────────────────────────────────
// Values match the CSS custom properties in index.css (--surface-*).
// In Tailwind: bg-surface-page, bg-surface-card, etc.
export const surface = {
  page:      '#0f1e35', // --surface-page      — page background
  card:      '#162a47', // --surface-card      — card / panel background
  elevated:  '#2d4a77', // --surface-elevated  — tooltips, dropdowns
  inset:     '#0a1628', // --surface-inset     — form inputs, deep nested bg
  section:   '#0d1c30', // --surface-section   — breadcrumbs, alternating rows
  deep:      '#050b14', // --surface-deep      — footer
  rowHover:  '#132640', // --surface-row-hover — table row hover
  border:    '#1a3455', // --surface-border    — borders throughout
} as const;

// ─── Risk Levels ──────────────────────────────────────────────────────────────
// Used by: FraudBadge, row highlighting, Fraud Spotlight gradient, filter chips.
// Scores: 0–100 from fraud engine. Visual breakpoints: 70+ = high, 40–69 = medium.
export const risk = {
  critical: { bg: '#fef2f2', border: '#fecaca', text: '#dc2626', solid: '#ef4444', label: 'Critical' },
  high:     { bg: '#fff7ed', border: '#fed7aa', text: '#c2410c', solid: '#f97316', label: 'High' },
  medium:   { bg: '#fffbeb', border: '#fde68a', text: '#b45309', solid: '#f59e0b', label: 'Medium' },
  low:      { bg: '#f0fdf4', border: '#bbf7d0', text: '#166534', solid: '#22c55e', label: 'Low' },
  none:     { bg: '#f8fafc', border: '#e2e8f0', text: '#475569', solid: '#94a3b8', label: 'Clear'  },
} as const;

// Threshold above which bulk approve is intercepted by the fraud gate.
export const FRAUD_GATE_THRESHOLD = 70;

// ─── Process Flow Stages ──────────────────────────────────────────────────────
// Maps to the 5 stages in the horizontal pipeline chip component.
export const processStage = {
  create:    { color: '#6366f1', bg: '#eef2ff', label: 'Create',     order: 1 },
  antiFraud: { color: '#f97316', bg: '#fff7ed', label: 'Anti Fraud', order: 2 },
  approvals: { color: '#8b5cf6', bg: '#f5f3ff', label: 'Approvals',  order: 3 },
  status:    { color: '#0ea5e9', bg: '#f0f9ff', label: 'Status',     order: 4 },
  history:   { color: '#64748b', bg: '#f8fafc', label: 'History',    order: 5 },
} as const;

export type ProcessStageKey = keyof typeof processStage;

// ─── Transaction Statuses ─────────────────────────────────────────────────────
// Display labels for status badges in the results table.
export const txStatus = {
  pending:        { color: '#b45309', bg: '#fffbeb', label: 'Pending'           },
  processing:     { color: '#0369a1', bg: '#f0f9ff', label: 'Processing'        },
  readyToApprove: { color: '#7c3aed', bg: '#f5f3ff', label: 'Ready to Approve'  },
  approved:       { color: '#166534', bg: '#f0fdf4', label: 'Approved'          },
  rejected:       { color: '#dc2626', bg: '#fef2f2', label: 'Rejected'          },
  onHold:         { color: '#92400e', bg: '#fef3c7', label: 'On Hold'           },
  escalated:      { color: '#1d4ed8', bg: '#eff6ff', label: 'Escalated'         },
  cancelled:      { color: '#374151', bg: '#f9fafb', label: 'Cancelled'         },
} as const;

export type TxStatusKey = keyof typeof txStatus;

// ─── Fraud Spotlight ──────────────────────────────────────────────────────────
export const fraudSpotlight = {
  gradientFrom: '#f43f5e', // Rose 500 — collapsed header gradient start
  gradientVia:  '#F06844', // Orange-red mid — collapsed header gradient mid
  gradientTo:   '#fb923c', // Orange 400 — collapsed header gradient end
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
// Space Grotesk is the closest available Google Fonts substitute.
export const typography = {
  fontSans: '"TT Ripple", "Space Grotesk", Inter, -apple-system, sans-serif',
  fontMono: '"JetBrains Mono", Menlo, monospace',
  scale: {
    xs:   { size: '0.75rem',  lineHeight: '1rem',    weight: 400 },
    sm:   { size: '0.8125rem',lineHeight: '1.125rem', weight: 400 }, // 13px — table cells
    base: { size: '0.875rem', lineHeight: '1.25rem',  weight: 400 }, // 14px — UI default
    md:   { size: '1rem',     lineHeight: '1.5rem',   weight: 400 }, // 16px — body
    lg:   { size: '1.125rem', lineHeight: '1.75rem',  weight: 600 }, // 18px — section headers
    xl:   { size: '1.25rem',  lineHeight: '1.75rem',  weight: 700 }, // 20px — card titles
    '2xl':{ size: '1.5rem',   lineHeight: '2rem',     weight: 700 }, // 24px — page title
  },
  tableHeader: { size: '0.6875rem', weight: 700, letterSpacing: '0.06em', transform: 'uppercase' },
} as const;

// ─── Spacing ──────────────────────────────────────────────────────────────────
export const spacing = {
  pagePadding:   '1.5rem',   // 24px — outer page inset
  sectionGap:    '0.75rem',  // 12px — gap between Filter / Spotlight / Flow / Table
  cardPadding:   '1rem',     // 16px — inner panel padding
  tableRowH:     '2.75rem',  // 44px — WCAG 2.5.8 minimum touch target height
  minTouchTarget:'1.5rem',   // 24px — WCAG 2.5.8 absolute minimum
} as const;

// ─── Border Radius ────────────────────────────────────────────────────────────
export const radius = {
  pill:  '100px',     // Ripple brand CTAs, primary buttons
  card:  '0.75rem',   // 12px — collapsible panels
  input: '0.5rem',    // 8px  — text inputs, selects, comboboxes
  badge: '0.25rem',   // 4px  — status chips, count badges
  sm:    '0.1875rem', // 3px  — subtle indicators
} as const;

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const shadows = {
  panel:    '0 1px 3px 0 rgba(0,0,0,0.08), 0 1px 2px -1px rgba(0,0,0,0.05)',
  dropdown: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.06)',
  modal:    '0 20px 25px -5px rgba(0,0,0,0.15), 0 8px 10px -6px rgba(0,0,0,0.1)',
} as const;

// ─── Z-Index Scale ────────────────────────────────────────────────────────────
export const zIndex = {
  base:     0,
  raised:   10,
  overlay:  20,
  dropdown: 30,
  sticky:   40,
  modal:    50,
  toast:    60,
} as const;

// ─── Text tokens ──────────────────────────────────────────────────────────────
// CSS custom properties: --text-primary, --text-secondary, --text-tertiary.
// Tailwind utilities: text-tsw-text-primary, text-tsw-text-secondary, text-tsw-text-tertiary.
export const textTokens = {
  dark: {
    primary:   '#f8fafc', // --text-primary   — 210 40% 98%  — ≈ 16.6:1 on surface-page
    secondary: '#94a3b8', // --text-secondary — 215 20% 65%  — ≈  7.1:1 on surface-page
    tertiary:  '#8e9eb0', // --text-tertiary  — 215 17% 62%  — ≈  6.3:1 on surface-page
  },
  light: {
    primary:   '#0f172a', // --text-primary   — 222 47% 11%  — ≈ 16.0:1 on white
    secondary: '#64748b', // --text-secondary — 215 16% 47%  — ≈  5.3:1 on white
    tertiary:  '#4b5563', // --text-tertiary  — 215 14% 34%  — ≈  6.6:1 on white
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
