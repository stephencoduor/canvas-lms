import { useParams, Link } from 'react-router'
import { useQuizzes } from '@/hooks/useQuizzes'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { HelpCircle, Clock, Star } from 'lucide-react'

function formatDate(isoString: string | null): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function QuizzesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: quizzes, isLoading } = useQuizzes(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Quizzes</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !quizzes || quizzes.length === 0 ? (
        <EmptyState
          icon={HelpCircle}
          heading="No quizzes"
          description="No quizzes in this course."
        />
      ) : (
        <div className="space-y-2">
          {quizzes.map((quiz) => (
            <Link
              key={quiz.id}
              to={`/courses/${courseId}/quizzes/${quiz.id}`}
              className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 shrink-0 text-purple-500" />
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {quiz.title}
                  </p>
                  <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500">
                    <span className="flex items-center gap-1">
                      <HelpCircle className="h-3 w-3" />
                      {quiz.question_count || 0} questions
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {quiz.points_possible || 0} pts
                    </span>
                    {quiz.time_limit && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.time_limit} min
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    quiz.published
                      ? 'bg-green-50 text-green-700'
                      : 'bg-neutral-100 text-neutral-500'
                  }`}
                >
                  {quiz.published ? 'Published' : 'Draft'}
                </span>
                {quiz.due_at && (
                  <span className="text-xs text-neutral-400">
                    Due {formatDate(quiz.due_at)}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
