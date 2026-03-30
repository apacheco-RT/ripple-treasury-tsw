# Phase 1: DS Token Uplift Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all custom tokens with `@ds-foundation/tokens`, upgrade Tailwind v3 → v4, and swap `next-themes` for a `data-theme` attribute approach — with zero visual regression against `main`.

**Architecture:** Install `@ds-foundation/tokens` from GitHub Packages, import its CSS vars and Tailwind `@theme` block, then systematically replace every hardcoded hex value and custom CSS variable in the codebase with DS-foundation token references. `design-tokens.ts` becomes a thin re-export wrapper so existing consumers don't break. `use-theme.ts` is rewritten to toggle `data-theme` on `<html>` and drop the `next-themes` dependency.

**Tech Stack:** React 18, Vite 7, Tailwind CSS v4, `@ds-foundation/tokens` v0.2.0, GitHub Packages (`npm.pkg.github.com`), TypeScript 5.6

---

## Files Modified

| File | Action | Why |
|---|---|---|
| `package.json` | Modify | Upgrade tailwindcss to v4, add @ds-foundation/tokens, remove next-themes |
| `tailwind.config.ts` | Delete | Replaced by CSS-first Tailwind v4 config in index.css |
| `postcss.config.js` | Modify | Tailwind v4 uses its own PostCSS plugin |
| `client/src/index.css` | Modify | Add DS-foundation imports; remove custom M3 CSS vars and v3 @layer blocks |
| `client/src/lib/design-tokens.ts` | Rewrite | Thin re-export wrapper mapping DS-foundation token CSS vars to existing API |
| `client/src/hooks/use-theme.ts` | Rewrite | Drop next-themes; toggle data-theme on <html>; persist to localStorage |
| `client/src/main.tsx` (or App root) | Modify | Remove ThemeProvider from next-themes |
| `.npmrc` | Create | Scoped GitHub Packages registry config (gitignored) |
| `.gitignore` | Modify | Add .npmrc |
| `README.md` | Modify | Add Local Setup section documenting NODE_AUTH_TOKEN |

---

## Task 1: Create Branch + shadcn/Radix Audit

**Files:** None modified yet — audit only.

- [ ] **Step 1: Cut the branch**

```bash
cd ~/Documents/Projects
git clone git@github.com:apacheco-RT/Payments-TSW.git payments-tsw-token-uplift
cd payments-tsw-token-uplift
git checkout -b feat/ds-token-uplift
```

- [ ] **Step 2: Audit shadcn/ui Tailwind v4 compatibility**

```bash
# Check current shadcn/ui version
cat package.json | grep -E '"@radix-ui|tailwindcss|class-variance-authority|tailwind-merge|tailwindcss-animate"'
```

Expected: Current pinned versions. Cross-reference each against the Tailwind v4 compatibility matrix:
- shadcn/ui components: v4 compatible as of early 2025 — confirm your installed version is ≥ latest shadcn CLI output
- `tailwindcss-animate`: maintained for v4 — verify `npm info tailwindcss-animate peerDependencies`
- `tw-animate-css`: v4 compatible
- `class-variance-authority`: framework-agnostic, always compatible
- `tailwind-merge`: v4 compatible from v2.3+

```bash
npm info tailwindcss-animate peerDependencies
npm info tailwind-merge version
```

- [ ] **Step 3: Document audit result**

Create `docs/superpowers/migration-notes/tailwind-v4-audit.md` with findings. If any package has a hard blocker against v4, stop here and surface to Alex before proceeding.

- [ ] **Step 4: Commit audit**

```bash
git add docs/superpowers/migration-notes/tailwind-v4-audit.md
git commit -m "docs: Tailwind v4 + shadcn compatibility audit"
```

---

## Task 2: Verify @ds-foundation/tokens Export Paths

**Files:** None modified.

- [ ] **Step 1: Configure .npmrc temporarily to install the package**

```bash
# Create a temp .npmrc to install — we'll formalize it in Task 4
echo '@ds-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' > .npmrc
```

