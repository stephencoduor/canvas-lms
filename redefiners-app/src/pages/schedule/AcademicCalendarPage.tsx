import { CalendarDays, ChevronLeft, ChevronRight, GraduationCap, Flag, BookOpen } from 'lucide-react'
import { useState } from 'react'

const ACADEMIC_DATES = [
  { id: 1, date: '2026-01-12', title: 'Spring Semester Begins', type: 'semester' as const },
  { id: 2, date: '2026-01-19', title: 'Martin Luther King Jr. Day — No Classes', type: 'holiday' as const },
  { id: 3, date: '2026-02-16', title: 'Presidents Day — No Classes', type: 'holiday' as const },
  { id: 4, date: '2026-03-02', title: 'Midterm Exams Begin', type: 'academic' as const },
  { id: 5, date: '2026-03-06', title: 'Midterm Exams End', type: 'academic' as const },
  { id: 6, date: '2026-03-16', title: 'Spring Break Begins', type: 'holiday' as const },
  { id: 7, date: '2026-03-20', title: 'Spring Break Ends', type: 'holiday' as const },
  { id: 8, date: '2026-04-06', title: 'Course Registration Opens (Fall)', type: 'academic' as const },
  { id: 9, date: '2026-04-20', title: 'Last Day to Withdraw', type: 'academic' as const },
  { id: 10, date: '2026-05-04', title: 'Final Exams Begin', type: 'academic' as const },
  { id: 11, date: '2026-05-08', title: 'Final Exams End', type: 'academic' as const },
  { id: 12, date: '2026-05-15', title: 'Commencement Ceremony', type: 'semester' as const },
]

function typeStyle(type: string) {
  switch (type) {
    case 'semester': return { icon: GraduationCap, color: 'text-primary-600 bg-primary-50', label: 'Semester' }
    case 'holiday': return { icon: Flag, color: 'text-red-600 bg-red-50', label: 'Holiday' }
    default: return { icon: BookOpen, color: 'text-amber-600 bg-amber-50', label: 'Academic' }
  }
}

type TypeFilter = 'all' | 'semester' | 'holiday' | 'academic'

export function AcademicCalendarPage() {
  const [filter, setFilter] = useState<TypeFilter>('all')

  const items = ACADEMIC_DATES.filter((d) => filter === 'all' || d.type === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <CalendarDays className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Academic Calendar</h3>
          <p className="mt-1 text-sm text-neutral-500">Important dates for Spring 2026</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {(['all', 'semester', 'academic', 'holiday'] as const).map((f) => (
            <button key={f} type="button" onClick={() => setFilter(f)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === f ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {f}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600"><ChevronLeft className="h-4 w-4" /></button>
          <span className="text-sm font-medium text-neutral-700">Spring 2026</span>
          <button type="button" className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-600"><ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((d) => {
          const s = typeStyle(d.type)
          const past = new Date(d.date) < new Date()
          return (
            <div key={d.id} className={`flex items-center gap-4 rounded-lg bg-white px-5 py-4 shadow-sm ${past ? 'opacity-50' : ''}`}>
              <div className="w-16 text-center">
                <p className="text-xs text-neutral-400">{new Date(d.date).toLocaleDateString(undefined, { month: 'short' })}</p>
                <p className="text-xl font-bold text-neutral-800">{new Date(d.date).getDate()}</p>
              </div>
              <div className={`rounded-lg p-2 ${s.color}`}><s.icon className="h-4 w-4" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-neutral-800">{d.title}</h4>
                <span className={`mt-0.5 inline-block rounded-full px-2 py-0.5 text-xs ${s.color}`}>{s.label}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
