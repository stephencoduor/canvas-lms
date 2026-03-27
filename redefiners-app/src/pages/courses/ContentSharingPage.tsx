import { useState } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Search, Send, CheckSquare, Square } from 'lucide-react'

interface ContentItem {
  id: number
  title: string
  type: 'assignment' | 'page' | 'module' | 'discussion_topic' | 'quiz'
}

interface ShareRecipient {
  id: number
  name: string
  email?: string
}

export function ContentSharingPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [recipientSearch, setRecipientSearch] = useState('')
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [selectedRecipient, setSelectedRecipient] = useState<ShareRecipient | null>(null)

  const { data: assignments } = useQuery<ContentItem[]>({
    queryKey: ['shareContent', 'assignments', courseId],
    queryFn: async () => {
      const response = await apiGet<Array<Record<string, unknown>>>(
        `/v1/courses/${courseId}/assignments`,
        { per_page: 50 },
      )
      return response.data.map((a) => ({
        id: a.id as number,
        title: (a.name ?? a.title) as string,
        type: 'assignment' as const,
      }))
    },
    enabled: !!courseId,
  })

  const { data: pages } = useQuery<ContentItem[]>({
    queryKey: ['shareContent', 'pages', courseId],
    queryFn: async () => {
      const response = await apiGet<Array<Record<string, unknown>>>(
        `/v1/courses/${courseId}/pages`,
        { per_page: 50 },
      )
      return response.data.map((p) => ({
        id: p.page_id as number,
        title: p.title as string,
        type: 'page' as const,
      }))
    },
    enabled: !!courseId,
  })

  const { data: modules } = useQuery<ContentItem[]>({
    queryKey: ['shareContent', 'modules', courseId],
    queryFn: async () => {
      const response = await apiGet<Array<Record<string, unknown>>>(
        `/v1/courses/${courseId}/modules`,
        { per_page: 50 },
      )
      return response.data.map((m) => ({
        id: m.id as number,
        title: m.name as string,
        type: 'module' as const,
      }))
    },
    enabled: !!courseId,
  })

  const { data: recipients, isLoading: recipientsLoading } = useQuery<ShareRecipient[]>({
    queryKey: ['shareRecipients', recipientSearch],
    queryFn: async () => {
      const response = await apiGet<ShareRecipient[]>(
        '/v1/search/recipients',
        { search: recipientSearch, per_page: 10 },
      )
      return response.data
    },
    enabled: recipientSearch.length >= 2,
  })

  const shareMutation = useMutation({
    mutationFn: async () => {
      const items = Array.from(selectedItems).map((key) => {
        const [type, id] = key.split('-')
        return { content_type: type, content_id: Number(id) }
      })
      return apiPost(`/v1/courses/${courseId}/content_shares`, {
        receiver_id: selectedRecipient?.id,
        content_shares: items,
      })
    },
    onSuccess: () => {
      setSelectedItems(new Set())
      setSelectedRecipient(null)
    },
  })

  const toggleItem = (key: string) => {
    setSelectedItems((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const allContent: ContentItem[] = [
    ...(assignments ?? []),
    ...(pages ?? []),
    ...(modules ?? []),
  ]

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Share Content
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Share course content with other courses or users
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Content Selection */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-neutral-700">
            Select Content
          </h4>
          {allContent.length === 0 ? (
            <p className="text-sm text-neutral-500">Loading content...</p>
          ) : (
            <div className="max-h-96 space-y-1 overflow-y-auto">
              {['assignment', 'page', 'module'].map((type) => {
                const items = allContent.filter((c) => c.type === type)
                if (items.length === 0) return null
                return (
                  <div key={type} className="mb-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400">
                      {type === 'assignment' ? 'Assignments' : type === 'page' ? 'Pages' : 'Modules'}
                    </p>
                    {items.map((item) => {
                      const key = `${item.type}-${item.id}`
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm text-neutral-700 transition-colors hover:bg-neutral-50"
                        >
                          {selectedItems.has(key) ? (
                            <CheckSquare className="h-4 w-4 text-primary-600" />
                          ) : (
                            <Square className="h-4 w-4 text-neutral-400" />
                          )}
                          {item.title}
                        </button>
                      )
                    })}
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recipient Search */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-sm font-semibold text-neutral-700">
            Select Recipient
          </h4>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              placeholder="Search users..."
              value={recipientSearch}
              onChange={(e) => setRecipientSearch(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-700 placeholder:text-neutral-400 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          {selectedRecipient && (
            <div className="mb-3 rounded-lg bg-primary-50 px-3 py-2 text-sm text-primary-700">
              Sharing with: <strong>{selectedRecipient.name}</strong>
            </div>
          )}
          {recipientsLoading ? (
            <LoadingSkeleton type="row" count={3} />
          ) : (
            <div className="space-y-1">
              {recipients?.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRecipient(r)}
                  className={`w-full rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                    selectedRecipient?.id === r.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  {r.name}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Share Action */}
      <div className="flex items-center justify-end gap-3">
        {shareMutation.isError && (
          <p className="mr-auto text-sm text-red-600">
            Failed to share content. Please try again.
          </p>
        )}
        {shareMutation.isSuccess && (
          <p className="mr-auto text-sm text-green-600">
            Content shared successfully.
          </p>
        )}
        <button
          type="button"
          onClick={() => shareMutation.mutate()}
          disabled={
            shareMutation.isPending ||
            selectedItems.size === 0 ||
            !selectedRecipient
          }
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
          {shareMutation.isPending ? 'Sharing...' : 'Share Selected'}
        </button>
      </div>
    </div>
  )
}
