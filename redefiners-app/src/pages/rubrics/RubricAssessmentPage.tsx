import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Save, X } from 'lucide-react'

interface RubricCriterion {
  id: string
  description: string
  long_description?: string
  points: number
  ratings: Array<{
    id: string
    description: string
    long_description?: string
    points: number
  }>
}

interface Rubric {
  id: number
  title: string
  points_possible: number
  criteria: RubricCriterion[]
}

export function RubricAssessmentPage() {
  const { courseId, rubricId } = useParams<{
    courseId: string
    rubricId: string
  }>()
  const navigate = useNavigate()
  const [selectedRatings, setSelectedRatings] = useState<
    Record<string, string>
  >({})
  const [comments, setComments] = useState<Record<string, string>>({})

  const { data: rubric, isLoading } = useQuery<Rubric>({
    queryKey: ['rubric', courseId, rubricId],
    queryFn: async () => {
      const response = await apiGet<Rubric>(
        `/v1/courses/${courseId}/rubrics/${rubricId}`,
        { include: ['criteria'] },
      )
      return response.data
    },
    enabled: !!courseId && !!rubricId,
  })

  const totalPoints = rubric?.criteria?.reduce((sum, criterion) => {
    const selectedRatingId = selectedRatings[criterion.id]
    const rating = criterion.ratings.find((r) => r.id === selectedRatingId)
    return sum + (rating?.points ?? 0)
  }, 0) ?? 0

  const saveMutation = useMutation({
    mutationFn: async () => {
      const criterionData: Record<string, { rating_id: string; points: number; comments: string }> = {}
      rubric?.criteria?.forEach((criterion) => {
        const ratingId = selectedRatings[criterion.id]
        const rating = criterion.ratings.find((r) => r.id === ratingId)
        if (ratingId) {
          criterionData[criterion.id] = {
            rating_id: ratingId,
            points: rating?.points ?? 0,
            comments: comments[criterion.id] ?? '',
          }
        }
      })
      return apiPost(
        `/v1/courses/${courseId}/rubric_assessments`,
        { rubric_assessment: criterionData },
      )
    },
    onSuccess: () => {
      navigate(`/courses/${courseId}/rubrics`)
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={1} />
        <LoadingSkeleton type="row" count={6} />
      </div>
    )
  }

  if (!rubric) return null

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            {rubric.title}
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Total: {totalPoints} / {rubric.points_possible} points
          </p>
        </div>
      </div>

      {/* Rubric Criteria */}
      <div className="space-y-4">
        {rubric.criteria?.map((criterion) => (
          <div key={criterion.id} className="rounded-lg bg-white shadow-sm">
            <div className="border-b border-neutral-100 px-5 py-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold text-neutral-800">
                  {criterion.description}
                </h4>
                <span className="text-sm text-neutral-500">
                  {criterion.points} pts
                </span>
              </div>
              {criterion.long_description && (
                <p className="mt-1 text-xs text-neutral-500">
                  {criterion.long_description}
                </p>
              )}
            </div>
            <div className="grid gap-2 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {criterion.ratings.map((rating) => {
                const isSelected = selectedRatings[criterion.id] === rating.id
                return (
                  <button
                    key={rating.id}
                    type="button"
                    onClick={() =>
                      setSelectedRatings((prev) => ({
                        ...prev,
                        [criterion.id]: rating.id,
                      }))
                    }
                    className={`rounded-lg border p-3 text-left transition-colors ${
                      isSelected
                        ? 'border-primary-500 bg-primary-50 ring-1 ring-primary-500'
                        : 'border-neutral-200 hover:border-primary-300 hover:bg-neutral-50'
                    }`}
                  >
                    <p className="text-xs font-bold text-neutral-800">
                      {rating.points} pts
                    </p>
                    <p className="mt-1 text-xs font-medium text-neutral-700">
                      {rating.description}
                    </p>
                    {rating.long_description && (
                      <p className="mt-0.5 text-xs text-neutral-500">
                        {rating.long_description}
                      </p>
                    )}
                  </button>
                )
              })}
            </div>
            {/* Comments */}
            <div className="border-t border-neutral-100 px-5 py-3">
              <label className="mb-1 block text-xs font-medium text-neutral-500">
                Comments
              </label>
              <textarea
                value={comments[criterion.id] ?? ''}
                onChange={(e) =>
                  setComments((prev) => ({
                    ...prev,
                    [criterion.id]: e.target.value,
                  }))
                }
                rows={2}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                placeholder="Optional comments..."
              />
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {saveMutation.isError && (
          <p className="mr-auto text-sm text-red-600">
            Failed to save assessment.
          </p>
        )}
        <button
          type="button"
          onClick={() => navigate(`/courses/${courseId}/rubrics`)}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save Assessment'}
        </button>
      </div>
    </div>
  )
}
