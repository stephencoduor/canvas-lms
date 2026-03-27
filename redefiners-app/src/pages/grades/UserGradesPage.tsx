import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router'

interface CourseGrade {
  id: number
  name: string
  course_code: string
  enrollment_term_id: number
  enrollments: Array<{
    type: string
    enrollment_state: string
    computed_current_score: number | null
    computed_current_grade: string | null
  }>
}

export function UserGradesPage() {
  const { data: courses, isLoading } = useQuery<CourseGrade[]>({
    queryKey: ['userGrades'],
    queryFn: async () => {
      const response = await apiGet<CourseGrade[]>('/v1/courses', {
        enrollment_type: 'student',
        include: ['total_scores'],
        state: ['available'],
        per_page: 50,
      })
      return response.data
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">My Grades</h3>
        <p className="mt-1 text-sm text-neutral-500">
          View grades across all your courses
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : !courses || courses.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          heading="No courses"
          description="You are not enrolled in any courses as a student."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Course</span>
            <span>Grade</span>
            <span>Score</span>
            <span>Status</span>
          </div>
          {courses.map((course) => {
            const enrollment = course.enrollments?.[0]
            const grade = enrollment?.computed_current_grade
            const score = enrollment?.computed_current_score
            const state = enrollment?.enrollment_state ?? 'active'

            return (
              <Link
                key={course.id}
                to={`/courses/${course.id}/grades`}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {course.name}
                  </p>
                  <p className="text-xs text-neutral-500">{course.course_code}</p>
                </div>
                <span className="text-sm font-semibold text-neutral-800">
                  {grade ?? '—'}
                </span>
                <span className="text-sm text-neutral-600">
                  {score !== null && score !== undefined ? `${score}%` : '—'}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    state === 'active'
                      ? 'bg-green-50 text-green-700'
                      : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {state}
                </span>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
