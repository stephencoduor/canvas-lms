import { useState } from 'react'
import { useParams } from 'react-router'
import { usePeople } from '@/hooks/usePeople'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Users } from 'lucide-react'
import type { CanvasUser } from '@/types/canvas'

type RoleFilter = 'all' | 'student' | 'teacher' | 'ta'

function getRoleLabel(user: CanvasUser): string {
  const type = user.enrollments?.[0]?.type
  if (!type) return 'User'
  return type.replace('Enrollment', '')
}

function getRoleColor(role: string): string {
  switch (role) {
    case 'Teacher':
      return 'text-amber-600 bg-amber-50'
    case 'Student':
      return 'text-blue-600 bg-blue-50'
    case 'Ta':
      return 'text-purple-600 bg-purple-50'
    case 'Designer':
      return 'text-pink-600 bg-pink-50'
    case 'Observer':
      return 'text-neutral-600 bg-neutral-100'
    default:
      return 'text-neutral-600 bg-neutral-100'
  }
}

function matchesFilter(user: CanvasUser, filter: RoleFilter): boolean {
  if (filter === 'all') return true
  const type = user.enrollments?.[0]?.type?.toLowerCase() ?? ''
  if (filter === 'student') return type.includes('student')
  if (filter === 'teacher') return type.includes('teacher')
  if (filter === 'ta') return type.includes('ta')
  return true
}

const FILTER_OPTIONS: { value: RoleFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'student', label: 'Students' },
  { value: 'teacher', label: 'Teachers' },
  { value: 'ta', label: 'TAs' },
]

export function PeoplePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: users, isLoading } = usePeople(courseId!)
  const [filter, setFilter] = useState<RoleFilter>('all')

  const filteredUsers = users?.filter((u) => matchesFilter(u, filter)) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary-800">People</h3>
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === opt.value
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={10} />
      ) : filteredUsers.length === 0 ? (
        <EmptyState
          icon={Users}
          heading="No people"
          description="No participants found."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Name</span>
            <span>Role</span>
            <span className="hidden sm:inline">Last Activity</span>
          </div>
          {filteredUsers.map((user) => {
            const role = getRoleLabel(user)
            const roleColor = getRoleColor(role)

            return (
              <div
                key={user.id}
                className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
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
                    <p className="text-xs text-neutral-500">
                      {user.email || user.login_id || ''}
                    </p>
                  </div>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${roleColor}`}
                >
                  {role}
                </span>
                <span className="hidden text-xs text-neutral-400 sm:inline">
                  {user.enrollments?.[0]?.enrollment_state === 'active'
                    ? 'Active'
                    : user.enrollments?.[0]?.enrollment_state ?? ''}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
