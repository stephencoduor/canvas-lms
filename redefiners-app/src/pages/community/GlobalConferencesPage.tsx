import { useState } from 'react'
import { Video, Calendar, Clock, Users, ExternalLink, Plus } from 'lucide-react'

type ConfTab = 'upcoming' | 'past'

const CONFERENCES = [
  { id: 1, title: 'Language Learning Best Practices', host: 'Prof. Martinez', date: '2026-03-30', time: '10:00 AM', duration: '60 min', attendees: 24, status: 'upcoming' as const },
  { id: 2, title: 'Cross-Cultural Communication Workshop', host: 'Dr. Patel', date: '2026-04-02', time: '2:00 PM', duration: '90 min', attendees: 18, status: 'upcoming' as const },
  { id: 3, title: 'Student Town Hall', host: 'Dean Richards', date: '2026-04-05', time: '11:00 AM', duration: '45 min', attendees: 56, status: 'upcoming' as const },
  { id: 4, title: 'Academic Planning Session', host: 'Advising Team', date: '2026-03-20', time: '3:00 PM', duration: '60 min', attendees: 32, status: 'past' as const },
  { id: 5, title: 'Research Showcase', host: 'Faculty Council', date: '2026-03-15', time: '1:00 PM', duration: '120 min', attendees: 45, status: 'past' as const },
]

export function GlobalConferencesPage() {
  const [tab, setTab] = useState<ConfTab>('upcoming')

  const items = CONFERENCES.filter((c) => c.status === tab)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Conferences</h3>
            <p className="mt-1 text-sm text-neutral-500">Join and manage virtual conferences</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Schedule Conference
        </button>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['upcoming', 'past'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((conf) => (
          <div key={conf.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
            <div className={`rounded-lg p-2.5 ${conf.status === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-neutral-100 text-neutral-500'}`}>
              <Video className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-800">{conf.title}</h4>
              <p className="text-xs text-neutral-500">Hosted by {conf.host}</p>
              <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{conf.date}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{conf.time} ({conf.duration})</span>
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{conf.attendees} attendees</span>
              </div>
            </div>
            {conf.status === 'upcoming' ? (
              <button type="button" className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-xs text-white hover:bg-primary-700">
                Join <ExternalLink className="h-3 w-3" />
              </button>
            ) : (
              <button type="button" className="rounded-lg bg-neutral-100 px-4 py-2 text-xs text-neutral-600 hover:bg-neutral-200">
                View Recording
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
