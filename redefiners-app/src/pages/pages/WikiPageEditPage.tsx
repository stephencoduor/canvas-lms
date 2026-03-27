import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getPage, createPage, updatePage } from '@/services/modules/pages'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { RichTextEditor } from '@/components/shared/RichTextEditor'
import { Save, X } from 'lucide-react'

interface PageFormData {
  title: string
  body: string
  published: boolean
  front_page: boolean
  editing_roles: string
}

const EDITING_ROLE_OPTIONS = [
  { value: 'teachers', label: 'Teachers Only' },
  { value: 'teachers,students', label: 'Teachers and Students' },
  { value: 'teachers,students,public', label: 'Everyone' },
]

export function WikiPageEditPage() {
  const { courseId, pageUrl } = useParams<{
    courseId: string
    pageUrl: string
  }>()
  const navigate = useNavigate()
  const isEdit = !!pageUrl

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['page', courseId, pageUrl],
    queryFn: async () => {
      const response = await getPage(courseId!, pageUrl!)
      return response.data
    },
    enabled: isEdit,
  })

  const [form, setForm] = useState<PageFormData>({
    title: '',
    body: '',
    published: true,
    front_page: false,
    editing_roles: 'teachers',
  })

  useEffect(() => {
    if (page) {
      setForm({
        title: page.title,
        body: page.body ?? '',
        published: page.published,
        front_page: page.front_page,
        editing_roles: page.editing_roles || 'teachers',
      })
    }
  }, [page])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string | boolean> = {
        title: form.title,
        body: form.body,
        published: form.published,
        front_page: form.front_page,
        editing_roles: form.editing_roles,
      }
      if (isEdit) {
        return updatePage(courseId!, pageUrl!, payload)
      }
      return createPage(courseId!, payload)
    },
    onSuccess: (response) => {
      const url = isEdit ? pageUrl : response.data.url
      navigate(`/courses/${courseId}/pages/${url}`)
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

  if (isEdit && pageLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={1} />
        <LoadingSkeleton type="row" count={6} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">
        {isEdit ? 'Edit Page' : 'New Page'}
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
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          />
        </div>

        {/* Body */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Body
          </label>
          <RichTextEditor
            value={form.body}
            onChange={(content) =>
              setForm((prev) => ({ ...prev, body: content }))
            }
            height={400}
          />
        </div>

        {/* Options */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="grid gap-5 md:grid-cols-2">
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

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="front_page"
                name="front_page"
                checked={form.front_page}
                onChange={handleChange}
                className="h-4 w-4 rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
              />
              <label
                htmlFor="front_page"
                className="text-sm font-medium text-neutral-700"
              >
                Set as Front Page
              </label>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Editing Roles
              </label>
              <select
                name="editing_roles"
                value={form.editing_roles}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              >
                {EDITING_ROLE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
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
                  ? `/courses/${courseId}/pages/${pageUrl}`
                  : `/courses/${courseId}/pages`,
              )
            }
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
            {saveMutation.isPending ? 'Saving...' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
