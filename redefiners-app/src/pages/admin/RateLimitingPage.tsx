import { useState } from 'react'
import { Gauge, Save } from 'lucide-react'

const CURRENT_LIMITS = [
  { label: 'API Requests (per user)', perMinute: 120, perHour: 3600 },
  { label: 'Login Attempts (per IP)', perMinute: 10, perHour: 60 },
  { label: 'File Uploads (per user)', perMinute: 15, perHour: 200 },
  { label: 'Report Generation', perMinute: 5, perHour: 30 },
]

export function RateLimitingPage() {
  const [apiPerMinute, setApiPerMinute] = useState('120')
  const [apiPerHour, setApiPerHour] = useState('3600')
  const [loginPerMinute, setLoginPerMinute] = useState('10')
  const [loginPerHour, setLoginPerHour] = useState('60')
  const [rateLimitEnabled, setRateLimitEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Gauge className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Rate Limiting</h3>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-neutral-800">Enable Rate Limiting</h4>
            <button
              type="button"
              onClick={() => setRateLimitEnabled(!rateLimitEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                rateLimitEnabled ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                  rateLimitEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>

          {rateLimitEnabled && (
            <div className="space-y-5">
              <div>
                <h5 className="mb-3 text-sm font-semibold text-neutral-700">API Requests (per user)</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-500">Per Minute</label>
                    <input
                      type="number"
                      value={apiPerMinute}
                      onChange={(e) => setApiPerMinute(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-500">Per Hour</label>
                    <input
                      type="number"
                      value={apiPerHour}
                      onChange={(e) => setApiPerHour(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              </div>
              <div>
                <h5 className="mb-3 text-sm font-semibold text-neutral-700">Login Attempts (per IP)</h5>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-500">Per Minute</label>
                    <input
                      type="number"
                      value={loginPerMinute}
                      onChange={(e) => setLoginPerMinute(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-xs font-medium text-neutral-500">Per Hour</label>
                    <input
                      type="number"
                      value={loginPerHour}
                      onChange={(e) => setLoginPerHour(e.target.value)}
                      className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Current Limits</h4>
          <div className="divide-y divide-neutral-100">
            {CURRENT_LIMITS.map((limit) => (
              <div key={limit.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-700">{limit.label}</span>
                <div className="flex gap-4">
                  <span className="text-xs text-neutral-500">{limit.perMinute}/min</span>
                  <span className="text-xs text-neutral-500">{limit.perHour}/hr</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Rate Limits
        </button>
      </div>
    </div>
  )
}
