import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Copy, CheckSquare, Square, Loader2 } from 'lucide-react'
import type { CanvasCourse } from '@/types/canvas'

const CONTENT_TYPES = [
  { key: 'assignments', label: 'Assignments' },
  { key: 'discussions', label: 'Discussions' },
  { key: 'modules', label: 'Modules' },
  { key: 'pages', label: 'Pages' },
  { key: 'files', label: 'Files' },
  { key: 'quizzes', label: 'Quizzes' },
  { key: 'announcements', label: 'Announcements' },
  { key: 'calendar_events', label: 'Calendar Events' },
  { key: 'syllabus_body', label: 'Syllabus' },
] as const

type ContentKey = (typeof CONTENT_TYPES)[number]['key']

interface CopyProgress {
  id: number
  workflow_state: string
  completion: number
  migration_type: string
}

export function CourseCopyPage() {
  const { courseId } = useParams<{ courseId: string }>()

  const [selected, setSelected] = useState<Set<ContentKey>>(new Set())
  const [progress, setProgress] = useState<CopyProgress | null>(null)

  const { data: course, isLoading } = useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasCourse>(
        `/v1/courses/${courseId}`,
      )
      return response.data
    },
  })

  const copyMutation = useMutation({
    mutationFn: async () => {
      const selectAll = selected.size === CONTENT_TYPES.length
      const body: Record<string, unknown> = {
        migration_type: 'course_copy_importer',
        settings: {
          source_course_id: courseId,
        },
      }

      if (!selectAll) {
        const copy: Record<string, boolean> = {}
        for (const key of selected) {
          copy[key] = true
        }
        body.select = copy
      }

      const response = await apiPost<CopyProgress>(
        `/v1/courses/${courseId}/content_migrations`,
        body,
      )
      return response.data
    },
    onSuccess: (data) => {
      setProgress(data)
      pollProgress(data.id)
    },
  })

  const pollProgress = async (migrationId: number) => {
    const poll = async () => {
      try {
        const response = await apiGet<CopyProgress>(
          `/v1/courses/${courseId}/content_migrations/${migrationId}`,
        )
        const migration = response.data
        setProgress(migration)
        if (
          migration.workflow_state !== 'completed' &&
          migration.workflow_state !== 'failed'
        ) {
          setTimeout(poll, 2000)
        }
      } catch {
        // Polling failed, stop silently
      }
    }
    setTimeout(poll, 2000)
  }

  const toggleItem = (key: ContentKey) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const selectAll = () => {
    setSelected(new Set(CONTENT_TYPES.map((t) => t.key)))
  }

  const deselectAll = () => {
    setSelected(new Set())
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={1} />
        <LoadingSkeleton type="row" count={4} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">Copy Course</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Select content to copy from this course
        </p>
      </div>

      {/* Source Course Info */}
      <div className="rounded-lg bg-white p-5 shadow-sm">
        <h4 className="text-sm font-medium text-neutral-500">Source Course</h4>
        <p className="mt-1 text-lg font-semibold text-neutral-800">
          {course?.name ?? 'Unknown Course'}
        </p>
        <p className="text-sm text-neutral-500">
          {course?.course_code}
        </p>
      </div>

      {/* Content Selection */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h4 className="text-lg font-semibold text-neutral-700">
            Select Content
          </h4>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={selectAll}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Select All
            </button>
            <span className="text-neutral-300">|</span>
            <button
              type="button"
              onClick={deselectAll}
              className="text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Deselect All
            </button>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {CONTENT_TYPES.map((ct) => (
            <button
              key={ct.key}
              type="button"
              onClick={() => toggleItem(ct.key)}
              disabled={!!progress}
              className={`flex items-center gap-3 rounded-lg border p-3 text-left text-sm transition-colors ${
                selected.has(ct.key)
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              } disabled:cursor-not-allowed disabled:opacity-50`}
            >
              {selected.has(ct.key) ? (
                <CheckSquare className="h-5 w-5 text-primary-500" />
              ) : (
                <Square className="h-5 w-5 text-neutral-400" />
              )}
              {ct.label}
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {progress && (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-semibold text-neutral-700">
            Copy Progress
          </h4>
          <div className="mb-2 h-3 overflow-hidden rounded-full bg-neutral-100">
            <div
              className={`h-full transition-all duration-500 ${
                progress.workflow_state === 'failed'
                  ? 'bg-red-500'
                  : progress.workflow_state === 'completed'
                    ? 'bg-green-500'
                    : 'bg-primary-500'
              }`}
              style={{ width: `${progress.completion ?? 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-600">
              {progress.workflow_state === 'completed'
                ? 'Copy completed successfully!'
                : progress.workflow_state === 'failed'
                  ? 'Copy failed. Please try again.'
                  : `Copying... ${progress.completion ?? 0}%`}
            </span>
            {progress.workflow_state !== 'completed' &&
              progress.workflow_state !== 'failed' && (
                <Loader2 className="h-4 w-4 animate-spin text-primary-500" />
              )}
          </div>
        </div>
      )}

      {/* Start Copy */}
      {!progress && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => copyMutation.mutate()}
            disabled={selected.size === 0 || copyMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {copyMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
            {copyMutation.isPending ? 'Starting...' : 'Start Copy'}
          </button>
        </div>
      )}
    </div>
  )
}
