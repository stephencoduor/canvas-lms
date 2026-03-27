import { useParams, Link } from 'react-router'
import { useDiscussions } from '@/hooks/useDiscussions'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { MessageSquare, Pin, Lock } from 'lucide-react'

function formatRelativeTime(isoString: string | null): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  if (diffMins < 1) return 'just now'
  if (diffMins < 60) return `${diffMins}m ago`
  const diffHours = Math.floor(diffMins / 60)
  if (diffHours < 24) return `${diffHours}h ago`
  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function DiscussionsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: topics, isLoading } = useDiscussions(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Discussions</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !topics || topics.length === 0 ? (
        <EmptyState
          icon={MessageSquare}
          heading="No discussions"
          description="No discussion topics yet."
        />
      ) : (
        <div className="space-y-2">
          {topics.map((topic) => (
            <Link
              key={topic.id}
              to={`/courses/${courseId}/discussions/${topic.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <MessageSquare className="h-5 w-5 shrink-0 text-primary-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {topic.title}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {topic.author?.display_name ?? 'Unknown'} &bull;{' '}
                    {topic.discussion_subentry_count || 0} replies &bull;{' '}
                    {topic.unread_count || 0} unread &bull;{' '}
                    {formatRelativeTime(topic.last_reply_at || topic.posted_at)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {topic.pinned && (
                  <Pin className="h-4 w-4 text-amber-500" />
                )}
                {topic.locked && (
                  <Lock className="h-4 w-4 text-neutral-400" />
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
