# Theme System — Switchable & Installable Themes

## Context

The ReDefiners static HTML designs have two themes implemented in separate Git branches:
- **`main`** — Teal theme (light green palette)
- **`theme/modern-dark-accent`** — Dark accent theme (dark teal sidebar, mint background, orange CTAs)

The React SPA currently uses the dark accent theme exclusively. We need a system that allows:
1. **Switching** between installed themes at runtime
2. **Installing** new themes from theme packages
3. **Admin control** over which themes are available

---

## Architecture

### Theme = CSS Variables + Config JSON

Each theme is a package containing:
```
themes/
├── dark-accent/
│   ├── theme.json         # Theme metadata
│   ├── variables.css      # CSS custom properties
│   ├── logo.png           # Theme-specific logo
│   └── preview.png        # Theme preview thumbnail
├── teal-classic/
│   ├── theme.json
│   ├── variables.css
│   ├── logo.png
│   └── preview.png
└── ocean-blue/
    ├── theme.json
    ├── variables.css
    ├── logo.png
    └── preview.png
```

### theme.json Schema
```json
{
  "id": "dark-accent",
  "name": "Modern Dark Accent",
  "description": "Dark teal sidebar with mint background and orange CTAs",
  "version": "1.0.0",
  "author": "ReDefiners",
  "preview": "preview.png",
  "logo": "logo.png",
  "variables": "variables.css",
  "sidebar": {
    "background": "linear-gradient(180deg, #163B32 0%, #0F2922 100%)",
    "textColor": "rgba(255,255,255,0.75)",
    "activeGradient": "linear-gradient(135deg, #2DB88A 0%, #25A07A 100%)"
  },
  "supports": ["light", "dark"]
}
```

### variables.css (per theme)
```css
/* dark-accent theme */
:root[data-theme="dark-accent"] {
  --color-primary-900: #0F2922;
  --color-primary-800: #163B32;
  --color-primary-700: #1E4D42;
  --color-accent-green: #2DB88A;
  --color-accent-orange: #FF6B35;
  --color-page: #D4EFE6;
  --color-surface: #FFFFFF;
  --sidebar-bg: linear-gradient(180deg, #163B32 0%, #0F2922 100%);
  --sidebar-text: rgba(255,255,255,0.75);
  --sidebar-active: linear-gradient(135deg, #2DB88A 0%, #25A07A 100%);
  --sidebar-section-header: rgba(124, 181, 164, 0.7);
  --topbar-bg: #FFFFFF;
  --topbar-border: #E5E7EB;
  --card-bg: #FFFFFF;
  --card-shadow: 0 2px 8px rgba(0,0,0,0.06);
  --card-radius: 16px;
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}

/* teal-classic theme */
:root[data-theme="teal-classic"] {
  --color-primary-900: #0D4F4F;
  --color-primary-800: #1A6B6B;
  --color-primary-700: #2D8A8A;
  --color-accent-green: #2DB88A;
  --color-accent-orange: #E67E22;
  --color-page: #E8F5F0;
  --color-surface: #FFFFFF;
  --sidebar-bg: linear-gradient(180deg, #1A6B6B 0%, #0D4F4F 100%);
  --sidebar-text: rgba(255,255,255,0.8);
  --sidebar-active: linear-gradient(135deg, #2DB88A 0%, #1FA87A 100%);
  --sidebar-section-header: rgba(255,255,255,0.4);
  --topbar-bg: #FFFFFF;
  --topbar-border: #D1E5DD;
  --card-bg: #FFFFFF;
  --card-shadow: 0 2px 6px rgba(0,0,0,0.04);
  --card-radius: 12px;
  --font-heading: 'Poppins', sans-serif;
  --font-body: 'Inter', sans-serif;
}
```

---

## Implementation Plan

### Phase 1: Theme Context & Variable System

#### 1a. Create ThemeRegistry
`src/lib/theme-registry.ts`
```typescript
export interface ThemeConfig {
  id: string
  name: string
  description: string
  version: string
  author: string
  preview: string
  logo: string
  sidebar: {
    background: string
    textColor: string
    activeGradient: string
    sectionHeaderColor: string
  }
  supports: ('light' | 'dark')[]
}

// Built-in themes
export const BUILT_IN_THEMES: ThemeConfig[] = [
  {
    id: 'dark-accent',
    name: 'Modern Dark Accent',
    description: 'Dark teal sidebar with mint background',
    // ... full config
  },
  {
    id: 'teal-classic',
    name: 'Classic Teal',
    description: 'Traditional teal palette with clean lines',
    // ... full config
  },
]

export function getTheme(id: string): ThemeConfig | undefined
export function listThemes(): ThemeConfig[]
export function registerTheme(config: ThemeConfig): void
```

#### 1b. Update ThemeContext
Extend existing `src/contexts/ThemeContext.tsx`:
```typescript
interface ThemeContextValue {
  // Existing
  mode: 'light' | 'dark'
  toggleMode: () => void
  // New
  themeId: string
  theme: ThemeConfig
  setTheme: (id: string) => void
  availableThemes: ThemeConfig[]
}
```

- Store active theme ID in localStorage key `redefiners-theme-id`
- On theme change: set `data-theme` attribute on `<html>`, load theme CSS variables
- Default theme: `dark-accent`

