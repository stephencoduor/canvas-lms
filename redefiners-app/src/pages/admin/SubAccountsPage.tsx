import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Building2, Plus, ChevronDown, ChevronRight, Users, BookOpen } from 'lucide-react'

interface SubAccount {
  id: number
  name: string
  parent_account_id: number | null
  course_count?: number
  sub_account_count?: number
  default_user_storage_quota_mb?: number
}

export function SubAccountsPage() {
  const [expanded, setExpanded] = useState<Set<number>>(new Set())
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')

  const { data: accounts, isLoading, refetch } = useQuery<SubAccount[]>({
    queryKey: ['subAccounts'],
    queryFn: async () => {
      const response = await apiGet<SubAccount[]>(
        '/v1/accounts/self/sub_accounts',
        { recursive: true, per_page: 100 },
      )
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiPost('/v1/accounts/self/sub_accounts', {
        account: { name: newName },
      })
    },
    onSuccess: () => {
      setNewName('')
      setShowCreate(false)
      refetch()
    },
  })

  const toggleExpand = (id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  // Build tree
  const rootAccounts = (accounts ?? []).filter(
    (a) => !a.parent_account_id || !accounts?.some((p) => p.id === a.parent_account_id),
  )
  const childMap = new Map<number, SubAccount[]>()
  for (const a of accounts ?? []) {
    if (a.parent_account_id) {
      const children = childMap.get(a.parent_account_id) ?? []
      children.push(a)
      childMap.set(a.parent_account_id, children)
    }
  }

  const renderAccount = (account: SubAccount, depth: number) => {
    const children = childMap.get(account.id) ?? []
    const hasChildren = children.length > 0
    const isExpanded = expanded.has(account.id)

    return (
      <div key={account.id}>
        <div
          className="flex items-center gap-3 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
          style={{ paddingLeft: `${20 + depth * 24}px` }}
        >
          <button
            type="button"
            onClick={() => toggleExpand(account.id)}
            className="shrink-0 text-neutral-400"
            disabled={!hasChildren}
          >
            {hasChildren ? (
              isExpanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )
            ) : (
              <div className="h-4 w-4" />
            )}
          </button>
          <Building2 className="h-4 w-4 shrink-0 text-neutral-400" />
          <div className="flex-1">
            <p className="text-sm font-medium text-neutral-800">
              {account.name}
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <BookOpen className="h-3.5 w-3.5" />
              {account.course_count ?? 0}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              {account.sub_account_count ?? children.length}
            </span>
          </div>
        </div>
        {isExpanded && children.map((child) => renderAccount(child, depth + 1))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            Sub-Accounts
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Manage account hierarchy
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Create Sub-Account
        </button>
      </div>

      {showCreate && (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Account Name
              </label>
              <input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !newName.trim()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
          {createMutation.isError && (
            <p className="mt-2 text-sm text-red-600">Failed to create sub-account.</p>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : !accounts || accounts.length === 0 ? (
        <EmptyState
          icon={Building2}
          heading="No sub-accounts"
          description="No sub-accounts have been created yet."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            Account Hierarchy
          </div>
          {rootAccounts.map((account) => renderAccount(account, 0))}
        </div>
      )}
    </div>
  )
}
