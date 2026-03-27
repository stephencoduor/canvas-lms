import { useState } from 'react'
import { Search, Users, BookOpen } from 'lucide-react'

interface SearchResult {
  id: string
  name: string
  email?: string
  type: 'user' | 'course'
}

const MOCK_USERS: SearchResult[] = [
  { id: '1', name: 'Jane Smith', email: 'jane.smith@example.com', type: 'user' },
  { id: '2', name: 'John Doe', email: 'john.doe@example.com', type: 'user' },
  { id: '3', name: 'Maria Garcia', email: 'maria.garcia@example.com', type: 'user' },
]

const MOCK_COURSES: SearchResult[] = [
  { id: '101', name: 'Introduction to Computer Science', type: 'course' },
  { id: '102', name: 'Advanced Mathematics', type: 'course' },
  { id: '103', name: 'English Literature 201', type: 'course' },
]

export function AccountSearchPage() {
  const [query, setQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'users' | 'courses'>('users')

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(query.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(query.toLowerCase()))
  )

  const filteredCourses = MOCK_COURSES.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  )

  const results = activeTab === 'users' ? filteredUsers : filteredCourses

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Search className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Account Search</h3>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users and courses..."
            className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="mt-4 flex gap-1 border-b border-neutral-100">
          <button
            type="button"
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'users'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <Users className="h-4 w-4" />
            Users ({filteredUsers.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('courses')}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-sm font-medium transition-colors ${
              activeTab === 'courses'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700'
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Courses ({filteredCourses.length})
          </button>
        </div>

        <div className="mt-4 divide-y divide-neutral-100">
          {results.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-500">
              {query ? 'No results found.' : 'Enter a search term to begin.'}
            </p>
          ) : (
            results.map((result) => (
              <div
                key={result.id}
                className="flex items-center gap-3 rounded-md p-3 transition-colors hover:bg-neutral-50"
              >
                <div className="rounded-full bg-primary-50 p-2">
                  {result.type === 'user' ? (
                    <Users className="h-4 w-4 text-primary-600" />
                  ) : (
                    <BookOpen className="h-4 w-4 text-primary-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-800">{result.name}</p>
                  {result.email && (
                    <p className="text-xs text-neutral-500">{result.email}</p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
