import { useState } from 'react'
import { Key, Plus, Copy, Trash2, Eye, EyeOff, Check, Clock } from 'lucide-react'

interface Token {
  id: number
  name: string
  prefix: string
  created: string
  lastUsed: string
  scopes: string[]
}

const TOKENS: Token[] = [
  { id: 1, name: 'CI/CD Pipeline', prefix: 'rdfl_****Kx8m', created: '2026-01-15', lastUsed: '2026-03-25', scopes: ['read', 'write'] },
  { id: 2, name: 'Mobile App', prefix: 'rdfl_****Bp3n', created: '2026-02-20', lastUsed: '2026-03-24', scopes: ['read'] },
  { id: 3, name: 'Analytics Integration', prefix: 'rdfl_****Wq7j', created: '2026-03-01', lastUsed: '2026-03-20', scopes: ['read', 'analytics'] },
]

export function ApiTokensPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [visibleId, setVisibleId] = useState<number | null>(null)

  function handleCopy(token: Token) {
    navigator.clipboard.writeText(token.prefix).catch(() => {})
    setCopiedId(token.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Key className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">API Tokens</h3>
            <p className="mt-1 text-sm text-neutral-500">Manage API access tokens for integrations</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Generate Token
        </button>
      </div>

      <div className="rounded-lg bg-amber-50 p-4">
        <p className="text-xs text-amber-800">API tokens provide full access to your account. Never share tokens publicly or commit them to version control.</p>
      </div>

      <div className="space-y-3">
        {TOKENS.map((token) => (
          <div key={token.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{token.name}</h4>
                <div className="mt-1 flex items-center gap-2">
                  <code className="rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-600">
                    {visibleId === token.id ? 'rdfl_a1b2c3d4e5f6g7h8' : token.prefix}
                  </code>
                  <button type="button" onClick={() => setVisibleId(visibleId === token.id ? null : token.id)} className="text-neutral-400 hover:text-neutral-600">
                    {visibleId === token.id ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                  <button type="button" onClick={() => handleCopy(token)} className="text-neutral-400 hover:text-neutral-600">
                    {copiedId === token.id ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>
              <button type="button" className="rounded-lg p-2 text-neutral-400 hover:bg-red-50 hover:text-red-500">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 flex items-center gap-4 text-xs text-neutral-400">
              <span>Created: {token.created}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />Last used: {token.lastUsed}</span>
              <div className="flex gap-1">
                {token.scopes.map((scope) => (
                  <span key={scope} className="rounded bg-neutral-100 px-1.5 py-0.5 text-xs text-neutral-500">{scope}</span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
