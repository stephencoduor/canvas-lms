import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { apiGet, apiPost } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { BookCopy, Lock, Unlock, RefreshCw } from 'lucide-react'

interface BlueprintCourse {
  id: number
  name: string
  course_code: string
  blueprint: boolean
  blueprint_restrictions?: Record<string, boolean>
  term?: { name: string }
  associated_courses_count?: number
  last_sync_at?: string
}

export function BlueprintCoursesPage() {
  const [syncing, setSyncing] = useState<number | null>(null)

  const { data: courses, isLoading } = useQuery<BlueprintCourse[]>({
    queryKey: ['blueprintCourses'],
    queryFn: async () => {
      const response = await apiGet<BlueprintCourse[]>(
        '/v1/accounts/self/courses',
        { blueprint: true, per_page: 50, include: ['term'] },
      )
      return response.data
    },
  })

  const handleSync = async (courseId: number) => {
    setSyncing(courseId)
    try {
      await apiPost(`/v1/courses/${courseId}/blueprint_templates/default/migrations`)
    } finally {
      setSyncing(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-primary-800">
          Blueprint Courses
        </h3>
        <p className="mt-1 text-sm text-neutral-500">
          Manage blueprint courses and sync associated courses
        </p>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !courses || courses.length === 0 ? (
        <EmptyState
          icon={BookCopy}
          heading="No blueprint courses"
          description="No blueprint courses have been created yet."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <div className="grid grid-cols-[1fr_auto_auto_auto_auto] gap-4 border-b border-neutral-200 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-neutral-500">
            <span>Course</span>
            <span>Lock Status</span>
            <span>Associated</span>
            <span>Last Sync</span>
            <span>Actions</span>
          </div>
          {courses.map((course) => (
            <div
              key={course.id}
              className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
            >
              <div>
                <p className="text-sm font-medium text-neutral-800">
                  {course.name}
                </p>
                <p className="text-xs text-neutral-500">{course.course_code}</p>
              </div>
              <span className="flex items-center gap-1.5 text-sm text-neutral-600">
                {course.blueprint_restrictions ? (
                  <Lock className="h-4 w-4 text-amber-500" />
                ) : (
                  <Unlock className="h-4 w-4 text-neutral-400" />
                )}
                {course.blueprint_restrictions ? 'Locked' : 'Unlocked'}
              </span>
              <span className="text-center text-sm text-neutral-600">
                {course.associated_courses_count ?? 0}
              </span>
              <span className="text-xs text-neutral-500">
                {course.last_sync_at
                  ? new Date(course.last_sync_at).toLocaleDateString()
                  : 'Never'}
              </span>
              <button
                type="button"
                onClick={() => handleSync(course.id)}
                disabled={syncing === course.id}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-3.5 w-3.5 ${syncing === course.id ? 'animate-spin' : ''}`}
                />
                Sync
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
