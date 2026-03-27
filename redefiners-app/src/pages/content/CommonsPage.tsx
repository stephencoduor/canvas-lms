import { useState } from 'react'
import { Globe, Search, Star, Download, Upload, BookOpen, Users } from 'lucide-react'

type CommonsTab = 'browse' | 'shared'

const SHARED_CONTENT = [
  { id: 1, title: 'Spanish Verb Conjugation Module', type: 'Module', author: 'Prof. Martinez', rating: 4.9, downloads: 342, subject: 'Language Arts' },
  { id: 2, title: 'World History Timeline Activity', type: 'Assignment', author: 'Dr. Chen', rating: 4.7, downloads: 198, subject: 'Social Studies' },
  { id: 3, title: 'Cultural Competency Rubric', type: 'Rubric', author: 'Admin Team', rating: 4.5, downloads: 156, subject: 'General' },
  { id: 4, title: 'Math Problem Sets — Integration', type: 'Quiz', author: 'Prof. Adams', rating: 4.3, downloads: 89, subject: 'Mathematics' },
  { id: 5, title: 'Reading Comprehension Framework', type: 'Module', author: 'Dr. Williams', rating: 4.8, downloads: 267, subject: 'English' },
]

const MY_SHARED = [
  { id: 6, title: 'Vocabulary Practice Sheet', type: 'Assignment', shares: 45, date: '2026-03-15' },
  { id: 7, title: 'Listening Comprehension Quiz', type: 'Quiz', shares: 23, date: '2026-02-20' },
]

export function CommonsPage() {
  const [tab, setTab] = useState<CommonsTab>('browse')
  const [search, setSearch] = useState('')

  const items = SHARED_CONTENT.filter((c) => !search || c.title.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Globe className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Commons</h3>
            <p className="mt-1 text-sm text-neutral-500">Share and discover learning content across the community</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Upload className="h-4 w-4" /> Share Content
        </button>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['browse', 'shared'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'browse' ? 'Browse All' : 'My Shared'}
          </button>
        ))}
      </div>

      {tab === 'browse' ? (
        <>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search commons..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
          </div>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
                <div className="rounded-lg bg-primary-50 p-2.5 text-primary-600"><BookOpen className="h-5 w-5" /></div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-neutral-800">{item.title}</h4>
                  <p className="text-xs text-neutral-500">{item.author} &middot; {item.subject} &middot; {item.type}</p>
                </div>
                <div className="flex items-center gap-1 text-xs text-amber-500"><Star className="h-3 w-3 fill-amber-400" />{item.rating}</div>
                <div className="flex items-center gap-1 text-xs text-neutral-400"><Download className="h-3 w-3" />{item.downloads}</div>
                <button type="button" className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100">Import</button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="space-y-3">
          {MY_SHARED.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-lg bg-white p-5 shadow-sm">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600"><Upload className="h-5 w-5" /></div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-neutral-800">{item.title}</h4>
                <p className="text-xs text-neutral-500">{item.type} &middot; Shared {item.date}</p>
              </div>
              <div className="flex items-center gap-1 text-xs text-neutral-400"><Users className="h-3 w-3" />{item.shares} imports</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
