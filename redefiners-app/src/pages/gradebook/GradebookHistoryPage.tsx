import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { History, Search } from 'lucide-react'

interface GradeChange {
  id: number
  created_at: string
  grader: { id: number; name: string }
  student: { id: number; name: string }
  assignment: { id: number; name: string }
  grade_before: string | null
  grade_after: string | null
  score_before: number | null
  score_after: number | null
}

export function GradebookHistoryPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [studentFilter, setStudentFilter] = useState('')
  const [assignmentFilter, setAssignmentFilter] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const { data: history, isLoading } = useQuery<GradeChange[]>({
    queryKey: ['gradebookHistory', courseId, startDate, endDate],
    queryFn: async () => {
      const params: Record<string, string> = { per_page: '100' }
      if (startDate) params.start_date = new Date(startDate).toISOString()
      if (endDate) params.end_date = new Date(endDate).toISOString()
      const response = await apiGet<{ events: GradeChange[] }>(
        `/v1/audit/grade_change/courses/${courseId}`,
        params,
      )
      return (response.data as unknown as { events: GradeChange[] }).events ?? (response.data as unknown as GradeChange[])
    },
    enabled: !!courseId,
  })

  const filteredHistory = (history ?? []).filter((entry) => {
    if (
      studentFilter &&
      !entry.student?.name?.toLowerCase().includes(studentFilter.toLowerCase())
    )
      return false
    if (
      assignmentFilter &&
      !entry.assignment?.name?.toLowerCase().includes(assignmentFilter.toLowerCase())
    )
      return false
    return true
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Gradebook History
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          View grade change history for this course
        </p>
      </div>

      {/* Filters */}
      <div className="grid gap-4 rounded-lg bg-white p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">
            Student
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by student..."
              value={studentFilter}
              onChange={(e) => setStudentFilter(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">
            Assignment
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by assignment..."
              value={assignmentFilter}
              onChange={(e) => setAssignmentFilter(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 py-2 pl-9 pr-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-neutral-500">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* History Table */}
      {isLoading ? (
        <LoadingSkeleton type="row" count={10} />
      ) : filteredHistory.length === 0 ? (
        <EmptyState
          icon={History}
          heading="No grade changes"
          description="No grade changes found for the selected filters."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="border-b border-neutral-200">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Grader
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Student
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Assignment
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  Old Grade
                </th>
                <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500">
                  New Grade
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b border-neutral-50 transition-colors hover:bg-neutral-50"
                >
                  <td className="px-4 py-2.5 text-xs text-neutral-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-neutral-700">
                    {entry.grader?.name ?? 'System'}
                  </td>
                  <td className="px-4 py-2.5 text-sm font-medium text-neutral-800">
                    {entry.student?.name ?? 'Unknown'}
                  </td>
                  <td className="px-4 py-2.5 text-sm text-neutral-700">
                    {entry.assignment?.name ?? 'Unknown'}
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm text-neutral-600">
                    {entry.score_before ?? entry.grade_before ?? '—'}
                  </td>
                  <td className="px-4 py-2.5 text-center text-sm font-medium text-neutral-800">
                    {entry.score_after ?? entry.grade_after ?? '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
