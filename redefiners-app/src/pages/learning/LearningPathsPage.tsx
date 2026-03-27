import { Route, CheckCircle2, Circle, Lock, ChevronRight } from 'lucide-react'

const PATHS = [
  {
    id: 1,
    name: 'Spanish Language Mastery',
    description: 'Complete path from beginner to advanced Spanish fluency.',
    progress: 45,
    steps: [
      { id: 1, title: 'Spanish 101 — Basics', status: 'completed' as const },
      { id: 2, title: 'Spanish 102 — Intermediate', status: 'current' as const },
      { id: 3, title: 'Spanish 201 — Advanced Conversation', status: 'locked' as const },
      { id: 4, title: 'Spanish 301 — Business Spanish', status: 'locked' as const },
    ],
  },
  {
    id: 2,
    name: 'Global Citizenship',
    description: 'Develop cross-cultural competencies and global awareness.',
    progress: 67,
    steps: [
      { id: 5, title: 'Cultural Awareness Foundations', status: 'completed' as const },
      { id: 6, title: 'World History Survey', status: 'completed' as const },
      { id: 7, title: 'International Relations', status: 'current' as const },
      { id: 8, title: 'Capstone: Global Leadership', status: 'locked' as const },
    ],
  },
  {
    id: 3,
    name: 'STEM Foundations',
    description: 'Build a strong foundation in science, technology, engineering, and math.',
    progress: 25,
    steps: [
      { id: 9, title: 'Calculus I', status: 'completed' as const },
      { id: 10, title: 'Physics I', status: 'current' as const },
      { id: 11, title: 'Introduction to Programming', status: 'locked' as const },
      { id: 12, title: 'Engineering Design', status: 'locked' as const },
    ],
  },
]

function stepIcon(status: string) {
  switch (status) {
    case 'completed': return <CheckCircle2 className="h-5 w-5 text-green-600" />
    case 'current': return <Circle className="h-5 w-5 text-primary-600" />
    default: return <Lock className="h-5 w-5 text-neutral-300" />
  }
}

export function LearningPathsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Route className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Learning Paths</h3>
          <p className="mt-1 text-sm text-neutral-500">Follow structured paths to achieve your goals</p>
        </div>
      </div>

      <div className="space-y-4">
        {PATHS.map((path) => (
          <div key={path.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{path.name}</h4>
                <p className="mt-0.5 text-xs text-neutral-500">{path.description}</p>
              </div>
              <span className="text-sm font-bold text-primary-600">{path.progress}%</span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-neutral-100">
              <div className="h-2 rounded-full bg-primary-500 transition-all" style={{ width: `${path.progress}%` }} />
            </div>
            <div className="mt-4 space-y-2">
              {path.steps.map((step) => (
                <div key={step.id} className={`flex items-center gap-3 rounded-lg px-3 py-2.5 ${step.status === 'current' ? 'bg-primary-50' : ''}`}>
                  {stepIcon(step.status)}
                  <span className={`flex-1 text-sm ${step.status === 'locked' ? 'text-neutral-400' : 'text-neutral-700'}`}>{step.title}</span>
                  {step.status !== 'locked' && <ChevronRight className="h-4 w-4 text-neutral-300" />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
