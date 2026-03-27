import { BarChart3, CheckCircle2, Clock, BookOpen } from 'lucide-react'

const COURSES = [
  {
    id: 1,
    name: 'Spanish 101',
    modules: [
      { name: 'Greetings & Introductions', progress: 100 },
      { name: 'Family & Relationships', progress: 100 },
      { name: 'Food & Dining', progress: 75 },
      { name: 'Travel & Directions', progress: 30 },
      { name: 'Health & Wellness', progress: 0 },
    ],
    overall: 61,
    assignments: { completed: 8, total: 12 },
    quizzes: { completed: 3, total: 5 },
  },
  {
    id: 2,
    name: 'World History',
    modules: [
      { name: 'Ancient Civilizations', progress: 100 },
      { name: 'Medieval Period', progress: 100 },
      { name: 'Renaissance & Enlightenment', progress: 50 },
      { name: 'Modern Era', progress: 0 },
    ],
    overall: 63,
    assignments: { completed: 6, total: 10 },
    quizzes: { completed: 2, total: 4 },
  },
  {
    id: 3,
    name: 'Calculus II',
    modules: [
      { name: 'Integration Techniques', progress: 100 },
      { name: 'Applications of Integration', progress: 80 },
      { name: 'Sequences & Series', progress: 20 },
      { name: 'Differential Equations', progress: 0 },
    ],
    overall: 50,
    assignments: { completed: 5, total: 14 },
    quizzes: { completed: 2, total: 6 },
  },
]

function barColor(pct: number): string {
  if (pct === 100) return 'bg-green-500'
  if (pct >= 50) return 'bg-primary-500'
  if (pct > 0) return 'bg-amber-500'
  return 'bg-neutral-200'
}

export function ProgressTrackerPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BarChart3 className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Progress Tracker</h3>
          <p className="mt-1 text-sm text-neutral-500">Monitor your progress across courses and modules</p>
        </div>
      </div>

      <div className="space-y-4">
        {COURSES.map((course) => (
          <div key={course.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-800">{course.name}</h4>
              <span className="text-lg font-bold text-primary-600">{course.overall}%</span>
            </div>

            <div className="mt-2 h-2 rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${course.overall}%` }} />
            </div>

            <div className="mt-3 flex gap-4 text-xs text-neutral-500">
              <span className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3 text-green-600" />{course.assignments.completed}/{course.assignments.total} assignments</span>
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3 text-blue-600" />{course.quizzes.completed}/{course.quizzes.total} quizzes</span>
            </div>

            <div className="mt-4 space-y-2">
              {course.modules.map((mod) => (
                <div key={mod.name} className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {mod.progress === 100 ? <CheckCircle2 className="h-3.5 w-3.5 text-green-600" /> : <Clock className="h-3.5 w-3.5 text-neutral-300" />}
                  </div>
                  <span className="w-48 truncate text-xs text-neutral-600">{mod.name}</span>
                  <div className="h-1.5 flex-1 rounded-full bg-neutral-100">
                    <div className={`h-1.5 rounded-full ${barColor(mod.progress)}`} style={{ width: `${mod.progress}%` }} />
                  </div>
                  <span className="w-8 text-right text-xs text-neutral-400">{mod.progress}%</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
