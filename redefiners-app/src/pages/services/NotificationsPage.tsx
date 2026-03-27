import { useState } from 'react'
import { useActivityStream } from '@/hooks/useNotifications'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Bell, Megaphone, Star, Mail, Clock } from 'lucide-react'
import type { ActivityStreamItem } from '@/services/modules/notifications'

type NotificationFilter = 'all' | 'Announcement' | 'Submission' | 'Conversation' | 'Message'

const FILTER_OPTIONS: { value: NotificationFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Announcement', label: 'Announcements' },
  { value: 'Submission', label: 'Grades' },
  { value: 'Conversation', label: 'Messages' },
  { value: 'Message', label: 'Due Dates' },
]

function getTypeIcon(type: string) {
  switch (type) {
    case 'Announcement':
      return Megaphone
    case 'Submission':
      return Star
    case 'Conversation':
      return Mail
    case 'Message':
      return Clock
    default:
      return Bell
  }
}

function getTypeColor(type: string): string {
  switch (type) {
    case 'Announcement':
      return 'text-amber-600 bg-amber-50'
    case 'Submission':
      return 'text-yellow-600 bg-yellow-50'
    case 'Conversation':
      return 'text-blue-600 bg-blue-50'
    case 'Message':
      return 'text-red-600 bg-red-50'
    default:
      return 'text-neutral-600 bg-neutral-100'
  }
}

function matchesFilter(item: ActivityStreamItem, filter: NotificationFilter): boolean {
  if (filter === 'all') return true
  return item.type === filter
}

export function NotificationsPage() {
  const { data: stream, isLoading } = useActivityStream()
  const [filter, setFilter] = useState<NotificationFilter>('all')
  const [readItems, setReadItems] = useState<Set<number>>(new Set())

  const items = stream?.filter((item) => matchesFilter(item, filter)) ?? []

  function toggleRead(id: number) {
    setReadItems((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  function isRead(item: ActivityStreamItem): boolean {
    if (readItems.has(item.id)) return !item.read_state
    return item.read_state
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary-800">Notifications</h3>
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilter(opt.value)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === opt.value
                  ? 'bg-white text-primary-700 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-700'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : items.length === 0 ? (
        <EmptyState
          icon={Bell}
          heading="No notifications"
          description="You're all caught up! No notifications to display."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {items.map((item) => {
            const Icon = getTypeIcon(item.type)
            const color = getTypeColor(item.type)
            const read = isRead(item)

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleRead(item.id)}
                className={`flex w-full items-start gap-4 border-b border-neutral-50 px-5 py-4 text-left transition-colors hover:bg-neutral-50 ${
                  read ? 'opacity-60' : ''
                }`}
              >
                <div className={`mt-0.5 shrink-0 rounded-lg p-2 ${color}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`text-sm ${read ? 'text-neutral-500' : 'font-medium text-neutral-800'}`}>
                      {item.title}
                    </p>
                    {!read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-primary-500" />
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-neutral-400">
                    {new Date(item.created_at).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
