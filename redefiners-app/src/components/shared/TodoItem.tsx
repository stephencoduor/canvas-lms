import { FileText, HelpCircle, MessageSquare, ClipboardList } from 'lucide-react'
import type { CanvasTodoItem } from '@/types/canvas'

interface TodoItemProps {
  item: CanvasTodoItem
}

const typeIcons: Record<string, typeof FileText> = {
  assignment: FileText,
  quiz: HelpCircle,
  discussion_topic: MessageSquare,
}

function formatDateTime(isoString: string | null): string {
  if (!isoString) return 'No due date'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function TodoItem({ item }: TodoItemProps) {
  const Icon =
    typeIcons[item.assignment?.submission_types?.[0] ?? ''] ?? ClipboardList

  return (
    <a
      href={item.html_url}
      className="flex items-center gap-3 border-b border-neutral-100 py-2.5 transition-colors last:border-0 hover:bg-neutral-50"
    >
      {/* Color dot */}
      <div
        className={`h-2 w-2 flex-shrink-0 rounded-full ${
          item.context_type === 'Course' ? 'bg-blue-500' : 'bg-purple-500'
        }`}
      />

      {/* Icon */}
      <Icon className="h-4 w-4 flex-shrink-0 text-neutral-400" />

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-neutral-700">
          {item.assignment?.name ?? item.type}
        </p>
        <p className="text-[11px] text-neutral-400">
          {item.context_name}
          {item.assignment?.due_at && (
            <span className="ml-1">
              &middot; Due {formatDateTime(item.assignment.due_at)}
            </span>
          )}
        </p>
      </div>
    </a>
  )
}
