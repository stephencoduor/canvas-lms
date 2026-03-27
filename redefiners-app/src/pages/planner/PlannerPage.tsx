import { useMemo } from 'react'
import { usePlannerItems } from '@/hooks/usePlanner'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ClipboardList, CheckCircle2, Circle, ExternalLink } from 'lucide-react'
import type { CanvasPlannerItem } from '@/services/modules/planner'

function groupByDate(
  items: CanvasPlannerItem[],
): Map<string, CanvasPlannerItem[]> {
  const map = new Map<string, CanvasPlannerItem[]>()
  for (const item of items) {
    const dateStr = item.plannable_date?.split('T')[0] ?? 'Unknown'
    const existing = map.get(dateStr) ?? []
    existing.push(item)
    map.set(dateStr, existing)
  }
  return map
}

function formatDateLabel(dateStr: string): string {
  const date = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  if (date.getTime() === today.getTime()) return 'Today'
  if (date.getTime() === tomorrow.getTime()) return 'Tomorrow'
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

export function PlannerPage() {
  const { data: items, isLoading } = usePlannerItems()

  const grouped = useMemo(() => {
    if (!items) return new Map()
    return groupByDate(items)
  }, [items])

  const sortedDates = Array.from(grouped.keys()).sort()

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Planner</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Your upcoming tasks and assignments
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={10} />
      ) : !items || items.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          heading="All caught up!"
          description="You have no upcoming items in your planner."
        />
      ) : (
        <div className="space-y-6">
          {sortedDates.map((dateStr) => {
            const dateItems: CanvasPlannerItem[] = grouped.get(dateStr) ?? []
            return (
              <div key={dateStr}>
                <h4 className="mb-2 text-sm font-semibold text-neutral-600">
                  {formatDateLabel(dateStr)}
                </h4>
                <div className="space-y-2">
                  {dateItems.map((item) => {
                    const isComplete =
                      item.planner_override?.marked_complete ?? false
                    const submitted = item.submissions?.submitted ?? false

                    return (
                      <div
                        key={item.plannable.id}
                        className="flex items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm transition-colors hover:bg-neutral-50"
                      >
                        {isComplete || submitted ? (
                          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-500" />
                        ) : (
                          <Circle className="h-5 w-5 shrink-0 text-neutral-300" />
                        )}
                        <div className="min-w-0 flex-1">
                          <p
                            className={`text-sm font-medium ${
                              isComplete || submitted
                                ? 'text-neutral-400 line-through'
                                : 'text-neutral-800'
                            }`}
                          >
                            {item.plannable.title}
                          </p>
                          <div className="flex items-center gap-2">
                            {item.context_name && (
                              <span className="text-xs text-neutral-400">
                                {item.context_name}
                              </span>
                            )}
                            <span className="rounded bg-neutral-100 px-1.5 py-0.5 text-[10px] font-medium text-neutral-500">
                              {item.plannable_type}
                            </span>
                          </div>
                        </div>
                        {item.plannable.points_possible != null && (
                          <span className="text-xs text-neutral-500">
                            {item.plannable.points_possible} pts
                          </span>
                        )}
                        {item.html_url && (
                          <a
                            href={item.html_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-300 transition-colors hover:text-primary-600"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
