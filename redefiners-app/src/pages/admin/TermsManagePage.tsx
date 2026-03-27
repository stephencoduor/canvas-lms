import { useState } from 'react'
import { Calendar, Plus, Pencil, Trash2, Save } from 'lucide-react'

interface Term {
  id: string
  name: string
  startDate: string
  endDate: string
  gradingPeriodStart: string
  gradingPeriodEnd: string
}

const MOCK_TERMS: Term[] = [
  {
    id: '1',
    name: 'Spring 2026',
    startDate: '2026-01-15',
    endDate: '2026-05-20',
    gradingPeriodStart: '2026-01-15',
    gradingPeriodEnd: '2026-05-15',
  },
  {
    id: '2',
    name: 'Fall 2025',
    startDate: '2025-08-25',
    endDate: '2025-12-18',
    gradingPeriodStart: '2025-08-25',
    gradingPeriodEnd: '2025-12-15',
  },
]

export function TermsManagePage() {
  const [terms] = useState<Term[]>(MOCK_TERMS)
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formStart, setFormStart] = useState('')
  const [formEnd, setFormEnd] = useState('')
  const [formGradingStart, setFormGradingStart] = useState('')
  const [formGradingEnd, setFormGradingEnd] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-6 w-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-800">Manage Terms</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Term
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">New Term</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Term Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Summer 2026"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Start Date</label>
                <input
                  type="date"
                  value={formStart}
                  onChange={(e) => setFormStart(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">End Date</label>
                <input
                  type="date"
                  value={formEnd}
                  onChange={(e) => setFormEnd(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            <div className="border-t border-neutral-100 pt-4">
              <h5 className="mb-3 text-sm font-semibold text-neutral-700">Grading Period</h5>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Grading Start</label>
                  <input
                    type="date"
                    value={formGradingStart}
                    onChange={(e) => setFormGradingStart(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">Grading End</label>
                  <input
                    type="date"
                    value={formGradingEnd}
                    onChange={(e) => setFormGradingEnd(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Term
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {terms.map((term) => (
          <div key={term.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{term.name}</h4>
                <p className="mt-1 text-xs text-neutral-500">
                  {term.startDate} to {term.endDate}
                </p>
                <p className="text-xs text-neutral-400">
                  Grading: {term.gradingPeriodStart} to {term.gradingPeriodEnd}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
