import { useState } from 'react'
import { Film, Search, Play, Download, Clock, Calendar, Users } from 'lucide-react'

const RECORDINGS = [
  { id: 1, title: 'Academic Planning Session', host: 'Advising Team', date: '2026-03-20', duration: '58:32', views: 89, size: '420 MB' },
  { id: 2, title: 'Research Showcase', host: 'Faculty Council', date: '2026-03-15', duration: '1:52:10', views: 134, size: '890 MB' },
  { id: 3, title: 'Language Lab Open House', host: 'Prof. Martinez', date: '2026-03-10', duration: '45:20', views: 67, size: '340 MB' },
  { id: 4, title: 'Student Government Meeting', host: 'SGA', date: '2026-03-05', duration: '1:15:45', views: 45, size: '560 MB' },
  { id: 5, title: 'Orientation Webinar', host: 'Admissions', date: '2026-02-28', duration: '38:10', views: 212, size: '280 MB' },
]

export function RecordingsPage() {
  const [search, setSearch] = useState('')

  const items = RECORDINGS.filter((r) => !search || r.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Film className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Recordings</h3>
          <p className="mt-1 text-sm text-neutral-500">Browse conference and session recordings</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search recordings..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
      </div>

      <div className="space-y-3">
        {items.map((rec) => (
          <div key={rec.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
            <button type="button" className="flex h-16 w-24 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
              <Play className="h-6 w-6 text-white" />
            </button>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-800">{rec.title}</h4>
              <p className="text-xs text-neutral-500">Hosted by {rec.host}</p>
              <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{rec.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rec.duration}</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{rec.views} views</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="button" className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100">
                <Play className="h-3.5 w-3.5" />
              </button>
              <button type="button" className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-200">
                <Download className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
