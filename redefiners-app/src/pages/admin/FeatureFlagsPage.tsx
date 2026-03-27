import { useState } from 'react'
import { Flag, Search } from 'lucide-react'

type FlagState = 'on' | 'off' | 'allowed'

interface FeatureFlag {
  id: string
  name: string
  description: string
  state: FlagState
}

const INITIAL_FLAGS: FeatureFlag[] = [
  { id: '1', name: 'New Gradebook', description: 'Enable the redesigned gradebook interface with enhanced filtering and sorting.', state: 'on' },
  { id: '2', name: 'Rich Content Editor v2', description: 'Use the updated rich content editor with improved media embedding.', state: 'on' },
  { id: '3', name: 'Student Planner', description: 'Allow students to access the integrated planner for assignment tracking.', state: 'allowed' },
  { id: '4', name: 'Canvas Studio', description: 'Enable video creation and management tools within courses.', state: 'off' },
  { id: '5', name: 'Discussion Redesign', description: 'Enable threaded discussions with reactions and inline media.', state: 'allowed' },
  { id: '6', name: 'Analytics 2.0', description: 'New analytics dashboard with detailed student engagement data.', state: 'off' },
  { id: '7', name: 'Peer Review Assignments', description: 'Enable peer review workflow for student assignments.', state: 'on' },
  { id: '8', name: 'Direct Share', description: 'Allow direct sharing of content items between courses.', state: 'allowed' },
]

const STATE_STYLES: Record<FlagState, string> = {
  on: 'bg-emerald-100 text-emerald-700',
  off: 'bg-neutral-100 text-neutral-600',
  allowed: 'bg-blue-100 text-blue-700',
}

export function FeatureFlagsPage() {
  const [flags, setFlags] = useState<FeatureFlag[]>(INITIAL_FLAGS)
  const [filter, setFilter] = useState('')

  const cycleState = (id: string) => {
    setFlags((prev) =>
      prev.map((f) => {
        if (f.id !== id) return f
        const next: FlagState = f.state === 'on' ? 'allowed' : f.state === 'allowed' ? 'off' : 'on'
        return { ...f, state: next }
      })
    )
  }

  const filtered = flags.filter(
    (f) =>
      f.name.toLowerCase().includes(filter.toLowerCase()) ||
      f.description.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Flag className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Feature Flags</h3>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter feature flags..."
          className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="divide-y divide-neutral-100">
          {filtered.map((flag) => (
            <div key={flag.id} className="flex items-center justify-between p-5">
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-neutral-800">{flag.name}</h4>
                <p className="mt-0.5 text-xs text-neutral-500">{flag.description}</p>
              </div>
              <button
                type="button"
                onClick={() => cycleState(flag.id)}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${STATE_STYLES[flag.state]}`}
              >
                {flag.state.toUpperCase()}
              </button>
            </div>
          ))}
        </div>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">No feature flags match the filter.</p>
        )}
      </div>
    </div>
  )
}
