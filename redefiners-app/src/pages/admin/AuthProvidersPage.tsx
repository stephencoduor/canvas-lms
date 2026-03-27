import { useState } from 'react'
import { KeyRound, Plus, Settings, Trash2, CheckCircle2, XCircle } from 'lucide-react'

interface AuthProvider {
  id: string
  name: string
  type: 'LDAP' | 'SAML' | 'CAS' | 'OAuth2'
  enabled: boolean
  position: number
}

const INITIAL_PROVIDERS: AuthProvider[] = [
  { id: '1', name: 'Google OAuth', type: 'OAuth2', enabled: true, position: 1 },
  { id: '2', name: 'University LDAP', type: 'LDAP', enabled: true, position: 2 },
  { id: '3', name: 'Microsoft SAML', type: 'SAML', enabled: false, position: 3 },
]

const PROVIDER_TYPES = ['LDAP', 'SAML', 'CAS', 'OAuth2'] as const

export function AuthProvidersPage() {
  const [providers, setProviders] = useState<AuthProvider[]>(INITIAL_PROVIDERS)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<AuthProvider['type']>('OAuth2')

  const toggleProvider = (id: string) => {
    setProviders((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <KeyRound className="h-6 w-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-800">Authentication Providers</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Provider
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">New Authentication Provider</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Provider Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Company SSO"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Provider Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as AuthProvider['type'])}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {PROVIDER_TYPES.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Save Provider
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {providers.map((provider) => (
          <div key={provider.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {provider.enabled ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-neutral-300" />
                )}
                <div>
                  <h4 className="text-sm font-semibold text-neutral-800">{provider.name}</h4>
                  <p className="text-xs text-neutral-500">
                    Type: {provider.type} &middot; Position: {provider.position}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggleProvider(provider.id)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    provider.enabled ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      provider.enabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
