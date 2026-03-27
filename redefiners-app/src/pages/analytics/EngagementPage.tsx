import { Activity, Users, MessageSquare, FileText, Video, TrendingUp } from 'lucide-react'

const ENGAGEMENT_STATS = [
  { label: 'Discussion Posts', value: 42, change: '+15%', icon: MessageSquare, color: 'text-blue-600 bg-blue-50' },
  { label: 'Assignments Submitted', value: 21, change: '+8%', icon: FileText, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Videos Watched', value: 35, change: '+22%', icon: Video, color: 'text-purple-600 bg-purple-50' },
  { label: 'Peer Interactions', value: 68, change: '+18%', icon: Users, color: 'text-amber-600 bg-amber-50' },
]

const STUDENT_ENGAGEMENT = [
  { name: 'Maria Santos', engagement: 95, lastActive: '1 hour ago', trend: 'up' as const },
  { name: 'James Kim', engagement: 88, lastActive: '3 hours ago', trend: 'up' as const },
  { name: 'Alex Rivera', engagement: 76, lastActive: '1 day ago', trend: 'stable' as const },
  { name: 'Priya Patel', engagement: 72, lastActive: '2 days ago', trend: 'down' as const },
  { name: 'Tom Wilson', engagement: 45, lastActive: '5 days ago', trend: 'down' as const },
]

function engagementColor(value: number): string {
  if (value >= 80) return 'bg-green-500'
  if (value >= 60) return 'bg-amber-500'
  return 'bg-red-500'
}

function trendBadge(trend: string) {
  switch (trend) {
    case 'up': return <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">Increasing</span>
    case 'stable': return <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700">Stable</span>
    default: return <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs text-red-600">Declining</span>
  }
}

export function EngagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Activity className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Engagement Dashboard</h3>
          <p className="mt-1 text-sm text-neutral-500">Monitor student engagement and participation</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ENGAGEMENT_STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
              <span className="flex items-center gap-0.5 text-xs font-medium text-green-600"><TrendingUp className="h-3 w-3" />{stat.change}</span>
            </div>
            <p className="mt-2 text-2xl font-bold text-neutral-800">{stat.value}</p>
            <p className="text-xs text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Student Engagement</h4>
        </div>
        <div className="divide-y">
          {STUDENT_ENGAGEMENT.map((student) => (
            <div key={student.name} className="flex items-center gap-4 px-5 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-100 text-xs font-bold text-primary-700">
                {student.name.split(' ').map((n) => n[0]).join('')}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{student.name}</p>
                <p className="text-xs text-neutral-400">Last active: {student.lastActive}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-24">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
                      <div className={`h-1.5 rounded-full ${engagementColor(student.engagement)}`} style={{ width: `${student.engagement}%` }} />
                    </div>
                    <span className="text-xs font-medium text-neutral-600">{student.engagement}%</span>
                  </div>
                </div>
                {trendBadge(student.trend)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