Make sure `NODE_AUTH_TOKEN` is set in your shell:
```bash
echo $NODE_AUTH_TOKEN   # Should print your GitHub PAT with read:packages scope
```

If it's not set: `export NODE_AUTH_TOKEN=ghp_your_token_here`

- [ ] **Step 2: Install and inspect exports**

```bash
npm install @ds-foundation/tokens@0.2.0
cat node_modules/@ds-foundation/tokens/package.json | jq '.exports'
```

Expected output (confirm these paths exist):
```json
{
  ".": { ... },
  "./css": { "import": "./build/css/tokens.css", ... },
  "./tailwind": { "import": "./build/tailwind/tokens.css", ... },
  "./css/dark": { "import": "./build/css/dark.css", ... },
  "./scss": { ... },
  "./json": { ... }
}
```

- [ ] **Step 3: Confirm the CSS var prefix**

```bash
head -30 node_modules/@ds-foundation/tokens/build/css/tokens.css
```

Expected: Variables prefixed `--ds-color-*`, `--ds-spacing-*`, `--ds-font-*`, etc. Note the exact prefix — every token reference in the codebase will use this prefix.

- [ ] **Step 4: Note findings and continue**

No commit needed. Export paths confirmed. Proceed to Task 3.

---

## Task 3: Tailwind v3 → v4 Upgrade

**Files:** `package.json`, `tailwind.config.ts` (deleted), `postcss.config.js`, `vite.config.ts`

- [ ] **Step 1: Run the official Tailwind v4 upgrade codemod**

```bash
npx @tailwindcss/upgrade@next
```

This codemod:
- Upgrades `tailwindcss` in `package.json` to v4
- Migrates utility class renames across all source files (e.g., `shadow-sm` → `shadow-xs` where applicable)
- Converts `tailwind.config.ts` content into a CSS `@theme` block
- Updates PostCSS config

Review every change the codemod made before accepting:
```bash
git diff
```

- [ ] **Step 2: Verify package.json changes**

```bash
cat package.json | grep tailwindcss
```

Expected: `"tailwindcss": "^4.x.x"`

- [ ] **Step 3: Check the generated CSS @theme block**

The codemod creates a CSS file (likely updates `client/src/index.css`) with an `@theme` block. Review it:
```bash
git diff client/src/index.css
```

We will replace this generated `@theme` block with `@ds-foundation/tokens/tailwind` in Task 5 — for now just confirm the codemod ran.

- [ ] **Step 4: Update vite.config.ts for Tailwind v4**

Tailwind v4 uses `@tailwindcss/vite` instead of the PostCSS plugin. Check if the codemod handled this:

```bash
cat vite.config.ts
```

If `@tailwindcss/vite` is not already imported, update manually:
```ts
// vite.config.ts
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),   // ← add this
    // ... other plugins
  ],
})
```

Also remove tailwindcss from postcss.config.js if the codemod left it there:
```js
// postcss.config.js — after v4 migration
export default {
  plugins: {
    autoprefixer: {},
    // tailwindcss removed — now handled by Vite plugin
  },
}
```

- [ ] **Step 5: Install updated dependencies**

```bash
npm install
```

- [ ] **Step 6: Smoke test — dev server starts without errors**

```bash
npm run dev
```

Expected: Server starts at `http://localhost:5000`. Open it. Pages may look broken (custom tokens not yet wired) but the server should not crash with a build error.

If there are build errors from the codemod output, fix them before proceeding. Common issues:
- Renamed utilities not caught by codemod — check `npm run dev` output for unknown utility warnings
- Missing `@tailwindcss/vite` package: `npm install @tailwindcss/vite`

- [ ] **Step 7: Commit Tailwind v4 upgrade**

```bash
git add -A
git commit -m "chore: upgrade Tailwind CSS v3 → v4 via official codemod"
```

---

## Task 4: Install @ds-foundation/tokens + Auth Setup

**Files:** `.npmrc` (create), `.gitignore` (modify), `README.md` (modify)

- [ ] **Step 1: Formalize .npmrc (gitignored)**

