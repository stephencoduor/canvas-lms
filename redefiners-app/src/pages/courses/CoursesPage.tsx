import { useCourses } from '@/hooks/useCourses'
import { CourseCard } from '@/components/shared/CourseCard'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { BookOpen } from 'lucide-react'

export function CoursesPage() {
  const { data: courses, isLoading } = useCourses()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold" style={{ color: 'var(--color-text-primary)' }}>My Courses</h3>
          {!isLoading && courses && (
            <p className="mt-1 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} enrolled
            </p>
          )}
        </div>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <LoadingSkeleton type="card" count={6} />
      ) : !courses || courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          heading="No courses found"
          description="You are not enrolled in any courses yet."
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
