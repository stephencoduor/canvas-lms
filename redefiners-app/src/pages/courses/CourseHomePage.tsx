import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { AssignmentRow } from '@/components/shared/AssignmentRow'
import { Megaphone, CalendarDays, Layers } from 'lucide-react'
import type {
  CanvasCourse,
  CanvasAnnouncement,
  CanvasAssignment,
  CanvasModule,
} from '@/types/canvas'

function useCourse(courseId: string) {
  return useQuery({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasCourse>(`/v1/courses/${courseId}`, {
        include: ['term', 'total_students', 'enrollments', 'syllabus_body'],
      })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

function useAnnouncements(courseId: string) {
  return useQuery({
    queryKey: ['announcements', courseId],
    queryFn: async () => {
      const response = await apiGet<CanvasAnnouncement[]>(
        '/v1/announcements',
        { context_codes: [`course_${courseId}`], per_page: 3 },
      )
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

function useUpcomingAssignments(courseId: string) {
  return useQuery({
    queryKey: ['assignments', courseId, 'upcoming'],
    queryFn: async () => {
      const response = await apiGet<CanvasAssignment[]>(
        `/v1/courses/${courseId}/assignments`,
        {
          include: ['submission'],
          order_by: 'due_at',
          per_page: 50,
        },
      )
      const now = new Date()
      return (response.data ?? [])
        .filter((a) => a.due_at && new Date(a.due_at) > now)
        .sort(
          (a, b) =>
            new Date(a.due_at!).getTime() - new Date(b.due_at!).getTime(),
        )
        .slice(0, 5)
    },
    staleTime: 5 * 60 * 1000,
  })
}

function useModulesOverview(courseId: string) {
  return useQuery({
    queryKey: ['modules', courseId, 'overview'],
    queryFn: async () => {
      const response = await apiGet<CanvasModule[]>(
        `/v1/courses/${courseId}/modules`,
        { include: ['items'], per_page: 50 },
      )
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

function formatDate(isoString: string | null): string {
  if (!isoString) return ''
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function CourseHomePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: course, isLoading: courseLoading } = useCourse(courseId!)
  const { data: announcements, isLoading: announcementsLoading } =
    useAnnouncements(courseId!)
  const { data: upcoming, isLoading: upcomingLoading } =
    useUpcomingAssignments(courseId!)
  const { data: modules, isLoading: modulesLoading } = useModulesOverview(
    courseId!,
  )

  return (
    <div className="space-y-6">
      {/* Course Header */}
      {courseLoading ? (
        <LoadingSkeleton type="text" count={2} />
      ) : course ? (
        <div>
          <h3 className="text-2xl font-bold text-primary-800">{course.name}</h3>
          <p className="mt-1 text-sm text-neutral-500">{course.course_code}</p>
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left column: Announcements + Assignments */}
        <div className="space-y-6 lg:col-span-2">
          {/* Recent Announcements */}
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700">
              <Megaphone className="h-5 w-5 text-primary-500" />
              Recent Announcements
            </h4>
            {announcementsLoading ? (
              <LoadingSkeleton type="row" count={3} />
            ) : !announcements || announcements.length === 0 ? (
              <p className="text-sm text-neutral-500">No announcements yet.</p>
            ) : (
              <div className="space-y-3">
                {announcements.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-lg border border-neutral-100 p-3"
                  >
                    <p className="text-sm font-medium text-neutral-800">
                      {a.title}
                    </p>
                    <p className="mt-1 text-xs text-neutral-400">
                      {formatDate(a.posted_at)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Upcoming Assignments */}
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700">
              <CalendarDays className="h-5 w-5 text-primary-500" />
              Upcoming Assignments
            </h4>
            {upcomingLoading ? (
              <LoadingSkeleton type="row" count={5} />
            ) : !upcoming || upcoming.length === 0 ? (
              <p className="text-sm text-neutral-500">
                No upcoming assignments.
              </p>
            ) : (
              <div className="space-y-2">
                {upcoming.map((a) => (
                  <AssignmentRow
                    key={a.id}
                    assignment={a}
                    courseId={courseId!}
                  />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Right column: Module progress */}
        <div>
          <section className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700">
              <Layers className="h-5 w-5 text-primary-500" />
              Module Progress
            </h4>
            {modulesLoading ? (
              <LoadingSkeleton type="row" count={4} />
            ) : !modules || modules.length === 0 ? (
              <p className="text-sm text-neutral-500">No modules available.</p>
            ) : (
              <div className="space-y-3">
                {modules.map((mod) => {
                  const items = mod.items ?? []
                  const completable = items.filter(
                    (i) => i.completion_requirement,
                  )
                  const completed = completable.filter(
                    (i) => i.completion_requirement?.completed,
                  )
                  const pct =
                    completable.length > 0
                      ? Math.round(
                          (completed.length / completable.length) * 100,
                        )
                      : 0

                  return (
                    <div key={mod.id}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="truncate text-neutral-700">
                          {mod.name}
                        </span>
                        <span className="ml-2 text-xs font-semibold text-primary-600">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
                        <div
                          className="h-full rounded-full bg-primary-500 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}
