import { useParams } from 'react-router'
import { useRubrics } from '@/hooks/useRubrics'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { TableProperties, Hash } from 'lucide-react'

export function RubricsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: rubrics, isLoading } = useRubrics(courseId!)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Rubrics</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Assessment rubrics for this course
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={4} />
      ) : !rubrics || rubrics.length === 0 ? (
        <EmptyState
          icon={TableProperties}
          heading="No rubrics"
          description="No rubrics have been created for this course."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rubrics.map((rubric) => (
            <div
              key={rubric.id}
              className="rounded-lg bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="rounded-lg bg-teal-50 p-2">
                  <TableProperties className="h-5 w-5 text-teal-600" />
                </div>
                <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-600">
                  {rubric.points_possible} pts
                </span>
              </div>
              <h4 className="text-sm font-semibold text-neutral-800">
                {rubric.title}
              </h4>
              <div className="mt-2 flex items-center gap-3 text-xs text-neutral-500">
                <div className="flex items-center gap-1">
                  <Hash className="h-3.5 w-3.5" />
                  <span>
                    {rubric.data?.length ?? 0}{' '}
                    {(rubric.data?.length ?? 0) === 1
                      ? 'criterion'
                      : 'criteria'}
                  </span>
                </div>
              </div>
              {rubric.data && rubric.data.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  {rubric.data.slice(0, 4).map((criterion) => (
                    <div
                      key={criterion.id}
                      className="flex items-center justify-between rounded bg-neutral-50 px-2.5 py-1.5 text-xs"
                    >
                      <span className="text-neutral-600">
                        {criterion.description}
                      </span>
                      <span className="font-medium text-neutral-500">
                        {criterion.points} pts
                      </span>
                    </div>
                  ))}
                  {rubric.data.length > 4 && (
                    <p className="px-2.5 text-[10px] text-neutral-400">
                      +{rubric.data.length - 4} more criteria
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
