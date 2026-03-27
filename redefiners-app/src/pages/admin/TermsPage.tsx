import { useAccounts, useTerms } from '@/hooks/useAdmin'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Calendar } from 'lucide-react'

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString()
}

function getTermStatus(term: { start_at: string | null; end_at: string | null; workflow_state: string }): {
  label: string
  color: string
} {
  if (term.workflow_state === 'deleted') {
    return { label: 'Deleted', color: 'text-red-600 bg-red-50' }
  }
  const now = new Date()
  const start = term.start_at ? new Date(term.start_at) : null
  const end = term.end_at ? new Date(term.end_at) : null

  if (start && end && now >= start && now <= end) {
    return { label: 'Active', color: 'text-emerald-600 bg-emerald-50' }
  }
  if (end && now > end) {
    return { label: 'Completed', color: 'text-neutral-500 bg-neutral-100' }
  }
  if (start && now < start) {
    return { label: 'Upcoming', color: 'text-blue-600 bg-blue-50' }
  }
  return { label: 'Active', color: 'text-emerald-600 bg-emerald-50' }
}

export function TermsPage() {
  const { data: accounts } = useAccounts()
  const accountId = accounts?.[0]?.id ?? 'self'
  const { data: terms, isLoading } = useTerms(accountId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Academic Terms</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Manage enrollment terms and academic periods
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !terms || terms.length === 0 ? (
        <EmptyState
          icon={Calendar}
          heading="No terms found"
          description="No academic terms have been created."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Name</span>
            <span>Start Date</span>
            <span>End Date</span>
            <span className="hidden sm:inline">Courses</span>
            <span>Status</span>
          </div>
          {terms.map((term) => {
            const status = getTermStatus(term)
            return (
              <div
                key={term.id}
                className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <span className="text-sm font-medium text-neutral-800">
                  {term.name}
                </span>
                <span className="text-sm text-neutral-600">
                  {formatDate(term.start_at)}
                </span>
                <span className="text-sm text-neutral-600">
                  {formatDate(term.end_at)}
                </span>
                <span className="hidden text-sm text-neutral-600 sm:inline">
                  {term.course_count ?? '—'}
                </span>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.color}`}
                >
                  {status.label}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
