import { LineChart, BookOpen, Clock, TrendingUp, Target } from 'lucide-react'

const WEEKLY_DATA = [
  { week: 'Week 1', hours: 8, assignments: 3, quizScore: 85 },
  { week: 'Week 2', hours: 10, assignments: 4, quizScore: 88 },
  { week: 'Week 3', hours: 7, assignments: 2, quizScore: 82 },
  { week: 'Week 4', hours: 12, assignments: 5, quizScore: 91 },
  { week: 'Week 5', hours: 9, assignments: 3, quizScore: 87 },
  { week: 'Week 6', hours: 11, assignments: 4, quizScore: 93 },
]

const METRICS = [
  { label: 'Total Study Hours', value: '57h', subtitle: 'This semester', icon: Clock, color: 'text-blue-600 bg-blue-50' },
  { label: 'Assignments Completed', value: '21/28', subtitle: '75% completion', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Average Quiz Score', value: '87.7%', subtitle: '+4.2% from last month', icon: Target, color: 'text-purple-600 bg-purple-50' },
  { label: 'Learning Trend', value: 'Improving', subtitle: 'Based on last 6 weeks', icon: TrendingUp, color: 'text-green-600 bg-green-50' },
]

export function LearningAnalyticsPage() {
  const maxHours = Math.max(...WEEKLY_DATA.map((d) => d.hours))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LineChart className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Learning Analytics</h3>
          <p className="mt-1 text-sm text-neutral-500">Track your learning engagement and performance trends</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <div key={m.label} className="rounded-lg bg-white p-4 shadow-sm">
            <div className={`inline-flex rounded-lg p-2 ${m.color}`}><m.icon className="h-4 w-4" /></div>
            <p className="mt-2 text-xl font-bold text-neutral-800">{m.value}</p>
            <p className="text-xs text-neutral-500">{m.label}</p>
            <p className="text-xs text-neutral-400">{m.subtitle}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-neutral-800">Weekly Study Hours</h4>
        <div className="flex items-end gap-3" style={{ height: '160px' }}>
          {WEEKLY_DATA.map((d) => (
            <div key={d.week} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-medium text-neutral-600">{d.hours}h</span>
              <div className="w-full rounded-t-md bg-primary-500 transition-all" style={{ height: `${(d.hours / maxHours) * 130}px` }} />
              <span className="text-xs text-neutral-400">{d.week.replace('Week ', 'W')}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Weekly Breakdown</h4>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Week</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Study Hours</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Assignments</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Quiz Score</th>
            </tr>
          </thead>
          <tbody>
            {WEEKLY_DATA.map((d) => (
              <tr key={d.week} className="border-b border-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800">{d.week}</td>
                <td className="px-5 py-3 text-neutral-600">{d.hours}h</td>
                <td className="px-5 py-3 text-neutral-600">{d.assignments}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${d.quizScore >= 90 ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>{d.quizScore}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
