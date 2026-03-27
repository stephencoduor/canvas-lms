import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Download, Package, FileArchive } from 'lucide-react'

interface ContentExport {
  id: number
  export_type: string
  workflow_state: 'created' | 'exporting' | 'exported' | 'failed'
  created_at: string
  attachment?: {
    url: string
    filename: string
    size: number
  }
}

const EXPORT_FORMATS = [
  { value: 'zip', label: 'ZIP File' },
  { value: 'qti', label: 'QTI Package' },
  { value: 'common_cartridge', label: 'Common Cartridge' },
]

export function ContentExportsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [format, setFormat] = useState('zip')

  const { data: exports, isLoading, refetch } = useQuery<ContentExport[]>({
    queryKey: ['contentExports', courseId],
    queryFn: async () => {
      const response = await apiGet<ContentExport[]>(
        `/v1/courses/${courseId}/content_exports`,
        { per_page: 20 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const exportMutation = useMutation({
    mutationFn: async () => {
      return apiPost(`/v1/courses/${courseId}/content_exports`, {
        export_type: format,
      })
    },
    onSuccess: () => {
      refetch()
    },
  })

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Content Exports
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Export course content for backup or migration
        </p>
      </div>

      {/* New Export */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-sm font-semibold text-neutral-700">
          Start New Export
        </h4>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Export Format
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {EXPORT_FORMATS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => exportMutation.mutate()}
            disabled={exportMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Package className="h-4 w-4" />
            {exportMutation.isPending ? 'Starting...' : 'Start Export'}
          </button>
        </div>
        {exportMutation.isError && (
          <p className="mt-2 text-sm text-red-600">
            Failed to start export. Please try again.
          </p>
        )}
      </div>

      {/* Export History */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-3">
          <h4 className="text-sm font-semibold text-neutral-700">
            Export History
          </h4>
        </div>
        {isLoading ? (
          <div className="p-5">
            <LoadingSkeleton type="row" count={4} />
          </div>
        ) : !exports || exports.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={FileArchive}
              heading="No exports"
              description="No content exports have been created yet."
            />
          </div>
        ) : (
          <div>
            {exports.map((exp) => (
              <div
                key={exp.id}
                className="flex items-center justify-between border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {exp.export_type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(exp.created_at).toLocaleString()}
                    {exp.attachment && ` - ${formatBytes(exp.attachment.size)}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      exp.workflow_state === 'exported'
                        ? 'bg-green-50 text-green-700'
                        : exp.workflow_state === 'failed'
                          ? 'bg-red-50 text-red-700'
                          : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    {exp.workflow_state}
                  </span>
                  {exp.attachment?.url && (
                    <a
                      href={exp.attachment.url}
                      className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
