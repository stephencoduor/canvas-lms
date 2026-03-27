import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPut } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Bell, Save } from 'lucide-react'

interface NotificationPreference {
  notification: string
  category: string
  frequency: 'immediately' | 'daily' | 'weekly' | 'never'
}

const NOTIFICATION_CATEGORIES = [
  {
    name: 'Course Activities',
    items: [
      { key: 'new_announcement', label: 'New Announcements' },
      { key: 'assignment_due_date_changed', label: 'Assignment Due Date Changed' },
      { key: 'assignment_created', label: 'New Assignment' },
    ],
  },
  {
    name: 'Grades',
    items: [
      { key: 'submission_graded', label: 'Submission Graded' },
      { key: 'grade_weight_changed', label: 'Grade Weight Changed' },
    ],
  },
  {
    name: 'Discussions',
    items: [
      { key: 'new_discussion_topic', label: 'New Discussion Topic' },
      { key: 'new_discussion_entry', label: 'New Discussion Reply' },
    ],
  },
  {
    name: 'Conversations',
    items: [
      { key: 'new_message', label: 'New Message' },
      { key: 'added_to_conversation', label: 'Added to Conversation' },
    ],
  },
  {
    name: 'Scheduling',
    items: [
      { key: 'event_date_changed', label: 'Event Date Changed' },
      { key: 'appointment_canceled', label: 'Appointment Canceled' },
    ],
  },
]

export function CourseNotificationSettingsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const [preferences, setPreferences] = useState<Record<string, 'immediately' | 'daily' | 'weekly' | 'never'>>({})

  const { data: savedPrefs, isLoading } = useQuery<NotificationPreference[]>({
    queryKey: ['notificationPrefs', courseId],
    queryFn: async () => {
      const response = await apiGet<{ notification_preferences: NotificationPreference[] }>(
        `/v1/users/self/communication_channels/email/notification_preferences`,
        { course_id: courseId },
      )
      const prefs = (response.data as unknown as { notification_preferences: NotificationPreference[] }).notification_preferences ?? (response.data as unknown as NotificationPreference[])
      return Array.isArray(prefs) ? prefs : []
    },
    enabled: !!courseId,
  })

  useEffect(() => {
    if (savedPrefs) {
      const map: Record<string, 'immediately' | 'daily' | 'weekly' | 'never'> = {}
      for (const p of savedPrefs) {
        map[p.notification] = p.frequency
      }
      setPreferences(map)
    }
  }, [savedPrefs])

  const saveMutation = useMutation({
    mutationFn: async () => {
      const updates = Object.entries(preferences).map(([notification, frequency]) => ({
        notification,
        frequency,
      }))
      return apiPut(
        '/v1/users/self/communication_channels/email/notification_preferences',
        { notification_preferences: updates, course_id: courseId },
      )
    },
  })

  const togglePref = (key: string) => {
    setPreferences((prev) => {
      const current = prev[key] ?? 'immediately'
      const cycle: Array<'immediately' | 'daily' | 'weekly' | 'never'> = [
        'immediately',
        'daily',
        'weekly',
        'never',
      ]
      const nextIndex = (cycle.indexOf(current) + 1) % cycle.length
      return { ...prev, [key]: cycle[nextIndex] }
    })
  }

  const freqColor = (freq: string) => {
    switch (freq) {
      case 'immediately':
        return 'bg-green-50 text-green-700'
      case 'daily':
        return 'bg-blue-50 text-blue-700'
      case 'weekly':
        return 'bg-amber-50 text-amber-700'
      case 'never':
        return 'bg-neutral-100 text-neutral-500'
      default:
        return 'bg-neutral-100 text-neutral-500'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            Notification Settings
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Manage notification preferences for this course
          </p>
        </div>
        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {saveMutation.isPending ? 'Saving...' : 'Save'}
        </button>
      </div>

      {saveMutation.isSuccess && (
        <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700">
          Notification preferences saved successfully.
        </div>
      )}

      {saveMutation.isError && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
          Failed to save preferences. Please try again.
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton type="row" count={8} />
      ) : (
        <div className="space-y-4">
          {NOTIFICATION_CATEGORIES.map((category) => (
            <div key={category.name} className="rounded-lg bg-white shadow-sm">
              <div className="flex items-center gap-2 border-b border-neutral-200 px-5 py-3">
                <Bell className="h-4 w-4 text-neutral-400" />
                <h4 className="text-sm font-semibold text-neutral-700">
                  {category.name}
                </h4>
              </div>
              {category.items.map((item) => {
                const freq = preferences[item.key] ?? 'immediately'
                return (
                  <div
                    key={item.key}
                    className="flex items-center justify-between border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
                  >
                    <span className="text-sm text-neutral-700">
                      {item.label}
                    </span>
                    <button
                      type="button"
                      onClick={() => togglePref(item.key)}
                      className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${freqColor(freq)}`}
                    >
                      {freq}
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
