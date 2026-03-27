import { useParams } from 'react-router'
import { useCollaborations } from '@/hooks/useCollaborations'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { FileText, ExternalLink } from 'lucide-react'

function getCollabTypeLabel(type: string): string {
  if (type.toLowerCase().includes('google')) return 'Google Docs'
  if (type.toLowerCase().includes('etherpad')) return 'Etherpad'
  return type
}

function getCollabTypeColor(type: string): string {
  if (type.toLowerCase().includes('google')) return 'text-blue-600 bg-blue-50'
  if (type.toLowerCase().includes('etherpad')) return 'text-purple-600 bg-purple-50'
  return 'text-neutral-600 bg-neutral-100'
}

export function CollaborationsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: collaborations, isLoading } = useCollaborations(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Collaborations</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !collaborations || collaborations.length === 0 ? (
        <EmptyState
          icon={FileText}
          heading="No collaborations"
          description="No shared documents or collaborations have been created for this course."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Title</span>
            <span>Type</span>
            <span className="hidden sm:inline">Created By</span>
            <span className="hidden md:inline">Last Modified</span>
          </div>
          {collaborations.map((collab) => {
            const typeLabel = getCollabTypeLabel(collab.collaboration_type)
            const typeColor = getCollabTypeColor(collab.collaboration_type)

            return (
              <a
                key={collab.id}
                href={collab.url}
                target="_blank"
                rel="noopener noreferrer"
                className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <FileText className="h-4 w-4 shrink-0 text-neutral-400" />
                  <span className="truncate text-sm font-medium text-neutral-800">
                    {collab.title || collab.description || 'Untitled'}
                  </span>
                  <ExternalLink className="h-3 w-3 shrink-0 text-neutral-300" />
                </div>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColor}`}>
                  {typeLabel}
                </span>
                <span className="hidden text-xs text-neutral-400 sm:inline">
                  {collab.user_name}
                </span>
                <span className="hidden text-xs text-neutral-400 md:inline">
                  {new Date(collab.updated_at).toLocaleDateString()}
                </span>
              </a>
            )
          })}
        </div>
      )}
    </div>
  )
}
