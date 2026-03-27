import { Wand2, BarChart3, PenTool, Layers, ArrowRight, Zap } from 'lucide-react'

const TOOLS = [
  {
    title: 'Polls & Surveys',
    description: 'Create real-time polls and surveys for student engagement.',
    icon: BarChart3,
    color: 'text-blue-600 bg-blue-50',
    features: ['Live voting', 'Multiple question types', 'Anonymous responses', 'Export results'],
  },
  {
    title: 'Whiteboard',
    description: 'Collaborative digital whiteboard for brainstorming and teaching.',
    icon: PenTool,
    color: 'text-emerald-600 bg-emerald-50',
    features: ['Real-time collaboration', 'Drawing tools', 'Text & shapes', 'Save & share'],
  },
  {
    title: 'Flashcards',
    description: 'Create and study with digital flashcard sets.',
    icon: Layers,
    color: 'text-purple-600 bg-purple-50',
    features: ['Spaced repetition', 'Image support', 'Share with class', 'Study statistics'],
  },
  {
    title: 'Quick Quiz',
    description: 'Generate instant quizzes for formative assessment.',
    icon: Zap,
    color: 'text-amber-600 bg-amber-50',
    features: ['Auto-grading', 'Timer mode', 'Leaderboard', 'Question bank'],
  },
]

export function InteractiveToolsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Wand2 className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Interactive Tools</h3>
          <p className="mt-1 text-sm text-neutral-500">Engage students with interactive learning activities</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {TOOLS.map((tool) => (
          <div key={tool.title} className="group rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${tool.color}`}>
                <tool.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-primary-500" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-neutral-800">{tool.title}</h4>
            <p className="mt-1 text-xs text-neutral-500">{tool.description}</p>
            <ul className="mt-3 space-y-1">
              {tool.features.map((f) => (
                <li key={f} className="flex items-center gap-1.5 text-xs text-neutral-400">
                  <span className="h-1 w-1 rounded-full bg-neutral-300" />
                  {f}
                </li>
              ))}
            </ul>
            <button type="button" className="mt-4 w-full rounded-lg bg-primary-50 py-2 text-xs font-medium text-primary-700 hover:bg-primary-100">
              Launch Tool
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
