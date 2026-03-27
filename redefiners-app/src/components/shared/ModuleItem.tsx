import {
  FileText,
  File,
  MessageSquare,
  HelpCircle,
  Link as LinkIcon,
  Minus,
  CheckSquare,
  Square,
} from 'lucide-react'
import type { CanvasModuleItem } from '@/types/canvas'

interface ModuleItemProps {
  item: CanvasModuleItem
}

const typeIcons: Record<string, typeof FileText> = {
  Assignment: FileText,
  Page: File,
  Discussion: MessageSquare,
  Quiz: HelpCircle,
  File: File,
  ExternalUrl: LinkIcon,
  ExternalTool: LinkIcon,
  SubHeader: Minus,
}

export function ModuleItem({ item }: ModuleItemProps) {
  const Icon = typeIcons[item.type] ?? File
  const isCompleted = item.completion_requirement?.completed === true
  const hasRequirement = !!item.completion_requirement

  if (item.type === 'SubHeader') {
    return (
      <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
        {item.title}
      </div>
    )
  }

  return (
    <div
      className="flex items-center gap-3 border-b border-neutral-50 px-4 py-2.5 transition-colors last:border-0 hover:bg-neutral-50"
      style={{ paddingLeft: `${1 + item.indent * 1.5}rem` }}
    >
      {/* Completion checkbox */}
      {hasRequirement ? (
        isCompleted ? (
          <CheckSquare className="h-4 w-4 flex-shrink-0 text-green-500" />
        ) : (
          <Square className="h-4 w-4 flex-shrink-0 text-neutral-300" />
        )
      ) : (
        <div className="h-4 w-4 flex-shrink-0" />
      )}

      {/* Type icon */}
      <Icon className="h-4 w-4 flex-shrink-0 text-neutral-400" />

      {/* Title */}
      <span className="min-w-0 flex-1 truncate text-sm text-neutral-700">
        {item.title}
      </span>

      {/* Points if applicable */}
      {item.content_details?.points_possible != null && (
        <span className="text-xs text-neutral-400">
          {item.content_details.points_possible} pts
        </span>
      )}
    </div>
  )
}
