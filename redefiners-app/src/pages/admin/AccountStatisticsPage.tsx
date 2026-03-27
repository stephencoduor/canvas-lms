import { BarChart3, Users, BookOpen, GraduationCap, HardDrive, LogIn } from 'lucide-react'

const STATS = [
  { label: 'Total Users', value: '2,847', icon: Users, color: 'text-blue-600 bg-blue-50' },
  { label: 'Active Courses', value: '156', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Total Enrollments', value: '8,432', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' },
  { label: 'Storage Used', value: '45.2 GB', icon: HardDrive, color: 'text-amber-600 bg-amber-50' },
  { label: 'Logins Today', value: '312', icon: LogIn, color: 'text-rose-600 bg-rose-50' },
]

const RECENT_ACTIVITY = [
  { label: 'Page Views (24h)', value: '12,847' },
  { label: 'File Uploads (24h)', value: '234' },
  { label: 'Assignments Submitted (24h)', value: '1,089' },
  { label: 'Discussion Posts (24h)', value: '456' },
  { label: 'Quiz Attempts (24h)', value: '287' },
  { label: 'Messages Sent (24h)', value: '198' },
]

const MONTHLY_TRENDS = [
  { month: 'Oct', users: 2100, courses: 120 },
  { month: 'Nov', users: 2350, courses: 135 },
  { month: 'Dec', users: 2200, courses: 130 },
  { month: 'Jan', users: 2600, courses: 148 },
  { month: 'Feb', users: 2750, courses: 152 },
  { month: 'Mar', users: 2847, courses: 156 },
]

export function AccountStatisticsPage() {
  const maxUsers = Math.max(...MONTHLY_TRENDS.map((m) => m.users))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Account Statistics</h3>
          <p className="mt-1 text-sm text-neutral-500">Account-wide usage overview</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2.5 ${stat.color}`}>
                <stat.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <p className="text-lg font-bold text-neutral-800">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">User Growth (6 months)</h4>
          <div className="space-y-2">
            {MONTHLY_TRENDS.map((month) => (
              <div key={month.month} className="flex items-center gap-3">
                <span className="w-8 text-xs font-medium text-neutral-500">{month.month}</span>
                <div className="flex-1">
                  <div
                    className="h-6 rounded bg-primary-100"
                    style={{ width: `${(month.users / maxUsers) * 100}%` }}
                  >
                    <div className="flex h-full items-center px-2">
                      <span className="text-xs font-medium text-primary-700">
                        {month.users.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Activity (Last 24 Hours)</h4>
          <div className="divide-y divide-neutral-100">
            {RECENT_ACTIVITY.map((item) => (
              <div key={item.label} className="flex items-center justify-between py-3">
                <span className="text-sm text-neutral-600">{item.label}</span>
                <span className="text-sm font-semibold text-neutral-800">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
