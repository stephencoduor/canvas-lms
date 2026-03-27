import { useState } from 'react'
import { useAccounts, useAccountUsers } from '@/hooks/useAdmin'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Users, Search, UserPlus } from 'lucide-react'

export function UserManagementPage() {
  const { data: accounts } = useAccounts()
  const accountId = accounts?.[0]?.id ?? 'self'
  const { data: users, isLoading } = useAccountUsers(accountId)
  const [search, setSearch] = useState('')

  const filteredUsers =
    users?.filter(
      (u) =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? '').toLowerCase().includes(search.toLowerCase()) ||
        (u.login_id ?? '').toLowerCase().includes(search.toLowerCase()),
    ) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            User Management
          </h3>
          {!isLoading && users && (
            <p className="mt-1 text-sm text-neutral-500">
              {users.length} {users.length === 1 ? 'user' : 'users'} total
            </p>
          )}
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search users by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* User List */}
      {isLoading ? (
        <LoadingSkeleton type="row" count={10} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          heading="No users found"
          description={
            search
              ? 'Try a different search term.'
              : 'No users in this account.'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Name</span>
            <span>Email</span>
            <span className="hidden sm:inline">Role</span>
            <span className="hidden sm:inline">Status</span>
          </div>
          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={user.avatar_url || '/images/default-avatar.png'}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {user.name}
                  </p>
                  <p className="text-xs text-neutral-500">{user.login_id}</p>
                </div>
              </div>
              <span className="text-sm text-neutral-600">
                {user.email ?? '—'}
              </span>
              <span className="hidden rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 sm:inline">
                User
              </span>
              <span className="hidden text-xs text-neutral-400 sm:inline">
                {user.last_login
                  ? new Date(user.last_login).toLocaleDateString()
                  : 'Never'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
