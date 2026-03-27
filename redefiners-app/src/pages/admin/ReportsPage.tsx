import { useAccounts, useReports } from '@/hooks/useAdmin'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { FileText, Play } from 'lucide-react'

export function ReportsPage() {
  const { data: accounts } = useAccounts()
  const accountId = accounts?.[0]?.id ?? 'self'
  const { data: reports, isLoading } = useReports(accountId)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Reports</h3>
        <p className="mt-1 text-sm text-neutral-500">
          View and run available reports
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : !reports || reports.length === 0 ? (
        <EmptyState
          icon={FileText}
          heading="No reports available"
          description="No reports are configured for this account."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((report) => (
            <div
              key={report.id ?? report.report}
              className="rounded-lg bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-indigo-50 p-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                </div>
                {report.status && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      report.status === 'complete'
                        ? 'bg-emerald-50 text-emerald-600'
                        : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {report.status}
                  </span>
                )}
              </div>
              <h4 className="text-sm font-semibold text-neutral-800">
                {report.title || report.report}
              </h4>
              <p className="mt-1 text-xs text-neutral-500">
                {report.last_run
                  ? `Last run: ${new Date(report.last_run).toLocaleDateString()}`
                  : 'Never run'}
              </p>
              <button
                type="button"
                className="mt-3 flex items-center gap-1.5 rounded-md bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 transition-colors hover:bg-primary-100"
              >
                <Play className="h-3.5 w-3.5" />
                Run Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
