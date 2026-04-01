# TSW Phase 3 — DS Foundation Atom Contribution

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add three new components (`DetailCard`, `IconButton`, `StateBadge`) to the `ds-foundation` design system monorepo, then update TSW to consume them from the package instead of local atoms.

**Architecture:** DS contributions go into `ds-foundation/packages/react/src/` as inline-styled React components with co-located Storybook stories, a registry MDX spec, and a barrel export in `index.ts`. TSW consumes `ds-foundation` via a `file:` dependency, so DS changes are immediately available — no npm publish step. The TSW migration PR deletes the two existing local atoms, adds a `getTxStatusIntent()` helper and `iconButtonVariants.ts` shim, and replaces `StatusBadgeContent` in `Badge.tsx` with `<StateBadge>`.

**Tech Stack:** React 18, TypeScript, inline CSS styles (no Tailwind in DS components), Storybook `@storybook/react`, `@changesets/cli`, TSW uses Tailwind + shadcn/ui.

---

## File Map

### `ds-foundation/packages/react/src/`
| File | Action | Responsibility |
|------|--------|----------------|
| `DetailCard.tsx` | Create | Card primitive — title heading + content slot |
| `DetailCard.stories.tsx` | Create | Stories: default, dark mode |
| `IconButton.tsx` | Create | Icon button — 6 variants (intent-driven), 2 sizes, `forwardRef` |
| `IconButton.stories.tsx` | Create | Stories: all 6 variants, both sizes, with/without label, disabled |
| `StateBadge.tsx` | Create | Status pill — state label + optional next-state, intent-driven colour |
| `StateBadge.stories.tsx` | Create | Stories: all 5 intents, both sizes, with/without nextState |
| `index.ts` | Modify | Add `DetailCard`, `IconButton`, `StateBadge` barrel exports (3 additions) |

### `ds-foundation/packages/registry/components/`
| File | Action | Responsibility |
|------|--------|----------------|
| `detail-card.mdx` | Create | Registry spec for DetailCard |
| `icon-button.mdx` | Create | Registry spec for IconButton |
| `state-badge.mdx` | Create | Registry spec for StateBadge |

### `payments-tsw-phase1/client/src/`
| File | Action | Responsibility |
|------|--------|----------------|
| `components/atoms/DetailCard.tsx` | Delete | Replaced by DS package import |
| `components/atoms/IconButton.tsx` | Delete | Replaced by DS package import |
| `lib/iconButtonVariants.ts` | Create | Maps TSW variant names → DS `IconButtonVariant` |
| `lib/design-tokens.ts` | Modify | Add `getTxStatusIntent()` function |
| `components/atoms/Badge.tsx` | Modify | Replace `StatusBadgeContent` with `<StateBadge>`; remove `Failed` special case |
| `components/organisms/results-table/TransactionCard.tsx` | Modify | Update DetailCard import path |
| `components/organisms/results-table/TransactionRow.tsx` | Modify | Update DetailCard + IconButton import paths; wrap variants with `toIconButtonVariant()` |
| `components/organisms/results-table/TableToolbar.tsx` | Modify | Update IconButton import path |
| `components/organisms/results-table/TablePagination.tsx` | Modify | Update IconButton import path |
| `components/organisms/results-table/ColumnPicker.tsx` | Modify | Update IconButton import path; wrap variants with `toIconButtonVariant()` |

---

## Working directory notes

- DS work: `cd /Users/apacheco/Documents/Projects/ds-foundation`
- TSW work: `cd /Users/apacheco/Documents/Projects/payments-tsw-phase1`
- TSW consumes DS via `"@ds-foundation/react": "file:../ds-foundation/packages/react"` — changes in DS are immediately available to TSW without a publish step.

---

## Task 1: DetailCard — DS component + stories + registry

**Files:**
- Create: `ds-foundation/packages/react/src/DetailCard.tsx`
- Create: `ds-foundation/packages/react/src/DetailCard.stories.tsx`
- Create: `ds-foundation/packages/registry/components/detail-card.mdx`
- Modify: `ds-foundation/packages/react/src/index.ts`

- [ ] **Step 1: Create `DetailCard.tsx`**

Working dir: `ds-foundation/`

