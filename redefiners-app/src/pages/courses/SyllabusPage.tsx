import { safeHtml } from '../../lib/sanitize';
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Calendar } from 'lucide-react'
import type { CanvasCourse, CanvasAssignment } from '@/types/canvas'

function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasCourse>(`/v1/courses/${courseId}`, {
        include: ['syllabus_body'],
      })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

function useAssignments(courseId: string) {
  return useQuery({
    queryKey: ['assignments', courseId, 'syllabus'],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignment[]>(
        `/v1/courses/${courseId}/assignments`,
        { order_by: 'due_at', per_page: 50 },
      )
      return (response.data ?? [])
        .filter((a) => a.due_at)
        .sort(
          (a, b) =>
            new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime(),
        )
    },
    staleTime: 5 * 60 * 1000,
  })
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

export function SyllabusPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: course, isLoading: courseLoading } = useCourse(courseId!)
  const { data: assignments, isLoading: assignmentsLoading } = useAssignments(
    courseId!,
  )

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Syllabus</h3>

      {/* Syllabus Body */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        {courseLoading ? (
          <LoadingSkeleton type="text" count={8} />
        ) : course?.syllabus_body ? (
          <div
            className="prose prose-sm max-w-none text-neutral-600"
            dangerouslySetInnerHTML={safeHtml(course.syllabus_body)}
          />
        ) : (
          <p className="text-sm text-neutral-400">
            No syllabus content has been provided for this course.
          </p>
        )}
      </section>

      {/* Assignment Schedule */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700">
          <Calendar className="h-5 w-5 text-primary-500" />
          Assignment Schedule
        </h4>

        {assignmentsLoading ? (
          <LoadingSkeleton type="row" count={6} />
        ) : !assignments || assignments.length === 0 ? (
          <p className="text-sm text-neutral-400">
            No assignments with due dates.
          </p>
        ) : (
          <div>
            {assignments.map((a) => (
              <div
                key={a.id}
                className="flex items-center justify-between border-b border-neutral-100 py-2.5 last:border-0"
              >
                <div>
                  <p className="text-sm text-neutral-700">{a.name}</p>
                  <p className="text-xs text-neutral-500">
                    {formatDate(a.due_at!)}
                  </p>
                </div>
                <span className="text-xs text-neutral-400">
                  {a.points_possible ?? 0} pts
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
