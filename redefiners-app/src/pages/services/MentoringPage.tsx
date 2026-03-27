import { useState } from 'react'
import { Users, Calendar, Clock, CheckCircle2, UserPlus } from 'lucide-react'

const MENTORS = [
  { id: 1, name: 'Dr. Sarah Johnson', expertise: 'Computer Science', availability: 'Mon, Wed, Fri', avatar: 'SJ', matched: true },
  { id: 2, name: 'Prof. Michael Lee', expertise: 'Business Administration', availability: 'Tue, Thu', avatar: 'ML', matched: false },
  { id: 3, name: 'Dr. Emily Davis', expertise: 'Language Arts', availability: 'Mon-Fri', avatar: 'ED', matched: false },
]

const SESSIONS = [
  { id: 1, mentor: 'Dr. Sarah Johnson', date: '2026-03-28', time: '2:00 PM', topic: 'Career Planning', status: 'upcoming' as const },
  { id: 2, mentor: 'Dr. Sarah Johnson', date: '2026-03-21', time: '2:00 PM', topic: 'Course Selection', status: 'completed' as const },
  { id: 3, mentor: 'Dr. Sarah Johnson', date: '2026-03-14', time: '3:00 PM', topic: 'Research Opportunities', status: 'completed' as const },
]

export function MentoringPage() {
  const [tab, setTab] = useState<'sessions' | 'mentors'>('sessions')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Users className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Mentoring</h3>
          <p className="mt-1 text-sm text-neutral-500">Connect with mentors and track sessions</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['sessions', 'mentors'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'sessions' ? 'My Sessions' : 'Find a Mentor'}
          </button>
        ))}
      </div>

      {tab === 'sessions' ? (
        <div className="space-y-3">
          {SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center gap-4 rounded-lg bg-white p-4 shadow-sm">
              <div className={`rounded-lg p-2.5 ${s.status === 'upcoming' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                {s.status === 'upcoming' ? <Calendar className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-neutral-800">{s.topic}</h4>
                <p className="text-xs text-neutral-500">{s.mentor}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-700">{s.date}</p>
                <p className="flex items-center gap-1 text-xs text-neutral-400"><Clock className="h-3 w-3" />{s.time}</p>
              </div>
              {s.status === 'upcoming' && (
                <button type="button" className="rounded-lg bg-primary-600 px-3 py-1.5 text-xs text-white hover:bg-primary-700">Join</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENTORS.map((m) => (
            <div key={m.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">{m.avatar}</div>
                <div>
                  <h4 className="text-sm font-semibold text-neutral-800">{m.name}</h4>
                  <p className="text-xs text-neutral-500">{m.expertise}</p>
                </div>
              </div>
              <p className="mt-3 text-xs text-neutral-400">Available: {m.availability}</p>
              <button type="button" className={`mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium ${m.matched ? 'bg-green-50 text-green-700' : 'bg-primary-50 text-primary-700 hover:bg-primary-100'}`}>
                {m.matched ? <><CheckCircle2 className="h-3.5 w-3.5" /> Matched</> : <><UserPlus className="h-3.5 w-3.5" /> Request Match</>}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
