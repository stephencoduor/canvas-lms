import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Calendar, Users, Send, ChevronDown, ChevronRight } from 'lucide-react'
import type { CanvasModule, CanvasModuleItem, CanvasSection } from '@/types/canvas'

interface PaceItem {
  moduleItem: CanvasModuleItem
  dueDate: string
}

interface PaceModule {
  module: CanvasModule
  items: PaceItem[]
}

function toLocalDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toISOString().slice(0, 10)
}

export function CoursePacesPage() {
  const { courseId } = useParams<{ courseId: string }>()

  const [selectedSection, setSelectedSection] = useState<string>('all')
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  )
  const [endDate, setEndDate] = useState('')
  const [expandedModules, setExpandedModules] = useState<Set<number>>(
    new Set(),
  )
  const [paceModules, setPaceModules] = useState<PaceModule[]>([])

  const { data: modules, isLoading: modulesLoading } = useQuery({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasModule[]>(
        `/v1/courses/${courseId}/modules`,
        { include: ['items'], per_page: 50 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: sections } = useQuery({
    queryKey: ['sections', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasSection[]>(
        `/v1/courses/${courseId}/sections`,
      )
      return response.data
    },
    enabled: !!courseId,
  })

  // Initialize pace modules from course modules
  if (modules && paceModules.length === 0) {
    const initialized: PaceModule[] = modules.map((mod) => ({
      module: mod,
      items: (mod.items ?? [])
        .filter((item) => item.type !== 'SubHeader')
        .map((item) => ({
          moduleItem: item,
          dueDate: toLocalDate(item.content_details?.due_at),
        })),
    }))
    setPaceModules(initialized)
  }

  const toggleModule = (moduleId: number) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const updateItemDueDate = (
    moduleIndex: number,
    itemIndex: number,
    date: string,
  ) => {
    setPaceModules((prev) => {
      const updated = [...prev]
      const module = { ...updated[moduleIndex] }
      const items = [...module.items]
      items[itemIndex] = { ...items[itemIndex], dueDate: date }
      module.items = items
      updated[moduleIndex] = module
      return updated
    })
  }

  if (modulesLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={1} />
        <LoadingSkeleton type="row" count={6} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Course Pacing</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Customize due dates for modules and assignments
        </p>
      </div>

      {/* Controls */}
      <div className="grid gap-4 rounded-lg bg-white p-5 shadow-sm md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            <Users className="mr-1 inline h-4 w-4" />
            Student / Section
          </label>
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            <option value="all">All Students</option>
            {sections?.map((s: CanvasSection) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            <Calendar className="mr-1 inline h-4 w-4" />
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            <Calendar className="mr-1 inline h-4 w-4" />
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Module List */}
      <div className="space-y-3">
        {paceModules.map((pm, moduleIndex) => {
          const isExpanded = expandedModules.has(pm.module.id)
          return (
            <div
              key={pm.module.id}
              className="rounded-lg bg-white shadow-sm"
            >
              <button
                type="button"
                onClick={() => toggleModule(pm.module.id)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <div className="flex items-center gap-2">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  )}
                  <span className="font-medium text-neutral-800">
                    {pm.module.name}
                  </span>
                </div>
                <span className="text-xs text-neutral-500">
                  {pm.items.length} items
                </span>
              </button>

              {isExpanded && (
                <div className="border-t border-neutral-100 px-5 pb-4">
                  {pm.items.length === 0 ? (
                    <p className="py-3 text-sm text-neutral-400">
                      No items in this module.
                    </p>
                  ) : (
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-neutral-100">
                          <th className="py-2 text-left font-medium text-neutral-500">
                            Item
                          </th>
                          <th className="py-2 text-left font-medium text-neutral-500">
                            Type
                          </th>
                          <th className="py-2 text-left font-medium text-neutral-500">
                            Due Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {pm.items.map((item, itemIndex) => (
                          <tr
                            key={item.moduleItem.id}
                            className="border-b border-neutral-50"
                          >
                            <td className="py-2 text-neutral-700">
                              {item.moduleItem.title}
                            </td>
                            <td className="py-2 text-neutral-500">
                              {item.moduleItem.type}
                            </td>
                            <td className="py-2">
                              <input
                                type="date"
                                value={item.dueDate}
                                onChange={(e) =>
                                  updateItemDueDate(
                                    moduleIndex,
                                    itemIndex,
                                    e.target.value,
                                  )
                                }
                                className="rounded border border-neutral-200 px-2 py-1 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Publish */}
      <div className="flex justify-end">
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Send className="h-4 w-4" />
          Publish Pacing
        </button>
      </div>
    </div>
  )
}