```bash
cat .npmrc
# Should already exist from Task 2 — verify contents match:
# @ds-foundation:registry=https://npm.pkg.github.com
# //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

If it doesn't exist:
```bash
echo '@ds-foundation:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' > .npmrc
```

- [ ] **Step 2: Add .npmrc to .gitignore**

```bash
echo '.npmrc' >> .gitignore
git diff .gitignore   # Confirm .npmrc appears
```

- [ ] **Step 3: Confirm @ds-foundation/tokens is installed**

```bash
ls node_modules/@ds-foundation/tokens
```

If not present (was only temporarily installed in Task 2):
```bash
npm install @ds-foundation/tokens@0.2.0
```

- [ ] **Step 4: Add Local Setup section to README.md**

Open `README.md` and add after the existing setup section:

```markdown
## Local Setup

### GitHub Packages Authentication

This project consumes packages from GitHub Packages under the `@ds-foundation` scope.

1. Create a GitHub Personal Access Token with `read:packages` scope:
   https://github.com/settings/tokens/new?scopes=read:packages

2. Create `.npmrc` in the project root (this file is gitignored — never commit it):
   ```
   @ds-foundation:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=YOUR_TOKEN_HERE
   ```

3. Or set the token as an environment variable and use the template:
   ```bash
   export NODE_AUTH_TOKEN=ghp_your_token_here
   echo '@ds-foundation:registry=https://npm.pkg.github.com
   //npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}' > .npmrc
   ```

### CI

Add `NODE_AUTH_TOKEN` as a GitHub Actions secret. The `.npmrc` template with `${NODE_AUTH_TOKEN}` will pick it up automatically.
```

- [ ] **Step 5: Commit**

```bash
git add .gitignore README.md
git commit -m "chore: add GitHub Packages auth setup for @ds-foundation scope"
```

---

## Task 5: Wire DS-Foundation Token Imports

**Files:** `client/src/index.css`

- [ ] **Step 1: Open index.css and identify what to replace**

```bash
wc -l client/src/index.css
head -50 client/src/index.css
```

The file currently contains:
- Ripple brand CSS variables (`--ripple-*`)
- M3 shape/component/typography/spacing/elevation/state layer vars
- Dark/light mode `:root` and `body.light-mode` blocks
- Tailwind v3 `@layer base` / `@layer components` blocks (may have been migrated by codemod)

- [ ] **Step 2: Replace the CSS variable blocks with DS-foundation imports**

At the very top of `client/src/index.css`, before any existing content, add:

```css
/* DS-Foundation token imports — source of truth for all design tokens */
@import "@ds-foundation/tokens/css";
@import "@ds-foundation/tokens/tailwind";
```

Then remove:
- All `--ripple-*` custom property declarations
- All `--m3-*` custom property declarations
- The `body.light-mode` override block (DS-foundation handles this via `data-theme`)
- The existing `@theme` block if the Tailwind codemod generated one (replaced by the DS import)

Keep:
- `@import "tailwindcss";` (the v4 base import)
- Any app-specific structural CSS not covered by tokens (e.g., scrollbar styles, print styles)

- [ ] **Step 3: Verify the imports resolve**

```bash
npm run dev
```

Expected: Build succeeds. Token CSS vars are available. Check in browser devtools:
```
document.documentElement.style.getPropertyValue('--ds-color-brand-primary')
```
Should return a value.

- [ ] **Step 4: Commit**

```bash
git add client/src/index.css
git commit -m "feat: wire @ds-foundation/tokens CSS vars and Tailwind @theme block"
```

---

## Task 6: Build Token Mapping Table

**Files:** `docs/superpowers/migration-notes/token-mapping.md` (create)

This task produces the mapping artifact that guides Task 7. Do not skip it.

- [ ] **Step 1: Open design-tokens.ts and list all token categories**

```bash
cat client/src/lib/design-tokens.ts
```

- [ ] **Step 2: For each category, find the DS-foundation equivalent**

```bash
# List all DS-foundation CSS vars
grep -E '^\s*--ds-' node_modules/@ds-foundation/tokens/build/css/tokens.css | head -80
```

- [ ] **Step 3: Create the mapping table**

Create `docs/superpowers/migration-notes/token-mapping.md`:

```markdown
# Token Mapping: TSW Custom → DS-Foundation

