import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Folder,
  FileText,
  FileImage,
  FileVideo,
  File,
  Download,
  FolderOpen,
  ChevronRight,
} from 'lucide-react'
import type { CanvasFile, CanvasFolder, CanvasQuota } from '@/types/canvas'

function useFiles(courseId: string) {
  return useQuery({
    queryKey: ['files', courseId],
    queryFn: async () => {
      // Get root folder first
      const rootRes = await apiGet<CanvasFolder[]>(
        `/v1/courses/${courseId}/folders/root`,
      )
      const rootFolder =
        Array.isArray(rootRes.data) ? rootRes.data[0] : rootRes.data

      // Load files, subfolders, and quota in parallel
      const [filesRes, foldersRes, quotaRes] = await Promise.all([
        apiGet<CanvasFile[]>(
          `/v1/courses/${courseId}/files`,
          { per_page: 50 },
        ),
        apiGet<CanvasFolder[]>(
          `/v1/courses/${courseId}/folders`,
          { per_page: 50 },
        ),
        apiGet<CanvasQuota>(`/v1/courses/${courseId}/files/quota`),
      ])

      return {
        files: filesRes.data ?? [],
        folders: (foldersRes.data ?? []).filter(
          (f) => f.id !== (rootFolder as CanvasFolder)?.id,
        ),
        quota: quotaRes.data,
      }
    },
    staleTime: 5 * 60 * 1000,
  })
}

function getFileIcon(contentType: string) {
  if (contentType.includes('pdf'))
    return { Icon: FileText, color: 'text-red-500' }
  if (contentType.includes('image'))
    return { Icon: FileImage, color: 'text-blue-500' }
  if (contentType.includes('video'))
    return { Icon: FileVideo, color: 'text-purple-500' }
  if (contentType.includes('word') || contentType.includes('document'))
    return { Icon: FileText, color: 'text-blue-600' }
  return { Icon: File, color: 'text-neutral-400' }
}

function formatFileSize(bytes: number): string {
  if (bytes > 1048576) return `${(bytes / 1048576).toFixed(1)} MB`
  return `${(bytes / 1024).toFixed(0)} KB`
}

function relativeTime(isoString: string): string {
  const now = new Date()
  const date = new Date(isoString)
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 30) return `${diffDays}d ago`
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function FilesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data, isLoading } = useFiles(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Files</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !data ||
        (data.files.length === 0 && data.folders.length === 0) ? (
        <EmptyState
          icon={FolderOpen}
          heading="No files"
          description="This course has no files yet."
        />
      ) : (
        <>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm">
            {/* Folders */}
            {data.folders.map((folder) => (
              <div
                key={folder.id}
                className="flex cursor-pointer items-center justify-between border-b border-neutral-100 px-5 py-3 transition-colors last:border-0 hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <Folder className="h-5 w-5 flex-shrink-0 text-amber-500" />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {folder.name}
                    </p>
                    <p className="text-xs text-neutral-500">
                      {folder.files_count || 0} files
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-neutral-300" />
              </div>
            ))}

            {/* Files */}
            {data.files.map((file) => {
              const { Icon, color } = getFileIcon(file.content_type)
              return (
                <div
                  key={file.id}
                  className="flex items-center justify-between border-b border-neutral-100 px-5 py-3 last:border-0 hover:bg-neutral-50"
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-5 w-5 flex-shrink-0 ${color}`} />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">
                        {file.display_name}
                      </p>
                      <p className="text-xs text-neutral-500">
                        {formatFileSize(file.size)} &middot;{' '}
                        {relativeTime(file.updated_at)}
                      </p>
                    </div>
                  </div>
                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 transition-colors hover:text-primary-600"
                  >
                    <Download className="h-4 w-4" />
                  </a>
                </div>
              )
            })}
          </div>

          {/* Storage Quota */}
          {data.quota && (
            <div className="rounded-lg bg-white p-4 shadow-sm">
              {(() => {
                const used = data.quota.quota_used || 0
                const total = data.quota.quota || 1
                const pct = Math.round((used / total) * 100)
                const usedMB = (used / 1048576).toFixed(1)
                const totalMB = (total / 1048576).toFixed(0)
                return (
                  <>
                    <p className="mb-2 text-xs text-neutral-500">
                      Storage: {usedMB} MB / {totalMB} MB ({pct}%)
                    </p>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-primary-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </>
                )
              })()}
            </div>
          )}
        </>
      )}
    </div>
  )
}
