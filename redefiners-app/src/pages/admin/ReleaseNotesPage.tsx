import { useState } from 'react'
import { Megaphone, Plus, Trash2, Send } from 'lucide-react'

interface ReleaseNote {
  id: string
  title: string
  body: string
  publishDate: string
  published: boolean
}

const MOCK_NOTES: ReleaseNote[] = [
  {
    id: '1',
    title: 'Canvas LMS v3.2 - Enhanced Gradebook',
    body: 'The gradebook has been redesigned with improved filtering, bulk actions, and a new grade history view.',
    publishDate: '2026-03-15',
    published: true,
  },
  {
    id: '2',
    title: 'Canvas LMS v3.1 - Discussion Improvements',
    body: 'Discussions now support threaded replies, emoji reactions, and inline image uploads.',
    publishDate: '2026-02-20',
    published: true,
  },
]

export function ReleaseNotesPage() {
  const [notes] = useState<ReleaseNote[]>(MOCK_NOTES)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [publishDate, setPublishDate] = useState('')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Megaphone className="h-6 w-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-800">Release Notes</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Release Note
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Create Release Note</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Release note title..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Body</label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={6}
                placeholder="Describe the changes in this release..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Publish Date</label>
              <input
                type="date"
                value={publishDate}
                onChange={(e) => setPublishDate(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Send className="h-4 w-4" />
              Publish
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {notes.map((note) => (
          <div key={note.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{note.title}</h4>
                <p className="mt-2 text-sm text-neutral-600">{note.body}</p>
                <p className="mt-2 text-xs text-neutral-400">
                  Published: {note.publishDate}
                </p>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
