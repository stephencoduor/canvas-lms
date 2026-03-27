import { useState } from 'react'
import { GraduationCap, Clock, Calendar, MapPin, Video } from 'lucide-react'

type DayFilter = 'all' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri'

const TUTORS = [
  { id: 1, name: 'Alex Rivera', subject: 'Mathematics', days: ['mon', 'wed', 'fri'], time: '9:00 AM - 12:00 PM', mode: 'In-Person', location: 'Library Room 204', available: true },
  { id: 2, name: 'Priya Patel', subject: 'Chemistry', days: ['tue', 'thu'], time: '1:00 PM - 4:00 PM', mode: 'Online', location: 'Zoom', available: true },
  { id: 3, name: 'James Kim', subject: 'Writing Center', days: ['mon', 'tue', 'wed', 'thu', 'fri'], time: '10:00 AM - 6:00 PM', mode: 'Hybrid', location: 'Student Center 105', available: false },
  { id: 4, name: 'Maria Santos', subject: 'Physics', days: ['mon', 'wed'], time: '2:00 PM - 5:00 PM', mode: 'In-Person', location: 'Science Building 301', available: true },
  { id: 5, name: 'Tom Wilson', subject: 'Computer Science', days: ['tue', 'thu', 'fri'], time: '11:00 AM - 3:00 PM', mode: 'Online', location: 'Discord', available: true },
]

const DAY_OPTIONS: { value: DayFilter; label: string }[] = [
  { value: 'all', label: 'All Days' },
  { value: 'mon', label: 'Mon' },
  { value: 'tue', label: 'Tue' },
  { value: 'wed', label: 'Wed' },
  { value: 'thu', label: 'Thu' },
  { value: 'fri', label: 'Fri' },
]

export function TutoringPage() {
  const [dayFilter, setDayFilter] = useState<DayFilter>('all')

  const filtered = TUTORS.filter((t) => dayFilter === 'all' || t.days.includes(dayFilter))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Tutoring</h3>
          <p className="mt-1 text-sm text-neutral-500">Find available tutors and book sessions</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {DAY_OPTIONS.map((opt) => (
          <button key={opt.value} type="button" onClick={() => setDayFilter(opt.value)} className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${dayFilter === opt.value ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {opt.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((tutor) => (
          <div key={tutor.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {tutor.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-neutral-800">{tutor.name}</h4>
                <span className={`rounded-full px-2 py-0.5 text-xs ${tutor.available ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                  {tutor.available ? 'Available' : 'Booked'}
                </span>
              </div>
              <p className="text-xs font-medium text-primary-600">{tutor.subject}</p>
              <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tutor.time}</span>
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{tutor.days.map((d) => d.charAt(0).toUpperCase() + d.slice(1)).join(', ')}</span>
                <span className="flex items-center gap-1">{tutor.mode === 'Online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}{tutor.location}</span>
              </div>
            </div>
            <button type="button" disabled={!tutor.available} className="rounded-lg bg-primary-600 px-4 py-2 text-xs text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50">
              Book Session
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
