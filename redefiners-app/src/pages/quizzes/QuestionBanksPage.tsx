import { safeHtml } from '../../lib/sanitize';
import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Database, Plus, ChevronDown, ChevronRight } from 'lucide-react'

interface QuestionBank {
  id: number
  title: string
  context_type: string
  assessment_question_count: number
}

interface BankQuestion {
  id: number
  question_name: string
  question_type: string
  question_text: string
}

export function QuestionBanksPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [expandedBank, setExpandedBank] = useState<number | null>(null)
  const [newBankTitle, setNewBankTitle] = useState('')
  const [showCreateForm, setShowCreateForm] = useState(false)

  const { data: banks, isLoading, refetch } = useQuery<QuestionBank[]>({
    queryKey: ['questionBanks', courseId],
    queryFn: async () => {
      const response = await apiGet<QuestionBank[]>(
        `/v1/courses/${courseId}/question_banks`,
        { per_page: 50 },
      )
      return response.data
    },
    enabled: !!courseId,
  })

  const { data: questions, isLoading: questionsLoading } = useQuery<BankQuestion[]>({
    queryKey: ['bankQuestions', courseId, expandedBank],
    queryFn: async () => {
      const response = await apiGet<BankQuestion[]>(
        `/v1/courses/${courseId}/question_banks/${expandedBank}/questions`,
        { per_page: 50 },
      )
      return response.data
    },
    enabled: !!courseId && !!expandedBank,
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      return apiPost(`/v1/courses/${courseId}/question_banks`, {
        assessment_question_bank: { title: newBankTitle },
      })
    },
    onSuccess: () => {
      setNewBankTitle('')
      setShowCreateForm(false)
      refetch()
    },
  })

  const questionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      multiple_choice_question: 'Multiple Choice',
      true_false_question: 'True/False',
      short_answer_question: 'Short Answer',
      essay_question: 'Essay',
      fill_in_multiple_blanks_question: 'Fill in Blanks',
      matching_question: 'Matching',
      numerical_question: 'Numerical',
      multiple_answers_question: 'Multiple Answers',
    }
    return labels[type] ?? type.replace(/_/g, ' ')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            Question Banks
          </h3>
          {!isLoading && banks && (
            <p className="mt-1 text-sm text-neutral-500">
              {banks.length} {banks.length === 1 ? 'bank' : 'banks'}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Create Bank
        </button>
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Bank Title
              </label>
              <input
                value={newBankTitle}
                onChange={(e) => setNewBankTitle(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="button"
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !newBankTitle.trim()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
          {createMutation.isError && (
            <p className="mt-2 text-sm text-red-600">Failed to create bank.</p>
          )}
        </div>
      )}

      {/* Banks List */}
      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !banks || banks.length === 0 ? (
        <EmptyState
          icon={Database}
          heading="No question banks"
          description="Create a question bank to organize your quiz questions."
        />
      ) : (
        <div className="space-y-2">
          {banks.map((bank) => (
            <div key={bank.id} className="rounded-lg bg-white shadow-sm">
              <button
                type="button"
                onClick={() =>
                  setExpandedBank(expandedBank === bank.id ? null : bank.id)
                }
                className="flex w-full items-center justify-between px-5 py-4 text-left transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  {expandedBank === bank.id ? (
                    <ChevronDown className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-neutral-400" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {bank.title}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {bank.assessment_question_count ?? 0} questions
                    </p>
                  </div>
                </div>
              </button>

              {expandedBank === bank.id && (
                <div className="border-t border-neutral-100 px-5 py-3">
                  {questionsLoading ? (
                    <LoadingSkeleton type="row" count={3} />
                  ) : !questions || questions.length === 0 ? (
                    <p className="py-2 text-sm text-neutral-500">
                      No questions in this bank.
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {questions.map((q) => (
                        <div
                          key={q.id}
                          className="flex items-start gap-3 rounded-lg border border-neutral-100 p-3"
                        >
                          <span className="shrink-0 rounded bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                            {questionTypeLabel(q.question_type)}
                          </span>
                          <p
                            className="text-sm text-neutral-700"
                            dangerouslySetInnerHTML={safeHtml(
                                q.question_text?.slice(0, 200) ??
                                q.question_name
                            )}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
