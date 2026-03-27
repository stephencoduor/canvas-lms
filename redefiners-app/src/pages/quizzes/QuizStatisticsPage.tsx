import { safeHtml } from '../../lib/sanitize';
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getQuiz, getQuizStatistics } from '@/services/modules/quizzes'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { BarChart3, Users, TrendingUp, TrendingDown } from 'lucide-react'

export function QuizStatisticsPage() {
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

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['quizStatistics', courseId, quizId],
    queryFn: async () => {
      const response = await getQuizStatistics(courseId!, quizId!)
      return response.data.quiz_statistics[0]
    },
  })

  const isLoading = quizLoading || statsLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={2} />
        <LoadingSkeleton type="row" count={6} />
      </div>
    )
  }

  if (!quiz || !stats) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">
          Statistics are not available for this quiz.
        </p>
      </div>
    )
  }

  const subStats = stats.submission_statistics

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          {quiz.title} - Statistics
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Quiz performance overview
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <TrendingUp className="h-4 w-4" />
            Average Score
          </div>
          <p className="mt-2 text-2xl font-bold text-primary-700">
            {subStats.score_average.toFixed(1)}
          </p>
          <p className="text-xs text-neutral-400">
            out of {quiz.points_possible}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <TrendingUp className="h-4 w-4 text-green-500" />
            High Score
          </div>
          <p className="mt-2 text-2xl font-bold text-green-700">
            {subStats.score_high.toFixed(1)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <TrendingDown className="h-4 w-4 text-red-500" />
            Low Score
          </div>
          <p className="mt-2 text-2xl font-bold text-red-700">
            {subStats.score_low.toFixed(1)}
          </p>
        </div>

        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm text-neutral-500">
            <Users className="h-4 w-4" />
            Submissions
          </div>
          <p className="mt-2 text-2xl font-bold text-neutral-700">
            {subStats.unique_count}
          </p>
          <p className="text-xs text-neutral-400">
            Std Dev: {subStats.score_stdev.toFixed(2)}
          </p>
        </div>
      </div>

      {/* Per-Question Breakdown */}
      <section className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700">
          <BarChart3 className="h-5 w-5 text-primary-500" />
          Question Breakdown
        </h4>
        <div className="space-y-4">
          {stats.question_statistics.map((q, index) => {
            const total = q.correct + q.partially_correct + q.incorrect
            const correctPct = total > 0 ? (q.correct / total) * 100 : 0

            return (
              <div
                key={q.id}
                className="border-b border-neutral-100 pb-4 last:border-0"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-700">
                      Question {index + 1}
                    </p>
                    <div
                      className="mt-1 text-xs text-neutral-500"
                      dangerouslySetInnerHTML={safeHtml(q.question_text.slice(0, 200))}
                    />
                  </div>
                  <span
                    className={`ml-4 rounded-full px-3 py-1 text-xs font-medium ${
                      correctPct >= 70
                        ? 'bg-green-100 text-green-700'
                        : correctPct >= 40
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {correctPct.toFixed(0)}% correct
                  </span>
                </div>
                {/* Bar chart */}
                <div className="mt-2 flex h-2 overflow-hidden rounded-full bg-neutral-100">
                  {q.correct > 0 && (
                    <div
                      className="bg-green-500"
                      style={{
                        width: `${(q.correct / total) * 100}%`,
                      }}
                    />
                  )}
                  {q.partially_correct > 0 && (
                    <div
                      className="bg-amber-400"
                      style={{
                        width: `${(q.partially_correct / total) * 100}%`,
                      }}
                    />
                  )}
                  {q.incorrect > 0 && (
                    <div
                      className="bg-red-400"
                      style={{
                        width: `${(q.incorrect / total) * 100}%`,
                      }}
                    />
                  )}
                </div>
                <div className="mt-1 flex gap-4 text-xs text-neutral-500">
                  <span>Correct: {q.correct}</span>
                  <span>Partial: {q.partially_correct}</span>
                  <span>Incorrect: {q.incorrect}</span>
                </div>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
