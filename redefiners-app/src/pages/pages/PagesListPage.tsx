import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { StatusPill } from '@/components/common/StatusPill'
import { FileText, Star } from 'lucide-react'
import type { CanvasPage } from '@/types/canvas'

function usePages(courseId: string) {
  return useQuery({
    queryKey: ['pages', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasPage[]>(
        `/v1/courses/${courseId}/pages`,
        { per_page: 50 },
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

function relativeTime(isoString: string): string {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function PagesListPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: pages, isLoading } = usePages(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Pages</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !pages || pages.length === 0 ? (
        <EmptyState
          icon={FileText}
          heading="No pages"
          description="This course has no pages yet."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {pages.map((page) => (
            <Link
              key={page.url}
              to={`/courses/${courseId}/pages/${encodeURIComponent(page.url)}`}
              className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 transition-colors last:border-0 hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 flex-shrink-0 text-primary-400" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {page.title}
                  </p>
                  <p className="text-xs text-neutral-500">
                    <StatusPill
                      status={page.published ? 'published' : 'unpublished'}
                      className="mr-2"
                    />
                    Updated {relativeTime(page.updated_at)}
                  </p>
                </div>
              </div>

              {page.front_page && (
                <span className="flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700">
                  <Star className="h-3 w-3" />
                  Front Page
                </span>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
