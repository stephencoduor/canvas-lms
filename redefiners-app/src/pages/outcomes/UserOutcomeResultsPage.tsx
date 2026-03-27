import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Target, Search } from 'lucide-react'

interface OutcomeResult {
  id: number
  score: number | null
  possible: number
  mastery: boolean | null
  outcome: {
    id: number
    title: string
    display_name?: string
    mastery_points: number
    points_possible: number
  }
  links: {
    course?: number
    course_name?: string
  }
}

export function UserOutcomeResultsPage() {
  const [courseFilter, setCourseFilter] = useState('')

  const { data: results, isLoading } = useQuery<OutcomeResult[]>({
    queryKey: ['userOutcomeResults'],
    queryFn: async () => {
      const response = await apiGet<{ outcome_results: OutcomeResult[] }>(
        '/v1/users/self/outcome_results',
        { include: ['outcomes', 'courses'], per_page: 100 },
      )
      return (response.data as unknown as { outcome_results: OutcomeResult[] }).outcome_results ?? (response.data as unknown as OutcomeResult[])
    },
  })

  const filteredResults = (results ?? []).filter((r) => {
    if (!courseFilter) return true
    return (r.links?.course_name ?? '')
      .toLowerCase()
      .includes(courseFilter.toLowerCase())
  })

  const getMasteryLevel = (result: OutcomeResult) => {
    if (result.score === null || result.score === undefined)
      return { label: 'Not Assessed', color: 'bg-neutral-100 text-neutral-600' }
    const pct = result.outcome.points_possible > 0
      ? result.score / result.outcome.points_possible
      : 0
    if (pct >= 1) return { label: 'Exceeds', color: 'bg-green-50 text-green-700' }
    if (pct >= 0.7) return { label: 'Meets', color: 'bg-blue-50 text-blue-700' }
    if (pct >= 0.4) return { label: 'Near', color: 'bg-amber-50 text-amber-700' }
    return { label: 'Below', color: 'bg-red-50 text-red-700' }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Outcome Results
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Your mastery results across all courses
        </p>
      </div>

      {/* Filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Filter by course..."
          value={courseFilter}
          onChange={(e) => setCourseFilter(e.target.value)}
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={10} />
      ) : filteredResults.length === 0 ? (
        <EmptyState
          icon={Target}
          heading="No outcome results"
          description={
            courseFilter
              ? 'No results match your filter.'
              : 'No outcome results are available yet.'
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Outcome</span>
            <span>Course</span>
            <span>Mastery</span>
            <span>Score</span>
          </div>
          {filteredResults.map((result) => {
            const mastery = getMasteryLevel(result)
            return (
              <div
                key={result.id}
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {result.outcome?.display_name ?? result.outcome?.title}
                  </p>
                </div>
                <span className="text-sm text-neutral-600">
                  {result.links?.course_name ?? '—'}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${mastery.color}`}
                >
                  {mastery.label}
                </span>
                <span className="text-sm text-neutral-600">
                  {result.score !== null
                    ? `${result.score} / ${result.outcome.points_possible}`
                    : '—'}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
