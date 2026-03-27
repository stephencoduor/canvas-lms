import { useState } from 'react'
import { useParams } from 'react-router'
import { useOutcomeGroups, useGroupOutcomes } from '@/hooks/useOutcomes'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Target, ChevronRight, Star } from 'lucide-react'

export function OutcomesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: groups, isLoading } = useOutcomeGroups(courseId!)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const { data: outcomes, isLoading: outcomesLoading } = useGroupOutcomes(
    courseId!,
    selectedGroupId ?? '',
  )

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Learning Outcomes
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Outcomes and mastery tracking for this course
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : !groups || groups.length === 0 ? (
        <EmptyState
          icon={Target}
          heading="No outcome groups"
          description="No learning outcome groups have been created for this course."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Outcome Groups */}
          <div className="space-y-2">
            <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide text-neutral-500">
              Outcome Groups
            </h4>
            {groups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setSelectedGroupId(String(group.id))}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-left transition-colors ${
                  selectedGroupId === String(group.id)
                    ? 'bg-primary-50 text-primary-700'
                    : 'bg-white text-neutral-700 shadow-sm hover:bg-neutral-50'
                }`}
              >
                <span className="text-sm font-medium">{group.title}</span>
                <ChevronRight className="h-4 w-4 text-neutral-400" />
              </button>
            ))}
          </div>

          {/* Outcomes List */}
          <div className="lg:col-span-2">
            {!selectedGroupId ? (
              <div className="flex h-48 items-center justify-center rounded-lg bg-white shadow-sm">
                <p className="text-sm text-neutral-400">
                  Select an outcome group to view outcomes
                </p>
              </div>
            ) : outcomesLoading ? (
              <LoadingSkeleton type="row" count={6} />
            ) : !outcomes || outcomes.length === 0 ? (
              <EmptyState
                icon={Target}
                heading="No outcomes"
                description="No outcomes in this group."
              />
            ) : (
              <div className="space-y-3">
                {outcomes.map((outcome) => (
                  <div
                    key={outcome.id}
                    className="rounded-lg bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h5 className="text-sm font-semibold text-neutral-800">
                          {outcome.title}
                        </h5>
                        {outcome.display_name && (
                          <p className="text-xs text-neutral-500">
                            {outcome.display_name}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 rounded bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-600">
                        <Star className="h-3 w-3" />
                        {outcome.mastery_points} / {outcome.points_possible} pts
                      </div>
                    </div>
                    {outcome.description && (
                      <p className="mt-2 text-xs text-neutral-500">
                        {outcome.description}
                      </p>
                    )}
                    {outcome.ratings && outcome.ratings.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {outcome.ratings.map((rating, idx) => (
                          <span
                            key={idx}
                            className="rounded-full border border-neutral-200 px-2 py-0.5 text-[10px] text-neutral-500"
                          >
                            {rating.description} ({rating.points})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
