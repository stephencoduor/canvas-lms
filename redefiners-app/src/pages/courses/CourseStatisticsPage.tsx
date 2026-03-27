import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { BarChart3, Users, BookOpen, CheckCircle } from 'lucide-react'

export function CourseStatisticsPage() {
  const { courseId } = useParams<{ courseId: string }>()

  const { data: analytics, isLoading: analyticsLoading } = useQuery({
    queryKey: ['courseStats', courseId],
    queryFn: async () => {
      const response = await apiGet<Record<string, unknown>>(
        `/v1/courses/${courseId}/analytics/activity`,
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: students } = useQuery({
    queryKey: ['courseStats', 'students', courseId],
    queryFn: async () => {
      const response = await apiGet<unknown[]>(
        `/v1/courses/${courseId}/users`,
        { enrollment_type: 'student', per_page: 1 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: assignments } = useQuery({
    queryKey: ['courseStats', 'assignments', courseId],
    queryFn: async () => {
      const response = await apiGet<unknown[]>(
        `/v1/courses/${courseId}/assignments`,
        { per_page: 100 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const statCards = [
    {
      icon: Users,
      label: 'Total Students',
      value: students?.length ?? 0,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      icon: BookOpen,
      label: 'Assignments',
      value: assignments?.length ?? 0,
      color: 'bg-purple-50 text-purple-600',
    },
    {
      icon: BarChart3,
      label: 'Page Views',
      value: Array.isArray(analytics)
        ? analytics.reduce((sum: number, d: Record<string, number>) => sum + (d.views ?? 0), 0)
        : 0,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      icon: CheckCircle,
      label: 'Participations',
      value: Array.isArray(analytics)
        ? analytics.reduce((sum: number, d: Record<string, number>) => sum + (d.participations ?? 0), 0)
        : 0,
      color: 'bg-amber-50 text-amber-600',
    },
  ]

  const isLoading = analyticsLoading

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Course Statistics
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Enrollment, activity, and completion statistics
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : (
        <>
          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statCards.map((stat) => (
              <div key={stat.label} className="rounded-lg bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className={`rounded-lg p-2 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-neutral-800">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-sm text-neutral-500">{stat.label}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Assignments Completion Table */}
          {assignments && assignments.length > 0 && (
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="border-b border-neutral-200 px-5 py-3">
                <h4 className="text-sm font-semibold text-neutral-700">
                  Assignment Completion Rates
                </h4>
              </div>
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-neutral-100 px-5 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <span>Assignment</span>
                <span>Points</span>
                <span>Due Date</span>
              </div>
              {(assignments as Array<Record<string, unknown>>).slice(0, 20).map((a) => (
                <div
                  key={a.id as number}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-2.5 transition-colors hover:bg-neutral-50"
                >
                  <span className="text-sm text-neutral-800">
                    {a.name as string}
                  </span>
                  <span className="text-sm text-neutral-600">
                    {(a.points_possible as number) ?? 0} pts
                  </span>
                  <span className="text-xs text-neutral-500">
                    {a.due_at
                      ? new Date(a.due_at as string).toLocaleDateString()
                      : 'No due date'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
