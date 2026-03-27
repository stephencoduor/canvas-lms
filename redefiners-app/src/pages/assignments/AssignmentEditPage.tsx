import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import {
  getAssignment,
  getAssignmentGroups,
  createAssignment,
  updateAssignment,
} from '@/services/modules/assignments'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { Save, X } from 'lucide-react'
import type { CanvasAssignment, CanvasAssignmentGroup, SubmissionType } from '@/types/canvas'

const SUBMISSION_TYPE_OPTIONS: { value: SubmissionType; label: string }[] = [
  { value: 'online_upload', label: 'File Upload' },
  { value: 'online_text_entry', label: 'Text Entry' },
  { value: 'online_url', label: 'Website URL' },
  { value: 'on_paper', label: 'On Paper' },
  { value: 'none', label: 'No Submission' },
]

interface AssignmentFormData {
  name: string
  description: string
  points_possible: number
  assignment_group_id: string
  submission_types: SubmissionType
  due_at: string
  unlock_at: string
  lock_at: string
}

function toLocalDatetime(iso: string | null | undefined): string {
  if (!iso) return ''
  const d = new Date(iso)
  const offset = d.getTimezoneOffset()
  const local = new Date(d.getTime() - offset * 60000)
  return local.toISOString().slice(0, 16)
}

export function AssignmentEditPage() {
  const { courseId, assignmentId } = useParams<{
    courseId: string
    assignmentId: string
  }>()
  const navigate = useNavigate()
  const isEdit = !!assignmentId

  const { data: assignment, isLoading: assignmentLoading } = useQuery({
    queryKey: ['assignment', courseId, assignmentId],
    queryFn: async () => {
      const response = await getAssignment(courseId!, assignmentId!)
      return response.data
    },
    enabled: isEdit,
  })

  const { data: groups } = useQuery({
    queryKey: ['assignmentGroups', courseId],
    queryFn: async () => {
      const response = await getAssignmentGroups(courseId!)
      return response.data
    },
    enabled: !!courseId,
  })

  const [form, setForm] = useState<AssignmentFormData>({
    name: '',
    description: '',
    points_possible: 0,
    assignment_group_id: '',
    submission_types: 'online_upload',
    due_at: '',
    unlock_at: '',
    lock_at: '',
  })

  useEffect(() => {
    if (assignment) {
      setForm({
        name: assignment.name,
        description: assignment.description ?? '',
        points_possible: assignment.points_possible,
        assignment_group_id: assignment.assignment_group_id
          ? String(assignment.assignment_group_id)
          : '',
        submission_types: assignment.submission_types[0] ?? 'online_upload',
        due_at: toLocalDatetime(assignment.due_at),
        unlock_at: toLocalDatetime(assignment.unlock_at),
        lock_at: toLocalDatetime(assignment.lock_at),
      })
    }
  }, [assignment])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string | number | string[]> = {
        name: form.name,
        description: form.description,
        points_possible: form.points_possible,
        submission_types: [form.submission_types],
      }
      if (form.assignment_group_id) {
        payload.assignment_group_id = Number(form.assignment_group_id)
      }
      if (form.due_at) payload.due_at = new Date(form.due_at).toISOString()
      if (form.unlock_at)
        payload.unlock_at = new Date(form.unlock_at).toISOString()
      if (form.lock_at) payload.lock_at = new Date(form.lock_at).toISOString()

      if (isEdit) {
        return updateAssignment(courseId!, assignmentId!, payload)
      }
      return createAssignment(courseId!, payload)
    },
    onSuccess: (response) => {
      const id = isEdit ? assignmentId : (response.data as CanvasAssignment).id
      navigate(`/courses/${courseId}/assignments/${id}`)
    },
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  if (isEdit && assignmentLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={2} />
        <LoadingSkeleton type="row" count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">
        {isEdit ? 'Edit Assignment' : 'New Assignment'}
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          saveMutation.mutate()
        }}
        className="space-y-5"
      >
        {/* Title */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Title
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Description */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Description
          </label>
          <RichTextEditor
            value={form.description}
            onChange={(content) =>
              setForm((prev) => ({ ...prev, description: content }))
            }
            height={300}
          />
        </div>

        {/* Settings Row */}
        <div className="grid gap-5 rounded-lg bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Points Possible
            </label>
            <input
              name="points_possible"
              type="number"
              min={0}
              value={form.points_possible}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Assignment Group
            </label>
            <select
              name="assignment_group_id"
              value={form.assignment_group_id}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              <option value="">Select group...</option>
              {groups?.map((g: CanvasAssignmentGroup) => (
                <option key={g.id} value={g.id}>
                  {g.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Submission Type
            </label>
            <select
              name="submission_types"
              value={form.submission_types}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            >
              {SUBMISSION_TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Dates */}
        <div className="grid gap-5 rounded-lg bg-white p-6 shadow-sm md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Due Date
            </label>
            <input
              name="due_at"
              type="datetime-local"
              value={form.due_at}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Available From
            </label>
            <input
              name="unlock_at"
              type="datetime-local"
              value={form.unlock_at}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Available Until
            </label>
            <input
              name="lock_at"
              type="datetime-local"
              value={form.lock_at}
              onChange={handleChange}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          {saveMutation.isError && (
            <p className="mr-auto text-sm text-red-600">
              Failed to save. Please try again.
            </p>
          )}
          <button
            type="button"
            onClick={() =>
              navigate(
                isEdit
                  ? `/courses/${courseId}/assignments/${assignmentId}`
                  : `/courses/${courseId}/assignments`,
              )
            }
            className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending || !form.name.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
