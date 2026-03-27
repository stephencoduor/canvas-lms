import { safeHtml } from '../../lib/sanitize';
import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  getQuiz,
  startQuizSubmission,
  getQuizQuestions,
  completeQuizSubmission,
} from '@/services/modules/quizzes'
import type { QuizQuestion, QuizSubmission } from '@/services/modules/quizzes'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Send,
  CheckCircle2,
  Circle,
} from 'lucide-react'

function formatTimeRemaining(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function QuestionRenderer({
  question,
  answer,
  onAnswer,
}: {
  question: QuizQuestion
  answer: unknown
  onAnswer: (questionId: number, value: unknown) => void
}) {
  const { question_type, question_text, answers, matches } = question

  return (
    <div className="space-y-4">
      <div
        className="prose prose-sm max-w-none text-neutral-700"
        dangerouslySetInnerHTML={safeHtml(question_text)}
      />

      {(question_type === 'multiple_choice_question' ||
        question_type === 'true_false_question') && (
        <div className="space-y-2">
          {answers.map((a) => (
            <label
              key={a.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                answer === a.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <input
                type="radio"
                name={`q_${question.id}`}
                checked={answer === a.id}
                onChange={() => onAnswer(question.id, a.id)}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500"
              />
              <span
                className="text-sm text-neutral-700"
                dangerouslySetInnerHTML={safeHtml(a.html || a.text)}
              />
            </label>
          ))}
        </div>
      )}

      {question_type === 'short_answer_question' && (
        <input
          type="text"
          value={(answer as string) ?? ''}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="Type your answer..."
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      )}

      {question_type === 'essay_question' && (
        <textarea
          value={(answer as string) ?? ''}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="Write your answer..."
          rows={8}
          className="w-full rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      )}

      {question_type === 'fill_in_multiple_blanks_question' && (
        <input
          type="text"
          value={(answer as string) ?? ''}
          onChange={(e) => onAnswer(question.id, e.target.value)}
          placeholder="Fill in the blank..."
          className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      )}

      {question_type === 'matching_question' && matches && (
        <div className="space-y-3">
          {answers.map((a) => (
            <div key={a.id} className="flex items-center gap-3">
              <span className="w-1/3 text-sm text-neutral-700">
                {a.left ?? a.text}
              </span>
              <select
                value={
                  (answer as Record<number, number> | undefined)?.[a.id] ?? ''
                }
                onChange={(e) =>
                  onAnswer(question.id, {
                    ...((answer as Record<number, number>) ?? {}),
                    [a.id]: Number(e.target.value),
                  })
                }
                className="flex-1 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select a match...</option>
                {matches.map((m) => (
                  <option key={m.match_id} value={m.match_id}>
                    {m.text}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export function QuizTakePage() {
  const { courseId, quizId } = useParams<{
    courseId: string
    quizId: string
  }>()
  const navigate = useNavigate()

  const [submission, setSubmission] = useState<QuizSubmission | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<number, unknown>>({})
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const { data: quiz, isLoading: quizLoading } = useQuery({
    queryKey: ['quiz', courseId, quizId],
    queryFn: async () => {
      const response = await getQuiz(courseId!, quizId!)
      return response.data
    },
  })

  const startMutation = useMutation({
    mutationFn: async () => {
      const response = await startQuizSubmission(courseId!, quizId!)
      return response.data.quiz_submissions[0]
    },
    onSuccess: async (sub) => {
      setSubmission(sub)
      const qResponse = await getQuizQuestions(courseId!, quizId!, sub.id)
      setQuestions(qResponse.data)
      if (quiz?.time_limit) {
        setTimeRemaining(quiz.time_limit * 60)
      }
    },
  })

  const completeMutation = useMutation({
    mutationFn: async () => {
      if (!submission) throw new Error('No active submission')
      const quizQuestions = Object.entries(answers).map(([id, answer]) => ({
        id: Number(id),
        answer,
      }))
      return completeQuizSubmission(courseId!, quizId!, submission.id, {
        attempt: submission.attempt,
        validation_token: submission.validation_token,
        quiz_questions: quizQuestions,
      })
    },
    onSuccess: () => {
      navigate(`/courses/${courseId}/quizzes/${quizId}/results`)
    },
  })

  // Timer
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          completeMutation.mutate()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [timeRemaining !== null]) // eslint-disable-line react-hooks/exhaustive-deps

  // Start quiz automatically
  useEffect(() => {
    if (quiz && !submission && !startMutation.isPending) {
      startMutation.mutate()
    }
  }, [quiz]) // eslint-disable-line react-hooks/exhaustive-deps

  const handleAnswer = (questionId: number, value: unknown) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }))
  }

  if (quizLoading || startMutation.isPending) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={1} />
        <LoadingSkeleton type="row" count={6} />
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

  if (questions.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Loading questions...</p>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(answers).length

  return (
    <div className="space-y-6">
      {/* Timer Bar */}
      {timeRemaining !== null && (
        <div
          className={`flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium ${
            timeRemaining < 60
              ? 'bg-red-100 text-red-700'
              : timeRemaining < 300
                ? 'bg-amber-100 text-amber-700'
                : 'bg-primary-100 text-primary-700'
          }`}
        >
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Time Remaining
          </span>
          <span className="font-mono text-lg">
            {formatTimeRemaining(timeRemaining)}
          </span>
        </div>
      )}

      <div className="flex gap-6">
        {/* Question Navigation Sidebar */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <h4 className="mb-3 text-sm font-semibold text-neutral-700">
            Questions
          </h4>
          <div className="grid grid-cols-4 gap-2">
            {questions.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(i)}
                className={`flex h-9 w-9 items-center justify-center rounded text-xs font-medium transition-colors ${
                  i === currentIndex
                    ? 'bg-primary-600 text-white'
                    : answers[q.id] !== undefined
                      ? 'bg-green-100 text-green-700'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="mt-4 space-y-1 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3 w-3 text-green-500" />
              {answeredCount} answered
            </div>
            <div className="flex items-center gap-2">
              <Circle className="h-3 w-3 text-neutral-400" />
              {questions.length - answeredCount} unanswered
            </div>
          </div>
        </aside>

        {/* Current Question */}
        <div className="flex-1">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <h4 className="text-sm font-semibold text-neutral-700">
                Question {currentIndex + 1} of {questions.length}
              </h4>
              <span className="text-xs text-neutral-500">
                {currentQuestion.points_possible} pts
              </span>
            </div>
            <QuestionRenderer
              question={currentQuestion}
              answer={answers[currentQuestion.id]}
              onAnswer={handleAnswer}
            />
          </div>

          {/* Navigation */}
          <div className="mt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentIndex === 0}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>

            {currentIndex === questions.length - 1 ? (
              <button
                type="button"
                onClick={() => setShowConfirmDialog(true)}
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Send className="h-4 w-4" />
                Submit Quiz
              </button>
            ) : (
              <button
                type="button"
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(questions.length - 1, prev + 1),
                  )
                }
                className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h4 className="text-lg font-semibold text-neutral-800">
              Submit Quiz?
            </h4>
            <p className="mt-2 text-sm text-neutral-600">
              You have answered {answeredCount} of {questions.length} questions.
              {answeredCount < questions.length && (
                <span className="mt-1 block font-medium text-amber-600">
                  {questions.length - answeredCount} questions are unanswered.
                </span>
              )}
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
              >
                Go Back
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowConfirmDialog(false)
                  completeMutation.mutate()
                }}
                disabled={completeMutation.isPending}
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:opacity-50"
              >
                {completeMutation.isPending ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
