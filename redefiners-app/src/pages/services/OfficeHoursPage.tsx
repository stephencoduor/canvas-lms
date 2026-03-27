import { useState } from 'react'
import { DoorOpen, Clock, Video, MapPin, Calendar } from 'lucide-react'

type DayFilter = 'all' | 'today' | 'tomorrow'

const OFFICE_HOURS = [
  { id: 1, instructor: 'Prof. Martinez', course: 'Spanish 101', day: 'Monday', time: '10:00 AM - 11:30 AM', mode: 'In-Person', location: 'Language Bldg 204', available: true },
  { id: 2, instructor: 'Dr. Chen', course: 'World History', day: 'Monday', time: '2:00 PM - 3:30 PM', mode: 'Online', location: 'Zoom', available: true },
  { id: 3, instructor: 'Prof. Adams', course: 'Calculus II', day: 'Tuesday', time: '9:00 AM - 10:00 AM', mode: 'In-Person', location: 'Math Bldg 118', available: false },
  { id: 4, instructor: 'Dr. Williams', course: 'English Composition', day: 'Wednesday', time: '1:00 PM - 2:30 PM', mode: 'Hybrid', location: 'Humanities 305 / Zoom', available: true },
  { id: 5, instructor: 'Prof. Liu', course: 'Mandarin 201', day: 'Thursday', time: '11:00 AM - 12:00 PM', mode: 'Online', location: 'Google Meet', available: true },
]

export function OfficeHoursPage() {
  const [filter, setFilter] = useState<DayFilter>('all')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DoorOpen className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Office Hours</h3>
          <p className="mt-1 text-sm text-neutral-500">Schedule time with your instructors</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['all', 'today', 'tomorrow'] as const).map((f) => (
          <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${filter === f ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {f === 'all' ? 'All Days' : f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {OFFICE_HOURS.map((oh) => (
          <div key={oh.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {oh.instructor.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-neutral-800">{oh.instructor}</h4>
              <p className="text-xs text-primary-600">{oh.course}</p>
              <div className="mt-1.5 flex flex-wrap gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{oh.day}</span>
                <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{oh.time}</span>
                <span className="flex items-center gap-1">{oh.mode === 'Online' ? <Video className="h-3 w-3" /> : <MapPin className="h-3 w-3" />}{oh.location}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`rounded-full px-2 py-0.5 text-xs ${oh.available ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>
                {oh.available ? 'Available' : 'Full'}
              </span>
              <button type="button" disabled={!oh.available} className="rounded-lg bg-primary-600 px-4 py-2 text-xs text-white hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50">
                Book Slot
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
