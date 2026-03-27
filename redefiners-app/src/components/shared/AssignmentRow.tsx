import { memo } from 'react'
import { Link } from 'react-router'
import { FileText, Calendar } from 'lucide-react'
import { StatusPill } from '@/components/common/StatusPill'
import type { CanvasAssignment } from '@/types/canvas'

interface AssignmentRowProps {
  assignment: CanvasAssignment
  courseId: string
}

function formatDueDate(isoString: string | null): string {
  if (!isoString) return 'No due date'
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function getSubmissionStatus(
  assignment: CanvasAssignment,
): 'submitted' | 'graded' | 'missing' | 'late' | null {
  const sub = assignment.submission
  if (!sub) return null
  if (sub.excused) return null
  if (sub.grade !== null && sub.score !== null) return 'graded'
  if (sub.late) return 'late'
  if (sub.missing) return 'missing'
  if (sub.submitted_at) return 'submitted'
  return null
}

export const AssignmentRow = memo(function AssignmentRow({ assignment, courseId }: AssignmentRowProps) {
  const status = getSubmissionStatus(assignment)

  return (
    <Link
      to={`/courses/${courseId}/assignments/${assignment.id}`}
      className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-3 transition-colors hover:bg-neutral-50"
    >
      <div className="flex items-center gap-3">
        <FileText className="h-5 w-5 flex-shrink-0 text-primary-400" />
        <div>
          <p className="text-sm font-medium text-neutral-800">
            {assignment.name}
          </p>
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDueDate(assignment.due_at)}
            </span>
            <span>&middot;</span>
            <span>{assignment.points_possible ?? 0} pts</span>
          </div>
        </div>
      </div>

      {status && <StatusPill status={status} />}
    </Link>
  )
})
