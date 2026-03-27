import { Award, TrendingUp } from 'lucide-react'

const COMPETENCIES = [
  { id: 1, name: 'Oral Communication', level: 'Proficient', score: 85, maxScore: 100, category: 'Language Skills' },
  { id: 2, name: 'Written Expression', level: 'Developing', score: 62, maxScore: 100, category: 'Language Skills' },
  { id: 3, name: 'Cultural Awareness', level: 'Advanced', score: 92, maxScore: 100, category: 'Global Competency' },
  { id: 4, name: 'Critical Thinking', level: 'Proficient', score: 78, maxScore: 100, category: 'Cognitive Skills' },
  { id: 5, name: 'Collaboration', level: 'Advanced', score: 90, maxScore: 100, category: 'Social Skills' },
  { id: 6, name: 'Digital Literacy', level: 'Developing', score: 55, maxScore: 100, category: 'Technical Skills' },
  { id: 7, name: 'Research Skills', level: 'Proficient', score: 73, maxScore: 100, category: 'Cognitive Skills' },
]

function levelColor(level: string): string {
  switch (level) {
    case 'Advanced': return 'text-green-700 bg-green-50'
    case 'Proficient': return 'text-blue-700 bg-blue-50'
    default: return 'text-amber-700 bg-amber-50'
  }
}

function barColor(level: string): string {
  switch (level) {
    case 'Advanced': return 'bg-green-500'
    case 'Proficient': return 'bg-blue-500'
    default: return 'bg-amber-500'
  }
}

export function CompetenciesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Award className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Competencies</h3>
          <p className="mt-1 text-sm text-neutral-500">Track your competency mastery across skill areas</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {['Advanced', 'Proficient', 'Developing'].map((level) => {
          const count = COMPETENCIES.filter((c) => c.level === level).length
          return (
            <div key={level} className="rounded-lg bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className={`h-4 w-4 ${level === 'Advanced' ? 'text-green-600' : level === 'Proficient' ? 'text-blue-600' : 'text-amber-600'}`} />
                <span className="text-sm font-medium text-neutral-700">{level}</span>
              </div>
              <p className="mt-1 text-2xl font-bold text-neutral-800">{count}</p>
              <p className="text-xs text-neutral-400">competencies</p>
            </div>
          )
        })}
      </div>

      <div className="space-y-3">
        {COMPETENCIES.map((c) => (
          <div key={c.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{c.name}</h4>
                <p className="text-xs text-neutral-400">{c.category}</p>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${levelColor(c.level)}`}>{c.level}</span>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-neutral-100">
                <div className={`h-2 rounded-full ${barColor(c.level)}`} style={{ width: `${c.score}%` }} />
              </div>
              <span className="text-xs font-medium text-neutral-600">{c.score}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
