import { useState } from 'react'
import { useParams } from 'react-router'
import { LayoutList, Plus, Pencil, Trash2, Save } from 'lucide-react'

interface Section {
  id: string
  name: string
  studentCount: number
  startDate: string | null
  endDate: string | null
}

const MOCK_SECTIONS: Section[] = [
  { id: '1', name: 'Default Section', studentCount: 28, startDate: null, endDate: null },
  { id: '2', name: 'Section A - Morning', studentCount: 15, startDate: '2026-01-15', endDate: '2026-05-20' },
  { id: '3', name: 'Section B - Afternoon', studentCount: 13, startDate: '2026-01-15', endDate: '2026-05-20' },
]

export function SectionManagementPage() {
  const { courseId } = useParams()
  const [sections] = useState<Section[]>(MOCK_SECTIONS)
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')
  const [newStart, setNewStart] = useState('')
  const [newEnd, setNewEnd] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutList className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Course Sections</h3>
            <p className="mt-1 text-sm text-neutral-500">Course {courseId}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Section
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">New Section</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Section Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g., Section C - Evening"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Start Date (optional)</label>
                <input
                  type="date"
                  value={newStart}
                  onChange={(e) => setNewStart(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">End Date (optional)</label>
                <input
                  type="date"
                  value={newEnd}
                  onChange={(e) => setNewEnd(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Create Section
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sections.map((section) => (
          <div key={section.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{section.name}</h4>
                <p className="mt-1 text-xs text-neutral-500">
                  {section.studentCount} students
                  {section.startDate && (
                    <> &middot; {section.startDate} to {section.endDate}</>
                  )}
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
