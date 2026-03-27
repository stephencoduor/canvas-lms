import { useState } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { createDiscussion } from '@/services/modules/discussions'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { Save, X } from 'lucide-react'

interface DiscussionFormData {
  title: string
  message: string
  discussion_type: string
  require_initial_post: boolean
  published: boolean
  delayed_post_at: string
}

export function DiscussionEditPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const navigate = useNavigate()

  const [form, setForm] = useState<DiscussionFormData>({
    title: '',
    message: '',
    discussion_type: 'side_comment',
    require_initial_post: false,
    published: true,
    delayed_post_at: '',
  })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string | boolean> = {
        title: form.title,
        message: form.message,
        discussion_type: form.discussion_type,
        require_initial_post: form.require_initial_post,
        published: form.published,
      }
      if (form.delayed_post_at) {
        payload.delayed_post_at = new Date(
          form.delayed_post_at,
        ).toISOString()
      }
      return createDiscussion(courseId!, payload)
    },
    onSuccess: (response) => {
      navigate(`/courses/${courseId}/discussions/${response.data.id}`)
    },
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setForm((prev) => ({ ...prev, [name]: checked }))
    } else {
      setForm((prev) => ({ ...prev, [name]: value }))
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">New Discussion</h3>

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
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Message */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Message
          </label>
          <RichTextEditor
            value={form.message}
            onChange={(content) =>
              setForm((prev) => ({ ...prev, message: content }))
            }
            height={300}
          />
        </div>

        {/* Options */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Discussion Type
              </label>
              <select
                name="discussion_type"
                value={form.discussion_type}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                <option value="side_comment">Focused (side comment)</option>
                <option value="threaded">Threaded</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Delayed Post At
              </label>
              <input
                name="delayed_post_at"
                type="datetime-local"
                value={form.delayed_post_at}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="require_initial_post"
                name="require_initial_post"
                checked={form.require_initial_post}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="require_initial_post"
                className="text-sm font-medium text-neutral-700"
              >
                Require Initial Post
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="published"
                name="published"
                checked={form.published}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="published"
                className="text-sm font-medium text-neutral-700"
              >
                Published
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          {saveMutation.isError && (
            <p className="mr-auto text-sm text-red-600">
              Failed to create discussion. Please try again.
            </p>
          )}
          <button
            type="button"
            onClick={() => navigate(`/courses/${courseId}/discussions`)}
            className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending || !form.title.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Creating...' : 'Create Discussion'}
          </button>
        </div>
      </form>
    </div>
  )
}
