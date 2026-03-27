import { useState, useRef } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Upload, FileUp, X, Database } from 'lucide-react'

interface SisImport {
  id: number
  created_at: string
  workflow_state: 'created' | 'importing' | 'imported' | 'failed' | 'imported_with_messages'
  progress: number
  data?: {
    import_type: string
    supplied_batches: string[]
    counts?: Record<string, number>
  }
}

const IMPORT_TYPES = [
  { value: 'users', label: 'Users' },
  { value: 'courses', label: 'Courses' },
  { value: 'enrollments', label: 'Enrollments' },
  { value: 'sections', label: 'Sections' },
]

export function SisImportPage() {
  const fileRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [importType, setImportType] = useState('users')
  const [dragOver, setDragOver] = useState(false)

  const { data: imports, isLoading, refetch } = useQuery<SisImport[]>({
    queryKey: ['sisImports'],
    queryFn: async () => {
      const response = await apiGet<{ sis_imports: SisImport[] }>(
        '/v1/accounts/self/sis_imports',
        { per_page: 20 },
      )
      return (response.data as unknown as { sis_imports: SisImport[] }).sis_imports ?? (response.data as unknown as SisImport[])
    },
  })

  const importMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error('No file selected')
      const text = await file.text()
      return apiPost('/v1/accounts/self/sis_imports', {
        import_type: importType,
        attachment: { content: text, filename: file.name },
      })
    },
    onSuccess: () => {
      setFile(null)
      refetch()
    },
  })

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f && f.name.endsWith('.csv')) setFile(f)
  }

  const stateColor = (state: string) => {
    switch (state) {
      case 'imported':
        return 'bg-green-50 text-green-700'
      case 'failed':
        return 'bg-red-50 text-red-700'
      case 'importing':
      case 'created':
        return 'bg-amber-50 text-amber-700'
      default:
        return 'bg-neutral-50 text-neutral-700'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">SIS Import</h3>
        <p className="mt-1 text-sm text-neutral-500">
          Import users, courses, enrollments, and sections via CSV
        </p>
      </div>

      {/* Import Form */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium text-neutral-700">
            Import Type
          </label>
          <select
            value={importType}
            onChange={(e) => setImportType(e.target.value)}
            className="w-full max-w-xs rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          >
            {IMPORT_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver
              ? 'border-primary-400 bg-primary-50'
              : 'border-neutral-200'
          }`}
        >
          {file ? (
            <div className="space-y-2">
              <FileUp className="mx-auto h-8 w-8 text-primary-500" />
              <p className="text-sm font-medium text-neutral-700">{file.name}</p>
              <button
                type="button"
                onClick={() => setFile(null)}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-red-500"
              >
                <X className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Upload className="mx-auto h-8 w-8 text-neutral-400" />
              <p className="text-sm text-neutral-600">
                Drag and drop a CSV file, or{' '}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="font-medium text-primary-600 hover:text-primary-700"
                >
                  browse
                </button>
              </p>
            </div>
          )}
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setFile(f)
            }}
          />
        </div>

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={() => importMutation.mutate()}
            disabled={!file || importMutation.isPending}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Upload className="h-4 w-4" />
            {importMutation.isPending ? 'Importing...' : 'Start Import'}
          </button>
        </div>
        {importMutation.isError && (
          <p className="mt-2 text-sm text-red-600">Import failed. Please try again.</p>
        )}
      </div>

      {/* Import History */}
      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-5 py-3">
          <h4 className="text-sm font-semibold text-neutral-700">
            Import History
          </h4>
        </div>
        {isLoading ? (
          <div className="p-5">
            <LoadingSkeleton type="row" count={5} />
          </div>
        ) : !imports || imports.length === 0 ? (
          <div className="p-5">
            <EmptyState
              icon={Database}
              heading="No imports"
              description="No SIS imports have been run yet."
            />
          </div>
        ) : (
          <div>
            {imports.map((imp) => (
              <div
                key={imp.id}
                className="flex items-center justify-between border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
              >
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    Import #{imp.id}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {new Date(imp.created_at).toLocaleString()}
                    {imp.data?.supplied_batches &&
                      ` - ${imp.data.supplied_batches.join(', ')}`}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {(imp.workflow_state === 'importing' || imp.workflow_state === 'created') && (
                    <div className="w-24">
                      <div className="h-1.5 overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${imp.progress ?? 0}%` }}
                        />
                      </div>
                      <p className="mt-0.5 text-right text-[10px] text-neutral-400">
                        {imp.progress ?? 0}%
                      </p>
                    </div>
                  )}
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${stateColor(imp.workflow_state)}`}
                  >
                    {imp.workflow_state.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
