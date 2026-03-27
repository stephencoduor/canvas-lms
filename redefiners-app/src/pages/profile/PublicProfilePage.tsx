import { useParams } from 'react-router'
import { User, BookOpen, Mail } from 'lucide-react'

const MOCK_PROFILE = {
  name: 'Jane Smith',
  bio: 'Passionate educator focused on language acquisition and cultural studies. Currently teaching Spanish and French at the intermediate and advanced levels.',
  avatarInitial: 'J',
  title: 'Language Instructor',
  coursesInCommon: [
    { id: '101', name: 'Intermediate Spanish' },
    { id: '102', name: 'Advanced French Literature' },
    { id: '103', name: 'Introduction to Linguistics' },
  ],
}

export function PublicProfilePage() {
  const { userId } = useParams()
  const profile = MOCK_PROFILE

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="flex items-start gap-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-100 text-2xl font-bold text-primary-700">
            {profile.avatarInitial}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-primary-800">{profile.name}</h3>
            <p className="mt-1 text-sm text-neutral-500">{profile.title}</p>
            <p className="mt-1 text-xs text-neutral-400">User ID: {userId}</p>
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Mail className="h-4 w-4" />
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <User className="h-4 w-4 text-primary-600" />
            <h4 className="text-lg font-semibold text-neutral-800">About</h4>
          </div>
          <p className="text-sm leading-relaxed text-neutral-600">{profile.bio}</p>
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary-600" />
            <h4 className="text-lg font-semibold text-neutral-800">
              Courses in Common ({profile.coursesInCommon.length})
            </h4>
          </div>
          <div className="space-y-2">
            {profile.coursesInCommon.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-3 rounded-md p-2 transition-colors hover:bg-neutral-50"
              >
                <div className="rounded-md bg-primary-50 p-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary-600" />
                </div>
                <span className="text-sm text-neutral-700">{course.name}</span>
              </div>
            ))}
            {profile.coursesInCommon.length === 0 && (
              <p className="text-sm text-neutral-500">No courses in common.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
