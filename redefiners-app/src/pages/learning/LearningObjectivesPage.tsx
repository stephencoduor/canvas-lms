import { Target, CheckCircle2, Circle, ChevronRight } from 'lucide-react'

const OBJECTIVES = [
  {
    course: 'Spanish 101',
    objectives: [
      { id: 1, text: 'Demonstrate basic conversational Spanish', met: true },
      { id: 2, text: 'Write short paragraphs in Spanish', met: true },
      { id: 3, text: 'Understand spoken Spanish at a beginner level', met: false },
      { id: 4, text: 'Read and comprehend simple Spanish texts', met: false },
    ],
  },
  {
    course: 'World History',
    objectives: [
      { id: 5, text: 'Analyze primary historical sources', met: true },
      { id: 6, text: 'Compare major world civilizations', met: false },
      { id: 7, text: 'Construct evidence-based historical arguments', met: false },
    ],
  },
  {
    course: 'Mathematics',
    objectives: [
      { id: 8, text: 'Apply integration techniques', met: true },
      { id: 9, text: 'Solve differential equations', met: false },
      { id: 10, text: 'Model real-world problems mathematically', met: false },
    ],
  },
]

export function LearningObjectivesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Target className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Learning Objectives</h3>
          <p className="mt-1 text-sm text-neutral-500">Track your progress toward course learning goals</p>
        </div>
      </div>

      <div className="space-y-4">
        {OBJECTIVES.map((group) => {
          const met = group.objectives.filter((o) => o.met).length
          const total = group.objectives.length
          const pct = Math.round((met / total) * 100)
          return (
            <div key={group.course} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-neutral-800">{group.course}</h4>
                <span className="text-xs font-medium text-primary-600">{met}/{total} met ({pct}%)</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-neutral-100">
                <div className="h-1.5 rounded-full bg-primary-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
              <ul className="mt-4 space-y-2">
                {group.objectives.map((obj) => (
                  <li key={obj.id} className="flex items-center gap-2.5">
                    {obj.met ? <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" /> : <Circle className="h-4 w-4 shrink-0 text-neutral-300" />}
                    <span className={`text-sm ${obj.met ? 'text-neutral-500 line-through' : 'text-neutral-700'}`}>{obj.text}</span>
                    <ChevronRight className="ml-auto h-3.5 w-3.5 text-neutral-300" />
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
