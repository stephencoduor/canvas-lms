import { Palette, Eye, Check, Star } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemePreview } from '@/components/shared/ThemePreview'

export function BrandConfigsPage() {
  const { themeId, setTheme, availableThemes } = useTheme()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Themes & Branding</h3>
          <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Manage the visual appearance of your Canvas instance
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {availableThemes.map((t) => {
          const isActive = themeId === t.id
          return (
            <div
              key={t.id}
              className="rounded-lg shadow-sm"
              style={{
                background: 'var(--color-surface)',
                ...(isActive
                  ? { boxShadow: '0 0 0 2px var(--color-accent-green)' }
                  : {}),
              }}
            >
              {/* Theme preview */}
              <div className="flex items-center justify-center overflow-hidden rounded-t-lg p-4"
                style={{ background: 'var(--color-surface-100)' }}
              >
                <ThemePreview theme={t} size="md" />
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                    {t.name}
                  </h4>
                  {isActive && (
                    <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
                      <Check className="h-3 w-3" />
                      Active
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                  {t.description}
                </p>

                {/* Color swatches */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-200"
                    style={{ backgroundColor: t.colors.sidebarBg }}
                    title="Sidebar"
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-200"
                    style={{ backgroundColor: t.colors.accentGreen }}
                    title="Accent"
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-200"
                    style={{ backgroundColor: t.colors.accentOrange }}
                    title="CTA"
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-neutral-200"
                    style={{ backgroundColor: t.colors.pageBg }}
                    title="Page Background"
                  />
                </div>

                {/* Meta info */}
                <div className="mt-2 flex items-center gap-3 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span>v{t.version}</span>
                  <span>by {t.author}</span>
                </div>

                <div className="mt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className="flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                    style={{
                      borderColor: 'var(--color-surface-200)',
                      color: 'var(--color-text-primary)',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    Preview
                  </button>
                  {!isActive && (
                    <button
                      type="button"
                      onClick={() => setTheme(t.id)}
                      className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-white transition-colors"
                      style={{
                        background: 'var(--color-accent-green)',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <Star className="h-3.5 w-3.5" />
                      Set as Default
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
