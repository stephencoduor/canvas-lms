import { LayoutGrid, BarChart3, LineChart, PieChart, TrendingUp, Activity, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

const TOOLS = [
  { label: 'Global Analytics', description: 'Platform-wide metrics and performance overview.', path: '/analytics', icon: BarChart3, color: 'text-blue-600 bg-blue-50' },
  { label: 'Learning Analytics', description: 'Individual learning engagement and trends.', path: '/learning-analytics', icon: LineChart, color: 'text-emerald-600 bg-emerald-50' },
  { label: 'Engagement Dashboard', description: 'Student participation and interaction metrics.', path: '/engagement', icon: Activity, color: 'text-purple-600 bg-purple-50' },
  { label: 'Completion Reports', description: 'Course and assignment completion statistics.', path: '/completion-reports', icon: PieChart, color: 'text-amber-600 bg-amber-50' },
  { label: 'Student Analytics', description: 'Individual student performance insights.', path: '/student-analytics', icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
]

const RECENT_REPORTS = [
  { title: 'Weekly Engagement Summary', date: '2026-03-25', type: 'Engagement' },
  { title: 'Monthly Completion Report', date: '2026-03-01', type: 'Completion' },
  { title: 'Semester Grade Distribution', date: '2026-02-15', type: 'Grades' },
]

export function AnalyticsHubPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LayoutGrid className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Analytics Hub</h3>
          <p className="mt-1 text-sm text-neutral-500">Central hub for all analytics and reporting tools</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link key={tool.label} to={tool.path} className="group rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${tool.color}`}><tool.icon className="h-5 w-5" /></div>
              <ArrowRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-primary-500" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-neutral-800">{tool.label}</h4>
            <p className="mt-1 text-xs text-neutral-500">{tool.description}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Recent Reports</h4>
        </div>
        <div className="divide-y">
          {RECENT_REPORTS.map((report) => (
            <button key={report.title} type="button" className="flex w-full items-center gap-4 px-5 py-4 text-left hover:bg-neutral-50">
              <BarChart3 className="h-4 w-4 text-neutral-400" />
              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-800">{report.title}</p>
                <p className="text-xs text-neutral-400">{report.date}</p>
              </div>
              <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">{report.type}</span>
              <ArrowRight className="h-3.5 w-3.5 text-neutral-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
