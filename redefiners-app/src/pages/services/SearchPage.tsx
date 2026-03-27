import { useState } from 'react'
import { useSearchRecipients, useSearchCourses } from '@/hooks/useSearch'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Search, BookOpen, Users } from 'lucide-react'
import { Link } from 'react-router'

export function SearchPage() {
  const [query, setQuery] = useState('')
  const { data: recipients, isLoading: recipientsLoading } = useSearchRecipients(query)
  const { data: courses, isLoading: coursesLoading } = useSearchCourses(query)

  const isLoading = recipientsLoading || coursesLoading
  const hasResults = (recipients && recipients.length > 0) || (courses && courses.length > 0)
  const hasSearched = query.length >= 2

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Search</h3>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search courses, people, and more..."
          className="w-full rounded-lg border border-neutral-200 bg-white py-3 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {isLoading && hasSearched ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !hasSearched ? (
        <EmptyState
          icon={Search}
          heading="Start searching"
          description="Type at least 2 characters to search across courses and people."
        />
      ) : !hasResults ? (
        <EmptyState
          icon={Search}
          heading="No results found"
          description={`No results found for "${query}". Try a different search term.`}
        />
      ) : (
        <div className="space-y-6">
          {courses && courses.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-emerald-600" />
                <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  Courses ({courses.length})
                </h4>
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                {courses.map((course) => (
                  <Link
                    key={course.id}
                    to={`/courses/${course.id}`}
                    className="flex items-center gap-3 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
                  >
                    <div className="rounded-lg bg-emerald-50 p-2">
                      <BookOpen className="h-4 w-4 text-emerald-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-800">{course.name}</p>
                      <p className="text-xs text-neutral-400">{course.course_code}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {recipients && recipients.length > 0 && (
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-600" />
                <h4 className="text-sm font-semibold uppercase tracking-wide text-neutral-500">
                  People ({recipients.length})
                </h4>
              </div>
              <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                {recipients.map((person) => (
                  <div
                    key={person.id}
                    className="flex items-center gap-3 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
                  >
                    <img
                      src={person.avatar_url || '/images/default-avatar.png'}
                      alt=""
                      className="h-9 w-9 shrink-0 rounded-full object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-neutral-800">{person.name}</p>
                      <p className="text-xs text-neutral-400">{person.full_name}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
