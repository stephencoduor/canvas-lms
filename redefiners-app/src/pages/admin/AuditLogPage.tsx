import { useState } from 'react'
import { ScrollText, Search, Filter, Download, User, Settings, Shield, Database } from 'lucide-react'

type LogLevel = 'all' | 'info' | 'warning' | 'error'

const LOG_ENTRIES = [
  { id: 1, timestamp: '2026-03-25 14:32:10', user: 'admin@redefiners.org', action: 'User role updated', target: 'john.doe@student.edu', level: 'info' as const, category: 'user' },
  { id: 2, timestamp: '2026-03-25 13:15:45', user: 'system', action: 'Backup completed', target: 'Full system backup', level: 'info' as const, category: 'system' },
  { id: 3, timestamp: '2026-03-25 12:08:22', user: 'admin@redefiners.org', action: 'Failed login attempt', target: 'unknown@attacker.com', level: 'warning' as const, category: 'security' },
  { id: 4, timestamp: '2026-03-25 11:45:00', user: 'system', action: 'Database migration error', target: 'users_table v3.2', level: 'error' as const, category: 'system' },
  { id: 5, timestamp: '2026-03-25 10:30:15', user: 'admin@redefiners.org', action: 'Course created', target: 'French 101', level: 'info' as const, category: 'data' },
  { id: 6, timestamp: '2026-03-25 09:22:33', user: 'admin@redefiners.org', action: 'Permission changed', target: 'Teacher role', level: 'warning' as const, category: 'security' },
]

function levelStyle(level: string) {
  switch (level) {
    case 'error': return 'bg-red-50 text-red-700'
    case 'warning': return 'bg-amber-50 text-amber-700'
    default: return 'bg-blue-50 text-blue-700'
  }
}

function categoryIcon(cat: string) {
  switch (cat) {
    case 'user': return User
    case 'system': return Settings
    case 'security': return Shield
    default: return Database
  }
}

export function AuditLogPage() {
  const [level, setLevel] = useState<LogLevel>('all')
  const [search, setSearch] = useState('')

  const entries = LOG_ENTRIES.filter((e) => {
    if (level !== 'all' && e.level !== level) return false
    if (search && !e.action.toLowerCase().includes(search.toLowerCase()) && !e.user.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScrollText className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Audit Log</h3>
            <p className="mt-1 text-sm text-neutral-500">System-wide activity and security log</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs text-white hover:bg-primary-700">
          <Download className="h-3.5 w-3.5" /> Export Log
        </button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search logs..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-neutral-400" />
          {(['all', 'info', 'warning', 'error'] as const).map((l) => (
            <button key={l} type="button" onClick={() => setLevel(l)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${level === l ? 'bg-primary-50 text-primary-700' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Timestamp</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">User</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Action</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Target</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Level</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e) => {
              const Icon = categoryIcon(e.category)
              return (
                <tr key={e.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                  <td className="whitespace-nowrap px-5 py-3 font-mono text-xs text-neutral-500">{e.timestamp}</td>
                  <td className="px-5 py-3 text-xs text-neutral-600">{e.user}</td>
                  <td className="px-5 py-3">
                    <span className="flex items-center gap-1.5 text-sm text-neutral-800"><Icon className="h-3.5 w-3.5 text-neutral-400" />{e.action}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-neutral-500">{e.target}</td>
                  <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs capitalize ${levelStyle(e.level)}`}>{e.level}</span></td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
