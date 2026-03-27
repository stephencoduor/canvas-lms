import { useParams } from 'react-router'
import { ClipboardList, LogIn, Mail, MessageSquare, CheckSquare } from 'lucide-react'

interface TeacherActivity {
  name: string
  lastLogin: string
  messagesSent: number
  discussionsPosts: number
  assignmentsGraded: number
}

const MOCK_TEACHERS: TeacherActivity[] = [
  {
    name: 'Dr. Sarah Johnson',
    lastLogin: '2026-03-26 09:15 AM',
    messagesSent: 47,
    discussionsPosts: 23,
    assignmentsGraded: 156,
  },
  {
    name: 'Prof. Michael Chen',
    lastLogin: '2026-03-25 03:42 PM',
    messagesSent: 31,
    discussionsPosts: 18,
    assignmentsGraded: 89,
  },
]

const STAT_ICONS = [
  { key: 'lastLogin', icon: LogIn, label: 'Last Login' },
  { key: 'messagesSent', icon: Mail, label: 'Messages Sent' },
  { key: 'discussionsPosts', icon: MessageSquare, label: 'Discussion Posts' },
  { key: 'assignmentsGraded', icon: CheckSquare, label: 'Assignments Graded' },
] as const

export function TeacherActivityReportPage() {
  const { courseId } = useParams()

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <ClipboardList className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Teacher Activity Report</h3>
          <p className="mt-1 text-sm text-neutral-500">Course {courseId}</p>
        </div>
      </div>

      {MOCK_TEACHERS.map((teacher) => (
        <div key={teacher.name} className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-sm font-bold text-primary-700">
              {teacher.name.charAt(0)}
            </div>
            <h4 className="text-lg font-semibold text-neutral-800">{teacher.name}</h4>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STAT_ICONS.map((stat) => {
              const value = teacher[stat.key]
              return (
                <div key={stat.key} className="rounded-lg border border-neutral-100 p-4">
                  <div className="flex items-center gap-2">
                    <stat.icon className="h-4 w-4 text-primary-500" />
                    <span className="text-xs text-neutral-500">{stat.label}</span>
                  </div>
                  <p className="mt-1 text-lg font-bold text-neutral-800">{value}</p>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