## Color — Brand
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `#1a56db` (Ripple blue) | `var(--ds-color-brand-primary)` | |
| `colors.ripple.blue` | `var(--ds-color-brand-primary)` | |

## Color — Surface
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `surface.page` | `var(--ds-color-surface-page)` | |
| `surface.card` | `var(--ds-color-surface-default)` | |
| `surface.elevated` | `var(--ds-color-surface-raised)` | |
| `surface.overlay` | `var(--ds-color-surface-overlay)` | |
| `surface.inset` | `var(--ds-color-surface-sunken)` | |

## Color — Feedback
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `success` color | `var(--ds-color-feedback-success)` | |
| `error` color | `var(--ds-color-feedback-error)` | |
| `warning` color | `var(--ds-color-feedback-warning)` | |

## Spacing
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `spacing.pagePadding` | `var(--ds-spacing-6)` (1.5rem) | Verify match |
| `spacing.sectionGap` | `var(--ds-spacing-8)` (2rem) | Verify match |
| `spacing.cardPadding` | `var(--ds-spacing-4)` (1rem) | Verify match |

## Typography
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `typography.xs` | `var(--ds-font-size-xs)` | |
| `typography.sm` | `var(--ds-font-size-sm)` | |
| `typography.base` | `var(--ds-font-size-md)` | |
| `typography.lg` | `var(--ds-font-size-lg)` | |

## Border Radius
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `radius.pill` | `var(--ds-radius-full)` | |
| `radius.card` | `var(--ds-radius-xl)` | |
| `radius.input` | `var(--ds-radius-md)` | |
| `radius.badge` | `var(--ds-radius-lg)` | |

## Shadows
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `shadows.panel` | `var(--ds-shadow-md)` | |
| `shadows.dropdown` | `var(--ds-shadow-lg)` | |
| `shadows.modal` | `var(--ds-shadow-xl)` | |

## Z-Index
| TSW token | DS-foundation var | Notes |
|---|---|---|
| `zIndex.base` | `var(--ds-z-base)` | |
| `zIndex.raised` | `var(--ds-z-raised)` | |
| `zIndex.overlay` | `var(--ds-z-overlay)` | |
| `zIndex.dropdown` | `var(--ds-z-dropdown)` | |
| `zIndex.modal` | `var(--ds-z-modal)` | |
| `zIndex.toast` | `var(--ds-z-toast)` | |

## ⚠ No DS-Foundation Equivalent — Flag to NEW_COMPONENTS.md
| TSW token | Notes |
|---|---|
| Risk level colors (critical/high/medium/low/none) | Domain-specific — no DS equivalent |
| Process stage colors (create/antifraud/approvals/status/history) | Domain-specific — no DS equivalent |
```

Fill in the actual values by cross-referencing `design-tokens.ts` with the DS-foundation CSS output. Where a direct match doesn't exist, note the closest alternative.

- [ ] **Step 4: Commit mapping table**

```bash
git add docs/superpowers/migration-notes/token-mapping.md
git commit -m "docs: TSW → DS-foundation token mapping table"
```

---

## Task 7: Rewrite design-tokens.ts as a Thin Wrapper

**Files:** `client/src/lib/design-tokens.ts`

This preserves all existing imports across the codebase while routing them to DS-foundation values.

- [ ] **Step 1: Replace design-tokens.ts content**

Rewrite `client/src/lib/design-tokens.ts` to re-export DS-foundation CSS variable references:

```ts
// client/src/lib/design-tokens.ts
// Thin re-export wrapper — maps TSW token API to @ds-foundation/tokens CSS vars.
// Consumers import from here unchanged. Token values are now sourced from DS-foundation.

