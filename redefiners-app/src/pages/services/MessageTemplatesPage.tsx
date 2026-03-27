import { useState } from 'react'
import { FileText, Plus, Copy, Pencil, Trash2, Check } from 'lucide-react'

interface Template {
  id: number
  name: string
  category: string
  body: string
}

const INITIAL_TEMPLATES: Template[] = [
  { id: 1, name: 'Absence Notification', category: 'Academic', body: 'Dear Professor, I am writing to inform you that I will be unable to attend class on [DATE] due to [REASON]. I will review the materials and complete any missed work.' },
  { id: 2, name: 'Extension Request', category: 'Academic', body: 'Dear Professor, I am requesting an extension on [ASSIGNMENT] originally due [DATE]. The reason is [REASON]. I would appreciate your consideration.' },
  { id: 3, name: 'Study Group Invitation', category: 'Social', body: 'Hi! Would you like to join our study group for [COURSE]? We meet [DAY/TIME] at [LOCATION]. Let me know if you are interested!' },
  { id: 4, name: 'Thank You Note', category: 'General', body: 'Thank you for [REASON]. I really appreciate your help and support. It made a significant difference.' },
]

export function MessageTemplatesPage() {
  const [templates] = useState<Template[]>(INITIAL_TEMPLATES)
  const [copiedId, setCopiedId] = useState<number | null>(null)

  function handleCopy(template: Template) {
    navigator.clipboard.writeText(template.body).catch(() => {})
    setCopiedId(template.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Message Templates</h3>
            <p className="mt-1 text-sm text-neutral-500">Saved templates for quick messaging</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Template
        </button>
      </div>

      <div className="space-y-3">
        {templates.map((t) => (
          <div key={t.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-neutral-800">{t.name}</h4>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">{t.category}</span>
                </div>
                <p className="mt-2 text-sm text-neutral-600">{t.body}</p>
              </div>
              <div className="flex shrink-0 gap-1">
                <button type="button" onClick={() => handleCopy(t)} className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-primary-600" title="Copy to clipboard">
                  {copiedId === t.id ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
                <button type="button" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-primary-600" title="Edit">
                  <Pencil className="h-4 w-4" />
                </button>
                <button type="button" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-red-500" title="Delete">
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
