import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Users, CheckCircle, Clock, UserPlus } from 'lucide-react'

interface PeerReview {
  id: number
  user_id: number
  user: { id: number; name: string; avatar_url?: string }
  assessor_id: number
  assessor: { id: number; name: string; avatar_url?: string }
  workflow_state: 'assigned' | 'completed'
}

export function PeerReviewsPage() {
  const { courseId, assignmentId } = useParams<{
    courseId: string
    assignmentId: string
  }>()
  const [assigning, setAssigning] = useState(false)

  const { data: reviews, isLoading, refetch } = useQuery<PeerReview[]>({
    queryKey: ['peerReviews', courseId, assignmentId],
    queryFn: async () => {
      const response = await apiGet<PeerReview[]>(
        `/v1/courses/${courseId}/assignments/${assignmentId}/peer_reviews`,
        { include: ['user', 'submission_comments'] },
      )
      return response.data
    },
    enabled: !!courseId && !!assignmentId,
  })

  const handleAssignReviewers = async () => {
    setAssigning(true)
    try {
      await apiPost(
        `/v1/courses/${courseId}/assignments/${assignmentId}/peer_reviews`,
      )
      refetch()
    } finally {
      setAssigning(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Peer Reviews</h3>
          {!isLoading && reviews && (
            <p className="mt-1 text-sm text-neutral-500">
              {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'} assigned
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={handleAssignReviewers}
          disabled={assigning}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UserPlus className="h-4 w-4" />
          {assigning ? 'Assigning...' : 'Assign Reviewers'}
        </button>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : !reviews || reviews.length === 0 ? (
        <EmptyState
          icon={Users}
          heading="No peer reviews"
          description="No peer reviews have been assigned for this assignment yet."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_1fr_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Reviewer</span>
            <span>Reviewee</span>
            <span>Status</span>
          </div>
          {reviews.map((review) => (
            <div
              key={review.id}
              className="grid grid-cols-[1fr_1fr_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={review.assessor?.avatar_url || '/images/default-avatar.png'}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-neutral-800">
                  {review.assessor?.name ?? 'Unknown'}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={review.user?.avatar_url || '/images/default-avatar.png'}
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full object-cover"
                />
                <span className="text-sm font-medium text-neutral-800">
                  {review.user?.name ?? 'Unknown'}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                  review.workflow_state === 'completed'
                    ? 'bg-green-50 text-green-700'
                    : 'bg-amber-50 text-amber-700'
                }`}
              >
                {review.workflow_state === 'completed' ? (
                  <CheckCircle className="h-3.5 w-3.5" />
                ) : (
                  <Clock className="h-3.5 w-3.5" />
                )}
                {review.workflow_state === 'completed' ? 'Completed' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
