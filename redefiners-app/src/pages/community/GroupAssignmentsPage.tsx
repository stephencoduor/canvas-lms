import { ClipboardList, Users, Calendar, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

const ASSIGNMENTS = [
  {
    id: 1,
    title: 'Cultural Presentation Project',
    course: 'Spanish 101',
    group: 'Group A — Las Estrellas',
    members: ['Maria S.', 'James K.', 'Priya P.', 'You'],
    dueDate: '2026-04-05',
    status: 'in-progress' as const,
    progress: 65,
    tasks: { completed: 4, total: 6 },
  },
  {
    id: 2,
    title: 'Historical Analysis Paper',
    course: 'World History',
    group: 'Team 3 — Historians',
    members: ['Alex R.', 'Emily D.', 'You'],
    dueDate: '2026-04-10',
    status: 'in-progress' as const,
    progress: 30,
    tasks: { completed: 2, total: 8 },
  },
  {
    id: 3,
    title: 'Lab Experiment Report',
    course: 'Chemistry',
    group: 'Lab Partners — Bench 4',
    members: ['Tom W.', 'Sarah J.', 'You'],
    dueDate: '2026-03-20',
    status: 'submitted' as const,
    progress: 100,
    tasks: { completed: 5, total: 5 },
  },
]

export function GroupAssignmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Group Assignments</h3>
          <p className="mt-1 text-sm text-neutral-500">Track and manage group project assignments</p>
        </div>
      </div>

      <div className="space-y-4">
        {ASSIGNMENTS.map((a) => (
          <div key={a.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{a.title}</h4>
                <p className="text-xs text-primary-600">{a.course} &middot; {a.group}</p>
              </div>
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${a.status === 'submitted' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                {a.status === 'submitted' ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                {a.status === 'submitted' ? 'Submitted' : 'In Progress'}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="h-2 flex-1 rounded-full bg-neutral-100">
                <div className={`h-2 rounded-full ${a.progress === 100 ? 'bg-green-500' : 'bg-primary-500'}`} style={{ width: `${a.progress}%` }} />
              </div>
              <span className="text-xs font-medium text-neutral-600">{a.progress}%</span>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-neutral-400">
              <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />Due {a.dueDate}</span>
              <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{a.tasks.completed}/{a.tasks.total} tasks done</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" />{a.members.length} members</span>
            </div>

            <div className="mt-3 flex gap-1">
              {a.members.map((m) => (
                <span key={m} className="rounded-full bg-neutral-100 px-2.5 py-1 text-xs text-neutral-600">{m}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
