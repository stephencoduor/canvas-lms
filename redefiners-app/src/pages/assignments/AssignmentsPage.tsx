import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { AssignmentRow } from '@/components/shared/AssignmentRow'
import { ClipboardList, ChevronDown, ChevronRight } from 'lucide-react'
import type { CanvasAssignmentGroup } from '@/types/canvas'

function useAssignmentGroups(courseId: string) {
  return useQuery({
    queryKey: ['assignmentGroups', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignmentGroup[]>(
        `/v1/courses/${courseId}/assignment_groups`,
        {
          include: ['assignments', 'submission'],
          per_page: 50,
        },
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

export function AssignmentsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: groups, isLoading } = useAssignmentGroups(courseId!)
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({})

  const toggleGroup = (groupId: number) => {
    setCollapsed((prev) => ({ ...prev, [groupId]: !prev[groupId] }))
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Assignments</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : !groups || groups.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          heading="No assignments"
          description="There are no assignments in this course yet."
        />
      ) : (
        <div className="space-y-4">
          {groups
            .sort((a, b) => a.position - b.position)
            .map((group) => {
              const isCollapsed = collapsed[group.id] ?? false
              const assignments = group.assignments ?? []

              return (
                <div
                  key={group.id}
                  className="overflow-hidden rounded-lg bg-white shadow-sm"
                >
                  {/* Group Header */}
                  <button
                    type="button"
                    onClick={() => toggleGroup(group.id)}
                    className="flex w-full items-center justify-between px-5 py-3 text-left transition-colors hover:bg-neutral-50"
                  >
                    <div className="flex items-center gap-2">
                      {isCollapsed ? (
                        <ChevronRight className="h-4 w-4 text-neutral-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-neutral-400" />
                      )}
                      <h4 className="text-sm font-semibold text-neutral-700">
                        {group.name}
                      </h4>
                      <span className="text-xs text-neutral-400">
                        ({assignments.length})
                      </span>
                    </div>
                    {group.group_weight > 0 && (
                      <span className="text-xs text-neutral-400">
                        {group.group_weight}% of grade
                      </span>
                    )}
                  </button>

                  {/* Assignment List */}
                  {!isCollapsed && assignments.length > 0 && (
                    <div className="space-y-1 px-4 pb-3">
                      {assignments
                        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
                        .map((assignment) => (
                          <AssignmentRow
                            key={assignment.id}
                            assignment={assignment}
                            courseId={courseId!}
                          />
                        ))}
                    </div>
                  )}

                  {!isCollapsed && assignments.length === 0 && (
                    <p className="px-5 pb-3 text-sm text-neutral-400">
                      No assignments in this group.
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
