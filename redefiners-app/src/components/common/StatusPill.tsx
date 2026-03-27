import { memo } from 'react'
import { cn } from '@/lib/utils'

type StatusType =
  | 'submitted'
  | 'graded'
  | 'missing'
  | 'late'
  | 'published'
  | 'unpublished'
  | 'active'
  | 'completed'

interface StatusPillProps {
  status: StatusType
  className?: string
}

const statusConfig: Record<StatusType, { label: string; classes: string }> = {
  submitted: {
    label: 'Submitted',
    classes: 'bg-green-100 text-green-700 border-green-200',
  },
  graded: {
    label: 'Graded',
    classes: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  missing: {
    label: 'Missing',
    classes: 'bg-red-100 text-red-700 border-red-200',
  },
  late: {
    label: 'Late',
    classes: 'bg-orange-100 text-orange-700 border-orange-200',
  },
  published: {
    label: 'Published',
    classes: 'bg-green-100 text-green-700 border-green-200',
  },
  unpublished: {
    label: 'Unpublished',
    classes: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  },
  active: {
    label: 'Active',
    classes: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  },
  completed: {
    label: 'Completed',
    classes: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  },
}

export const StatusPill = memo(function StatusPill({ status, className }: StatusPillProps) {
  const config = statusConfig[status]
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  )
})
