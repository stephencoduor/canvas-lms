import { safeHtml } from '../../lib/sanitize';
import { useState } from 'react'
import { useConversations, useConversation } from '@/hooks/useConversations'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Mail, PenSquare } from 'lucide-react'
import type { CanvasConversation } from '@/types/canvas'

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

function truncate(text: string, max: number): string {
  if (text.length <= max) return text
  return text.slice(0, max) + '...'
}

function ConversationRow({
  conversation,
  isSelected,
  onClick,
}: {
  conversation: CanvasConversation
  isSelected: boolean
  onClick: () => void
}) {
  const isUnread = conversation.workflow_state === 'unread'

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full border-b border-neutral-100 p-4 text-left transition-colors hover:bg-neutral-50 ${
        isSelected ? 'bg-primary-50' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <img
          src={conversation.avatar_url || '/images/default-avatar.png'}
          alt=""
          className="h-9 w-9 shrink-0 rounded-full object-cover"
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <p
              className={`truncate text-sm ${
                isUnread
                  ? 'font-semibold text-neutral-900'
                  : 'font-medium text-neutral-700'
              }`}
            >
              {conversation.participants
                .map((p) => p.name)
                .slice(0, 2)
                .join(', ')}
            </p>
            <span className="ml-2 shrink-0 text-xs text-neutral-400">
              {formatRelativeTime(conversation.last_message_at)}
            </span>
          </div>
          <p className="mt-0.5 truncate text-xs font-medium text-neutral-600">
            {conversation.subject || '(no subject)'}
          </p>
          <p className="mt-0.5 truncate text-xs text-neutral-400">
            {truncate(conversation.last_message || '', 80)}
          </p>
        </div>
        {isUnread && (
          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary-500" />
        )}
      </div>
    </button>
  )
}

export function InboxPage() {
  const { data: conversations, isLoading: listLoading } = useConversations()
  const [selectedId, setSelectedId] = useState<number | undefined>()
  const { data: thread, isLoading: threadLoading } = useConversation(selectedId)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary-800">Inbox</h3>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <PenSquare className="h-4 w-4" />
          Compose
        </button>
      </div>

      <div className="grid min-h-[500px] grid-cols-1 gap-0 overflow-hidden rounded-lg bg-white shadow-sm lg:grid-cols-3">
        {/* Left Panel: Conversation List */}
        <div className="border-r border-neutral-200 lg:col-span-1">
          <div className="border-b border-neutral-200 px-4 py-3">
            <p className="text-sm font-semibold text-neutral-700">Messages</p>
          </div>
          <div className="max-h-[600px] overflow-y-auto">
            {listLoading ? (
              <div className="p-4">
                <LoadingSkeleton type="row" count={6} />
              </div>
            ) : !conversations || conversations.length === 0 ? (
              <div className="p-8">
                <EmptyState
                  icon={Mail}
                  heading="No messages"
                  description="Your inbox is empty."
                />
              </div>
            ) : (
              conversations.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conversation={conv}
                  isSelected={selectedId === conv.id}
                  onClick={() => setSelectedId(conv.id)}
                />
              ))
            )}
          </div>
        </div>

        {/* Right Panel: Selected Conversation */}
        <div className="lg:col-span-2">
          {!selectedId ? (
            <div className="flex h-full items-center justify-center p-8">
              <p className="text-sm text-neutral-400">
                Select a conversation to view messages
              </p>
            </div>
          ) : threadLoading ? (
            <div className="p-5">
              <LoadingSkeleton type="row" count={4} />
            </div>
          ) : thread ? (
            <div>
              <div className="border-b border-neutral-200 px-5 py-4">
                <h4 className="text-lg font-semibold text-neutral-800">
                  {thread.subject || '(no subject)'}
                </h4>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {thread.participants.map((p) => p.name).join(', ')}
                </p>
              </div>
              <div className="max-h-[500px] space-y-4 overflow-y-auto p-5">
                {thread.messages?.map((msg) => {
                  const author = thread.participants.find(
                    (p) => p.id === msg.author_id,
                  )
                  return (
                    <div key={msg.id} className="flex gap-3">
                      <img
                        src={
                          author?.avatar_url || '/images/default-avatar.png'
                        }
                        alt=""
                        className="h-8 w-8 shrink-0 rounded-full object-cover"
                      />
                      <div className="flex-1">
                        <div className="mb-1 flex items-center justify-between">
                          <span className="text-sm font-medium text-neutral-800">
                            {author?.name || 'Unknown'}
                          </span>
                          <span className="text-xs text-neutral-400">
                            {formatRelativeTime(msg.created_at)}
                          </span>
                        </div>
                        <div
                          className="prose prose-sm max-w-none text-neutral-600"
                          dangerouslySetInnerHTML={safeHtml(msg.body || '')}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
