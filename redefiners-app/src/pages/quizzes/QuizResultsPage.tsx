import { safeHtml } from '../../lib/sanitize';
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import {
  getQuiz,
  getQuizSubmissions,
  getQuizQuestions,
} from '@/services/modules/quizzes'
import type { QuizSubmission, QuizQuestion } from '@/services/modules/quizzes'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Award, CheckCircle2, XCircle } from 'lucide-react'

export function QuizResultsPage() {
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

  const { data: submission, isLoading: subLoading } = useQuery({
    queryKey: ['quizSubmissionLatest', courseId, quizId],
    queryFn: async () => {
      const response = await getQuizSubmissions(courseId!, quizId!)
      const subs = response.data.quiz_submissions
      const completed = subs.filter(
        (s: QuizSubmission) => s.workflow_state === 'complete',
      )
      return completed.length > 0
        ? completed[completed.length - 1]
        : null
    },
  })

  const { data: questions, isLoading: questionsLoading } = useQuery({
    queryKey: ['quizResultQuestions', courseId, quizId, submission?.id],
    queryFn: async () => {
      const response = await getQuizQuestions(
        courseId!,
        quizId!,
        submission!.id,
      )
      return response.data
    },
    enabled: !!submission,
  })

  const isLoading = quizLoading || subLoading || questionsLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={2} />
        <LoadingSkeleton type="row" count={6} />
      </div>
    )
  }

  if (!quiz || !submission) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">
          No completed submission found for this quiz.
        </p>
      </div>
    )
  }

  const score = submission.score ?? 0
  const total = quiz.points_possible
  const pct = total > 0 ? (score / total) * 100 : 0

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="rounded-lg bg-white p-8 text-center shadow-sm">
        <Award
          className={`mx-auto h-12 w-12 ${
            pct >= 70 ? 'text-green-500' : pct >= 50 ? 'text-amber-500' : 'text-red-500'
          }`}
        />
        <h3 className="mt-3 text-2xl font-bold text-primary-800">
          {quiz.title}
        </h3>
        <p className="mt-4 text-4xl font-bold text-neutral-800">
          {score} / {total}
        </p>
        <p
          className={`mt-1 text-lg font-medium ${
            pct >= 70
              ? 'text-green-600'
              : pct >= 50
                ? 'text-amber-600'
                : 'text-red-600'
          }`}
        >
          {pct.toFixed(1)}%
        </p>
        <p className="mt-2 text-sm text-neutral-500">
          Attempt {submission.attempt}
          {submission.time_spent
            ? ` -- ${Math.round(submission.time_spent / 60)} minutes`
            : ''}
        </p>
      </div>

      {/* Per-Question Review */}
      {questions && questions.length > 0 && (
        <section className="space-y-4">
          <h4 className="text-lg font-semibold text-neutral-700">
            Question Review
          </h4>
          {questions.map((q: QuizQuestion, index: number) => {
            // Determine which answer was correct (weight > 0)
            const correctAnswer = q.answers.find((a) => a.weight > 0)

            return (
              <div
                key={q.id}
                className="rounded-lg bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-500">
                      Question {index + 1}
                    </p>
                    <div
                      className="prose prose-sm mt-1 max-w-none text-neutral-700"
                      dangerouslySetInnerHTML={safeHtml(q.question_text)}
                    />
                  </div>
                  <span className="ml-3 text-xs text-neutral-500">
                    {q.points_possible} pts
                  </span>
                </div>

                {/* Answers */}
                <div className="mt-3 space-y-2">
                  {q.answers.map((a) => {
                    const isCorrect = a.weight > 0

                    return (
                      <div
                        key={a.id}
                        className={`flex items-center gap-2 rounded-lg border p-3 text-sm ${
                          isCorrect
                            ? 'border-green-300 bg-green-50'
                            : 'border-neutral-200'
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 shrink-0 text-neutral-300" />
                        )}
                        <span
                          className={
                            isCorrect
                              ? 'font-medium text-green-800'
                              : 'text-neutral-600'
                          }
                          dangerouslySetInnerHTML={{
                            __html: a.html || a.text,
                          }}
                        />
                      </div>
                    )
                  })}
                </div>

                {correctAnswer && (
                  <p className="mt-2 text-xs text-green-600">
                    Correct answer:{' '}
                    <span className="font-medium">
                      {correctAnswer.text}
                    </span>
                  </p>
                )}
              </div>
            )
          })}
        </section>
      )}
    </div>
  )
}
