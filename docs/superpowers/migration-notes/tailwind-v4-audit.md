# Tailwind v4 + shadcn/ui Compatibility Audit

**Date:** 2026-03-30
**Branch:** feat/ds-token-uplift
**Auditor:** Claude Code (automated)
**Status:** DONE_WITH_CONCERNS — no hard blockers, two version bumps required before proceeding

---

## Current Tailwind Version

| Package | Installed (package.json) | Latest | Notes |
|---|---|---|---|
| `tailwindcss` | `^3.4.17` | `4.2.2` | **Must upgrade** — this is the core migration target |
| `@tailwindcss/vite` | `^4.1.18` (devDep) | `4.2.2` | Already present — confirms v4 migration was partially started |
| `autoprefixer` | `^10.4.20` (devDep) | — | Required for v3; **not needed in v4** (built-in), can be removed |
| `postcss` | `^8.4.47` (devDep) | — | Required for v3; in v4, Vite plugin replaces PostCSS pipeline |

**Key observation:** `@tailwindcss/vite` is already installed at a v4 version (4.1.18), but `tailwindcss` is pinned to v3.4.17. The project is in a split state — v4 plugin present, v3 core still active. This is a known intermediate state when beginning a v4 migration.

---

## Radix UI Packages

All `@radix-ui/*` packages are framework-agnostic headless components. They emit no CSS and carry no dependency on Tailwind. They are **v4 compatible unconditionally** — Tailwind version has zero bearing on Radix behavior.

| Package | Installed | Latest | v4 Compatible |
|---|---|---|---|
| `@radix-ui/react-accordion` | `^1.2.4` | `1.2.12` | Yes |
| `@radix-ui/react-alert-dialog` | `^1.1.7` | `1.1.15` | Yes |
| `@radix-ui/react-aspect-ratio` | `^1.1.3` | latest | Yes |
| `@radix-ui/react-avatar` | `^1.1.4` | latest | Yes |
| `@radix-ui/react-checkbox` | `^1.1.5` | latest | Yes |
| `@radix-ui/react-collapsible` | `^1.1.4` | latest | Yes |
| `@radix-ui/react-context-menu` | `^2.2.7` | latest | Yes |
| `@radix-ui/react-dialog` | `^1.1.7` | `1.1.15` | Yes |
| `@radix-ui/react-dropdown-menu` | `^2.1.7` | latest | Yes |
| `@radix-ui/react-hover-card` | `^1.1.7` | latest | Yes |
| `@radix-ui/react-label` | `^2.1.3` | latest | Yes |
| `@radix-ui/react-menubar` | `^1.1.7` | latest | Yes |
| `@radix-ui/react-navigation-menu` | `^1.2.6` | latest | Yes |
| `@radix-ui/react-popover` | `^1.1.7` | latest | Yes |
| `@radix-ui/react-progress` | `^1.1.3` | latest | Yes |
| `@radix-ui/react-radio-group` | `^1.2.4` | latest | Yes |
| `@radix-ui/react-scroll-area` | `^1.2.4` | latest | Yes |
| `@radix-ui/react-select` | `^2.1.7` | `2.2.6` | Yes |
| `@radix-ui/react-separator` | `^1.1.3` | latest | Yes |
| `@radix-ui/react-slider` | `^1.2.4` | latest | Yes |
| `@radix-ui/react-slot` | `^1.2.0` | `1.2.4` | Yes |
| `@radix-ui/react-switch` | `^1.1.4` | latest | Yes |
| `@radix-ui/react-tabs` | `^1.1.4` | latest | Yes |
| `@radix-ui/react-toast` | `^1.2.7` | latest | Yes |
| `@radix-ui/react-toggle` | `^1.1.3` | latest | Yes |
| `@radix-ui/react-toggle-group` | `^1.1.3` | latest | Yes |
| `@radix-ui/react-tooltip` | `^1.2.0` | latest | Yes |

Verdict: All 27 Radix packages are clear. No action required.

---

## Tailwind Utility Packages

| Package | Installed | Latest | v4 Compatible | Notes |
|---|---|---|---|---|
| `tailwindcss-animate` | `^1.0.7` (dep) | `1.0.7` | **Conditional** | Peer dep declares `tailwindcss >=3.0.0 || insiders` — does NOT explicitly declare v4 support. Functionally works but this package is **superseded by `tw-animate-css`** for v4 projects. See recommendation below. |
| `tw-animate-css` | `^1.2.5` (dep) | `1.4.0` | Yes | The v4-native animation utility. Should become the sole animation package post-migration. |
| `class-variance-authority` | `^0.7.1` (dep) | `0.7.1` | Yes | Framework-agnostic. Emits class strings only. No Tailwind dependency. |
| `tailwind-merge` | `^2.6.1` (dep) | `3.5.0` | Yes | v4 compatible from v2.3+. Current install (2.6.1) is within that range. Latest is 3.5.0 — consider upgrading for v4-specific merge logic improvements. |

---

## shadcn/ui Components

shadcn/ui components are installed directly into `client/src/components/ui/` — they are not a versioned package. The shadcn CLI scaffolds components as source files, so Tailwind compatibility depends on the component code itself, not a package version.

**Status:** shadcn/ui officially supports Tailwind v4 as of early 2025. The components use standard utility classes that map cleanly to v4. No hard incompatibility expected.

**Action required (Task 2):** After the Tailwind upgrade, run `npx shadcn diff` or manually inspect component files for any v3-only utility usage (e.g., `divide-*`, `ring-offset-*`, legacy `opacity-*` modifiers). These will surface as rendering regressions, not build errors.

---

## Summary: Version Bumps Required Before Proceeding

| Package | Current | Target | Reason |
|---|---|---|---|
| `tailwindcss` | `^3.4.17` | `^4.2.2` | Core migration — this is the whole point |
| `tailwind-merge` | `^2.6.1` | `^3.5.0` | Recommended — v4 class format changes improve merge accuracy |
| `tailwindcss-animate` | `^1.0.7` | remove | Superseded by `tw-animate-css` (already installed). Keeping both causes duplicate animation classes. |

---

## Hard Blockers

**None.** All packages audited are compatible with Tailwind v4 at their current or next minor versions. Proceed to Task 2.

---

## Split-State Warning

The repo currently has `@tailwindcss/vite@4.1.18` installed alongside `tailwindcss@3.4.17`. This is an unstable intermediate state. Do not run `npm run dev` in this state expecting a clean build — the Vite plugin will conflict with the v3 core. The Tailwind upgrade in Task 2 resolves this immediately.

---

## Next Steps

### Task 2: Verify @ds-foundation/tokens export paths

1. Install `@ds-foundation/tokens` from GitHub Packages
2. Inspect the package exports map (`package.json#exports`)
3. Confirm CSS variable prefix aligns with what the app expects
4. Validate that all token entry points resolve correctly before wiring them into the app

### Task 3: Tailwind v3 → v4 upgrade

1. `npm install tailwindcss@^4.2.2 tailwind-merge@^3.5.0`
2. `npm uninstall tailwindcss-animate` (keep `tw-animate-css`)
3. `npm uninstall autoprefixer postcss` (optional — v4 no longer needs them)
4. Resolve `@tailwindcss/vite` conflict now that `tailwindcss` core is on v4
5. Update `tailwind.config.ts` → migrate to `@import "tailwindcss"` CSS-first config
6. Replace `@tailwind base/components/utilities` directives with `@import "tailwindcss"`
7. Audit `client/src/components/ui/` for deprecated v3 utility classes
