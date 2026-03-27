import { useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { getAssignment, submitAssignment } from '@/services/modules/assignments'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Send, X, Upload, Type, Link, Film, Calendar } from 'lucide-react'
import type { SubmissionType } from '@/types/canvas'

const TAB_CONFIG: Record<
  string,
  { label: string; icon: React.ReactNode; type: SubmissionType }
> = {
  online_text_entry: {
    label: 'Text Entry',
    icon: <Type className="h-4 w-4" />,
    type: 'online_text_entry',
  },
  online_upload: {
    label: 'File Upload',
    icon: <Upload className="h-4 w-4" />,
    type: 'online_upload',
  },
  online_url: {
    label: 'Website URL',
    icon: <Link className="h-4 w-4" />,
    type: 'online_url',
  },
  media_recording: {
    label: 'Media',
    icon: <Film className="h-4 w-4" />,
    type: 'media_recording',
  },
}

function formatDateTime(isoString: string | null): string {
  if (!isoString) return 'No due date'
  return new Date(isoString).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export function SubmitAssignmentPage() {
  const { courseId, assignmentId } = useParams<{
    courseId: string
    assignmentId: string
  }>()
  const navigate = useNavigate()

  const { data: assignment, isLoading } = useQuery({
    queryKey: ['assignment', courseId, assignmentId],
    queryFn: async () => {
      const response = await getAssignment(courseId!, assignmentId!)
      return response.data
    },
  })

  const availableTypes = assignment?.submission_types?.filter(
    (t) => t in TAB_CONFIG,
  ) ?? []

  const [activeTab, setActiveTab] = useState<SubmissionType | null>(null)
  const [textBody, setTextBody] = useState('')
  const [submissionUrl, setSubmissionUrl] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  // Set first available tab once loaded
  if (!activeTab && availableTypes.length > 0) {
    setActiveTab(availableTypes[0])
  }

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback(() => {
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) setSelectedFile(file)
  }, [])

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, string | number> = {
        submission_type: activeTab!,
      }
      if (activeTab === 'online_text_entry') {
        payload.body = textBody
      } else if (activeTab === 'online_url') {
        payload.url = submissionUrl
      }
      // Note: file upload would require multipart form in a real implementation
      return submitAssignment(courseId!, assignmentId!, payload)
    },
    onSuccess: () => {
      navigate(`/courses/${courseId}/assignments/${assignmentId}`)
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton type="text" count={2} />
        <LoadingSkeleton type="row" count={4} />
      </div>
    )
  }

  if (!assignment) {
    return (
      <div className="py-16 text-center">
        <p className="text-neutral-500">Assignment not found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          {assignment.name}
        </h3>
        <div className="mt-2 flex items-center gap-4 text-sm text-neutral-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            Due: {formatDateTime(assignment.due_at)}
          </span>
          <span>{assignment.points_possible ?? 0} points</span>
        </div>
      </div>

      {/* Submission Tabs */}
      {availableTypes.length > 1 && (
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {availableTypes.map((t) => {
            const config = TAB_CONFIG[t]
            if (!config) return null
            return (
              <button
                key={t}
                type="button"
                onClick={() => setActiveTab(t)}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === t
                    ? 'bg-white text-primary-700 shadow-sm'
                    : 'text-neutral-600 hover:text-neutral-800'
                }`}
              >
                {config.icon}
                {config.label}
              </button>
            )
          })}
        </div>
      )}

      {/* Submission Content */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        {activeTab === 'online_text_entry' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Text Entry
            </label>
            <textarea
              value={textBody}
              onChange={(e) => setTextBody(e.target.value)}
              placeholder="Write your submission here..."
              rows={12}
              className="w-full rounded-lg border border-neutral-200 p-3 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}

        {activeTab === 'online_upload' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              File Upload
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors ${
                dragOver
                  ? 'border-primary-400 bg-primary-50'
                  : 'border-neutral-300 bg-neutral-50'
              }`}
            >
              <Upload className="mb-3 h-10 w-10 text-neutral-400" />
              {selectedFile ? (
                <p className="text-sm font-medium text-neutral-700">
                  {selectedFile.name}
                </p>
              ) : (
                <p className="text-sm text-neutral-500">
                  Drag and drop a file here, or click to browse
                </p>
              )}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) setSelectedFile(file)
                }}
                className="mt-3"
              />
            </div>
          </div>
        )}

        {activeTab === 'online_url' && (
          <div>
            <label className="mb-2 block text-sm font-medium text-neutral-700">
              Website URL
            </label>
            <input
              type="url"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              placeholder="https://..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            />
          </div>
        )}

        {activeTab === 'media_recording' && (
          <div className="py-12 text-center">
            <Film className="mx-auto mb-3 h-10 w-10 text-neutral-400" />
            <p className="text-sm text-neutral-500">
              Media recording is not yet supported in this interface.
            </p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end gap-3">
        {submitMutation.isError && (
          <p className="mr-auto text-sm text-red-600">
            Submission failed. Please try again.
          </p>
        )}
        <button
          type="button"
          onClick={() =>
            navigate(`/courses/${courseId}/assignments/${assignmentId}`)
          }
          className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
        >
          <X className="h-4 w-4" />
          Cancel
        </button>
        <button
          type="button"
          onClick={() => submitMutation.mutate()}
          disabled={submitMutation.isPending || !activeTab}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {submitMutation.isPending ? 'Submitting...' : 'Submit Assignment'}
        </button>
      </div>
    </div>
  )
}
