import { Monitor, Server, Database, HardDrive, Cpu, Clock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

const SYSTEM_INFO = [
  { label: 'Platform Version', value: 'Canvas LMS 2024.12.1' },
  { label: 'Ruby Version', value: '3.1.4' },
  { label: 'Rails Version', value: '7.0.8' },
  { label: 'Node Version', value: '20.11.0' },
  { label: 'Database', value: 'PostgreSQL 15.4' },
  { label: 'Cache', value: 'Redis 7.2.3' },
  { label: 'Storage', value: 'S3 Compatible' },
  { label: 'Uptime', value: '45 days 12 hours' },
]

const QUICK_LINKS = [
  { label: 'System Health', path: '/admin/system-health', icon: Cpu, color: 'text-green-600 bg-green-50' },
  { label: 'Audit Log', path: '/admin/audit-log', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  { label: 'Backup & Restore', path: '/admin/backup', icon: HardDrive, color: 'text-purple-600 bg-purple-50' },
  { label: 'API Tokens', path: '/admin/api-tokens', icon: Server, color: 'text-amber-600 bg-amber-50' },
]

export function SystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Monitor className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">System Overview</h3>
          <p className="mt-1 text-sm text-neutral-500">System information and quick access to admin tools</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK_LINKS.map((link) => (
          <Link key={link.label} to={link.path} className="group rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${link.color}`}><link.icon className="h-5 w-5" /></div>
              <ArrowRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-primary-500" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-neutral-800">{link.label}</h4>
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">System Information</h4>
        </div>
        <div className="divide-y">
          {SYSTEM_INFO.map((info) => (
            <div key={info.label} className="flex items-center justify-between px-5 py-3">
              <span className="text-sm text-neutral-500">{info.label}</span>
              <span className="font-mono text-sm text-neutral-800">{info.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><Cpu className="h-4 w-4 text-blue-600" /><span className="text-xs text-neutral-500">CPU Usage</span></div>
          <p className="mt-1 text-lg font-bold text-neutral-800">23%</p>
          <div className="mt-1 h-1.5 rounded-full bg-neutral-100"><div className="h-1.5 rounded-full bg-blue-500" style={{ width: '23%' }} /></div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><Database className="h-4 w-4 text-emerald-600" /><span className="text-xs text-neutral-500">Memory</span></div>
          <p className="mt-1 text-lg font-bold text-neutral-800">4.2 / 8 GB</p>
          <div className="mt-1 h-1.5 rounded-full bg-neutral-100"><div className="h-1.5 rounded-full bg-emerald-500" style={{ width: '52%' }} /></div>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <div className="flex items-center gap-2"><HardDrive className="h-4 w-4 text-purple-600" /><span className="text-xs text-neutral-500">Storage</span></div>
          <p className="mt-1 text-lg font-bold text-neutral-800">128 / 500 GB</p>
          <div className="mt-1 h-1.5 rounded-full bg-neutral-100"><div className="h-1.5 rounded-full bg-purple-500" style={{ width: '25%' }} /></div>
        </div>
      </div>
    </div>
  )
}
