import { useState } from 'react'
import { Accessibility, ToggleLeft, ToggleRight, CheckCircle2, AlertTriangle } from 'lucide-react'

const SETTINGS = [
  { id: 'high-contrast', label: 'High Contrast Mode', description: 'Enable high contrast colors for better visibility.', enabled: true },
  { id: 'screen-reader', label: 'Screen Reader Optimization', description: 'Optimize content for screen reader compatibility.', enabled: true },
  { id: 'keyboard-nav', label: 'Enhanced Keyboard Navigation', description: 'Enable skip links and keyboard shortcuts.', enabled: false },
  { id: 'font-scaling', label: 'Font Scaling', description: 'Allow users to adjust font sizes across the platform.', enabled: true },
  { id: 'captions', label: 'Auto-Generated Captions', description: 'Automatically generate captions for video content.', enabled: false },
  { id: 'alt-text', label: 'Alt Text Enforcement', description: 'Require alt text for all uploaded images.', enabled: true },
]

const COMPLIANCE = [
  { standard: 'WCAG 2.1 Level AA', status: 'compliant' as const, details: 'All pages meet AA criteria.' },
  { standard: 'Section 508', status: 'compliant' as const, details: 'Federal accessibility requirements met.' },
  { standard: 'WCAG 2.1 Level AAA', status: 'partial' as const, details: '12 of 28 criteria met. Working on remaining items.' },
]

export function AdminAccessibilityPage() {
  const [settings, setSettings] = useState(SETTINGS)

  function toggle(id: string) {
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Accessibility className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Accessibility Settings</h3>
          <p className="mt-1 text-sm text-neutral-500">Configure platform accessibility options</p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Accessibility Features</h4></div>
        <div className="divide-y">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-neutral-800">{s.label}</p>
                <p className="text-xs text-neutral-500">{s.description}</p>
              </div>
              <button type="button" onClick={() => toggle(s.id)}>
                {s.enabled ? <ToggleRight className="h-6 w-6 text-primary-600" /> : <ToggleLeft className="h-6 w-6 text-neutral-300" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Compliance Status</h4></div>
        <div className="divide-y">
          {COMPLIANCE.map((c) => (
            <div key={c.standard} className="flex items-center gap-4 px-5 py-4">
              {c.status === 'compliant' ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-amber-500" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{c.standard}</p>
                <p className="text-xs text-neutral-500">{c.details}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${c.status === 'compliant' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {c.status === 'compliant' ? 'Compliant' : 'Partial'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
