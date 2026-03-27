import { BarChart3, TrendingUp, Users, BookOpen, Clock, ArrowUpRight, ArrowDownRight } from 'lucide-react'

const STATS = [
  { label: 'Total Students', value: '1,247', change: '+12%', up: true, icon: Users, color: 'text-blue-600 bg-blue-50' },
  { label: 'Active Courses', value: '86', change: '+5%', up: true, icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Avg. Completion Rate', value: '78%', change: '+3%', up: true, icon: TrendingUp, color: 'text-purple-600 bg-purple-50' },
  { label: 'Avg. Time on Platform', value: '4.2h', change: '-8%', up: false, icon: Clock, color: 'text-amber-600 bg-amber-50' },
]

const COURSE_METRICS = [
  { course: 'Spanish 101', students: 32, completion: 82, avgGrade: 'B+', engagement: 91 },
  { course: 'World History', students: 28, completion: 75, avgGrade: 'B', engagement: 84 },
  { course: 'Calculus II', students: 24, completion: 68, avgGrade: 'B-', engagement: 72 },
  { course: 'English Comp', students: 30, completion: 88, avgGrade: 'A-', engagement: 95 },
  { course: 'Mandarin 201', students: 18, completion: 79, avgGrade: 'B+', engagement: 87 },
]

export function GlobalAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Analytics Dashboard</h3>
          <p className="mt-1 text-sm text-neutral-500">Overview of platform-wide metrics and trends</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className={`rounded-lg p-2 ${stat.color}`}><stat.icon className="h-4 w-4" /></div>
              <span className={`flex items-center gap-0.5 text-xs font-medium ${stat.up ? 'text-green-600' : 'text-red-500'}`}>
                {stat.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {stat.change}
              </span>
            </div>
            <p className="mt-3 text-2xl font-bold text-neutral-800">{stat.value}</p>
            <p className="text-xs text-neutral-400">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Course Performance</h4>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Students</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Completion</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Avg Grade</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Engagement</th>
            </tr>
          </thead>
          <tbody>
            {COURSE_METRICS.map((m) => (
              <tr key={m.course} className="border-b border-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800">{m.course}</td>
                <td className="px-5 py-3 text-neutral-600">{m.students}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-20 rounded-full bg-neutral-100"><div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${m.completion}%` }} /></div>
                    <span className="text-xs text-neutral-500">{m.completion}%</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-neutral-600">{m.avgGrade}</td>
                <td className="px-5 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${m.engagement >= 90 ? 'bg-green-50 text-green-700' : m.engagement >= 80 ? 'bg-blue-50 text-blue-700' : 'bg-amber-50 text-amber-700'}`}>
                    {m.engagement}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
