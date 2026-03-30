// client/src/hooks/use-theme.ts
// Manages light/dark theme via data-theme attribute on <html>.
// DS-foundation tokens swap automatically when data-theme changes.

import { useState } from 'react'

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
if (typeof window !== 'undefined') {
  applyTheme(getStoredTheme())
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => getStoredTheme())

  function setTheme(next: Theme) {
    applyTheme(next)
    setThemeState(next)
  }

  function toggleTheme() {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  // `toggle` is an alias for `toggleTheme` — kept for backwards compat with UnifiedNav.
  return { theme, setTheme, toggleTheme, toggle: toggleTheme }
}
