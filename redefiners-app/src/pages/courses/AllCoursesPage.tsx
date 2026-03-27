import { useState } from 'react'
import { useCourses } from '@/hooks/useCourses'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { BookOpen, Search } from 'lucide-react'
import { Link } from 'react-router'

export function AllCoursesPage() {
  const { data: courses, isLoading } = useCourses()
  const [search, setSearch] = useState('')

  const filtered =
    courses?.filter((course) =>
      course.name.toLowerCase().includes(search.toLowerCase()) ||
      course.course_code.toLowerCase().includes(search.toLowerCase()),
    ) ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary-800">All Courses</h3>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full rounded-lg border border-neutral-200 bg-white py-2.5 pl-10 pr-4 text-sm text-neutral-800 placeholder-neutral-400 shadow-sm focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          heading="No courses found"
          description={search ? 'No courses match your search. Try a different term.' : 'No courses are available at this time.'}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((course) => (
            <div
              key={course.id}
              className="overflow-hidden rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div
                className="h-32 bg-gradient-to-br from-primary-500 to-primary-700"
                style={
                  course.image_download_url
                    ? { backgroundImage: `url(${course.image_download_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                    : undefined
                }
              />
              <div className="p-4">
                <h4 className="text-sm font-semibold text-neutral-800">{course.name}</h4>
                <p className="mt-0.5 text-xs text-neutral-400">{course.course_code}</p>
                {course.term && (
                  <p className="mt-1 text-xs text-neutral-400">{course.term.name}</p>
                )}
                {course.teachers && course.teachers.length > 0 && (
                  <p className="mt-1 text-xs text-neutral-500">
                    {course.teachers.map((t) => t.display_name).join(', ')}
                  </p>
                )}
                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/courses/${course.id}`}
                    className="rounded-md bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
                  >
                    View Course
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
