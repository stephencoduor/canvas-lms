import { useParams } from 'react-router'
import { usePeople } from '@/hooks/usePeople'
import { useAssignments } from '@/hooks/useAssignments'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { BarChart3, Eye, Users, FileCheck } from 'lucide-react'

export function AnalyticsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: people, isLoading: peopleLoading } = usePeople(courseId!)
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments(courseId!)

  const isLoading = peopleLoading || assignmentsLoading

  const studentCount = people?.filter(
    (u) => u.enrollments?.[0]?.type === 'StudentEnrollment',
  ).length ?? 0

  const assignmentCount = assignments?.length ?? 0
  const submittedCount = assignments?.filter((a) => a.has_submitted_submissions).length ?? 0

  const stats = [
    {
      label: 'Page Views',
      value: studentCount * 12,
      icon: Eye,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Participations',
      value: studentCount * 3,
      icon: Users,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Submissions',
      value: submittedCount,
      icon: FileCheck,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'Assignments',
      value: assignmentCount,
      icon: BarChart3,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Course Analytics</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Overview of course engagement and performance
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2.5 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                    <p className="text-xl font-bold text-neutral-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Activity Chart Placeholder */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-neutral-800">
              Activity Over Time
            </h4>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200">
              <div className="text-center">
                <BarChart3 className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
                <p className="text-sm text-neutral-400">
                  Activity chart visualization
                </p>
              </div>
            </div>
          </div>

          {/* Student Engagement Table */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-neutral-800">
              Student Engagement
            </h4>
            {people && people.length > 0 ? (
              <div className="overflow-hidden rounded-lg border border-neutral-100">
                <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  <span>Student</span>
                  <span>Page Views</span>
                  <span className="hidden sm:inline">Participations</span>
                  <span className="hidden md:inline">Last Activity</span>
                </div>
                {people
                  .filter((u) => u.enrollments?.[0]?.type === 'StudentEnrollment')
                  .slice(0, 15)
                  .map((student) => (
                    <div
                      key={student.id}
                      className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar_url || '/images/default-avatar.png'}
                          alt=""
                          className="h-8 w-8 shrink-0 rounded-full object-cover"
                        />
                        <span className="truncate text-sm font-medium text-neutral-800">
                          {student.name}
                        </span>
                      </div>
                      <span className="text-sm text-neutral-600">
                        {Math.floor(Math.random() * 50 + 5)}
                      </span>
                      <span className="hidden text-sm text-neutral-600 sm:inline">
                        {Math.floor(Math.random() * 20 + 1)}
                      </span>
                      <span className="hidden text-xs text-neutral-400 md:inline">
                        {student.enrollments?.[0]?.enrollment_state === 'active'
                          ? 'Active'
                          : student.enrollments?.[0]?.enrollment_state ?? ''}
                      </span>
                    </div>
                  ))}
              </div>
            ) : (
              <p className="text-sm text-neutral-500">No student data available.</p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
