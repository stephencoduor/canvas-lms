import { useState } from 'react'
import { UserPlus, Search, Download, Filter, CheckCircle2, Clock, XCircle } from 'lucide-react'

type StatusFilter = 'all' | 'active' | 'pending' | 'dropped'

const ENROLLMENTS = [
  { id: 1, student: 'Maria Santos', email: 'maria.s@student.edu', course: 'Spanish 101', status: 'active' as const, enrolled: '2026-01-12', role: 'Student' },
  { id: 2, student: 'James Kim', email: 'james.k@student.edu', course: 'World History', status: 'active' as const, enrolled: '2026-01-12', role: 'Student' },
  { id: 3, student: 'Priya Patel', email: 'priya.p@student.edu', course: 'Calculus II', status: 'pending' as const, enrolled: '2026-03-20', role: 'Student' },
  { id: 4, student: 'Alex Rivera', email: 'alex.r@student.edu', course: 'Spanish 101', status: 'dropped' as const, enrolled: '2026-01-12', role: 'Student' },
  { id: 5, student: 'Emily Davis', email: 'emily.d@student.edu', course: 'English Comp', status: 'active' as const, enrolled: '2026-01-12', role: 'TA' },
]

function statusBadge(status: string) {
  switch (status) {
    case 'active': return { icon: CheckCircle2, color: 'bg-green-50 text-green-700' }
    case 'pending': return { icon: Clock, color: 'bg-amber-50 text-amber-700' }
    default: return { icon: XCircle, color: 'bg-red-50 text-red-600' }
  }
}

export function EnrollmentsPage() {
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  const items = ENROLLMENTS.filter((e) => {
    if (filter !== 'all' && e.status !== filter) return false
    if (search && !e.student.toLowerCase().includes(search.toLowerCase()) && !e.course.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UserPlus className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Enrollment Management</h3>
            <p className="mt-1 text-sm text-neutral-500">Manage student course enrollments</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
            <UserPlus className="h-4 w-4" /> Add Enrollment
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search students or courses..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
        </div>
        <div className="flex items-center gap-1">
          <Filter className="mr-1 h-4 w-4 text-neutral-400" />
          {(['all', 'active', 'pending', 'dropped'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Student</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Role</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Enrolled</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Status</th>
            </tr>
          </thead>
          <tbody>
            {items.map((e) => {
              const badge = statusBadge(e.status)
              return (
                <tr key={e.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="px-5 py-3">
                    <p className="font-medium text-neutral-800">{e.student}</p>
                    <p className="text-xs text-neutral-400">{e.email}</p>
                  </td>
                  <td className="px-5 py-3 text-neutral-600">{e.course}</td>
                  <td className="px-5 py-3 text-neutral-600">{e.role}</td>
                  <td className="px-5 py-3 text-xs text-neutral-400">{e.enrolled}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${badge.color}`}>
                      <badge.icon className="h-3 w-3" />{e.status}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