```tsx
// @ds-component: detail-card | @ds-adapter: tailwind | @ds-version: 0.2.0
import React from 'react';

export interface DetailCardProps {
  title: string;
  children: React.ReactNode;
}

export function DetailCard({ title, children }: DetailCardProps) {
  return (
    <div
      style={{
        borderRadius: 'var(--ds-radius-lg)',
        backgroundColor: 'var(--ds-color-surface-default)',
        border: '1px solid color-mix(in srgb, var(--ds-color-border-default) 50%, transparent)',
        padding: '16px',
      }}
    >
      <h4
        style={{
          fontSize: 'var(--ds-font-size-xs)',
          fontWeight: 'var(--ds-font-weight-medium)',
          color: 'var(--ds-color-brand-primary)',
          letterSpacing: 'var(--ds-font-tracking-wide)',
          textTransform: 'uppercase',
          marginBottom: '12px',
          paddingBottom: '8px',
          borderBottom: '1px solid color-mix(in srgb, var(--ds-color-border-default) 50%, transparent)',
          margin: '0 0 12px 0',
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `DetailCard.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { DetailCard } from './DetailCard';

const meta: Meta<typeof DetailCard> = {
  title: 'Atoms/DetailCard',
  component: DetailCard,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
};

export default meta;
type Story = StoryObj<typeof DetailCard>;

export const Default: Story = {
  args: {
    title: 'Payment Details',
    children: (
      <div style={{ fontSize: '0.875rem', color: 'var(--ds-color-text-primary)' }}>
        <div>Amount: $1,250.00</div>
        <div>Currency: USD</div>
      </div>
    ),
  },
};

