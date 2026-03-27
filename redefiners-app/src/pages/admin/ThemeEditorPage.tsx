import { useState } from 'react'
import { Paintbrush, Save, RotateCcw } from 'lucide-react'

interface ColorSetting {
  key: string
  label: string
  defaultValue: string
}

const COLOR_SETTINGS: ColorSetting[] = [
  { key: 'primary', label: 'Primary Brand Color', defaultValue: '#1e40af' },
  { key: 'secondary', label: 'Secondary Color', defaultValue: '#059669' },
  { key: 'navBg', label: 'Navigation Background', defaultValue: '#1e293b' },
  { key: 'navText', label: 'Navigation Text', defaultValue: '#f8fafc' },
  { key: 'buttonPrimary', label: 'Primary Button', defaultValue: '#2563eb' },
  { key: 'buttonSecondary', label: 'Secondary Button', defaultValue: '#64748b' },
  { key: 'linkColor', label: 'Link Color', defaultValue: '#2563eb' },
  { key: 'headerBg', label: 'Header Background', defaultValue: '#ffffff' },
]

export function ThemeEditorPage() {
  const [colors, setColors] = useState<Record<string, string>>(
    Object.fromEntries(COLOR_SETTINGS.map((c) => [c.key, c.defaultValue]))
  )

  const updateColor = (key: string, value: string) => {
    setColors((prev) => ({ ...prev, [key]: value }))
  }

  const resetColors = () => {
    setColors(Object.fromEntries(COLOR_SETTINGS.map((c) => [c.key, c.defaultValue])))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Paintbrush className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Theme Editor</h3>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Color Pickers */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Color Settings</h4>
          <div className="space-y-4">
            {COLOR_SETTINGS.map((setting) => (
              <div key={setting.key} className="flex items-center justify-between">
                <label className="text-sm font-medium text-neutral-700">{setting.label}</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={colors[setting.key]}
                    onChange={(e) => updateColor(setting.key, e.target.value)}
                    className="h-8 w-8 cursor-pointer rounded border border-neutral-200"
                  />
                  <input
                    type="text"
                    value={colors[setting.key]}
                    onChange={(e) => updateColor(setting.key, e.target.value)}
                    className="w-24 rounded-lg border border-neutral-200 px-2 py-1 text-xs font-mono text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Theme
            </button>
            <button
              type="button"
              onClick={resetColors}
              className="flex items-center gap-2 rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        {/* Live Preview */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Live Preview</h4>
          <div className="overflow-hidden rounded-lg border border-neutral-200">
            {/* Nav Preview */}
            <div
              className="flex items-center justify-between px-4 py-3"
              style={{ backgroundColor: colors.navBg }}
            >
              <span className="text-sm font-semibold" style={{ color: colors.navText }}>
                ReDefiners LMS
              </span>
              <div className="flex gap-2">
                <span className="text-xs" style={{ color: colors.navText }}>Dashboard</span>
                <span className="text-xs" style={{ color: colors.navText }}>Courses</span>
              </div>
            </div>
            {/* Header Preview */}
            <div className="px-4 py-3" style={{ backgroundColor: colors.headerBg }}>
              <h5 className="text-sm font-semibold" style={{ color: colors.primary }}>
                Course Dashboard
              </h5>
              <p className="mt-1 text-xs text-neutral-500">Preview of your theme settings</p>
            </div>
            {/* Content Preview */}
            <div className="space-y-3 p-4">
              <a href="#preview" className="text-sm" style={{ color: colors.linkColor }}>
                Sample Link Text
              </a>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="rounded px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: colors.buttonPrimary }}
                >
                  Primary Button
                </button>
                <button
                  type="button"
                  className="rounded px-3 py-1.5 text-xs font-medium text-white"
                  style={{ backgroundColor: colors.buttonSecondary }}
                >
                  Secondary Button
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
