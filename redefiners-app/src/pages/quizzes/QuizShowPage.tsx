import { safeHtml } from '../../lib/sanitize';
import { useParams, Link } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getQuiz, getQuizSubmissions } from '@/services/modules/quizzes'
import type { QuizSubmission } from '@/services/modules/quizzes'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import {
  Clock,
  Award,
  Calendar,
  BarChart3,
  Play,
  RefreshCw,
} from 'lucide-react'

function formatDateTime(isoString: string | null): string {
  if (!isoString) return 'No date set'
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function QuizShowPage() {
  const { courseId, quizId } = useParams<{
    courseId: string
    quizId: string
  }>()

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', courseId, quizId],
    queryFn: async () => {
      const response = await getQuiz(courseId!, quizId!)
      return response.data
    },
  })

  const { data: submissions } = useQuery({
    queryKey: ['quizSubmissions', courseId, quizId],
    queryFn: async () => {
      const response = await getQuizSubmissions(courseId!, quizId!)
      return response.data.quiz_submissions
    },
  })

  if (quizLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={2} />
        <LoadingSkeleton type="row" count={4} />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Quiz not found.</p>
      </div>
    )
  }

  const completedSubmissions =
    submissions?.filter(
      (s: QuizSubmission) => s.workflow_state === 'complete',
    ) ?? []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-primary-800">{quiz.title}</h3>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-neutral-500">
          {quiz.time_limit && (
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {quiz.time_limit} minutes
            </span>
          )}
          <span className="flex items-center gap-1">
            <Award className="h-4 w-4" />
            {quiz.points_possible} points
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Due: {formatDateTime(quiz.due_at)}
          </span>
        </div>
      </div>

      {/* Description */}
      {quiz.description && (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <div
            className="prose prose-sm max-w-none text-neutral-600"
            dangerouslySetInnerHTML={safeHtml(quiz.description)}
          />
        </section>
      )}

      {/* Settings Summary */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-700">
          Quiz Details
        </h4>
        <div className="grid gap-4 text-sm md:grid-cols-2">
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">Quiz Type</span>
            <span className="font-medium text-neutral-700">
              {quiz.quiz_type.replace(/_/g, ' ')}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">Questions</span>
            <span className="font-medium text-neutral-700">
              {quiz.question_count}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">Allowed Attempts</span>
            <span className="font-medium text-neutral-700">
              {quiz.allowed_attempts === -1
                ? 'Unlimited'
                : quiz.allowed_attempts}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">Time Limit</span>
            <span className="font-medium text-neutral-700">
              {quiz.time_limit ? `${quiz.time_limit} minutes` : 'None'}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">Show Correct Answers</span>
            <span className="font-medium text-neutral-700">
              {quiz.show_correct_answers ? 'Yes' : 'No'}
            </span>
          </div>
          <div className="flex justify-between border-b border-neutral-100 pb-2">
            <span className="text-neutral-500">Scoring Policy</span>
            <span className="font-medium text-neutral-700">
              {quiz.scoring_policy.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
      </section>

      {/* Previous Attempts */}
      {completedSubmissions.length > 0 && (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-700">
            Previous Attempts
          </h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200">
                  <th className="py-2 text-left font-medium text-neutral-500">
                    Attempt
                  </th>
                  <th className="py-2 text-left font-medium text-neutral-500">
                    Score
                  </th>
                  <th className="py-2 text-left font-medium text-neutral-500">
                    Time Spent
                  </th>
                  <th className="py-2 text-left font-medium text-neutral-500">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                {completedSubmissions.map((sub: QuizSubmission) => (
                  <tr
                    key={sub.id}
                    className="border-b border-neutral-100"
                  >
                    <td className="py-2 text-neutral-700">
                      Attempt {sub.attempt}
                    </td>
                    <td className="py-2 font-medium text-primary-700">
                      {sub.score !== null
                        ? `${sub.score}/${quiz.points_possible}`
                        : 'Pending'}
                    </td>
                    <td className="py-2 text-neutral-600">
                      {sub.time_spent
                        ? `${Math.round(sub.time_spent / 60)} min`
                        : '--'}
                    </td>
                    <td className="py-2 text-neutral-500">
                      {sub.finished_at
                        ? formatDateTime(sub.finished_at)
                        : 'In progress'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3">
        <Link
          to={`/courses/${courseId}/quizzes/${quizId}/take`}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          {completedSubmissions.length > 0 ? (
            <>
              <RefreshCw className="h-4 w-4" />
              Retake Quiz
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Start Quiz
            </>
          )}
        </Link>

        <Link
          to={`/courses/${courseId}/quizzes/${quizId}/statistics`}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <BarChart3 className="h-4 w-4" />
          Statistics
        </Link>
      </div>
    </div>
  )
}