export const colors = {
  brand: {
    primary: 'var(--ds-color-brand-primary)',
    primaryHover: 'var(--ds-color-brand-primary-hover)',
    secondary: 'var(--ds-color-brand-secondary)',
  },
  surface: {
    page: 'var(--ds-color-surface-page)',
    card: 'var(--ds-color-surface-default)',
    elevated: 'var(--ds-color-surface-raised)',
    overlay: 'var(--ds-color-surface-overlay)',
    inset: 'var(--ds-color-surface-sunken)',
    border: 'var(--ds-color-border-default)',
  },
  text: {
    primary: 'var(--ds-color-text-primary)',
    secondary: 'var(--ds-color-text-secondary)',
    tertiary: 'var(--ds-color-text-tertiary)',
    disabled: 'var(--ds-color-text-disabled)',
    inverse: 'var(--ds-color-text-inverse)',
  },
  feedback: {
    success: 'var(--ds-color-feedback-success)',
    error: 'var(--ds-color-feedback-error)',
    warning: 'var(--ds-color-feedback-warning)',
    info: 'var(--ds-color-feedback-info)',
  },
  // Domain-specific tokens with no DS-foundation equivalent.
  // Retained as local values — documented in NEW_COMPONENTS.md.
  risk: {
    critical: '#dc2626',
    high: '#f97316',
    medium: '#eab308',
    low: '#22c55e',
    none: '#6b7280',
  },
  processStage: {
    create: '#6366f1',
    antifraud: '#f97316',
    approvals: '#3b82f6',
    status: '#22c55e',
    history: '#6b7280',
  },
} as const

export const typography = {
  size: {
    xs: 'var(--ds-font-size-xs)',
    sm: 'var(--ds-font-size-sm)',
    base: 'var(--ds-font-size-md)',
    md: 'var(--ds-font-size-md)',
    lg: 'var(--ds-font-size-lg)',
    xl: 'var(--ds-font-size-xl)',
    '2xl': 'var(--ds-font-size-2xl)',
  },
  weight: {
    normal: 'var(--ds-font-weight-regular)',
    medium: 'var(--ds-font-weight-medium)',
    semibold: 'var(--ds-font-weight-semibold)',
    bold: 'var(--ds-font-weight-bold)',
  },
} as const

export const spacing = {
  pagePadding: 'var(--ds-spacing-6)',
  sectionGap: 'var(--ds-spacing-8)',
  cardPadding: 'var(--ds-spacing-4)',
  rowHeight: 'var(--ds-spacing-12)',
} as const

export const radius = {
  pill: 'var(--ds-radius-full)',
  card: 'var(--ds-radius-xl)',
  input: 'var(--ds-radius-md)',
  badge: 'var(--ds-radius-lg)',
  sm: 'var(--ds-radius-sm)',
} as const

export const shadows = {
  panel: 'var(--ds-shadow-md)',
  dropdown: 'var(--ds-shadow-lg)',
  modal: 'var(--ds-shadow-xl)',
} as const

