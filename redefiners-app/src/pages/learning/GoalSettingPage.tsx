import { useState } from 'react'
import { Crosshair, Plus, CheckCircle2, Circle, Trash2, Calendar } from 'lucide-react'

interface Goal {
  id: number
  text: string
  deadline: string
  completed: boolean
  category: string
}

const INITIAL_GOALS: Goal[] = [
  { id: 1, text: 'Complete Spanish 102 with an A', deadline: '2026-05-15', completed: false, category: 'Academic' },
  { id: 2, text: 'Read 12 books this semester', deadline: '2026-05-30', completed: false, category: 'Personal' },
  { id: 3, text: 'Attend 5 networking events', deadline: '2026-04-30', completed: false, category: 'Career' },
  { id: 4, text: 'Join a study group', deadline: '2026-02-28', completed: true, category: 'Academic' },
  { id: 5, text: 'Build a personal portfolio website', deadline: '2026-04-15', completed: false, category: 'Career' },
]

export function GoalSettingPage() {
  const [goals, setGoals] = useState<Goal[]>(INITIAL_GOALS)
  const [showForm, setShowForm] = useState(false)
  const [newGoal, setNewGoal] = useState('')
  const [newDeadline, setNewDeadline] = useState('')
  const [newCategory, setNewCategory] = useState('Academic')

  function toggleGoal(id: number) {
    setGoals((prev) => prev.map((g) => g.id === id ? { ...g, completed: !g.completed } : g))
  }

  function removeGoal(id: number) {
    setGoals((prev) => prev.filter((g) => g.id !== id))
  }

  function addGoal() {
    if (!newGoal.trim()) return
    setGoals((prev) => [...prev, { id: Date.now(), text: newGoal.trim(), deadline: newDeadline || '2026-06-01', completed: false, category: newCategory }])
    setNewGoal('')
    setNewDeadline('')
    setShowForm(false)
  }

  const active = goals.filter((g) => !g.completed)
  const done = goals.filter((g) => g.completed)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Crosshair className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Goal Setting</h3>
            <p className="mt-1 text-sm text-neutral-500">Set and track your personal and academic goals</p>
          </div>
        </div>
        <button type="button" onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Add Goal
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="grid gap-3 sm:grid-cols-3">
            <input type="text" value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="What do you want to achieve?" className="col-span-full rounded-lg border border-neutral-200 px-3 py-2 text-sm sm:col-span-1" />
            <input type="date" value={newDeadline} onChange={(e) => setNewDeadline(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
            <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm">
              <option>Academic</option>
              <option>Personal</option>
              <option>Career</option>
            </select>
          </div>
          <button type="button" onClick={addGoal} className="mt-3 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">Save Goal</button>
        </div>
      )}

      <div>
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Active Goals ({active.length})</h4>
        <div className="space-y-2">
          {active.map((g) => (
            <div key={g.id} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm">
              <button type="button" onClick={() => toggleGoal(g.id)}><Circle className="h-5 w-5 text-neutral-300 hover:text-primary-500" /></button>
              <div className="flex-1">
                <p className="text-sm text-neutral-800">{g.text}</p>
                <div className="mt-0.5 flex items-center gap-2 text-xs text-neutral-400">
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5">{g.category}</span>
                  <span className="flex items-center gap-0.5"><Calendar className="h-3 w-3" />{g.deadline}</span>
                </div>
              </div>
              <button type="button" onClick={() => removeGoal(g.id)} className="text-neutral-300 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      </div>

      {done.length > 0 && (
        <div>
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400">Completed ({done.length})</h4>
          <div className="space-y-2">
            {done.map((g) => (
              <div key={g.id} className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 opacity-60 shadow-sm">
                <button type="button" onClick={() => toggleGoal(g.id)}><CheckCircle2 className="h-5 w-5 text-green-600" /></button>
                <p className="flex-1 text-sm text-neutral-500 line-through">{g.text}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
