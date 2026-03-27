import { useAccounts, useDeveloperKeys } from '@/hooks/useAdmin'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { KeyRound } from 'lucide-react'

function maskKey(key: string): string {
  if (!key || key.length < 8) return '********'
  return key.slice(0, 4) + '****' + key.slice(-4)
}

export function DeveloperKeysPage() {
  const { data: accounts } = useAccounts()
  const accountId = accounts?.[0]?.id ?? 'self'
  const { data: keys, isLoading } = useDeveloperKeys(accountId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Developer Keys</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Manage API keys and integrations
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !keys || keys.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          heading="No developer keys"
          description="No API keys have been created."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Name</span>
            <span>Key</span>
            <span className="hidden sm:inline">Created</span>
            <span>Status</span>
          </div>
          {keys.map((key) => {
            const isActive = key.workflow_state === 'active'
            return (
              <div
                key={key.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {key.name || `Key ${key.id}`}
                  </p>
                </div>
                <code className="rounded bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                  {maskKey(key.api_key)}
                </code>
                <span className="hidden text-sm text-neutral-500 sm:inline">
                  {new Date(key.created_at).toLocaleDateString()}
                </span>
                <button
                  type="button"
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    isActive ? 'bg-emerald-500' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      isActive ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
