import { useState } from 'react'
import { BookMarked, Search, ExternalLink, Star, BookOpen, Globe, Headphones, FileText } from 'lucide-react'

type Category = 'all' | 'textbooks' | 'websites' | 'podcasts' | 'articles'

const RESOURCES = [
  { id: 1, title: 'Essential Spanish Grammar', category: 'textbooks' as const, author: 'Maria Rodriguez', rating: 4.8, link: '#', description: 'Comprehensive grammar reference for beginner to intermediate learners.' },
  { id: 2, title: 'SpanishPod101', category: 'podcasts' as const, author: 'Innovative Language', rating: 4.5, link: '#', description: 'Audio lessons covering vocabulary, grammar, and culture.' },
  { id: 3, title: 'BBC Mundo', category: 'websites' as const, author: 'BBC', rating: 4.7, link: '#', description: 'Spanish-language news for reading practice and cultural awareness.' },
  { id: 4, title: 'History of World Civilizations', category: 'textbooks' as const, author: 'Dr. James Chen', rating: 4.3, link: '#', description: 'Core textbook covering ancient to modern world history.' },
  { id: 5, title: 'Cultural Intelligence Research', category: 'articles' as const, author: 'Journal of Education', rating: 4.1, link: '#', description: 'Peer-reviewed articles on cross-cultural competency in education.' },
  { id: 6, title: 'Duolingo Stories', category: 'websites' as const, author: 'Duolingo', rating: 4.6, link: '#', description: 'Interactive stories for language learning with audio and comprehension.' },
]

function catIcon(cat: string) {
  switch (cat) {
    case 'textbooks': return BookOpen
    case 'websites': return Globe
    case 'podcasts': return Headphones
    default: return FileText
  }
}

function catColor(cat: string): string {
  switch (cat) {
    case 'textbooks': return 'text-blue-600 bg-blue-50'
    case 'websites': return 'text-emerald-600 bg-emerald-50'
    case 'podcasts': return 'text-purple-600 bg-purple-50'
    default: return 'text-amber-600 bg-amber-50'
  }
}

export function ResourceLibraryPage() {
  const [category, setCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')

  const items = RESOURCES.filter((r) => {
    if (category !== 'all' && r.category !== category) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <BookMarked className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Resource Library</h3>
          <p className="mt-1 text-sm text-neutral-500">Curated educational resources for your courses</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
        </div>
        <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
          {(['all', 'textbooks', 'websites', 'podcasts', 'articles'] as const).map((c) => (
            <button key={c} type="button" onClick={() => setCategory(c)} className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${category === c ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((r) => {
          const Icon = catIcon(r.category)
          return (
            <div key={r.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2 ${catColor(r.category)}`}><Icon className="h-4 w-4" /></div>
                <div className="flex items-center gap-0.5 text-xs text-amber-500"><Star className="h-3 w-3 fill-amber-400" />{r.rating}</div>
              </div>
              <h4 className="mt-3 text-sm font-semibold text-neutral-800">{r.title}</h4>
              <p className="text-xs text-neutral-500">{r.author}</p>
              <p className="mt-2 text-xs text-neutral-600">{r.description}</p>
              <button type="button" className="mt-3 flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                Open Resource <ExternalLink className="h-3 w-3" />
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
