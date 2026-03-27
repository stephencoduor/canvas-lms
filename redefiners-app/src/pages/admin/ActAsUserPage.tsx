import { useState } from 'react'
import { UserCog, Search, AlertTriangle } from 'lucide-react'

interface UserResult {
  id: string
  name: string
  email: string
  role: string
}

const MOCK_RESULTS: UserResult[] = [
  { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', role: 'Student' },
  { id: '2', name: 'John Doe', email: 'john.doe@example.com', role: 'Teacher' },
  { id: '3', name: 'Maria Garcia', email: 'maria.garcia@example.com', role: 'Student' },
  { id: '4', name: 'Ahmed Hassan', email: 'ahmed.hassan@example.com', role: 'TA' },
]

export function ActAsUserPage() {
  const [query, setQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<UserResult | null>(null)

  const filtered = query.length > 0
    ? MOCK_RESULTS.filter(
        (u) =>
          u.name.toLowerCase().includes(query.toLowerCase()) ||
          u.email.toLowerCase().includes(query.toLowerCase())
      )
    : []

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserCog className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Act As User</h3>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Important Warning</h4>
            <p className="mt-1 text-sm text-amber-700">
              Acting as another user gives you full access to their account. All actions
              performed will be logged and attributed to you. Use this feature responsibly
              and only for legitimate support purposes.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Search for User</h4>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedUser(null)
            }}
            placeholder="Search by name or email..."
            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        {filtered.length > 0 && !selectedUser && (
          <div className="mt-3 divide-y divide-neutral-100 rounded-lg border border-neutral-200">
            {filtered.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => {
                  setSelectedUser(user)
                  setQuery(user.name)
                }}
                className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-neutral-50"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{user.name}</p>
                  <p className="text-xs text-neutral-500">{user.email} &middot; {user.role}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {selectedUser && (
          <div className="mt-6 rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-lg font-bold text-primary-700">
                {selectedUser.name.charAt(0)}
              </div>
              <div>
                <p className="font-medium text-neutral-800">{selectedUser.name}</p>
                <p className="text-sm text-neutral-500">{selectedUser.email}</p>
                <p className="text-xs text-neutral-400">Role: {selectedUser.role}</p>
              </div>
            </div>
            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-amber-700"
            >
              <UserCog className="h-4 w-4" />
              Act As {selectedUser.name}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