export const zIndex = {
  base: 'var(--ds-z-base)',
  raised: 'var(--ds-z-raised)',
  overlay: 'var(--ds-z-overlay)',
  dropdown: 'var(--ds-z-dropdown)',
  sticky: 'var(--ds-z-sticky)',
  modal: 'var(--ds-z-modal)',
  toast: 'var(--ds-z-toast)',
} as const
```

Map each value using the token-mapping.md table from Task 6. Adjust the exact `--ds-*` variable names to match what was confirmed in Task 2 Step 3.

- [ ] **Step 2: Run TypeScript check**

```bash
npm run check
```

Expected: Zero errors. If there are type errors from narrowed or changed shapes, fix them before proceeding.

- [ ] **Step 3: Commit**

```bash
git add client/src/lib/design-tokens.ts
git commit -m "feat: convert design-tokens.ts to DS-foundation token re-export wrapper"
```

---

## Task 8: Sweep Hardcoded Values from Components

**Files:** All component files under `client/src/components/` and `client/src/pages/`

- [ ] **Step 1: Find all remaining hardcoded hex values**

```bash
grep -rn '#[0-9a-fA-F]\{3,6\}' client/src --include='*.tsx' --include='*.ts' --include='*.css' | grep -v 'design-tokens.ts' | grep -v '.test.'
```

Review each match. For each one:
- If there's a DS-foundation equivalent: replace with `var(--ds-*)` or import from `design-tokens.ts`
- If it's a domain-specific value (risk colors, process stage colors): confirm it matches the retained values in `design-tokens.ts`

- [ ] **Step 2: Find remaining custom CSS var references**

```bash
grep -rn 'var(--ripple\|var(--m3\|var(--surface' client/src --include='*.tsx' --include='*.ts' --include='*.css'
```

Replace each with the DS-foundation equivalent per the token-mapping.md table.

- [ ] **Step 3: Find remaining Tailwind config custom class references**

```bash
grep -rn 'text-ripple\|bg-ripple\|border-ripple\|text-surface\|bg-surface\|shadow-panel\|shadow-dropdown\|shadow-modal' client/src --include='*.tsx'
```

These were custom Tailwind classes from `tailwind.config.ts`. Replace with DS-foundation Tailwind utilities (e.g., `text-[var(--ds-color-brand-primary)]` or a direct DS utility class if one exists).

- [ ] **Step 4: Run TypeScript check**

```bash
npm run check
```

Expected: Zero errors.

- [ ] **Step 5: Run dev server and spot-check visually**

```bash
npm run dev
```

Open the app. Pages should look correct. If something looks broken, trace which token is missing.

- [ ] **Step 6: Commit**

```bash
git add client/src/components client/src/pages
git commit -m "feat: replace hardcoded values and custom CSS vars with DS-foundation tokens"
```

---

## Task 9: Theme System Migration (next-themes → data-theme)

**Files:** `client/src/hooks/use-theme.ts`, `client/src/main.tsx` (or wherever ThemeProvider wraps the app)

> **Higher risk than other tasks.** If this causes regressions, it can be reverted independently. Keep the commit for this task separate from Task 8.

- [ ] **Step 1: Find all next-themes imports**

```bash
grep -rn 'next-themes' client/src --include='*.tsx' --include='*.ts'
```

Note every file that imports from `next-themes`.

- [ ] **Step 2: Rewrite use-theme.ts**

Replace the entire file:

```ts
// client/src/hooks/use-theme.ts
// Manages light/dark theme via data-theme attribute on <html>.
// DS-foundation tokens swap automatically when data-theme changes.

import React from 'react'

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'
const DEFAULT_THEME: Theme = 'dark'

function getStoredTheme(): Theme {
  if (typeof window === 'undefined') return DEFAULT_THEME
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : DEFAULT_THEME
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
  localStorage.setItem(STORAGE_KEY, theme)
}

// Apply theme synchronously before first paint to avoid flash.
// Called once at module load — safe because this only runs in the browser.
if (typeof window !== 'undefined') {
  applyTheme(getStoredTheme())
}

