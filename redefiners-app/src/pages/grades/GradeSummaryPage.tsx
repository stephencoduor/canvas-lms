import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Calculator, TrendingUp } from 'lucide-react'
import type { CanvasAssignment } from '@/types/canvas'

interface GradeEntry {
  assignment: CanvasAssignment
  currentScore: number | null
  whatIfScore: number | null
}

export function GradeSummaryPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [whatIfScores, setWhatIfScores] = useState<Record<number, string>>({})

  const { data: assignments, isLoading: assignmentsLoading } = useQuery<CanvasAssignment[]>({
    queryKey: ['gradeSummary', 'assignments', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignment[]>(
        `/v1/courses/${courseId}/assignments`,
        { per_page: 100, order_by: 'due_at' },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: submissions, isLoading: submissionsLoading } = useQuery({
    queryKey: ['gradeSummary', 'submissions', courseId],
    queryFn: async () => {
      const response = await apiGet<Array<{ assignment_id: number; score: number | null }>>(
        `/v1/courses/${courseId}/students/submissions`,
        { student_ids: ['self'], per_page: 100 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const isLoading = assignmentsLoading || submissionsLoading

  const submissionMap = new Map<number, number | null>()
  if (submissions) {
    for (const sub of submissions) {
      submissionMap.set(sub.assignment_id, sub.score)
    }
  }

  const entries: GradeEntry[] = (assignments ?? []).map((a) => ({
    assignment: a,
    currentScore: submissionMap.get(a.id) ?? null,
    whatIfScore: whatIfScores[a.id] !== undefined ? Number(whatIfScores[a.id]) : null,
  }))

  const totalPossible = entries.reduce(
    (sum, e) => sum + (e.assignment.points_possible ?? 0),
    0,
  )

  const currentEarned = entries.reduce(
    (sum, e) => sum + (e.currentScore ?? 0),
    0,
  )

  const whatIfEarned = entries.reduce((sum, e) => {
    if (e.whatIfScore !== null) return sum + e.whatIfScore
    return sum + (e.currentScore ?? 0)
  }, 0)

  const currentPct = totalPossible > 0 ? (currentEarned / totalPossible) * 100 : 0
  const whatIfPct = totalPossible > 0 ? (whatIfEarned / totalPossible) * 100 : 0

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Grade Summary</h3>
        <p className="mt-1 text-sm text-neutral-500">
          View your grades and calculate what-if scores
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : (
        <>
          {/* Grade Cards */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                  <Calculator className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {currentPct.toFixed(1)}%
                  </p>
                  <p className="text-sm text-neutral-500">Current Grade</p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-emerald-50 p-2 text-emerald-600">
                  <TrendingUp className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-neutral-800">
                    {whatIfPct.toFixed(1)}%
                  </p>
                  <p className="text-sm text-neutral-500">What-If Grade</p>
                </div>
              </div>
            </div>
          </div>

          {/* Assignment List */}
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              <span>Assignment</span>
              <span>Points</span>
              <span>Score</span>
              <span>What-If</span>
            </div>
            {entries.map((entry) => (
              <div
                key={entry.assignment.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-2.5 transition-colors hover:bg-neutral-50"
              >
                <span className="text-sm text-neutral-800">
                  {entry.assignment.name}
                </span>
                <span className="text-sm text-neutral-600">
                  {entry.assignment.points_possible ?? 0}
                </span>
                <span className="text-sm text-neutral-600">
                  {entry.currentScore !== null ? entry.currentScore : '—'}
                </span>
                <input
                  type="number"
                  min={0}
                  max={entry.assignment.points_possible ?? 100}
                  value={whatIfScores[entry.assignment.id] ?? ''}
                  onChange={(e) =>
                    setWhatIfScores((prev) => ({
                      ...prev,
                      [entry.assignment.id]: e.target.value,
                    }))
                  }
                  placeholder="—"
                  className="w-20 rounded border border-neutral-200 px-2 py-1 text-center text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
