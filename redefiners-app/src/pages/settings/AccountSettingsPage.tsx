import { useState } from 'react'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Settings, Save, Check } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { ThemePreview } from '@/components/shared/ThemePreview'

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
  { value: 'pt', label: 'Portuguese' },
  { value: 'ar', label: 'Arabic' },
  { value: 'zh', label: 'Chinese' },
]

const TIMEZONES = [
  { value: 'America/New_York', label: 'Eastern Time (US)' },
  { value: 'America/Chicago', label: 'Central Time (US)' },
  { value: 'America/Denver', label: 'Mountain Time (US)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (US)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Paris', label: 'Paris (CET)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
]

export function AccountSettingsPage() {
  const { data: user, isLoading } = useCurrentUser()
  const { themeId, setTheme, availableThemes } = useTheme()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [language, setLanguage] = useState('en')
  const [timezone, setTimezone] = useState('America/New_York')
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)

  // Initialize form when user data loads
  if (user && !name) {
    setName(user.name ?? '')
    setEmail(user.email ?? user.login_id ?? '')
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-primary-800">
          Account Settings
        </h3>
        <LoadingSkeleton type="row" count={8} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">
          Account Settings
        </h3>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm dark:bg-[var(--color-surface)]">
        <div className="space-y-5">
          {/* Theme Selection */}
          <div>
            <h4 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Theme
            </h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {availableThemes.map((t) => {
                const isActive = themeId === t.id
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTheme(t.id)}
                    className="group relative rounded-lg border-2 p-3 text-left transition-all"
                    style={{
                      borderColor: isActive ? 'var(--color-accent-green)' : 'var(--color-surface-200)',
                      background: 'var(--color-surface)',
                      cursor: 'pointer',
                    }}
                  >
                    {isActive && (
                      <span
                        className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-white"
                        style={{ background: 'var(--color-accent-green)' }}
                      >
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <div className="mb-2 overflow-hidden rounded">
                      <ThemePreview theme={t} size="sm" />
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-text-primary)' }}>
                      {t.name}
                    </p>
                    <p className="mt-0.5 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
                      {t.description}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Login Page Design */}
          <div className="border-t border-neutral-100 pt-5 dark:border-neutral-700">
            <h4 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              <i className="fa fa-sign-in-alt mr-2 text-xs" />Login Page Design
            </h4>
            <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
              {[
                { id: 'default', name: 'Classic', colors: ['#163B32', '#0F2922'] },
                { id: 'aurora', name: 'Aurora', colors: ['#163B32', '#2DB88A', '#16D2DD'] },
                { id: 'glass', name: 'Glass', colors: ['#0F2922', '#2DB88A', '#3B82F6'] },
                { id: 'campus', name: 'Campus', colors: ['#000000', '#163B32'] },
                { id: 'waves', name: 'Waves', colors: ['#0a0e17', '#2DB88A', '#16D2DD'] },
                { id: 'mosaic', name: 'Mosaic', colors: ['#163B32', '#FFFFFF'] },
              ].map(v => {
                const active = (localStorage.getItem('redefiners-login-variant') ?? 'default') === v.id
                return (
                  <button key={v.id}
                    onClick={() => { localStorage.setItem('redefiners-login-variant', v.id); window.location.reload() }}
                    className={`relative rounded-lg border-2 p-2 text-center transition-all ${active ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-600'}`}
                  >
                    {active && (
                      <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white">
                        <Check className="h-3 w-3" />
                      </span>
                    )}
                    <div className="mb-1.5 h-12 rounded overflow-hidden flex">
                      {v.colors.map((c, i) => (
                        <div key={i} className="flex-1" style={{ background: c }} />
                      ))}
                    </div>
                    <p className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>{v.name}</p>
                  </button>
                )
              })}
            </div>
            <p className="mt-2 text-xs" style={{ color: 'var(--color-text-secondary)' }}>
              Choose the login page design for your institution. Preview by visiting{' '}
              <a href="/login" className="text-emerald-600 hover:underline" target="_blank">/login</a>
            </p>
          </div>

          <div className="border-t border-neutral-100 pt-5 dark:border-neutral-700">
            {/* Name */}
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-[var(--color-surface)] dark:text-neutral-200"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-[var(--color-surface)] dark:text-neutral-200"
              />
            </div>

            {/* Language */}
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-[var(--color-surface)] dark:text-neutral-200"
              >
                {LANGUAGES.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Timezone */}
            <div className="mb-5">
              <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Timezone
              </label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100 dark:border-neutral-600 dark:bg-[var(--color-surface)] dark:text-neutral-200"
              >
                {TIMEZONES.map((tz) => (
                  <option key={tz.value} value={tz.value}>
                    {tz.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Notification Preferences */}
          <div className="border-t border-neutral-100 pt-5 dark:border-neutral-700">
            <h4 className="mb-3 text-sm font-semibold text-neutral-800 dark:text-neutral-200">
              Notification Preferences
            </h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Email Notifications
                </span>
                <button
                  type="button"
                  onClick={() => setEmailNotifications(!emailNotifications)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    emailNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      emailNotifications
                        ? 'translate-x-4'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">
                  Push Notifications
                </span>
                <button
                  type="button"
                  onClick={() => setPushNotifications(!pushNotifications)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    pushNotifications ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      pushNotifications
                        ? 'translate-x-4'
                        : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          {/* Save Button */}
          <div className="border-t border-neutral-100 pt-5 dark:border-neutral-700">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