export function useTheme() {
  const [theme, setThemeState] = React.useState<Theme>(() => getStoredTheme())

  function setTheme(next: Theme) {
    applyTheme(next)
    setThemeState(next)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  return { theme, setTheme, toggleTheme }
}
```

Add `import React from 'react'` at the top if not already present.

- [ ] **Step 3: Remove ThemeProvider from the app root**

Open the file that wraps the app in `ThemeProvider` (likely `client/src/main.tsx` or `client/src/App.tsx`):

```bash
grep -rn 'ThemeProvider' client/src --include='*.tsx'
```

Remove the `ThemeProvider` import and wrapper. The new `useTheme` hook applies the theme via DOM attribute — no provider needed.

- [ ] **Step 4: Update any components that used useTheme from next-themes**

```bash
grep -rn 'useTheme' client/src --include='*.tsx' --include='*.ts' | grep -v 'use-theme'
```

For any component that called `useTheme()` from `next-themes`, update the import:
```ts
// Before
import { useTheme } from 'next-themes'

// After
import { useTheme } from '@/hooks/use-theme'
```

The API surface is the same (`theme`, `setTheme`) plus `toggleTheme` as a convenience.

- [ ] **Step 5: Remove next-themes from package.json**

```bash
npm uninstall next-themes
```

- [ ] **Step 6: TypeScript check**

```bash
npm run check
```

Expected: Zero errors.

- [ ] **Step 7: Test theme toggle manually**

```bash
npm run dev
```

- Open the app. Find the theme toggle button. Click it.
- Verify `<html>` gets `data-theme="light"` attribute in devtools Elements panel.
- Verify colors change across the UI.
- Reload the page — verify the selected theme persists.
- Test on routes: `/`, `/prototype`, `/research`, `/specs`.

- [ ] **Step 8: Commit**

```bash
git add client/src/hooks/use-theme.ts client/src/main.tsx package.json package-lock.json
# Add any other files modified in steps 3-4
git commit -m "feat: replace next-themes with data-theme attribute toggle for DS-foundation compat"
```

---

## Task 10: Visual Verification + README + PR

**Files:** `README.md` (already updated in Task 4), no other file changes.

- [ ] **Step 1: Take baseline screenshots of main**

```bash
git stash  # temporarily shelve branch changes
npm run dev  # serve main
```

Take screenshots at 1440px, 768px, 375px for each route:
- `/` (Landing)
- `/research`
- `/specs`
- `/prototype`
- `/strategy`
- `/export`

Also capture with feature flags enabled: `?rlusdStrip=1`, `?fraudSpotlight=1`, `?riskColumn=1`.

```bash
git stash pop  # restore branch
```

- [ ] **Step 2: Take branch screenshots and compare**

```bash
npm run dev  # serve branch
```

Take screenshots at the same breakpoints and routes. Compare side-by-side.

**Check for:**
- Surface colors (background, card, border)
- Text colors (primary, secondary, muted)
- Brand colors (buttons, links, highlights)
- Spacing and layout
- Shadows and radius
- Feature-flagged UI (risk column, fraud spotlight banner)

Any visual delta is a regression — trace the token, fix it, re-screenshot.

- [ ] **Step 3: Toggle light mode and compare**

Click the theme toggle on each route. Verify light mode renders correctly on both `main` and branch.

- [ ] **Step 4: Check browser console for errors**

Open devtools on each route. Console should be clean — no `var(--*)` resolution warnings, no missing token warnings.

- [ ] **Step 5: Run final TypeScript check**

```bash
npm run check
```

Expected: Zero errors.

- [ ] **Step 6: Final commit if any fixes were made**

```bash
git add -A
git commit -m "fix: visual regression corrections from Phase 1 verification"
```

- [ ] **Step 7: Push branch**

```bash
git push -u origin feat/ds-token-uplift
```

- [ ] **Step 8: Open PR**

Title: `feat: Phase 1 — DS-foundation token uplift + Tailwind v4`

PR description should include:
- Summary of what changed (token swap, Tailwind v4, theme system)
- Link to spec: `docs/superpowers/specs/2026-03-30-ds-foundation-uplift-design.md`
- Confirmation of success criteria met (no hex values, all `var(--ds-*)`, light/dark works)
- Screenshots at 1440/768/375px (before + after side-by-side)

---

## Phase 1 Success Criteria Checklist

Before merging:

- [ ] `npm run check` — zero TypeScript errors
- [ ] `npm run dev` — all 6 routes load without console errors
- [ ] All 5 feature flags render correctly
- [ ] Visual comparison at 1440/768/375px: identical to main
- [ ] Light/dark toggle works via `data-theme` on `<html>`
- [ ] `grep -rn '#[0-9a-fA-F]\{6\}' client/src` returns only domain-specific risk/process colors
- [ ] `grep -rn 'next-themes' client/src` returns zero results
- [ ] `.npmrc` is listed in `.gitignore`
- [ ] `README.md` has Local Setup section with NODE_AUTH_TOKEN instructions
