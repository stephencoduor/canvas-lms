import { LayoutTemplate, Plus, Copy, Eye, Pencil, BookOpen, Users, Clock } from 'lucide-react'

const TEMPLATES = [
  { id: 1, name: 'Language Course — Standard', description: 'Standard template for language courses with listening, speaking, reading, and writing modules.', courses: 12, lastUpdated: '2026-03-20', modules: 8, assignments: 24 },
  { id: 2, name: 'STEM Foundation', description: 'Template for introductory STEM courses with lab components.', courses: 6, lastUpdated: '2026-03-15', modules: 10, assignments: 30 },
  { id: 3, name: 'Humanities Seminar', description: 'Discussion-based seminar template with essay assignments and peer review.', courses: 8, lastUpdated: '2026-03-10', modules: 6, assignments: 18 },
  { id: 4, name: 'Professional Development', description: 'Self-paced professional development template with certificates.', courses: 4, lastUpdated: '2026-02-28', modules: 5, assignments: 12 },
  { id: 5, name: 'Bootcamp Intensive', description: 'Short-term intensive course template with daily assignments.', courses: 3, lastUpdated: '2026-02-20', modules: 4, assignments: 40 },
]

export function CourseTemplatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LayoutTemplate className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Course Templates</h3>
            <p className="mt-1 text-sm text-neutral-500">Manage and create reusable course templates</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Template
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {TEMPLATES.map((t) => (
          <div key={t.id} className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="text-sm font-semibold text-neutral-800">{t.name}</h4>
            <p className="mt-1 text-xs text-neutral-500">{t.description}</p>
            <div className="mt-3 flex flex-wrap gap-2 text-xs text-neutral-400">
              <span className="flex items-center gap-1"><BookOpen className="h-3 w-3" />{t.modules} modules</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{t.courses} courses</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.lastUpdated}</span>
            </div>
            <div className="mt-4 flex gap-2 border-t pt-3">
              <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"><Eye className="h-3.5 w-3.5" /> Preview</button>
              <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"><Copy className="h-3.5 w-3.5" /> Clone</button>
              <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50"><Pencil className="h-3.5 w-3.5" /> Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
