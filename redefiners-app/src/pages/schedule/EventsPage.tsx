import { useState } from 'react'
import { CalendarCheck, MapPin, Clock, Users, ExternalLink } from 'lucide-react'

type EventFilter = 'all' | 'registered' | 'open'

const EVENTS = [
  { id: 1, title: 'International Culture Fair', date: '2026-04-02', time: '10:00 AM - 4:00 PM', location: 'Student Center Lawn', spots: 200, registered: 145, isRegistered: true, category: 'Cultural' },
  { id: 2, title: 'Career Networking Night', date: '2026-04-05', time: '6:00 PM - 8:00 PM', location: 'Grand Ballroom', spots: 100, registered: 78, isRegistered: false, category: 'Career' },
  { id: 3, title: 'Language Exchange Mixer', date: '2026-04-08', time: '4:00 PM - 6:00 PM', location: 'Language Lab', spots: 40, registered: 40, isRegistered: true, category: 'Social' },
  { id: 4, title: 'Guest Lecture: AI in Education', date: '2026-04-12', time: '2:00 PM - 3:30 PM', location: 'Auditorium A', spots: 150, registered: 89, isRegistered: false, category: 'Academic' },
  { id: 5, title: 'Spring Festival', date: '2026-04-18', time: '11:00 AM - 7:00 PM', location: 'Campus Green', spots: 500, registered: 312, isRegistered: false, category: 'Social' },
]

export function EventsPage() {
  const [filter, setFilter] = useState<EventFilter>('all')

  const items = EVENTS.filter((e) => {
    if (filter === 'registered') return e.isRegistered
    if (filter === 'open') return e.registered < e.spots
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CalendarCheck className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Events</h3>
          <p className="mt-1 text-sm text-neutral-500">Discover and register for campus events</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['all', 'registered', 'open'] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {f === 'open' ? 'Open Spots' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {items.map((ev) => {
          const full = ev.registered >= ev.spots
          return (
            <div key={ev.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
              <div className="w-14 text-center">
                <p className="text-xs text-neutral-400">{new Date(ev.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                <p className="text-xl font-bold text-neutral-800">{new Date(ev.date).getDate()}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-neutral-800">{ev.title}</h4>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">{ev.category}</span>
                </div>
                <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{ev.time}</span>
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{ev.location}</span>
                  <span className="flex items-center gap-1"><Users className="h-3 w-3" />{ev.registered}/{ev.spots} spots</span>
                </div>
              </div>
              {ev.isRegistered ? (
                <span className="rounded-full bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700">Registered</span>
              ) : (
                <button type="button" disabled={full} className="flex items-center gap-1 rounded-lg bg-primary-600 px-4 py-2 text-xs text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50">
                  {full ? 'Full' : <><ExternalLink className="h-3 w-3" /> Register</>}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
