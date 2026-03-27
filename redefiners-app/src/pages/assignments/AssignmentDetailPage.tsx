import { safeHtml } from '../../lib/sanitize';
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { StatusPill } from '@/components/common/StatusPill'
import { Calendar, Award, Send } from 'lucide-react'
import type { CanvasAssignment } from '@/types/canvas'

function useAssignment(courseId: string, assignmentId: string) {
  return useQuery({
    queryKey: ['assignment', courseId, assignmentId],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignment>(
        `/v1/courses/${courseId}/assignments/${assignmentId}`,
        { include: ['submission', 'rubric_assessment'] },
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

function formatDateTime(isoString: string | null): string {
  if (!isoString) return 'No due date'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getSubmissionStatus(
  assignment: CanvasAssignment,
): 'submitted' | 'graded' | 'missing' | 'late' | null {
  const sub = assignment.submission
  if (!sub) return null
  if (sub.excused) return null
  if (sub.grade !== null && sub.score !== null) return 'graded'
  if (sub.late) return 'late'
  if (sub.missing) return 'missing'
  if (sub.submitted_at) return 'submitted'
  return null
}

export function AssignmentDetailPage() {
  const { courseId, assignmentId } = useParams<{
    courseId: string
    assignmentId: string
  }>()
  const { data: assignment, isLoading } = useAssignment(
    courseId!,
    assignmentId!,
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={2} />
        <LoadingSkeleton type="row" count={4} />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Assignment not found.</p>
      </div>
    )
  }

  const status = getSubmissionStatus(assignment)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          {assignment.name}
        </h3>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {formatDateTime(assignment.due_at)}
          </span>
          <span className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            {assignment.points_possible ?? 0} points
          </span>
          {status && <StatusPill status={status} />}
        </div>
      </div>

      {/* Description */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-3 text-lg font-semibold text-neutral-700">
          Description
        </h4>
        {assignment.description ? (
          <div
            className="prose prose-sm max-w-none text-neutral-600"
            dangerouslySetInnerHTML={safeHtml(assignment.description)}
          />
        ) : (
          <p className="text-sm text-neutral-400">
            No description provided.
          </p>
        )}
      </section>

      {/* Submission Status */}
      {assignment.submission && (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-3 text-lg font-semibold text-neutral-700">
            Submission
          </h4>
          <div className="flex items-center gap-4 text-sm">
            {assignment.submission.score !== null && (
              <span className="text-neutral-600">
                Score:{' '}
                <span className="font-semibold text-primary-700">
                  {assignment.submission.score}/{assignment.points_possible}
                </span>
              </span>
            )}
            {assignment.submission.submitted_at && (
              <span className="text-neutral-500">
                Submitted{' '}
                {formatDateTime(assignment.submission.submitted_at)}
              </span>
            )}
          </div>
        </section>
      )}

      {/* Rubric */}
      {assignment.rubric && assignment.rubric.length > 0 && (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-3 text-lg font-semibold text-neutral-700">
            Rubric
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-2 text-left font-medium text-neutral-500">
                    Criteria
                  </th>
                  <th className="py-2 text-right font-medium text-neutral-500">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {assignment.rubric.map((criterion) => (
                  <tr
                    key={criterion.id}
                    className="border-b border-neutral-100"
                  >
                    <td className="py-2 text-neutral-700">
                      <p className="font-medium">{criterion.description}</p>
                      {criterion.long_description && (
                        <p className="mt-0.5 text-xs text-neutral-400">
                          {criterion.long_description}
                        </p>
                      )}
                    </td>
                    <td className="py-2 text-right font-medium text-neutral-600">
                      {criterion.points}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Submit Button */}
      {!assignment.submission?.submitted_at && (
        <div className="flex justify-end">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Send className="h-4 w-4" />
            Submit Assignment
          </button>
        </div>
      )}
    </div>
  )
}
