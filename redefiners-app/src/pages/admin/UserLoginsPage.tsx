import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost, apiDelete } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { KeyRound, Plus, Trash2, X } from 'lucide-react'

interface UserLogin {
  id: number
  unique_id: string
  sis_user_id: string | null
  authentication_provider_type: string | null
  created_at: string
}

export function UserLoginsPage() {
  const { userId } = useParams<{ userId: string }>()
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLogin, setNewLogin] = useState({ unique_id: '', sis_user_id: '' })

  const { data: logins, isLoading, refetch } = useQuery<UserLogin[]>({
    queryKey: ['userLogins', userId],
    queryFn: async () => {
      const response = await apiGet<UserLogin[]>(
        `/v1/users/${userId}/logins`,
      )
      return response.data
    },
    enabled: !!userId,
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      return apiPost(`/v1/accounts/self/logins`, {
        user: { id: userId },
        login: {
          unique_id: newLogin.unique_id,
          sis_user_id: newLogin.sis_user_id || undefined,
        },
      })
    },
    onSuccess: () => {
      setNewLogin({ unique_id: '', sis_user_id: '' })
      setShowAddForm(false)
      refetch()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (loginId: number) => {
      return apiDelete(`/v1/users/${userId}/logins/${loginId}`)
    },
    onSuccess: () => {
      refetch()
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">User Logins</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Manage login credentials for this user
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Login
        </button>
      </div>

      {showAddForm && (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Email / Login ID
              </label>
              <input
                value={newLogin.unique_id}
                onChange={(e) =>
                  setNewLogin((prev) => ({ ...prev, unique_id: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                SIS ID (Optional)
              </label>
              <input
                value={newLogin.sis_user_id}
                onChange={(e) =>
                  setNewLogin((prev) => ({ ...prev, sis_user_id: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending || !newLogin.unique_id.trim()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addMutation.isPending ? 'Adding...' : 'Add Login'}
            </button>
          </div>
          {addMutation.isError && (
            <p className="mt-2 text-sm text-red-600">Failed to add login.</p>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton type="row" count={4} />
      ) : !logins || logins.length === 0 ? (
        <EmptyState
          icon={KeyRound}
          heading="No logins"
          description="No login credentials found for this user."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Login ID</span>
            <span>SIS ID</span>
            <span>Provider</span>
            <span>Actions</span>
          </div>
          {logins.map((login) => (
            <div
              key={login.id}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
            >
              <div>
                <p className="text-sm font-medium text-neutral-800">
                  {login.unique_id}
                </p>
                <p className="text-xs text-neutral-500">
                  Created {new Date(login.created_at).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm text-neutral-600">
                {login.sis_user_id ?? '—'}
              </span>
              <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600">
                {login.authentication_provider_type ?? 'canvas'}
              </span>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(login.id)}
                disabled={deleteMutation.isPending || (logins.length <= 1)}
                className="rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                title={logins.length <= 1 ? 'Cannot delete the only login' : 'Delete login'}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
