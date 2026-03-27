import { safeHtml } from '../../lib/sanitize';
import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDiscussion, getFullThread, postEntry } from '@/services/modules/discussions'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { MessageSquare, Send } from 'lucide-react'
import type {
  CanvasDiscussionTopic,
  CanvasDiscussionView,
  CanvasDiscussionEntry,
} from '@/types/canvas'

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

function EntryCard({
  entry,
  participants,
  depth = 0,
}: {
  entry: CanvasDiscussionEntry
  participants: CanvasDiscussionView['participants']
  depth?: number
}) {
  const participant = participants.find((p) => p.id === entry.user_id)

  return (
    <div style={{ marginLeft: depth * 24 }}>
      <div className="flex gap-3 border-b border-neutral-100 p-4">
        <img
          src={participant?.avatar_image_url || '/images/default-avatar.png'}
          alt=""
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
        <div className="flex-1">
          <div className="mb-1 flex items-center justify-between">
            <span className="text-sm font-medium text-neutral-800">
              {participant?.display_name || 'Anonymous'}
            </span>
            <span className="text-xs text-neutral-400">
              {formatRelativeTime(entry.created_at)}
            </span>
          </div>
          <div
            className="prose prose-sm max-w-none text-neutral-600"
            dangerouslySetInnerHTML={safeHtml(entry.message || '')}
          />
        </div>
      </div>
      {entry.replies?.map((reply) => (
        <EntryCard
          key={reply.id}
          entry={reply}
          participants={participants}
          depth={depth + 1}
        />
      ))}
    </div>
  )
}

export function DiscussionThreadPage() {
  const { courseId, topicId } = useParams<{
    courseId: string
    topicId: string
  }>()
  const queryClient = useQueryClient()
  const [replyText, setReplyText] = useState('')

  const { data: topic, isLoading: topicLoading } = useQuery<CanvasDiscussionTopic>({
    queryKey: ['discussion', courseId, topicId],
    queryFn: async () => {
      const response = await getDiscussion(courseId!, topicId!)
      return response.data
    },
    enabled: !!courseId && !!topicId,
  })

  const { data: thread, isLoading: threadLoading } = useQuery<CanvasDiscussionView>({
    queryKey: ['discussionThread', courseId, topicId],
    queryFn: async () => {
      const response = await getFullThread(courseId!, topicId!)
      return response.data
    },
    enabled: !!courseId && !!topicId,
  })

  const replyMutation = useMutation({
    mutationFn: async (message: string) => {
      await postEntry(courseId!, topicId!, message)
    },
    onSuccess: () => {
      setReplyText('')
      queryClient.invalidateQueries({
        queryKey: ['discussionThread', courseId, topicId],
      })
    },
  })

  const handleSubmitReply = () => {
    const trimmed = replyText.trim()
    if (!trimmed) return
    replyMutation.mutate(trimmed)
  }

  const isLoading = topicLoading || threadLoading

  return (
    <div className="space-y-6">
      {/* Topic Header */}
      {isLoading ? (
        <LoadingSkeleton type="text" count={2} />
      ) : topic ? (
        <div>
          <h3 className="text-2xl font-bold text-primary-800">{topic.title}</h3>
          <p className="mt-1 text-sm text-neutral-500">
            {topic.author?.display_name} &bull;{' '}
            {topic.discussion_subentry_count} replies
          </p>
        </div>
      ) : null}

      {/* Original Post */}
      {topic?.message && (
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <div
            className="prose prose-sm max-w-none text-neutral-700"
            dangerouslySetInnerHTML={safeHtml(topic.message)}
          />
        </section>
      )}

      {/* Replies */}
      <section className="overflow-hidden rounded-lg bg-white shadow-sm">
        <h4 className="flex items-center gap-2 px-5 py-4 text-lg font-semibold text-neutral-700">
          <MessageSquare className="h-5 w-5 text-primary-500" />
          Replies
        </h4>
        {threadLoading ? (
          <div className="px-5 pb-4">
            <LoadingSkeleton type="row" count={4} />
          </div>
        ) : !thread?.view || thread.view.length === 0 ? (
          <p className="px-5 pb-4 text-sm text-neutral-500">
            No replies yet. Be the first to respond!
          </p>
        ) : (
          thread.view.map((entry) => (
            <EntryCard
              key={entry.id}
              entry={entry}
              participants={thread.participants}
            />
          ))
        )}
      </section>

      {/* Reply Form */}
      {topic && !topic.locked && (
        <section className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-semibold text-neutral-700">
            Post a Reply
          </h4>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={4}
            className="w-full rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || replyMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              {replyMutation.isPending ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}
