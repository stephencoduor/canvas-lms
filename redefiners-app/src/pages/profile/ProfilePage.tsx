import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useCourses } from '@/hooks/useCourses'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Mail, BookOpen, PenSquare } from 'lucide-react'
import { Link } from 'react-router'

export function ProfilePage() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: courses, isLoading: coursesLoading } = useCourses()

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Profile</h3>

      {/* Profile Card */}
      {userLoading ? (
        <LoadingSkeleton type="text" count={4} />
      ) : user ? (
        <section className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-start gap-6">
            <img
              src={user.avatar_url || '/images/default-avatar.png'}
              alt={user.name}
              className="h-24 w-24 shrink-0 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-xl font-semibold text-neutral-800">
                    {user.name}
                  </h4>
                  {user.short_name && user.short_name !== user.name && (
                    <p className="text-sm text-neutral-500">
                      {user.short_name}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
                >
                  <PenSquare className="h-4 w-4" />
                  Edit Profile
                </button>
              </div>

              <div className="mt-4 space-y-2">
                {(user.email || user.primary_email) && (
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <Mail className="h-4 w-4 text-neutral-400" />
                    {user.email || user.primary_email}
                  </div>
                )}
                {user.bio && (
                  <p className="mt-3 text-sm text-neutral-600">{user.bio}</p>
                )}
                {user.time_zone && (
                  <p className="text-xs text-neutral-400">
                    Timezone: {user.time_zone}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* Enrollments */}
      <section className="rounded-lg bg-white p-5 shadow-sm">
        <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-700">
          <BookOpen className="h-5 w-5 text-primary-500" />
          My Courses
        </h4>
        {coursesLoading ? (
          <LoadingSkeleton type="row" count={4} />
        ) : !courses || courses.length === 0 ? (
          <p className="text-sm text-neutral-500">
            You are not enrolled in any courses.
          </p>
        ) : (
          <div className="space-y-2">
            {courses.map((course) => {
              const enrollment = course.enrollments?.[0]
              const role = enrollment?.type?.replace('Enrollment', '') ?? 'User'

              return (
                <Link
                  key={course.id}
                  to={`/courses/${course.id}`}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 p-3 transition-colors hover:bg-neutral-50"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {course.name}
                    </p>
                    <p className="mt-0.5 text-xs text-neutral-500">
                      {course.course_code}
                      {course.term ? ` \u00B7 ${course.term.name}` : ''}
                    </p>
                  </div>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                    {role}
                  </span>
                </Link>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
