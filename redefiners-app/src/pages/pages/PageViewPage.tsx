import { safeHtml } from '../../lib/sanitize';
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ChevronRight } from 'lucide-react'
import type { CanvasPage } from '@/types/canvas'

function usePage(courseId: string, pageUrl: string) {
  return useQuery({
    queryKey: ['page', courseId, pageUrl],
    queryFn: async () => {
      const response = await apiGet<CanvasPage>(
        `/v1/courses/${courseId}/pages/${pageUrl}`,
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

function formatDate(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function PageViewPage() {
  const { courseId, pageUrl } = useParams<{
    courseId: string
    pageUrl: string
  }>()
  const { data: page, isLoading } = usePage(courseId!, pageUrl!)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={1} />
        <LoadingSkeleton type="row" count={6} />
      </div>
    )
  }

  if (!page) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Page not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1 text-sm text-neutral-500">
        <Link
          to={`/courses/${courseId}`}
          className="transition-colors hover:text-primary-600"
        >
          Course
        </Link>
        <ChevronRight className="h-3 w-3" />
        <Link
          to={`/courses/${courseId}/pages`}
          className="transition-colors hover:text-primary-600"
        >
          Pages
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-neutral-700">{page.title}</span>
      </nav>

      {/* Page Header */}
      <div>
        <h3 className="text-2xl font-bold text-primary-800">{page.title}</h3>
        <p className="mt-1 text-xs text-neutral-400">
          Last updated {formatDate(page.updated_at)}
        </p>
      </div>

      {/* Page Body */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        {page.body ? (
          <div
            className="prose prose-sm max-w-none text-neutral-600"
            dangerouslySetInnerHTML={safeHtml(page.body)}
          />
        ) : (
          <p className="text-sm text-neutral-400">This page is empty.</p>
        )}
      </section>
    </div>
  )
}
