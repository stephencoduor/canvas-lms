import { useParams } from 'react-router'
import { useGroups } from '@/hooks/useGroups'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Users2, ArrowRight } from 'lucide-react'

export function GroupsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: groups, isLoading } = useGroups(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Groups</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={5} />
      ) : !groups || groups.length === 0 ? (
        <EmptyState
          icon={Users2}
          heading="No groups"
          description="You are not in any groups."
        />
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <div
              key={group.id}
              className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-50">
                  <Users2 className="h-5 w-5 text-primary-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {group.name}
                  </p>
                  <p className="mt-0.5 text-xs text-neutral-500">
                    {group.members_count || 0} members
                    {group.context_type
                      ? ` \u00B7 ${group.context_type}`
                      : ''}
                  </p>
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-neutral-400" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
