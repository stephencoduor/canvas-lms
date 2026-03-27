import { ClipboardCheck, CheckCircle2, XCircle, Clock, AlertTriangle } from 'lucide-react'

const COURSES_ATTENDANCE = [
  {
    id: 1,
    course: 'Spanish 101',
    instructor: 'Prof. Martinez',
    totalClasses: 24,
    present: 20,
    absent: 2,
    late: 2,
    records: [
      { date: '2026-03-25', status: 'present' as const },
      { date: '2026-03-23', status: 'present' as const },
      { date: '2026-03-20', status: 'late' as const },
      { date: '2026-03-18', status: 'present' as const },
      { date: '2026-03-16', status: 'absent' as const },
    ],
  },
  {
    id: 2,
    course: 'World History',
    instructor: 'Dr. Chen',
    totalClasses: 20,
    present: 17,
    absent: 1,
    late: 2,
    records: [
      { date: '2026-03-24', status: 'present' as const },
      { date: '2026-03-22', status: 'present' as const },
      { date: '2026-03-19', status: 'late' as const },
      { date: '2026-03-17', status: 'absent' as const },
      { date: '2026-03-15', status: 'present' as const },
    ],
  },
  {
    id: 3,
    course: 'Calculus II',
    instructor: 'Prof. Adams',
    totalClasses: 22,
    present: 19,
    absent: 3,
    late: 0,
    records: [
      { date: '2026-03-25', status: 'present' as const },
      { date: '2026-03-23', status: 'absent' as const },
      { date: '2026-03-20', status: 'present' as const },
      { date: '2026-03-18', status: 'present' as const },
      { date: '2026-03-16', status: 'present' as const },
    ],
  },
]

function statusIcon(status: string) {
  switch (status) {
    case 'present': return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'absent': return <XCircle className="h-4 w-4 text-red-500" />
    default: return <Clock className="h-4 w-4 text-amber-500" />
  }
}

export function AttendancePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardCheck className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Attendance</h3>
          <p className="mt-1 text-sm text-neutral-500">Track your class attendance across courses</p>
        </div>
      </div>

      <div className="space-y-4">
        {COURSES_ATTENDANCE.map((course) => {
          const rate = Math.round((course.present / course.totalClasses) * 100)
          const low = rate < 80
          return (
            <div key={course.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-800">{course.course}</h4>
                  <p className="text-xs text-neutral-500">{course.instructor}</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {low && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                  <span className={`text-lg font-bold ${low ? 'text-amber-600' : 'text-green-600'}`}>{rate}%</span>
                </div>
              </div>

              <div className="mt-3 flex gap-4 text-xs">
                <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="h-3 w-3" />{course.present} present</span>
                <span className="flex items-center gap-1 text-red-500"><XCircle className="h-3 w-3" />{course.absent} absent</span>
                <span className="flex items-center gap-1 text-amber-500"><Clock className="h-3 w-3" />{course.late} late</span>
              </div>

              <div className="mt-3 h-2 rounded-full bg-neutral-100">
                <div className={`h-2 rounded-full ${low ? 'bg-amber-500' : 'bg-green-500'}`} style={{ width: `${rate}%` }} />
              </div>

              <div className="mt-4">
                <p className="mb-2 text-xs font-medium text-neutral-500">Recent Records</p>
                <div className="flex gap-2">
                  {course.records.map((r) => (
                    <div key={r.date} className="flex flex-col items-center gap-1 rounded-lg bg-neutral-50 px-3 py-2">
                      {statusIcon(r.status)}
                      <span className="text-xs text-neutral-400">{new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
