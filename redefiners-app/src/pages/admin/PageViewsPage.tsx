import { useState } from 'react'
import { Eye, Search, Filter } from 'lucide-react'

interface PageView {
  id: string
  user: string
  url: string
  controller: string
  action: string
  timestamp: string
  userAgent: string
}

const MOCK_VIEWS: PageView[] = [
  { id: '1', user: 'jane.smith@example.com', url: '/courses/101/assignments', controller: 'assignments', action: 'index', timestamp: '2026-03-26 14:32:15', userAgent: 'Chrome 120' },
  { id: '2', user: 'john.doe@example.com', url: '/courses/101/grades', controller: 'grades', action: 'index', timestamp: '2026-03-26 14:28:03', userAgent: 'Firefox 121' },
  { id: '3', user: 'maria.garcia@example.com', url: '/dashboard', controller: 'dashboard', action: 'show', timestamp: '2026-03-26 14:25:41', userAgent: 'Safari 17' },
  { id: '4', user: 'ahmed.hassan@example.com', url: '/courses/102/discussions', controller: 'discussions', action: 'index', timestamp: '2026-03-26 14:20:19', userAgent: 'Chrome 120' },
  { id: '5', user: 'jane.smith@example.com', url: '/inbox', controller: 'conversations', action: 'index', timestamp: '2026-03-26 14:15:07', userAgent: 'Chrome 120' },
  { id: '6', user: 'john.doe@example.com', url: '/courses/103/quizzes/5', controller: 'quizzes', action: 'show', timestamp: '2026-03-26 14:10:55', userAgent: 'Firefox 121' },
]

export function PageViewsPage() {
  const [userFilter, setUserFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')

  const filtered = MOCK_VIEWS.filter((v) => {
    if (userFilter && !v.user.toLowerCase().includes(userFilter.toLowerCase())) return false
    if (dateFilter && !v.timestamp.startsWith(dateFilter)) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Eye className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Page Views</h3>
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <Filter className="h-4 w-4 text-neutral-400" />
          <span className="text-sm font-medium text-neutral-700">Filters</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={userFilter}
              onChange={(e) => setUserFilter(e.target.value)}
              placeholder="Filter by user..."
              className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-100 text-left text-xs font-medium uppercase text-neutral-500">
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">URL</th>
              <th className="px-4 py-3">Controller</th>
              <th className="px-4 py-3">Action</th>
              <th className="px-4 py-3">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-50">
            {filtered.map((view) => (
              <tr key={view.id} className="hover:bg-neutral-50">
                <td className="px-4 py-3 text-sm text-neutral-700">{view.user}</td>
                <td className="px-4 py-3 text-sm font-mono text-neutral-600">{view.url}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{view.controller}</td>
                <td className="px-4 py-3 text-sm text-neutral-600">{view.action}</td>
                <td className="px-4 py-3 text-xs text-neutral-400">{view.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">No page views match the filters.</p>
        )}
      </div>
    </div>
  )
}
