import { useState } from 'react'
import { Megaphone, Send, Calendar, Users, Bold, Italic, Link, List, Image } from 'lucide-react'

export function AnnouncementEditorPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [audience, setAudience] = useState('all')
  const [scheduleDate, setScheduleDate] = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit() {
    if (!title.trim() || !content.trim()) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col items-center justify-center rounded-lg bg-white py-16 shadow-sm">
          <Megaphone className="h-12 w-12 text-green-500" />
          <h3 className="mt-4 text-lg font-semibold text-neutral-800">Announcement Published!</h3>
          <p className="mt-1 text-sm text-neutral-500">Your announcement has been sent to the selected audience.</p>
          <button type="button" onClick={() => { setSubmitted(false); setTitle(''); setContent('') }} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
            Create Another
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Megaphone className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Create Announcement</h3>
          <p className="mt-1 text-sm text-neutral-500">Compose and publish announcements to your audience</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Title</label>
            <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Announcement title" className="w-full rounded-lg border border-neutral-200 px-4 py-2.5 text-sm focus:border-primary-400 focus:outline-none focus:ring-1 focus:ring-primary-400" />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">Content</label>
            <div className="rounded-lg border border-neutral-200 focus-within:border-primary-400 focus-within:ring-1 focus-within:ring-primary-400">
              <div className="flex gap-1 border-b px-3 py-2">
                <button type="button" className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"><Bold className="h-4 w-4" /></button>
                <button type="button" className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"><Italic className="h-4 w-4" /></button>
                <button type="button" className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"><Link className="h-4 w-4" /></button>
                <button type="button" className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"><List className="h-4 w-4" /></button>
                <button type="button" className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600"><Image className="h-4 w-4" /></button>
              </div>
              <textarea value={content} onChange={(e) => setContent(e.target.value)} rows={8} placeholder="Write your announcement..." className="w-full resize-none border-0 px-4 py-3 text-sm focus:outline-none" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                <span className="flex items-center gap-1"><Users className="h-4 w-4" /> Audience</span>
              </label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm">
                <option value="all">All Students</option>
                <option value="spanish">Spanish 101</option>
                <option value="history">World History</option>
                <option value="math">Calculus II</option>
                <option value="instructors">Instructors Only</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> Schedule (optional)</span>
              </label>
              <input type="datetime-local" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} className="w-full rounded-lg border border-neutral-200 px-3 py-2.5 text-sm" />
            </div>
          </div>

          <div className="flex items-center justify-between border-t pt-4">
            <p className="text-xs text-neutral-400">{content.length} characters</p>
            <div className="flex gap-2">
              <button type="button" className="rounded-lg border border-neutral-200 px-4 py-2 text-sm text-neutral-600 hover:bg-neutral-50">Save Draft</button>
              <button type="button" onClick={handleSubmit} className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
                <Send className="h-4 w-4" /> {scheduleDate ? 'Schedule' : 'Publish Now'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
