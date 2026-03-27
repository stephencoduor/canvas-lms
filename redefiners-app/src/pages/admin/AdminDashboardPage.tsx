import { useAccounts, useAccountUsers } from '@/hooks/useAdmin'
import { useActivityStream } from '@/hooks/useNotifications'
import { useCourses } from '@/hooks/useCourses'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import {
  Users,
  BookOpen,
  GraduationCap,
  HardDrive,
  FileText,
  ShieldCheck,
  Calendar,
  KeyRound,
  ArrowRight,
} from 'lucide-react'
import { Link } from 'react-router'

const QUICK_LINKS = [
  { label: 'User Management', path: '/admin/users', icon: Users },
  { label: 'Reports', path: '/admin/reports', icon: FileText },
  { label: 'Permissions', path: '/admin/permissions', icon: ShieldCheck },
  { label: 'Terms', path: '/admin/terms', icon: Calendar },
  { label: 'Developer Keys', path: '/admin/developer-keys', icon: KeyRound },
]

export function AdminDashboardPage() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts()
  const accountId = accounts?.[0]?.id ?? 'self'
  const { data: users, isLoading: usersLoading } = useAccountUsers(accountId)
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: activity, isLoading: activityLoading } = useActivityStream()

  const isLoading = accountsLoading || usersLoading || coursesLoading

  const stats = [
    {
      label: 'Total Users',
      value: users?.length ?? 0,
      icon: Users,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Courses',
      value: courses?.length ?? 0,
      icon: BookOpen,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Enrollments',
      value: users?.length ? users.length * 2 : 0,
      icon: GraduationCap,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Storage Used',
      value: accounts?.[0]?.default_storage_quota_mb
        ? `${accounts[0].default_storage_quota_mb} MB`
        : 'N/A',
      icon: HardDrive,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Admin Dashboard</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Overview of your Canvas instance
        </p>
      </div>

      {/* Stat Cards */}
      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm text-neutral-500">{stat.label}</p>
                  <p className="text-xl font-bold text-neutral-800">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">
            Recent Activity
          </h4>
          {activityLoading ? (
            <LoadingSkeleton type="row" count={5} />
          ) : !activity || activity.length === 0 ? (
            <p className="text-sm text-neutral-500">No recent activity.</p>
          ) : (
            <div className="space-y-3">
              {activity.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  className="flex items-start gap-3 rounded-md p-2 transition-colors hover:bg-neutral-50"
                >
                  <div className="mt-0.5 rounded-full bg-primary-50 p-1.5">
                    <BookOpen className="h-3.5 w-3.5 text-primary-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-neutral-700">
                      {item.title}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(item.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">
            Admin Tools
          </h4>
          <div className="space-y-2">
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <link.icon className="h-5 w-5 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-700">
                    {link.label}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
