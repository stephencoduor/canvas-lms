import { useState, useRef } from 'react'
import { useParams } from 'react-router'
import { useMutation, useQuery } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Upload, FileUp, CheckCircle, X } from 'lucide-react'

interface UploadHistory {
  id: number
  created_at: string
  workflow_state: string
  attachment?: { filename: string }
}

interface ParsedRow {
  student: string
  [key: string]: string
}

export function GradebookUploadsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const fileRef = useRef<HTMLInputElement>(null)
  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<ParsedRow[]>([])
  const [headers, setHeaders] = useState<string[]>([])

  const { data: history, isLoading: historyLoading, refetch } = useQuery<UploadHistory[]>({
    queryKey: ['gradebookUploads', courseId],
    queryFn: async () => {
      const response = await apiGet<UploadHistory[]>(
        `/v1/courses/${courseId}/gradebook_upload`,
      )
      return Array.isArray(response.data) ? response.data : []
    },
    enabled: !!courseId,
  })

  const parseCSV = (text: string) => {
    const lines = text.trim().split('\n')
    if (lines.length < 2) return
    const hdrs = lines[0].split(',').map((h) => h.trim())
    setHeaders(hdrs)
    const rows = lines.slice(1, 11).map((line) => {
      const values = line.split(',')
      const row: ParsedRow = { student: '' }
      hdrs.forEach((h, i) => {
        row[h] = values[i]?.trim() ?? ''
      })
      row.student = row[hdrs[0]] ?? ''
      return row
    })
    setPreview(rows)
  }

  const handleFile = (f: File) => {
    setFile(f)
    const reader = new FileReader()
    reader.onload = (e) => {
      const text = e.target?.result as string
      parseCSV(text)
    }
    reader.readAsText(f)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.name.endsWith('.csv')) handleFile(f)
  }

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('No file selected')
      const text = await file.text()
      return apiPost(`/v1/courses/${courseId}/gradebook_upload`, {
        attachment: { content: text, filename: file.name },
      })
    },
    onSuccess: () => {
      setFile(null)
      setPreview([])
      setHeaders([])
      refetch()
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Gradebook Upload
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Upload grades via CSV file
        </p>
      </div>

      {/* Upload Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? 'border-primary-400 bg-primary-50'
            : 'border-neutral-200 bg-white'
        }`}
      >
        {file ? (
          <div className="space-y-2">
            <FileUp className="mx-auto h-10 w-10 text-primary-500" />
            <p className="text-sm font-medium text-neutral-700">{file.name}</p>
            <button
              type="button"
              onClick={() => {
                setFile(null)
                setPreview([])
                setHeaders([])
              }}
              className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-red-500"
            >
              <X className="h-3.5 w-3.5" />
              Remove
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="mx-auto h-10 w-10 text-neutral-400" />
            <p className="text-sm text-neutral-600">
              Drag and drop a CSV file here, or{' '}
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="font-medium text-primary-600 hover:text-primary-700"
              >
                browse
              </button>
            </p>
            <p className="text-xs text-neutral-400">CSV files only</p>
          </div>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) handleFile(f)
          }}
        />
      </div>

      {/* Preview */}
      {preview.length > 0 && (
        <div className="rounded-lg bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-3">
            <h4 className="text-sm font-semibold text-neutral-700">
              Preview ({preview.length} rows)
            </h4>
            <button
              type="button"
              onClick={() => uploadMutation.mutate()}
              disabled={uploadMutation.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCircle className="h-4 w-4" />
              {uploadMutation.isPending ? 'Uploading...' : 'Confirm Upload'}
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-neutral-100">
                  {headers.map((h) => (
                    <th
                      key={h}
                      className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-neutral-50 transition-colors hover:bg-neutral-50"
                  >
                    {headers.map((h) => (
                      <td key={h} className="px-4 py-2 text-sm text-neutral-700">
                        {row[h] ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {uploadMutation.isError && (
            <div className="border-t border-neutral-100 px-5 py-3">
              <p className="text-sm text-red-600">Upload failed. Please try again.</p>
            </div>
          )}
        </div>
      )}

      {/* Upload History */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-3">
          <h4 className="text-sm font-semibold text-neutral-700">
            Upload History
          </h4>
        </div>
        {historyLoading ? (
          <div className="p-5">
            <LoadingSkeleton type="row" count={3} />
          </div>
        ) : !history || history.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Upload}
              heading="No uploads"
              description="No gradebook uploads have been made yet."
            />
          </div>
        ) : (
          <div>
            {history.map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between border-b border-neutral-50 px-5 py-3"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {entry.attachment?.filename ?? 'Upload'}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    entry.workflow_state === 'completed'
                      ? 'bg-green-50 text-green-700'
                      : entry.workflow_state === 'failed'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  {entry.workflow_state}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
