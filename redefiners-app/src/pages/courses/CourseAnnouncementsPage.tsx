import { useParams } from 'react-router'
import { useAnnouncements } from '@/hooks/useAnnouncements'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Megaphone } from 'lucide-react'

export function CourseAnnouncementsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const contextCodes = courseId ? [`course_${courseId}`] : []
  const { data: announcements, isLoading } = useAnnouncements(contextCodes)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Course Announcements</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={6} />
      ) : !announcements || announcements.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          heading="No announcements"
          description="There are no announcements for this course yet."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="flex items-start gap-4 border-b border-neutral-50 px-5 py-4 transition-colors hover:bg-neutral-50"
            >
              <div className="mt-0.5 flex items-center gap-2">
                <span
                  className={`h-2 w-2 shrink-0 rounded-full ${
                    announcement.read_state === 'unread'
                      ? 'bg-primary-500'
                      : 'bg-transparent'
                  }`}
                />
                <img
                  src={announcement.author.avatar_image_url || '/images/default-avatar.png'}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p
                  className={`text-sm ${
                    announcement.read_state === 'unread'
                      ? 'font-semibold text-neutral-800'
                      : 'font-medium text-neutral-600'
                  }`}
                >
                  {announcement.title}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  {announcement.author.display_name} &middot;{' '}
                  {new Date(announcement.posted_at).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </p>
              </div>
              {announcement.discussion_subentry_count > 0 && (
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                  {announcement.discussion_subentry_count} replies
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
