import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Zap,
  ChevronLeft,
  ChevronRight,
  Send,
  MessageSquare,
} from 'lucide-react'
import type { CanvasUser, CanvasAssignment } from '@/types/canvas'

export function SpeedGraderPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [gradeValue, setGradeValue] = useState('')
  const [comment, setComment] = useState('')

  const { data: students, isLoading: studentsLoading } = useQuery<CanvasUser[]>({
    queryKey: ['speedgrader', 'students', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasUser[]>(
        `/v1/courses/${courseId}/users`,
        { enrollment_type: 'student', include: ['avatar_url'] },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: assignments, isLoading: assignmentsLoading } = useQuery<CanvasAssignment[]>({
    queryKey: ['speedgrader', 'assignments', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignment[]>(
        `/v1/courses/${courseId}/assignments`,
        { per_page: 50, order_by: 'position' },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const isLoading = studentsLoading || assignmentsLoading
  const student = students?.[currentIndex]
  const assignment = assignments?.[0]

  function prevStudent() {
    setCurrentIndex((i) => Math.max(0, i - 1))
    setGradeValue('')
    setComment('')
  }

  function nextStudent() {
    if (students) {
      setCurrentIndex((i) => Math.min(students.length - 1, i + 1))
      setGradeValue('')
      setComment('')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Zap className="h-6 w-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-800">
            SpeedGrader
          </h3>
        </div>
        {students && students.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevStudent}
              disabled={currentIndex === 0}
              className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <span className="text-sm text-neutral-600">
              {currentIndex + 1} / {students.length}
            </span>
            <button
              type="button"
              onClick={nextStudent}
              disabled={currentIndex === students.length - 1}
              className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100 disabled:opacity-30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={2} />
      ) : !students || students.length === 0 ? (
        <EmptyState
          icon={Zap}
          heading="No students"
          description="No students enrolled to grade."
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Submission Panel (left) */}
          <div className="lg:col-span-2">
            <div className="rounded-lg bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center gap-3">
                <img
                  src={student?.avatar_url || '/images/default-avatar.png'}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-neutral-800">
                    {student?.name}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {assignment?.name ?? 'Select an assignment'}
                  </p>
                </div>
              </div>

              <div className="min-h-[300px] rounded-lg border border-dashed border-neutral-200 bg-neutral-50 p-8">
                <div className="flex h-full items-center justify-center">
                  <p className="text-sm text-neutral-400">
                    Submission content will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Grading Panel (right) */}
          <div className="space-y-4">
            {/* Grade Input */}
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <h4 className="mb-3 text-sm font-semibold text-neutral-800">
                Grade
              </h4>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={gradeValue}
                  onChange={(e) => setGradeValue(e.target.value)}
                  placeholder="Score"
                  className="w-20 rounded-lg border border-neutral-200 px-3 py-2 text-center text-sm font-medium text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <span className="text-sm text-neutral-500">
                  / {assignment?.points_possible ?? 0}
                </span>
              </div>
              <button
                type="button"
                className="mt-3 w-full rounded-lg bg-primary-600 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Update Grade
              </button>
            </div>

            {/* Rubric Assessment */}
            {assignment?.rubric_settings && (
              <div className="rounded-lg bg-white p-5 shadow-sm">
                <h4 className="mb-3 text-sm font-semibold text-neutral-800">
                  Rubric
                </h4>
                <p className="text-xs text-neutral-400">
                  Rubric assessment available for this assignment.
                </p>
              </div>
            )}

            {/* Comments */}
            <div className="rounded-lg bg-white p-5 shadow-sm">
              <h4 className="mb-3 flex items-center gap-2 text-sm font-semibold text-neutral-800">
                <MessageSquare className="h-4 w-4" />
                Comments
              </h4>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                rows={3}
                className="w-full resize-none rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg border border-neutral-200 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50"
              >
                <Send className="h-3.5 w-3.5" />
                Submit Comment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
