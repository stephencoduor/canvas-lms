import { useState } from 'react'
import { Library, Search, FileText, Image, Video, File, Download, Eye } from 'lucide-react'

type ContentType = 'all' | 'document' | 'image' | 'video'

const CONTENT_ITEMS = [
  { id: 1, name: 'Spanish Vocabulary Flashcards', type: 'document' as const, size: '2.4 MB', author: 'Prof. Martinez', date: '2026-03-20', downloads: 145 },
  { id: 2, name: 'Cultural Heritage Infographic', type: 'image' as const, size: '5.1 MB', author: 'Design Team', date: '2026-03-18', downloads: 89 },
  { id: 3, name: 'Pronunciation Guide — Unit 3', type: 'video' as const, size: '45 MB', author: 'Language Lab', date: '2026-03-15', downloads: 212 },
  { id: 4, name: 'Grammar Reference Sheet', type: 'document' as const, size: '1.2 MB', author: 'Prof. Martinez', date: '2026-03-12', downloads: 178 },
  { id: 5, name: 'Latin America Map Collection', type: 'image' as const, size: '8.3 MB', author: 'Geography Dept', date: '2026-03-10', downloads: 67 },
  { id: 6, name: 'Conversation Practice Video', type: 'video' as const, size: '120 MB', author: 'Language Lab', date: '2026-03-08', downloads: 95 },
]

function typeIcon(type: string) {
  switch (type) {
    case 'document': return FileText
    case 'image': return Image
    case 'video': return Video
    default: return File
  }
}

function typeColor(type: string): string {
  switch (type) {
    case 'document': return 'text-blue-600 bg-blue-50'
    case 'image': return 'text-purple-600 bg-purple-50'
    case 'video': return 'text-red-600 bg-red-50'
    default: return 'text-neutral-600 bg-neutral-100'
  }
}

export function ContentLibraryPage() {
  const [filter, setFilter] = useState<ContentType>('all')
  const [search, setSearch] = useState('')

  const items = CONTENT_ITEMS.filter((item) => {
    if (filter !== 'all' && item.type !== filter) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Library className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Content Library</h3>
          <p className="mt-1 text-sm text-neutral-500">Browse and download shared content assets</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search content..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
        </div>
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {(['all', 'document', 'image', 'video'] as const).map((t) => (
            <button key={t} type="button" onClick={() => setFilter(t)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${filter === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {t === 'all' ? 'All' : `${t}s`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {items.map((item) => {
          const Icon = typeIcon(item.type)
          return (
            <div key={item.id} className="flex items-center gap-4 rounded-lg bg-white px-5 py-4 shadow-sm">
              <div className={`rounded-lg p-2.5 ${typeColor(item.type)}`}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-neutral-800">{item.name}</h4>
                <p className="text-xs text-neutral-400">{item.author} &middot; {item.size} &middot; {item.date}</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-neutral-400"><Download className="h-3 w-3" />{item.downloads}</span>
              <button type="button" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-primary-600"><Eye className="h-4 w-4" /></button>
              <button type="button" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-primary-600"><Download className="h-4 w-4" /></button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
