import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { ModuleItem } from '@/components/shared/ModuleItem'
import { Layers, ChevronDown, ChevronRight } from 'lucide-react'
import type { CanvasModule } from '@/types/canvas'

function useModules(courseId: string) {
  return useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasModule[]>(
        `/v1/courses/${courseId}/modules`,
        { include: ['items', 'content_details'], per_page: 50 },
      )
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function ModulesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: modules, isLoading } = useModules(courseId!)
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})

  const toggleModule = (moduleId: number) => {
    setCollapsed((prev) => ({ ...prev, [moduleId]: !prev[moduleId] }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Modules</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !modules || modules.length === 0 ? (
        <EmptyState
          icon={Layers}
          heading="No modules"
          description="This course has no modules yet."
        />
      ) : (
        <div className="space-y-4">
          {modules
            .sort((a, b) => a.position - b.position)
            .map((mod) => {
              const isCollapsed = collapsed[mod.id] ?? false
              const items = mod.items ?? []
              const completable = items.filter(
                (i) => i.completion_requirement,
              )
              const completed = completable.filter(
                (i) => i.completion_requirement?.completed,
              )
              const pct =
                completable.length > 0
                  ? Math.round((completed.length / completable.length) * 100)
                  : 0

              return (
                <div
                  key={mod.id}
                  className="overflow-hidden rounded-lg bg-white shadow-sm"
                >
                  {/* Module Header */}
                  <button
                    type="button"
                    onClick={() => toggleModule(mod.id)}
                    className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                      )}
                      <h4 className="text-sm font-semibold text-neutral-700">
                        {mod.name}
                      </h4>
                      <span className="text-xs text-neutral-400">
                        ({items.length} {items.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      {completable.length > 0 && (
                        <>
                          <span className="text-xs font-semibold text-primary-600">
                            {pct}%
                          </span>
                          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-neutral-100">
                            <div
                              className="h-full rounded-full bg-primary-500 transition-all"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </button>

                  {/* Module Items */}
                  {!isCollapsed && items.length > 0 && (
                    <div className="border-t border-neutral-100">
                      {items
                        .sort((a, b) => a.position - b.position)
                        .map((item) => (
                          <ModuleItem key={item.id} item={item} />
                        ))}
                    </div>
                  )}

                  {!isCollapsed && items.length === 0 && (
                    <p className="border-t border-neutral-100 px-5 py-3 text-sm text-neutral-400">
                      No items in this module.
                    </p>
                  )}
                </div>
              )
            })}
        </div>
      )}
    </div>
  )
}
