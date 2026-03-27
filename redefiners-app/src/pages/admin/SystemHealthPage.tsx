import { HeartPulse, CheckCircle2, AlertTriangle, XCircle, RefreshCw, Clock } from 'lucide-react'
import { useState } from 'react'

const SERVICES = [
  { name: 'Web Application', status: 'healthy' as const, uptime: '99.97%', latency: '45ms', lastCheck: '30 sec ago' },
  { name: 'Database (PostgreSQL)', status: 'healthy' as const, uptime: '99.99%', latency: '12ms', lastCheck: '30 sec ago' },
  { name: 'Cache (Redis)', status: 'healthy' as const, uptime: '99.98%', latency: '3ms', lastCheck: '30 sec ago' },
  { name: 'File Storage (S3)', status: 'healthy' as const, uptime: '99.95%', latency: '85ms', lastCheck: '30 sec ago' },
  { name: 'Email Service', status: 'degraded' as const, uptime: '98.5%', latency: '250ms', lastCheck: '30 sec ago' },
  { name: 'Video Conferencing', status: 'healthy' as const, uptime: '99.90%', latency: '120ms', lastCheck: '30 sec ago' },
  { name: 'Background Jobs', status: 'healthy' as const, uptime: '99.96%', latency: '—', lastCheck: '30 sec ago' },
  { name: 'Search Service', status: 'down' as const, uptime: '95.2%', latency: '—', lastCheck: '30 sec ago' },
]

function statusDisplay(status: string) {
  switch (status) {
    case 'healthy': return { icon: CheckCircle2, color: 'text-green-600', badge: 'bg-green-50 text-green-700', label: 'Healthy' }
    case 'degraded': return { icon: AlertTriangle, color: 'text-amber-500', badge: 'bg-amber-50 text-amber-700', label: 'Degraded' }
    default: return { icon: XCircle, color: 'text-red-500', badge: 'bg-red-50 text-red-600', label: 'Down' }
  }
}

export function SystemHealthPage() {
  const [refreshing, setRefreshing] = useState(false)

  function handleRefresh() {
    setRefreshing(true)
    setTimeout(() => setRefreshing(false), 2000)
  }

  const healthy = SERVICES.filter((s) => s.status === 'healthy').length
  const total = SERVICES.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HeartPulse className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">System Health</h3>
            <p className="mt-1 text-sm text-neutral-500">Real-time status of all platform services</p>
          </div>
        </div>
        <button type="button" onClick={handleRefresh} disabled={refreshing} className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-50">
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-400">Overall Status</p>
          <p className={`text-lg font-bold ${healthy === total ? 'text-green-600' : 'text-amber-600'}`}>
            {healthy === total ? 'All Systems Operational' : 'Partial Outage'}
          </p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-400">Services Online</p>
          <p className="text-lg font-bold text-neutral-800">{healthy} / {total}</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-400">Last Updated</p>
          <p className="flex items-center gap-1 text-lg font-bold text-neutral-800"><Clock className="h-4 w-4 text-neutral-400" />Just now</p>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4"><h4 className="text-sm font-semibold text-neutral-800">Service Status</h4></div>
        <div className="divide-y">
          {SERVICES.map((service) => {
            const s = statusDisplay(service.status)
            return (
              <div key={service.name} className="flex items-center gap-4 px-5 py-4">
                <s.icon className={`h-5 w-5 ${s.color}`} />
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-800">{service.name}</p>
                  <div className="mt-0.5 flex gap-3 text-xs text-neutral-400">
                    <span>Uptime: {service.uptime}</span>
                    <span>Latency: {service.latency}</span>
                    <span>Checked: {service.lastCheck}</span>
                  </div>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${s.badge}`}>{s.label}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
