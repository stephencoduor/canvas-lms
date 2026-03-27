import { useParams } from 'react-router'
import { UserMinus, Download } from 'lucide-react'

interface PriorUser {
  id: string
  name: string
  email: string
  enrolledDate: string
  droppedDate: string
  role: string
}

const MOCK_PRIOR_USERS: PriorUser[] = [
  { id: '1', name: 'Alex Johnson', email: 'alex.johnson@example.com', enrolledDate: '2025-09-01', droppedDate: '2025-10-15', role: 'Student' },
  { id: '2', name: 'Sarah Williams', email: 'sarah.w@example.com', enrolledDate: '2025-09-01', droppedDate: '2025-11-03', role: 'Student' },
  { id: '3', name: 'Michael Brown', email: 'michael.b@example.com', enrolledDate: '2025-09-01', droppedDate: '2025-12-01', role: 'Student' },
  { id: '4', name: 'Emily Davis', email: 'emily.d@example.com', enrolledDate: '2025-09-01', droppedDate: '2025-10-20', role: 'TA' },
]

export function PriorUsersPage() {
  const { courseId } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserMinus className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Prior Enrollments</h3>
            <p className="mt-1 text-sm text-neutral-500">
              Course {courseId} &mdash; Previously enrolled users
            </p>
          </div>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase text-neutral-500">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Dropped</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {MOCK_PRIOR_USERS.map((user) => (
              <tr key={user.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-neutral-800">{user.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">{user.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-600">
                    {user.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-neutral-600">{user.enrolledDate}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{user.droppedDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {MOCK_PRIOR_USERS.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">No prior enrollments found.</p>
        )}
      </div>
    </div>
  )
}
