import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { ChevronLeft, ChevronRight, Check } from 'lucide-react'

const STEPS = ['Details', 'Schedule', 'Template', 'Confirm']

export function CourseWizardPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({
    name: '',
    course_code: '',
    start_at: '',
    end_at: '',
    enrollment_term_id: '',
    template_id: '',
  })

  const { data: terms } = useQuery({
    queryKey: ['enrollmentTerms'],
    queryFn: async () => {
      const response = await apiGet<{ enrollment_terms: Array<{ id: number; name: string }> }>(
        '/v1/accounts/self/terms',
      )
      return response.data.enrollment_terms ?? response.data
    },
  })

  const { data: courses } = useQuery({
    queryKey: ['templateCourses'],
    queryFn: async () => {
      const response = await apiGet<Array<{ id: number; name: string }>>(
        '/v1/accounts/self/courses',
        { per_page: 50 },
      )
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        course: {
          name: form.name,
          course_code: form.course_code,
        },
      }
      if (form.start_at) (payload.course as Record<string, unknown>).start_at = new Date(form.start_at).toISOString()
      if (form.end_at) (payload.course as Record<string, unknown>).end_at = new Date(form.end_at).toISOString()
      if (form.enrollment_term_id) (payload.course as Record<string, unknown>).enrollment_term_id = Number(form.enrollment_term_id)

      return apiPost('/v1/accounts/self/courses', payload)
    },
    onSuccess: (response) => {
      const course = response.data as { id: number }
      navigate(`/courses/${course.id}`)
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const canProceed = () => {
    if (step === 0) return form.name.trim().length > 0
    return true
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Create New Course</h3>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i < step
                  ? 'bg-primary-600 text-white'
                  : i === step
                    ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                    : 'bg-neutral-100 text-neutral-400'
              }`}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={`hidden text-sm sm:inline ${
                i === step ? 'font-medium text-primary-700' : 'text-neutral-400'
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className={`h-px w-8 ${i < step ? 'bg-primary-400' : 'bg-neutral-200'}`} />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        {step === 0 && (
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Course Name
              </label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Course Code
              </label>
              <input
                name="course_code"
                value={form.course_code}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  Start Date
                </label>
                <input
                  name="start_at"
                  type="datetime-local"
                  value={form.start_at}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">
                  End Date
                </label>
                <input
                  name="end_at"
                  type="datetime-local"
                  value={form.end_at}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Enrollment Term
              </label>
              <select
                name="enrollment_term_id"
                value={form.enrollment_term_id}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="">Select term...</option>
                {(Array.isArray(terms) ? terms : []).map((t: { id: number; name: string }) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Course Template (Optional)
            </label>
            <p className="mb-3 text-xs text-neutral-500">
              Copy content from an existing course
            </p>
            <select
              name="template_id"
              value={form.template_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">No template</option>
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-neutral-700">
              Review Your Course
            </h4>
            <dl className="space-y-2">
              <div className="flex justify-between border-b border-neutral-50 py-2">
                <dt className="text-sm text-neutral-500">Name</dt>
                <dd className="text-sm font-medium text-neutral-800">{form.name}</dd>
              </div>
              <div className="flex justify-between border-b border-neutral-50 py-2">
                <dt className="text-sm text-neutral-500">Code</dt>
                <dd className="text-sm font-medium text-neutral-800">
                  {form.course_code || '(auto)'}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-50 py-2">
                <dt className="text-sm text-neutral-500">Start</dt>
                <dd className="text-sm font-medium text-neutral-800">
                  {form.start_at ? new Date(form.start_at).toLocaleDateString() : 'Not set'}
                </dd>
              </div>
              <div className="flex justify-between border-b border-neutral-50 py-2">
                <dt className="text-sm text-neutral-500">End</dt>
                <dd className="text-sm font-medium text-neutral-800">
                  {form.end_at ? new Date(form.end_at).toLocaleDateString() : 'Not set'}
                </dd>
              </div>
              <div className="flex justify-between py-2">
                <dt className="text-sm text-neutral-500">Template</dt>
                <dd className="text-sm font-medium text-neutral-800">
                  {form.template_id
                    ? courses?.find((c) => String(c.id) === form.template_id)?.name ?? 'Selected'
                    : 'None'}
                </dd>
              </div>
            </dl>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 0}
          className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        {createMutation.isError && (
          <p className="text-sm text-red-600">Failed to create course.</p>
        )}
        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={() => setStep((s) => s + 1)}
            disabled={!canProceed()}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => createMutation.mutate()}
            disabled={createMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Check className="h-4 w-4" />
            {createMutation.isPending ? 'Creating...' : 'Create Course'}
          </button>
        )}
      </div>
    </div>
  )
}
