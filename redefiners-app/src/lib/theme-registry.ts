export interface ThemeColors {
  sidebarBg: string
  sidebarText: string
  sidebarActive: string
  sidebarActiveShadow: string
  sidebarSectionHeader: string
  pageBg: string
  accentGreen: string
  accentOrange: string
  primaryDark: string
}

export interface ThemeConfig {
  id: string
  name: string
  description: string
  version: string
  author: string
  colors: ThemeColors
  supports: ('light' | 'dark')[]
}

export const BUILT_IN_THEMES: ThemeConfig[] = [
  {
    id: 'dark-accent',
    name: 'Modern Dark Accent',
    description: 'Dark teal sidebar with mint background and orange CTAs',
    version: '1.0.0',
    author: 'ReDefiners',
    colors: {
      sidebarBg: '#163B32',
      sidebarText: 'rgba(255,255,255,0.75)',
      sidebarActive: '#2DB88A',
      sidebarActiveShadow: 'rgba(45,184,138,0.3)',
      sidebarSectionHeader: 'rgba(124,181,164,0.7)',
      pageBg: '#D4EFE6',
      accentGreen: '#2DB88A',
      accentOrange: '#FF6B35',
      primaryDark: '#163B32',
    },
    supports: ['light', 'dark'],
  },
  {
    id: 'teal-classic',
    name: 'Classic Teal',
    description: 'Traditional teal palette with clean lines and softer tones',
    version: '1.0.0',
    author: 'ReDefiners',
    colors: {
      sidebarBg: '#1A6B6B',
      sidebarText: 'rgba(255,255,255,0.8)',
      sidebarActive: '#2DB88A',
      sidebarActiveShadow: 'rgba(45,184,138,0.25)',
      sidebarSectionHeader: 'rgba(255,255,255,0.4)',
      pageBg: '#E8F5F0',
      accentGreen: '#2DB88A',
      accentOrange: '#E67E22',
      primaryDark: '#1A6B6B',
    },
    supports: ['light', 'dark'],
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Navy sidebar with light blue background and blue accents',
    version: '1.0.0',
    author: 'ReDefiners',
    colors: {
      sidebarBg: '#1E3A5F',
      sidebarText: 'rgba(255,255,255,0.8)',
      sidebarActive: '#3B82F6',
      sidebarActiveShadow: 'rgba(59,130,246,0.3)',
      sidebarSectionHeader: 'rgba(147,197,253,0.6)',
      pageBg: '#E8F0FE',
      accentGreen: '#3B82F6',
      accentOrange: '#0EA5E9',
      primaryDark: '#1E3A5F',
    },
    supports: ['light', 'dark'],
  },
]

const customThemes: ThemeConfig[] = []

export function getTheme(id: string): ThemeConfig | undefined {
  return [...BUILT_IN_THEMES, ...customThemes].find((t) => t.id === id)
}

export function listThemes(): ThemeConfig[] {
  return [...BUILT_IN_THEMES, ...customThemes]
}

export function getThemeById(id: string): ThemeConfig | undefined {
  return getTheme(id)
}

export function registerTheme(config: ThemeConfig): void {
  const idx = customThemes.findIndex((t) => t.id === config.id)
  if (idx >= 0) {
    customThemes[idx] = config
  } else {
    customThemes.push(config)
  }
}
