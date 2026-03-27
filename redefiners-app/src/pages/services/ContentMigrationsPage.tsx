import { useParams } from 'react-router'
import { useContentMigrations } from '@/hooks/useContentMigrations'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ArrowDownToLine, Upload, CheckCircle2, XCircle, Loader2 } from 'lucide-react'

function getStatusIcon(state: string) {
  switch (state) {
    case 'completed':
      return CheckCircle2
    case 'failed':
      return XCircle
    case 'running':
    case 'pre_processing':
    case 'pre_processed':
      return Loader2
    default:
      return ArrowDownToLine
  }
}

function getStatusColor(state: string): string {
  switch (state) {
    case 'completed':
      return 'text-emerald-600 bg-emerald-50'
    case 'failed':
      return 'text-red-600 bg-red-50'
    case 'running':
    case 'pre_processing':
    case 'pre_processed':
      return 'text-amber-600 bg-amber-50'
    default:
      return 'text-neutral-600 bg-neutral-100'
  }
}

function getStatusLabel(state: string): string {
  switch (state) {
    case 'completed':
      return 'Completed'
    case 'failed':
      return 'Failed'
    case 'running':
      return 'Running'
    case 'pre_processing':
      return 'Pre-processing'
    case 'pre_processed':
      return 'Queued'
    case 'waiting_for_select':
      return 'Waiting'
    default:
      return state
  }
}

export function ContentMigrationsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: migrations, isLoading } = useContentMigrations(courseId!)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary-800">Content Migrations</h3>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-700"
        >
          <Upload className="h-4 w-4" />
          Import Content
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={5} />
      ) : !migrations || migrations.length === 0 ? (
        <EmptyState
          icon={ArrowDownToLine}
          heading="No content migrations"
          description="No content has been imported or exported for this course."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {migrations.map((migration) => {
            const StatusIcon = getStatusIcon(migration.workflow_state)
            const statusColor = getStatusColor(migration.workflow_state)
            const isRunning = migration.workflow_state === 'running' || migration.workflow_state === 'pre_processing'

            return (
              <div
                key={migration.id}
                className="flex items-center gap-4 border-b border-neutral-50 px-5 py-4 transition-colors hover:bg-neutral-50"
              >
                <div className={`shrink-0 rounded-lg p-2 ${statusColor}`}>
                  <StatusIcon className={`h-4 w-4 ${isRunning ? 'animate-spin' : ''}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-neutral-800">
                    {migration.migration_type_title}
                  </p>
                  <p className="text-xs text-neutral-400">
                    {migration.created_at
                      ? new Date(migration.created_at).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : ''}
                    {migration.migration_issues_count > 0 &&
                      ` \u00b7 ${migration.migration_issues_count} issue${migration.migration_issues_count > 1 ? 's' : ''}`}
                  </p>
                </div>
                <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}>
                  {getStatusLabel(migration.workflow_state)}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
