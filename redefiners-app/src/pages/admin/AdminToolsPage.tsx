import {
  Wrench,
  RotateCcw,
  ScrollText,
  Bell,
  KeyRound,
  ArrowRight,
  Search,
  Palette,
  BarChart3,
  Flag,
} from 'lucide-react'
import { Link } from 'react-router'

const TOOLS = [
  {
    label: 'Restore Courses',
    description: 'Recover deleted courses and restore content from backups.',
    path: '/admin/search',
    icon: RotateCcw,
    color: 'text-blue-600 bg-blue-50',
  },
  {
    label: 'Logging & Page Views',
    description: 'View system logs, page view analytics, and user activity.',
    path: '/admin/page-views',
    icon: ScrollText,
    color: 'text-emerald-600 bg-emerald-50',
  },
  {
    label: 'Notifications',
    description: 'Manage global announcements and notification delivery.',
    path: '/admin/notifications',
    icon: Bell,
    color: 'text-amber-600 bg-amber-50',
  },
  {
    label: 'Authentication',
    description: 'Configure authentication providers and login settings.',
    path: '/admin/auth-providers',
    icon: KeyRound,
    color: 'text-purple-600 bg-purple-50',
  },
  {
    label: 'Account Search',
    description: 'Search across all users and courses in the account.',
    path: '/admin/search',
    icon: Search,
    color: 'text-rose-600 bg-rose-50',
  },
  {
    label: 'Themes & Branding',
    description: 'Customize the look and feel of your Canvas instance.',
    path: '/admin/themes',
    icon: Palette,
    color: 'text-indigo-600 bg-indigo-50',
  },
  {
    label: 'Statistics',
    description: 'View account-wide usage statistics and metrics.',
    path: '/admin/statistics',
    icon: BarChart3,
    color: 'text-teal-600 bg-teal-50',
  },
  {
    label: 'Feature Flags',
    description: 'Enable or disable feature flags across the instance.',
    path: '/admin/feature-flags',
    icon: Flag,
    color: 'text-orange-600 bg-orange-50',
  },
]

export function AdminToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wrench className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Admin Tools</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Quick-access dashboard for administrative actions
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.label}
            to={tool.path}
            className="group rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${tool.color}`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-primary-500" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-neutral-800">{tool.label}</h4>
            <p className="mt-1 text-xs text-neutral-500">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
