import { useState } from 'react'
import { Lock, ToggleLeft, ToggleRight, Shield, Key, Smartphone } from 'lucide-react'

const AUTH_SETTINGS = [
  { id: 'mfa', label: 'Multi-Factor Authentication', description: 'Require MFA for all admin accounts.', icon: Smartphone, enabled: true },
  { id: 'sso', label: 'Single Sign-On (SSO)', description: 'Enable SAML/OAuth SSO for institutional accounts.', icon: Key, enabled: true },
  { id: 'password-policy', label: 'Strong Password Policy', description: 'Enforce minimum 12 characters with complexity requirements.', icon: Lock, enabled: true },
  { id: 'session-timeout', label: 'Auto Session Timeout', description: 'Automatically log out users after 30 minutes of inactivity.', icon: Shield, enabled: false },
  { id: 'ip-whitelist', label: 'IP Whitelisting', description: 'Restrict admin access to approved IP addresses.', icon: Shield, enabled: false },
]

const LOGIN_PROVIDERS = [
  { name: 'Google Workspace', status: 'active' as const, users: 842 },
  { name: 'Microsoft Azure AD', status: 'active' as const, users: 356 },
  { name: 'LDAP', status: 'inactive' as const, users: 0 },
  { name: 'Canvas LMS', status: 'active' as const, users: 49 },
]

export function AuthenticationPage() {
  const [settings, setSettings] = useState(AUTH_SETTINGS)

  function toggle(id: string) {
    setSettings((prev) => prev.map((s) => s.id === id ? { ...s, enabled: !s.enabled } : s))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Lock className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Authentication</h3>
          <p className="mt-1 text-sm text-neutral-500">Configure authentication and security settings</p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Security Settings</h4></div>
        <div className="divide-y">
          {settings.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-neutral-100 p-2"><s.icon className="h-4 w-4 text-neutral-600" /></div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{s.label}</p>
                  <p className="text-xs text-neutral-500">{s.description}</p>
                </div>
              </div>
              <button type="button" onClick={() => toggle(s.id)}>
                {s.enabled ? <ToggleRight className="h-6 w-6 text-primary-600" /> : <ToggleLeft className="h-6 w-6 text-neutral-300" />}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Login Providers</h4></div>
        <div className="divide-y">
          {LOGIN_PROVIDERS.map((p) => (
            <div key={p.name} className="flex items-center justify-between px-5 py-4">
              <div>
                <p className="text-sm font-medium text-neutral-800">{p.name}</p>
                <p className="text-xs text-neutral-400">{p.users} users</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${p.status === 'active' ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                {p.status === 'active' ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