export const DarkMode: Story = {
  args: { ...Default.args },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--ds-color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
```

- [ ] **Step 3: Create `detail-card.mdx` registry spec**

File: `packages/registry/components/detail-card.mdx`

```mdx
---
id: detail-card
type: component
version: 0.2.0
status: beta
variants: []
sizes: []
accessibility:
  role: "none"
  wcag:
    - "1.4.3 Contrast (Minimum)"
  aria:
    - "h4 heading provides semantic structure within the card"
  notes: "Uses a semantic h4 for the title. No interactive elements — no ARIA roles required beyond the heading."
ai-prompt: "DetailCard renders a labelled section card with a title heading and arbitrary children. Use for grouping related fields in detail views, drawers, or side panels. Title is always uppercase, brand-primary coloured, and separated from content by a bottom border."
---

# DetailCard

A labelled section card for grouping related information. Uses a semantic `h4` heading for the title and renders arbitrary children in the card body.

## Usage

```tsx
import { DetailCard } from '@ds-foundation/react';

<DetailCard title="Payment Details">
  <p>Amount: $1,250.00</p>
</DetailCard>
```

## Props

| Prop | Type | Description |
|------|------|-------------|
| `title` | `string` | Card section heading (rendered as `h4`) |
| `children` | `React.ReactNode` | Card body content |

## Accessibility

`h4` provides semantic heading structure. Title colour (`--ds-color-brand-primary`) meets WCAG 1.4.3 contrast requirements against the card background.
```

- [ ] **Step 4: Add barrel export to `index.ts`**

Append to `packages/react/src/index.ts`:
```
export * from './DetailCard';
```

- [ ] **Step 5: Run type check and validation**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run typecheck
npm run ci:validate
```

Expected: both pass with zero errors.

- [ ] **Step 6: Add changeset**

```bash
npx changeset
```

When prompted:
- Select `@ds-foundation/react` (spacebar to select)
- Bump type: `patch`
- Summary: `feat: add DetailCard component`

- [ ] **Step 7: Commit**

```bash
git add packages/react/src/DetailCard.tsx packages/react/src/DetailCard.stories.tsx \
        packages/registry/components/detail-card.mdx packages/react/src/index.ts \
        .changeset/
git commit -m "feat(react): add DetailCard component"
```

---

## Task 2: IconButton — DS component + stories + registry

**Files:**
- Create: `ds-foundation/packages/react/src/IconButton.tsx`
- Create: `ds-foundation/packages/react/src/IconButton.stories.tsx`
- Create: `ds-foundation/packages/registry/components/icon-button.mdx`
- Modify: `ds-foundation/packages/react/src/index.ts`

> **DS implementation note:** DS components use inline styles (no Tailwind). However, `IconButton` needs hover/focus state CSS. Since inline styles cannot express `:hover` or `:focus-visible`, implement hover state using a `React.useState` `isHovered` + `onMouseEnter`/`onMouseLeave` pattern, and focus ring via `onFocus`/`onBlur`. This is the correct approach for an inline-styles-only DS component — do NOT use Tailwind classes.
>
> **`forwardRef` note:** This is the first DS component to use `React.forwardRef`. Required because downstream TSW call sites pass `ref` to `IconButton`. See spec for context.

- [ ] **Step 1: Create `IconButton.tsx`**

```tsx
// @ds-component: icon-button | @ds-adapter: tailwind | @ds-version: 0.2.0
import React from 'react';

export type IconButtonVariant = 'info' | 'success' | 'primary' | 'warning' | 'danger' | 'neutral';
export type IconButtonSize = 'sm' | 'md';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const VARIANT_HOVER: Record<IconButtonVariant, { color: string; bg: string; ring: string }> = {
  info:    { color: 'var(--ds-color-feedback-info-text)',    bg: 'var(--ds-color-feedback-info-bg)',    ring: 'var(--ds-color-feedback-info-border)' },
  success: { color: 'var(--ds-color-feedback-success-text)', bg: 'var(--ds-color-feedback-success-bg)', ring: 'var(--ds-color-feedback-success-border)' },
  primary: { color: 'var(--ds-color-brand-primary)',         bg: 'var(--ds-color-brand-primary-subtle)', ring: 'var(--ds-color-brand-primary)' },
  warning: { color: 'var(--ds-color-feedback-warning-text)', bg: 'var(--ds-color-feedback-warning-bg)', ring: 'var(--ds-color-feedback-warning-border)' },
  danger:  { color: 'var(--ds-color-feedback-error-text)',   bg: 'var(--ds-color-feedback-error-bg)',   ring: 'var(--ds-color-feedback-error-border)' },
  neutral: { color: 'var(--ds-color-text-primary)',          bg: 'var(--ds-color-surface-raised)',       ring: 'var(--ds-color-brand-primary)' },
};

const SIZE_STYLE: Record<IconButtonSize, { iconOnly: React.CSSProperties; withText: React.CSSProperties }> = {
  sm: {
    iconOnly: { padding: '4px', minWidth: '24px', minHeight: '24px' },
    withText: { padding: '4px 8px', minHeight: '24px', gap: '4px', fontSize: 'var(--ds-font-size-xs)' },
  },
  md: {
    iconOnly: { padding: '6px', minWidth: '28px', minHeight: '28px' },
    withText: { padding: '6px 12px', minHeight: '28px', gap: '6px' },
  },
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  function IconButton({ variant = 'neutral', size = 'md', icon, children, style, ...rest }, ref) {
    const [isHovered, setIsHovered] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const v = VARIANT_HOVER[variant];
    const sizeStyle = children ? SIZE_STYLE[size].withText : SIZE_STYLE[size].iconOnly;

    const baseStyle: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 'var(--ds-radius-lg)',
      border: 'none',
      cursor: rest.disabled ? 'not-allowed' : 'pointer',
      opacity: rest.disabled ? 0.3 : 1,
      transition: 'color 0.15s ease, background-color 0.15s ease',
      color: isHovered ? v.color : 'var(--ds-color-text-secondary)',
      backgroundColor: isHovered ? v.bg : 'transparent',
      outline: isFocused ? `2px solid ${v.ring}` : 'none',
      outlineOffset: '2px',
      ...sizeStyle,
      ...style,
    };

    return (
      <button
        ref={ref}
        style={baseStyle}
        onMouseEnter={(e) => { setIsHovered(true); rest.onMouseEnter?.(e); }}
        onMouseLeave={(e) => { setIsHovered(false); rest.onMouseLeave?.(e); }}
        onFocus={(e) => { setIsFocused(true); rest.onFocus?.(e); }}
        onBlur={(e) => { setIsFocused(false); rest.onBlur?.(e); }}
        {...rest}
      >
        {icon}
        {children}
      </button>
    );
  }
);
```

- [ ] **Step 2: Create `IconButton.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

// Inline SVG chevron icon for stories (no external dependency)
const ChevronIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const meta: Meta<typeof IconButton> = {
  title: 'Atoms/IconButton',
  component: IconButton,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    variant: { control: 'select', options: ['info', 'success', 'primary', 'warning', 'danger', 'neutral'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Neutral: Story = {
  args: { variant: 'neutral', icon: <ChevronIcon /> },
};

export const Info: Story = {
  args: { variant: 'info', icon: <ChevronIcon /> },
};

export const Success: Story = {
  args: { variant: 'success', icon: <ChevronIcon /> },
};

export const Primary: Story = {
  args: { variant: 'primary', icon: <ChevronIcon /> },
};

export const Warning: Story = {
  args: { variant: 'warning', icon: <ChevronIcon /> },
};

export const Danger: Story = {
  args: { variant: 'danger', icon: <ChevronIcon /> },
};

export const WithLabel: Story = {
  args: { variant: 'primary', icon: <ChevronIcon />, children: 'Action', size: 'md' },
};

export const Small: Story = {
  args: { variant: 'info', icon: <ChevronIcon />, size: 'sm' },
};

export const Disabled: Story = {
  args: { variant: 'danger', icon: <ChevronIcon />, disabled: true },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '8px' }}>
      {(['info', 'success', 'primary', 'warning', 'danger', 'neutral'] as const).map((v) => (
        <IconButton key={v} variant={v} icon={<ChevronIcon />} title={v} />
      ))}
    </div>
  ),
};

export const DarkMode: Story = {
  args: { variant: 'primary', icon: <ChevronIcon /> },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--ds-color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
```

- [ ] **Step 3: Create `icon-button.mdx` registry spec**

File: `packages/registry/components/icon-button.mdx`

```mdx
---
id: icon-button
type: component
version: 0.2.0
status: beta
variants: [info, success, primary, warning, danger, neutral]
sizes: [sm, md]
accessibility:
  role: "button"
  wcag:
    - "1.4.3 Contrast (Minimum)"
    - "2.4.7 Focus Visible"
    - "4.1.2 Name, Role, Value"
  aria:
    - "aria-label or title required when button contains only an icon (no visible text)"
    - "aria-expanded for toggle buttons (e.g. column pickers)"
    - "disabled attribute for non-interactive states"
  notes: "All variants share a neutral rest colour. Variant colour applies on hover only. Supports ref forwarding for programmatic focus management."
ai-prompt: "IconButton renders a small icon-only or icon+text action button. Six variants (info, success, primary, warning, danger, neutral) drive hover colour via DS feedback tokens. Neutral rest state — all variants look the same at rest, only differ on hover. Use when action context is implied by position/icon (table row actions, toolbar controls). Always add aria-label or title when icon-only."
---

# IconButton

A small icon-only (or icon+text) action button. Variants drive hover colour via DS feedback tokens. All variants share a neutral rest state — colour only applies on hover.

## Usage

```tsx
import { IconButton } from '@ds-foundation/react';
import { Eye } from 'lucide-react';

<IconButton variant="info" icon={<Eye size={16} />} title="View details" />
<IconButton variant="danger" icon={<Trash size={16} />} aria-label="Delete" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `IconButtonVariant` | `'neutral'` | Hover colour intent |
| `size` | `IconButtonSize` | `'md'` | `sm` (24px) or `md` (28px) |
| `icon` | `React.ReactNode` | — | Icon element |
| `children` | `React.ReactNode` | — | Optional label text beside icon |
| `ref` | `React.Ref<HTMLButtonElement>` | — | Forwarded to button element |
| `...rest` | `ButtonHTMLAttributes` | — | `disabled`, `onClick`, `title`, `aria-*`, etc. |

## Accessibility

Always provide `title` or `aria-label` on icon-only buttons. Use `aria-expanded` for toggle controls. Focus ring uses variant's ring token; outline offset 2px.
```

- [ ] **Step 4: Add barrel export to `index.ts`**

Append to `packages/react/src/index.ts`:
```
export * from './IconButton';
```

- [ ] **Step 5: Run type check and validation**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run typecheck
npm run ci:validate
```

Expected: both pass.

- [ ] **Step 6: Add changeset**

```bash
npx changeset
```

- Select `@ds-foundation/react`, patch bump
- Summary: `feat: add IconButton component`

- [ ] **Step 7: Commit**

```bash
git add packages/react/src/IconButton.tsx packages/react/src/IconButton.stories.tsx \
        packages/registry/components/icon-button.mdx packages/react/src/index.ts \
        .changeset/
git commit -m "feat(react): add IconButton component"
```

---

## Task 3: StateBadge — DS component + stories + registry

**Files:**
- Create: `ds-foundation/packages/react/src/StateBadge.tsx`
- Create: `ds-foundation/packages/react/src/StateBadge.stories.tsx`
- Create: `ds-foundation/packages/registry/components/state-badge.mdx`
- Modify: `ds-foundation/packages/react/src/index.ts`

- [ ] **Step 1: Create `StateBadge.tsx`**

```tsx
// @ds-component: state-badge | @ds-adapter: tailwind | @ds-version: 0.2.0
import React from 'react';

export type StateBadgeIntent = 'info' | 'warning' | 'success' | 'error' | 'neutral';
export type StateBadgeSize = 'sm' | 'md';

export interface StateBadgeProps {
  state: string;
  intent: StateBadgeIntent;
  nextState?: string;
  size?: StateBadgeSize;
}

const INTENT_STYLE: Record<StateBadgeIntent, { bg: string; border: string; color: string }> = {
  info:    { bg: 'var(--ds-color-feedback-info-bg)',    border: 'var(--ds-color-feedback-info-border)',    color: 'var(--ds-color-feedback-info-text)' },
  warning: { bg: 'var(--ds-color-feedback-warning-bg)', border: 'var(--ds-color-feedback-warning-border)', color: 'var(--ds-color-feedback-warning-text)' },
  success: { bg: 'var(--ds-color-feedback-success-bg)', border: 'var(--ds-color-feedback-success-border)', color: 'var(--ds-color-feedback-success-text)' },
  error:   { bg: 'var(--ds-color-feedback-error-bg)',   border: 'var(--ds-color-feedback-error-border)',   color: 'var(--ds-color-feedback-error-text)' },
  neutral: { bg: 'var(--ds-color-surface-sunken)',      border: 'var(--ds-color-border-default)',          color: 'var(--ds-color-text-secondary)' },
};

const SIZE_STYLE: Record<StateBadgeSize, { padding: string; fontSize: string }> = {
  sm: { padding: '2px 6px', fontSize: 'var(--ds-font-size-xs)' },
  md: { padding: '3px 8px', fontSize: 'var(--ds-font-size-sm)' },
};

export function StateBadge({ state, intent, nextState, size = 'md' }: StateBadgeProps) {
  const s = INTENT_STYLE[intent];
  const sz = SIZE_STYLE[size];
  const ariaLabel = nextState
    ? `Status: ${state}, next: ${nextState}`
    : `Status: ${state}`;

  return (
    <span
      role="status"
      aria-label={ariaLabel}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: sz.padding,
        borderRadius: 'var(--ds-radius-lg)',
        backgroundColor: s.bg,
        border: `1px solid ${s.border}`,
        color: s.color,
        fontSize: sz.fontSize,
        fontWeight: 'var(--ds-font-weight-medium)',
        letterSpacing: 'var(--ds-font-tracking-wide)',
        textTransform: 'uppercase',
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
      }}
    >
      {state}
      {nextState && (
        <>
          <span
            aria-hidden="true"
            style={{ color: 'var(--ds-color-text-tertiary)', fontWeight: 'normal' }}
          >
            →
          </span>
          <span style={{ fontWeight: 'var(--ds-font-weight-medium)' }}>{nextState}</span>
        </>
      )}
    </span>
  );
}
```

- [ ] **Step 2: Create `StateBadge.stories.tsx`**

```tsx
import type { Meta, StoryObj } from '@storybook/react';
import { StateBadge } from './StateBadge';

const meta: Meta<typeof StateBadge> = {
  title: 'Atoms/StateBadge',
  component: StateBadge,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  argTypes: {
    intent: { control: 'select', options: ['info', 'warning', 'success', 'error', 'neutral'] },
    size: { control: 'radio', options: ['sm', 'md'] },
  },
};

export default meta;
type Story = StoryObj<typeof StateBadge>;

export const Info: Story = {
  args: { state: 'Processing', intent: 'info' },
};

export const InfoWithNext: Story = {
  args: { state: 'Processing', intent: 'info', nextState: 'Approval' },
};

export const Warning: Story = {
  args: { state: 'Needs Approval', intent: 'warning' },
};

export const Success: Story = {
  args: { state: 'Approved', intent: 'success', nextState: 'Extract' },
};

export const Error: Story = {
  args: { state: 'Failed', intent: 'error' },
};

export const Neutral: Story = {
  args: { state: 'Void', intent: 'neutral' },
};

export const Small: Story = {
  args: { state: 'Processing', intent: 'info', nextState: 'Approval', size: 'sm' },
};

export const AllIntents: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-start' }}>
      <StateBadge state="Processing"    intent="info"    nextState="Approval" />
      <StateBadge state="Needs Approval" intent="warning" nextState="Review" />
      <StateBadge state="Approved"      intent="success" nextState="Extract" />
      <StateBadge state="Failed"        intent="error" />
      <StateBadge state="Void"          intent="neutral" />
    </div>
  ),
};

export const DarkMode: Story = {
  args: { state: 'Processing', intent: 'info', nextState: 'Approval' },
  decorators: [
    (Story) => (
      <div data-theme="dark" style={{ padding: '1rem', background: 'var(--ds-color-surface-default)' }}>
        <Story />
      </div>
    ),
  ],
};
```

- [ ] **Step 3: Create `state-badge.mdx` registry spec**

File: `packages/registry/components/state-badge.mdx`

```mdx
---
id: state-badge
type: component
version: 0.2.0
status: beta
variants: [info, warning, success, error, neutral]
sizes: [sm, md]
accessibility:
  role: "status"
  wcag:
    - "1.4.3 Contrast (Minimum)"
    - "4.1.2 Name, Role, Value"
  aria:
    - "role='status' announces state changes to screen readers"
    - "aria-label='Status: {state}' or 'Status: {state}, next: {nextState}' describes full transition"
  notes: "Color alone is never the sole indicator — text label is always visible. The → separator is aria-hidden; both state labels are included in aria-label."
ai-prompt: "StateBadge renders a semantic pill for workflow state labels. Five intents (info, warning, success, error, neutral) drive colour from DS feedback tokens. Accepts an optional nextState that renders inline as 'state → nextState' inside the same pill. Use in tables and detail panels anywhere a workflow step needs visual status encoding. Always set intent based on the semantic meaning of the state, not its display colour."
---

# StateBadge

A semantic status pill for workflow states. Intent drives colour via DS feedback tokens. Optionally shows a next-state transition inline within the pill.

## Usage

```tsx
import { StateBadge } from '@ds-foundation/react';

<StateBadge state="Processing" intent="info" />
<StateBadge state="Processing" intent="info" nextState="Approval" />
<StateBadge state="Failed" intent="error" />
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `state` | `string` | required | Current state display label |
| `intent` | `StateBadgeIntent` | required | Colour intent |
| `nextState` | `string` | — | Optional next state; renders `state → nextState` |
| `size` | `StateBadgeSize` | `'md'` | `sm` or `md` |

## Intent → Colour

| Intent | Semantic meaning | Example states |
|--------|-----------------|----------------|
| `info` | In-progress, neutral positive | Processing, Draft, Extracted |
| `warning` | Requires attention | Needs Approval, On Hold, Under Review |
| `success` | Complete/approved | Approved |
| `error` | Failed/rejected | Failed, Rejected |
| `neutral` | Terminal/inactive | Void, Cancelled |

## Accessibility

`role="status"` announces transitions to assistive technology. The `→` arrow is `aria-hidden`; the full label including next-state is in `aria-label`.
```

- [ ] **Step 4: Add barrel export to `index.ts`**

Append to `packages/react/src/index.ts`:
```
export * from './StateBadge';
```

- [ ] **Step 5: Run type check and validation**

```bash
cd /Users/apacheco/Documents/Projects/ds-foundation
npm run typecheck
npm run ci:validate
```

Expected: both pass.

- [ ] **Step 6: Add changeset**

```bash
npx changeset
```

- Select `@ds-foundation/react`, patch bump
- Summary: `feat: add StateBadge component`

- [ ] **Step 7: Commit**

```bash
git add packages/react/src/StateBadge.tsx packages/react/src/StateBadge.stories.tsx \
        packages/registry/components/state-badge.mdx packages/react/src/index.ts \
        .changeset/
git commit -m "feat(react): add StateBadge component"
```

---

## Task 4: TSW migration — consume from DS package

**Files:**
- Delete: `payments-tsw-phase1/client/src/components/atoms/DetailCard.tsx`
- Delete: `payments-tsw-phase1/client/src/components/atoms/IconButton.tsx`
- Create: `payments-tsw-phase1/client/src/lib/iconButtonVariants.ts`
- Modify: `payments-tsw-phase1/client/src/lib/design-tokens.ts`
- Modify: `payments-tsw-phase1/client/src/components/atoms/Badge.tsx`
- Modify: `payments-tsw-phase1/client/src/components/organisms/results-table/TransactionCard.tsx`
- Modify: `payments-tsw-phase1/client/src/components/results-table/TransactionRow.tsx`
- Modify: `payments-tsw-phase1/client/src/components/organisms/results-table/TableToolbar.tsx`
- Modify: `payments-tsw-phase1/client/src/components/organisms/results-table/TablePagination.tsx`
- Modify: `payments-tsw-phase1/client/src/components/organisms/results-table/ColumnPicker.tsx`

> **No package version bump needed.** TSW uses `"@ds-foundation/react": "file:../ds-foundation/packages/react"` — changes in ds-foundation are immediately visible after the DS tasks complete. No `npm install` or `package.json` change required.

- [ ] **Step 1: Delete local `DetailCard.tsx` and `IconButton.tsx`**

```bash
cd /Users/apacheco/Documents/Projects/payments-tsw-phase1
rm client/src/components/atoms/DetailCard.tsx
rm client/src/components/atoms/IconButton.tsx
```

- [ ] **Step 2: Create `iconButtonVariants.ts` shim**

File: `client/src/lib/iconButtonVariants.ts`

```typescript
import type { IconButtonVariant } from '@ds-foundation/react';

const TSW_VARIANT_MAP = {
  view:      'info',
  confirm:   'success',
  complete:  'primary',
  reextract: 'warning',
  fail:      'danger',
  default:   'neutral',
} as const satisfies Record<string, IconButtonVariant>;

export type TswIconButtonVariant = keyof typeof TSW_VARIANT_MAP;

export const toIconButtonVariant = (v: TswIconButtonVariant): IconButtonVariant =>
  TSW_VARIANT_MAP[v];
```

- [ ] **Step 3: Add `getTxStatusIntent` to `design-tokens.ts`**

Open `client/src/lib/design-tokens.ts` and add at the end of the file:

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

- [ ] **Step 4: Update `Badge.tsx` — replace `StatusBadgeContent` with `StateBadge`**

In `client/src/components/atoms/Badge.tsx`:

1. Add imports at the top:
   ```typescript
   import { StateBadge } from '@ds-foundation/react';
   import { getTxStatusIntent } from '@/lib/design-tokens';
   ```

2. **Delete the entire `StatusBadgeContent` function** (roughly lines 46–80). This includes the function declaration, the `if (!overdue && status === 'Failed')` early-return block, the `cls` ternary chain, and the returned JSX.

3. In `BadgeInner` (the component function), find the `case "status":` branch which currently returns `<StatusBadgeContent .../>`. Replace that entire `case "status":` branch with:
   ```tsx
   if (variant === 'status') {
     const { status, next, overdue, className } = props as StatusBadgeProps;
     if (overdue) {
       // Existing overdue markup — keep exactly as-is (clock icon + error border/bg/text classes)
       return (
         <div className={cn("flex items-center gap-1 text-xs flex-wrap", className)}>
           <span className="inline-flex items-center h-8 px-3 rounded-[var(--ds-radius-lg)] font-medium text-xs border bg-[var(--ds-color-feedback-error-bg)] border-[var(--ds-color-feedback-error-border)] text-[var(--ds-color-feedback-error-text)]">
             <Clock className="w-2.5 h-2.5 inline mr-1" aria-hidden="true" />
             {status}
           </span>
           <ArrowRight className="w-2.5 h-2.5 text-[var(--ds-color-text-secondary)]" aria-hidden="true" />
           <span className="text-[var(--ds-color-text-secondary)] text-xs">{next}</span>
         </div>
       );
     }
     return (
       <div className={cn("flex items-center", className)}>
         <StateBadge state={status} intent={getTxStatusIntent(status)} nextState={next} />
       </div>
     );
   }
   ```

4. Remove now-unused imports: `StatusPill` (if only used by the removed `StatusBadgeContent`).

> **Note on intentional changes:**
> - `Failed` no longer delegates to `StatusPill` — it now uses `StateBadge intent="error"`. Deliberate simplification.
> - `Pending` and `On Hold` shift from neutral → warning colour. Minor intentional improvement.

- [ ] **Step 5: Update `TransactionCard.tsx` and `TransactionRow.tsx` — DetailCard import**

In both files, change:
```typescript
import { DetailCard } from '@/components/atoms/DetailCard';
```
to:
```typescript
import { DetailCard } from '@ds-foundation/react';
```

No prop changes needed.

- [ ] **Step 6: Update IconButton import paths and variant calls in 4 files**

**`TransactionRow.tsx`** (only file with `variant=` props — needs import swap + shim):

```typescript
// Change import:
import { IconButton } from '@ds-foundation/react';
import { toIconButtonVariant } from '@/lib/iconButtonVariants';

// Wrap every variant= prop with toIconButtonVariant():
// Before: <IconButton variant="view" ... />
// After:  <IconButton variant={toIconButtonVariant('view')} ... />
// Variants present: 'view', 'confirm', 'complete', 'reextract', 'fail'
```

**`TableToolbar.tsx`, `TablePagination.tsx`, `ColumnPicker.tsx`** (no `variant=` props — import swap only, no shim needed):

```typescript
// Change import only — no variant props to update:
import { IconButton } from '@ds-foundation/react';
```

Files:
- `client/src/components/organisms/results-table/TransactionRow.tsx`
- `client/src/components/organisms/results-table/TableToolbar.tsx`
- `client/src/components/organisms/results-table/TablePagination.tsx`
- `client/src/components/organisms/results-table/ColumnPicker.tsx`

- [ ] **Step 7: TypeScript check**

```bash
cd /Users/apacheco/Documents/Projects/payments-tsw-phase1
npm run check
```

Expected: zero TypeScript errors.

- [ ] **Step 8: Verify no stale local imports remain**

```bash
cd /Users/apacheco/Documents/Projects/payments-tsw-phase1
grep -r "@/components/atoms/DetailCard\|@/components/atoms/IconButton" client/src/
```

Expected: no output (zero matches).

- [ ] **Step 9: Verify StatusBadgeContent is gone from Badge.tsx**

```bash
grep "StatusBadgeContent" client/src/components/atoms/Badge.tsx
```

Expected: no output.

- [ ] **Step 10: Commit**

```bash
git add client/src/lib/iconButtonVariants.ts \
        client/src/lib/design-tokens.ts \
        client/src/components/atoms/Badge.tsx \
        client/src/components/organisms/results-table/TransactionCard.tsx \
        client/src/components/organisms/results-table/TransactionRow.tsx \
        client/src/components/organisms/results-table/TableToolbar.tsx \
        client/src/components/organisms/results-table/TablePagination.tsx \
        client/src/components/organisms/results-table/ColumnPicker.tsx
git rm client/src/components/atoms/DetailCard.tsx \
       client/src/components/atoms/IconButton.tsx
git commit -m "feat: migrate atoms to @ds-foundation/react (DetailCard, IconButton, StateBadge)"
```

---

## Acceptance Criteria Checklist

Run these after all tasks complete:

**DS Foundation:**
- [ ] `npm run typecheck` passes in `ds-foundation/`
- [ ] `npm run ci:validate` passes in `ds-foundation/`
- [ ] `DetailCard`, `IconButton`, `StateBadge` appear in Storybook (run `npm run dev:storybook` in `ds-foundation/`)
- [ ] All three components use `--ds-` prefixed tokens only — no Tailwind classes, no `cn()` usage
- [ ] Each component file has `// @ds-component` annotation at top

**TSW:**
- [ ] `npm run check` passes in `payments-tsw-phase1/`
- [ ] `grep -r "@/components/atoms/DetailCard\|@/components/atoms/IconButton" client/src/` returns zero matches
- [ ] `grep "StatusBadgeContent" client/src/components/atoms/Badge.tsx` returns zero matches
- [ ] Browser: non-overdue status badges render correctly, overdue badge is unchanged
- [ ] Browser: IconButton hover states render correctly (neutral rest, variant on hover)
