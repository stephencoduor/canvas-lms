import { useCourses } from '@/hooks/useCourses'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { TrendingUp, CheckCircle2, Clock, BarChart3 } from 'lucide-react'

export function StudentAnalyticsPage() {
  const { data: courses, isLoading } = useCourses()

  const enrolledCourses = courses ?? []
  const totalCourses = enrolledCourses.length

  // Derive basic stats from enrollment data
  const completedCourses = enrolledCourses.filter(
    (c) => c.workflow_state === 'completed',
  ).length

  const averageScore = enrolledCourses.reduce((sum, course) => {
    const score = course.enrollments?.[0]?.computed_current_score
    return sum + (score ?? 0)
  }, 0) / (totalCourses || 1)

  const stats = [
    {
      label: 'Enrolled Courses',
      value: totalCourses,
      icon: BarChart3,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Completed',
      value: completedCourses,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      label: 'Avg. Score',
      value: averageScore > 0 ? `${Math.round(averageScore)}%` : 'N/A',
      icon: TrendingUp,
      color: 'text-purple-600 bg-purple-50',
    },
    {
      label: 'In Progress',
      value: totalCourses - completedCourses,
      icon: Clock,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">My Performance</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Your academic progress and performance metrics
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : totalCourses === 0 ? (
        <EmptyState
          icon={BarChart3}
          heading="No course data"
          description="Enroll in courses to see your performance analytics."
        />
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

          {/* Grade Trend Placeholder */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-neutral-800">Grade Trend</h4>
            <div className="flex h-48 items-center justify-center rounded-lg border-2 border-dashed border-neutral-200">
              <div className="text-center">
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-neutral-300" />
                <p className="text-sm text-neutral-400">Grade trend visualization</p>
              </div>
            </div>
          </div>

          {/* Course Performance Table */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-neutral-800">
              Course Performance
            </h4>
            <div className="overflow-hidden rounded-lg border border-neutral-100">
              <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-neutral-200 bg-neutral-50 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <span>Course</span>
                <span>Grade</span>
                <span className="hidden sm:inline">Status</span>
              </div>
              {enrolledCourses.map((course) => {
                const score = course.enrollments?.[0]?.computed_current_score
                const grade = course.enrollments?.[0]?.computed_current_grade

                return (
                  <div
                    key={course.id}
                    className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-neutral-800">
                        {course.name}
                      </p>
                      <p className="text-xs text-neutral-400">{course.course_code}</p>
                    </div>
                    <span className="text-sm font-medium text-neutral-700">
                      {grade ?? (score != null ? `${score}%` : 'N/A')}
                    </span>
                    <span
                      className={`hidden rounded-full px-2 py-0.5 text-xs font-medium sm:inline ${
                        course.workflow_state === 'completed'
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      {course.workflow_state === 'completed' ? 'Completed' : 'Active'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
