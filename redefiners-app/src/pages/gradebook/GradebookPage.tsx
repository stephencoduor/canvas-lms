import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Table } from 'lucide-react'
import type { CanvasUser, CanvasAssignment, CanvasSubmission } from '@/types/canvas'

interface GradebookStudent extends Omit<CanvasUser, 'enrollments'> {
  enrollments?: { grades?: { current_score: number | null; final_score: number | null } }[]
}

export function GradebookPage() {
  const { courseId } = useParams<{ courseId: string }>()

  const { data: students, isLoading: studentsLoading } = useQuery<GradebookStudent[]>({
    queryKey: ['gradebook', 'students', courseId],
    queryFn: async () => {
      const response = await apiGet<GradebookStudent[]>(
        `/v1/courses/${courseId}/users`,
        { enrollment_type: 'student', include: ['enrollments', 'avatar_url'] },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: assignments, isLoading: assignmentsLoading } = useQuery<CanvasAssignment[]>({
    queryKey: ['gradebook', 'assignments', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignment[]>(
        `/v1/courses/${courseId}/assignments`,
        { per_page: 50, order_by: 'position' },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: submissions, isLoading: submissionsLoading } = useQuery<CanvasSubmission[]>({
    queryKey: ['gradebook', 'submissions', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasSubmission[]>(
        `/v1/courses/${courseId}/students/submissions`,
        { student_ids: 'all', per_page: 100 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const isLoading = studentsLoading || assignmentsLoading || submissionsLoading

  // Build a lookup for submissions: `${userId}-${assignmentId}` -> submission
  const submissionMap = new Map<string, CanvasSubmission>()
  if (submissions) {
    for (const sub of submissions) {
      submissionMap.set(`${sub.user_id}-${sub.assignment_id}`, sub)
    }
  }

  const displayAssignments = assignments?.slice(0, 10) ?? []

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Gradebook</h3>
        <p className="mt-1 text-sm text-neutral-500">
          View and manage student grades
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={12} />
      ) : !students || students.length === 0 ? (
        <EmptyState
          icon={Table}
          heading="No students"
          description="No students are enrolled in this course."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[800px]">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="sticky left-0 z-10 bg-white px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Student
                </th>
                {displayAssignments.map((a) => (
                  <th
                    key={a.id}
                    className="px-3 py-3 text-center text-xs font-semibold text-neutral-500"
                    title={a.name}
                  >
                    <div className="max-w-[100px] truncate">{a.name}</div>
                    <div className="text-[10px] font-normal text-neutral-400">
                      {a.points_possible ?? 0} pts
                    </div>
                  </th>
                ))}
                <th className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => {
                const totalScore =
                  student.enrollments?.[0]?.grades?.current_score ?? null

                return (
                  <tr
                    key={student.id}
                    className="border-b border-neutral-50 transition-colors hover:bg-neutral-50"
                  >
                    <td className="sticky left-0 z-10 bg-white px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <img
                          src={
                            student.avatar_url || '/images/default-avatar.png'
                          }
                          alt=""
                          className="h-7 w-7 shrink-0 rounded-full object-cover"
                        />
                        <span className="text-sm font-medium text-neutral-700">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    {displayAssignments.map((a) => {
                      const sub = submissionMap.get(
                        `${student.id}-${a.id}`,
                      )
                      const score = sub?.score
                      return (
                        <td
                          key={a.id}
                          className="px-3 py-2.5 text-center text-sm text-neutral-600"
                        >
                          {score != null ? score : '—'}
                        </td>
                      )
                    })}
                    <td className="px-3 py-2.5 text-center text-sm font-semibold text-neutral-800">
                      {totalScore != null ? `${totalScore}%` : '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
