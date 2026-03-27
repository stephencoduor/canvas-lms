import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusPill } from '@/components/common/StatusPill'
import { BarChart3 } from 'lucide-react'
import type {
  CanvasAssignmentGroup,
  CanvasEnrollment,
} from '@/types/canvas'

function useGrades(courseId: string) {
  return useQuery({
    queryKey: ['grades', courseId],
    queryFn: async () => {
      const [groupsRes, enrollmentsRes] = await Promise.all([
        apiGet<CanvasAssignmentGroup[]>(
          `/v1/courses/${courseId}/assignment_groups`,
          {
            include: ['assignments', 'submission'],
            per_page: 50,
          },
        ),
        apiGet<CanvasEnrollment[]>(
          `/v1/courses/${courseId}/enrollments`,
          {
            type: ['StudentEnrollment'],
            include: ['grades'],
          },
        ),
      ])

      const enrollment = enrollmentsRes.data?.find(
        (e) => e.type === 'StudentEnrollment',
      )

      return {
        groups: groupsRes.data,
        totalScore: enrollment?.grades?.current_score ?? null,
        totalGrade: enrollment?.grades?.current_grade ?? null,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

function getSubmissionStatus(
  submission?: { grade: string | null; score: number | null; late: boolean; missing: boolean; excused: boolean; submitted_at: string | null },
): 'submitted' | 'graded' | 'missing' | 'late' | null {
  if (!submission) return null
  if (submission.excused) return null
  if (submission.grade !== null && submission.score !== null) return 'graded'
  if (submission.late) return 'late'
  if (submission.missing) return 'missing'
  if (submission.submitted_at) return 'submitted'
  return null
}

export function GradesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data, isLoading } = useGrades(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Grades</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : !data?.groups || data.groups.length === 0 ? (
        <EmptyState
          icon={BarChart3}
          heading="No grades"
          description="No grade data available for this course."
        />
      ) : (
        <>
          {/* Overall Grade */}
          {data.totalScore !== null && (
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-neutral-500">Overall Grade</p>
                  <p className="text-3xl font-bold text-primary-700">
                    {Math.round(data.totalScore)}%
                  </p>
                </div>
                {data.totalGrade && (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-700">
                    {data.totalGrade}
                  </div>
                )}
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                <div
                  className="h-full rounded-full bg-primary-500 transition-all"
                  style={{
                    width: `${Math.min(data.totalScore, 100)}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Assignment Groups */}
          <div className="space-y-4">
            {data.groups
              .sort((a, b) => a.position - b.position)
              .map((group) => {
                const assignments = group.assignments ?? []
                if (assignments.length === 0) return null

                return (
                  <div
                    key={group.id}
                    className="overflow-hidden rounded-lg bg-white shadow-sm"
                  >
                    {/* Group Header */}
                    <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-3">
                      <h4 className="text-sm font-semibold text-neutral-700">
                        {group.name}
                      </h4>
                      {group.group_weight > 0 && (
                        <span className="text-xs text-neutral-400">
                          {group.group_weight}% of grade
                        </span>
                      )}
                    </div>

                    {/* Assignment Grades */}
                    <div>
                      {assignments.map((assignment) => {
                        const sub = assignment.submission
                        const status = getSubmissionStatus(sub)

                        return (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between border-b border-neutral-50 px-5 py-2.5 last:border-0"
                          >
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm text-neutral-700">
                                {assignment.name}
                              </p>
                            </div>
                            <div className="ml-4 flex items-center gap-3">
                              {status && <StatusPill status={status} />}
                              <span className="min-w-[80px] text-right text-sm">
                                {sub?.score !== null && sub?.score !== undefined ? (
                                  <span className="font-semibold text-neutral-700">
                                    {sub.score}
                                    <span className="text-neutral-400">
                                      /{assignment.points_possible}
                                    </span>
                                  </span>
                                ) : (
                                  <span className="text-neutral-400">
                                    -/{assignment.points_possible}
                                  </span>
                                )}
                              </span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
          </div>
        </>
      )}
    </div>
  )
}