#### 1c. Update Components to Use CSS Variables
Replace ALL hardcoded colors in components with CSS variables:

| Component | Current | After |
|-----------|---------|-------|
| Sidebar background | `linear-gradient(180deg, #163B32...)` | `var(--sidebar-bg)` |
| Sidebar text | `rgba(255,255,255,0.75)` | `var(--sidebar-text)` |
| Active nav item | `linear-gradient(135deg, #2DB88A...)` | `var(--sidebar-active)` |
| Section headers | `rgba(124,181,164,0.7)` | `var(--sidebar-section-header)` |
| TopBar bg | `white` | `var(--topbar-bg)` |
| Page bg | `#D4EFE6` | `var(--color-page)` |
| Card bg | `white` | `var(--card-bg)` |
| Card shadow | hardcoded | `var(--card-shadow)` |
| Card radius | `16px` | `var(--card-radius)` |

### Phase 2: Theme Switcher UI

#### 2a. Theme Picker in Settings
Add theme grid to AccountSettingsPage:
- Show theme cards with preview thumbnails
- Active theme has green check badge
- Click to switch (instant apply via CSS variables)

#### 2b. Theme Picker in Admin
Add to BrandConfigsPage (already exists at `/admin/themes`):
- List installed themes
- Set default theme for institution
- Upload new theme package

#### 2c. Quick Theme Toggle
Add to TopBar (next to dark mode toggle):
- Palette icon button
- Dropdown with theme list
- Instant preview on hover

### Phase 3: Theme Package Format

#### 3a. Theme Package (.rdt file)
A `.rdt` (ReDefiners Theme) file is a ZIP containing:
```
my-theme.rdt (ZIP)
├── theme.json          # Required: metadata
├── variables.css       # Required: CSS custom properties
├── logo.png            # Optional: sidebar logo
├── preview.png         # Optional: theme preview thumbnail
├── fonts/              # Optional: custom fonts
│   ├── CustomFont.woff2
│   └── CustomFont.css
└── overrides.css       # Optional: additional CSS overrides
```

#### 3b. Theme Install Flow
1. Admin uploads `.rdt` file at `/admin/themes`
2. System extracts and validates `theme.json`
3. CSS variables file is loaded dynamically
4. Theme appears in the theme picker
5. Admin can set as default or allow user choice

#### 3c. Theme Storage
- Built-in themes: bundled in `public/themes/`
- Installed themes: stored in Canvas file storage or localStorage
- Theme preference: per-user in localStorage, per-institution in Canvas API

### Phase 4: Port Teal Classic Theme

Port the `main` branch design to a theme package:

#### Current differences between branches:

| Property | Dark Accent (current) | Teal Classic (main branch) |
|----------|----------------------|---------------------------|
| Sidebar bg | `#163B32 → #0F2922` | `#1A6B6B → #0D4F4F` |
| Page bg | `#D4EFE6` (mint) | `#E8F5F0` (lighter mint) |
| Accent orange | `#FF6B35` | `#E67E22` |
| Card radius | 16px | 12px |
| Card shadow | heavier | lighter |
| Section headers | teal-tinted | white-tinted |
| Logo | Same | Same |

Create `public/themes/teal-classic/variables.css` with the main branch's colors.

---

## File Changes Required

### New Files
```
src/lib/theme-registry.ts          # Theme config types + built-in themes
public/themes/dark-accent/
  ├── theme.json
  ├── variables.css
  └── preview.png
public/themes/teal-classic/
  ├── theme.json
  ├── variables.css
  └── preview.png
```

### Modified Files
```
src/contexts/ThemeContext.tsx       # Add themeId, setTheme, availableThemes
src/components/layout/Sidebar.tsx  # Use var(--sidebar-bg) instead of hardcoded
src/components/layout/SidebarItem.tsx  # Use var(--sidebar-active)
src/components/layout/TopBar.tsx   # Add theme picker dropdown
src/components/layout/AppLayout.tsx # Use var(--color-page)
src/pages/settings/AccountSettingsPage.tsx  # Add theme picker grid
src/pages/admin/BrandConfigsPage.tsx  # Theme upload/management
src/index.css                      # Move hardcoded colors to :root[data-theme]
```

### Estimated Effort
| Phase | Effort |
|-------|--------|
| Phase 1: CSS Variable System | 8h |
| Phase 2: Theme Switcher UI | 6h |
| Phase 3: Theme Package Format | 8h |
| Phase 4: Port Teal Classic | 4h |
| **Total** | **26h** |

---

## Theme Switching Flow

```
User clicks theme in Settings
        ↓
ThemeContext.setTheme('teal-classic')
        ↓
localStorage.setItem('redefiners-theme-id', 'teal-classic')
        ↓
document.documentElement.setAttribute('data-theme', 'teal-classic')
        ↓
CSS variables update instantly (no page reload)
        ↓
All components re-render with new colors via var() references
```

## Admin Theme Management Flow

```
Admin uploads .rdt file at /admin/themes
        ↓
System extracts theme.json + variables.css
        ↓
Validates required fields (id, name, variables)
        ↓
Stores theme files in public/themes/{id}/
        ↓
Registers theme in ThemeRegistry
        ↓
Theme appears in all users' theme picker
        ↓
Admin can set as institution default
```
