import { useState } from 'react'
import { useParams } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { EmptyState } from '@/components/common/EmptyState'
import { Link2, Search, ExternalLink, AlertTriangle } from 'lucide-react'

interface LinkValidationResult {
  url: string
  name: string
  type: string
  status_code: number
  failure_reason?: string
}

export function LinkValidatorPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [results, setResults] = useState<LinkValidationResult[]>([])

  const scanMutation = useMutation({
    mutationFn: async () => {
      const response = await apiGet<LinkValidationResult[]>(
        `/v1/courses/${courseId}/link_validation`,
      )
      return response.data
    },
    onSuccess: (data) => {
      setResults(Array.isArray(data) ? data : [])
    },
  })

  const brokenLinks = results.filter(
    (r) => r.status_code >= 400 || r.status_code === 0,
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            Link Validator
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Scan course content for broken links
          </p>
        </div>
        <button
          type="button"
          onClick={() => scanMutation.mutate()}
          disabled={scanMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Search className="h-4 w-4" />
          {scanMutation.isPending ? 'Scanning...' : 'Run Scan'}
        </button>
      </div>

      {/* Progress */}
      {scanMutation.isPending && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-sm text-neutral-600">
            <span>Scanning links...</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-neutral-100">
            <div className="h-full animate-pulse rounded-full bg-primary-500" style={{ width: '60%' }} />
          </div>
        </div>
      )}

      {scanMutation.isError && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700">
          Failed to scan links. Please try again.
        </div>
      )}

      {/* Results */}
      {!scanMutation.isPending && results.length > 0 && (
        <>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-neutral-800">{results.length}</p>
              <p className="text-sm text-neutral-500">Total Links</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-green-600">
                {results.length - brokenLinks.length}
              </p>
              <p className="text-sm text-neutral-500">Valid Links</p>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <p className="text-2xl font-bold text-red-600">{brokenLinks.length}</p>
              <p className="text-sm text-neutral-500">Broken Links</p>
            </div>
          </div>

          {brokenLinks.length === 0 ? (
            <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
              All links are valid. No broken links found.
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="grid grid-cols-[1fr_1fr_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
                <span>Page</span>
                <span>Broken URL</span>
                <span>Status</span>
                <span>Suggestion</span>
              </div>
              {brokenLinks.map((link, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_1fr_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
                    <span className="text-sm text-neutral-800">{link.name}</span>
                  </div>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 truncate text-sm text-blue-600 hover:underline"
                  >
                    {link.url}
                    <ExternalLink className="h-3 w-3 shrink-0" />
                  </a>
                  <span className="rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-medium text-red-700">
                    {link.status_code || 'Error'}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {link.failure_reason ?? 'Check URL'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {!scanMutation.isPending && results.length === 0 && !scanMutation.isError && (
        <EmptyState
          icon={Link2}
          heading="No scan results"
          description="Click Run Scan to check for broken links in this course."
        />
      )}
    </div>
  )
}
