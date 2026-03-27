import { CheckSquare, Download, Filter } from 'lucide-react'
import { useState } from 'react'

type ReportPeriod = 'week' | 'month' | 'semester'

const COURSE_COMPLETION = [
  { course: 'Spanish 101', enrolled: 32, completed: 26, inProgress: 4, notStarted: 2, rate: 81 },
  { course: 'World History', enrolled: 28, completed: 21, inProgress: 5, notStarted: 2, rate: 75 },
  { course: 'Calculus II', enrolled: 24, completed: 16, inProgress: 6, notStarted: 2, rate: 67 },
  { course: 'English Comp', enrolled: 30, completed: 27, inProgress: 2, notStarted: 1, rate: 90 },
  { course: 'Mandarin 201', enrolled: 18, completed: 14, inProgress: 3, notStarted: 1, rate: 78 },
]

const ASSIGNMENT_COMPLETION = [
  { assignment: 'Essay — Cultural Analysis', course: 'Spanish 101', submitted: 30, total: 32, rate: 94 },
  { assignment: 'Midterm Exam', course: 'World History', submitted: 27, total: 28, rate: 96 },
  { assignment: 'Problem Set 5', course: 'Calculus II', submitted: 18, total: 24, rate: 75 },
  { assignment: 'Research Paper Draft', course: 'English Comp', submitted: 28, total: 30, rate: 93 },
  { assignment: 'Oral Presentation', course: 'Mandarin 201', submitted: 15, total: 18, rate: 83 },
]

export function CompletionReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('semester')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CheckSquare className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Completion Reports</h3>
            <p className="mt-1 text-sm text-neutral-500">Course and assignment completion statistics</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="button" className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-2 text-xs text-neutral-600 hover:bg-neutral-50">
            <Filter className="h-3.5 w-3.5" /> Filter
          </button>
          <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-3 py-2 text-xs text-white hover:bg-primary-700">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['week', 'month', 'semester'] as const).map((p) => (
          <button key={p} type="button" onClick={() => setPeriod(p)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${period === p ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {p === 'week' ? 'This Week' : p === 'month' ? 'This Month' : 'Semester'}
          </button>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Course Completion Rates</h4>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Enrolled</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Completed</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">In Progress</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Rate</th>
            </tr>
          </thead>
          <tbody>
            {COURSE_COMPLETION.map((c) => (
              <tr key={c.course} className="border-b border-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800">{c.course}</td>
                <td className="px-5 py-3 text-neutral-600">{c.enrolled}</td>
                <td className="px-5 py-3 text-green-600">{c.completed}</td>
                <td className="px-5 py-3 text-amber-600">{c.inProgress}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-16 rounded-full bg-neutral-100"><div className={`h-1.5 rounded-full ${c.rate >= 80 ? 'bg-green-500' : c.rate >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${c.rate}%` }} /></div>
                    <span className="text-xs font-medium">{c.rate}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Assignment Submission Rates</h4>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-neutral-50">
            <tr>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Assignment</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Course</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Submitted</th>
              <th className="px-5 py-3 text-xs font-medium text-neutral-500">Rate</th>
            </tr>
          </thead>
          <tbody>
            {ASSIGNMENT_COMPLETION.map((a) => (
              <tr key={a.assignment} className="border-b border-neutral-50">
                <td className="px-5 py-3 font-medium text-neutral-800">{a.assignment}</td>
                <td className="px-5 py-3 text-neutral-500">{a.course}</td>
                <td className="px-5 py-3 text-neutral-600">{a.submitted}/{a.total}</td>
                <td className="px-5 py-3"><span className={`rounded-full px-2 py-0.5 text-xs ${a.rate >= 90 ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>{a.rate}%</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
