import { useState } from 'react'
import { ShieldCheck, ToggleLeft, ToggleRight, Download, FileText, AlertTriangle } from 'lucide-react'

const PRIVACY_SETTINGS = [
  { id: 'data-collection', label: 'Analytics Data Collection', description: 'Collect anonymized usage analytics for platform improvement.', enabled: true },
  { id: 'cookie-consent', label: 'Cookie Consent Banner', description: 'Show cookie consent banner to all visitors.', enabled: true },
  { id: 'data-retention', label: 'Auto Data Retention (2 years)', description: 'Automatically purge user data older than 2 years.', enabled: false },
  { id: 'gdpr-exports', label: 'GDPR Data Export', description: 'Allow users to request and download their personal data.', enabled: true },
  { id: 'right-to-delete', label: 'Right to Deletion', description: 'Allow users to request account and data deletion.', enabled: true },
]

const DATA_REQUESTS = [
  { id: 1, type: 'Data Export', user: 'john.doe@student.edu', date: '2026-03-24', status: 'completed' as const },
  { id: 2, type: 'Account Deletion', user: 'jane.smith@student.edu', date: '2026-03-22', status: 'pending' as const },
  { id: 3, type: 'Data Export', user: 'alex.r@student.edu', date: '2026-03-20', status: 'completed' as const },
]

export function DataPrivacyPage() {
  const [settings, setSettings] = useState(PRIVACY_SETTINGS)

  function toggle(id: string) {
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Data Privacy</h3>
            <p className="mt-1 text-sm text-neutral-500">GDPR compliance and privacy settings</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs text-white hover:bg-primary-700">
          <Download className="h-3.5 w-3.5" /> Privacy Report
        </button>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Privacy Settings</h4></div>
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
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Data Requests</h4></div>
        <div className="divide-y">
          {DATA_REQUESTS.map((r) => (
            <div key={r.id} className="flex items-center gap-4 px-5 py-4">
              {r.status === 'pending' ? <AlertTriangle className="h-4 w-4 text-amber-500" /> : <FileText className="h-4 w-4 text-green-600" />}
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{r.type}</p>
                <p className="text-xs text-neutral-400">{r.user} &middot; {r.date}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${r.status === 'completed' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {r.status === 'completed' ? 'Completed' : 'Pending Review'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
