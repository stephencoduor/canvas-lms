import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { listThemes, getTheme, type ThemeConfig } from '@/lib/theme-registry'

type Mode = 'light' | 'dark'

interface ThemeContextValue {
  /** Light or dark mode */
  mode: Mode
  toggleMode: () => void
  /** Active theme id */
  themeId: string
  /** Active theme config */
  theme: ThemeConfig
  /** Switch to a different theme by id */
  setTheme: (id: string) => void
  /** All available themes */
  availableThemes: ThemeConfig[]
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

const MODE_STORAGE_KEY = 'redefiners-theme'
const THEME_ID_STORAGE_KEY = 'redefiners-theme-id'
const DEFAULT_THEME_ID = 'dark-accent'

/** Load a theme CSS file from /themes/{id}.css */
function loadThemeCSS(themeId: string) {
  const existingLink = document.getElementById('theme-css-link') as HTMLLinkElement | null
  const href = `${import.meta.env.BASE_URL}themes/${themeId}.css`

  if (existingLink) {
    existingLink.href = href
  } else {
    const link = document.createElement('link')
    link.id = 'theme-css-link'
    link.rel = 'stylesheet'
    link.href = href
    document.head.appendChild(link)
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>(() => {
    try {
      const stored = localStorage.getItem(MODE_STORAGE_KEY)
      if (stored === 'dark' || stored === 'light') return stored
    } catch {
      // localStorage unavailable
    }
    return 'light'
  })

  const [themeId, setThemeId] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(THEME_ID_STORAGE_KEY)
      if (stored && getTheme(stored)) return stored
    } catch {
      // localStorage unavailable
    }
    return DEFAULT_THEME_ID
  })

  // Apply dark/light mode class
  useEffect(() => {
    const root = document.documentElement
    if (mode === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    try {
      localStorage.setItem(MODE_STORAGE_KEY, mode)
    } catch {
      // localStorage unavailable
    }
  }, [mode])

  // Apply theme id attribute and load CSS
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    loadThemeCSS(themeId)
    try {
      localStorage.setItem(THEME_ID_STORAGE_KEY, themeId)
    } catch {
      // localStorage unavailable
    }
  }, [themeId])

  const toggleMode = useCallback(() => {
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  const setTheme = useCallback((id: string) => {
    const found = getTheme(id)
    if (found) {
      setThemeId(id)
    }
  }, [])

  const theme = useMemo(() => {
    return getTheme(themeId) ?? getTheme(DEFAULT_THEME_ID)!
  }, [themeId])

  const availableThemes = useMemo(() => listThemes(), [])

  const value = useMemo<ThemeContextValue>(
    () => ({ mode, toggleMode, themeId, theme, setTheme, availableThemes }),
    [mode, toggleMode, themeId, theme, setTheme, availableThemes],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return ctx
}
