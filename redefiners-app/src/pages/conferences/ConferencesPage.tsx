import { useParams } from 'react-router'
import { useConferences } from '@/hooks/useConferences'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Video, Users, ExternalLink } from 'lucide-react'

function formatDuration(minutes: number | null): string {
  if (!minutes) return ''
  if (minutes < 60) return `${minutes} min`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function ConferencesPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: conferences, isLoading } = useConferences(courseId!)

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">Conferences</h3>

      {isLoading ? (
        <LoadingSkeleton type="row" count={4} />
      ) : !conferences || conferences.length === 0 ? (
        <EmptyState
          icon={Video}
          heading="No conferences"
          description="No video conferences scheduled."
        />
      ) : (
        <div className="space-y-2">
          {conferences.map((conf) => {
            const isLive = !!conf.started_at && !conf.ended_at
            const isEnded = !!conf.ended_at

            return (
              <div
                key={conf.id}
                className="flex items-center justify-between rounded-lg border border-neutral-100 bg-white p-4 transition-colors hover:bg-neutral-50"
              >
                <div className="flex items-center gap-3">
                  <Video
                    className={`h-5 w-5 shrink-0 ${
                      isLive ? 'text-green-500' : 'text-neutral-400'
                    }`}
                  />
                  <div>
                    <p className="text-sm font-medium text-neutral-800">
                      {conf.title}
                    </p>
                    <div className="mt-0.5 flex items-center gap-3 text-xs text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {conf.participant_count || 0} participants
                      </span>
                      {conf.duration && (
                        <span>{formatDuration(conf.duration)}</span>
                      )}
                      {conf.description && (
                        <span className="hidden sm:inline">
                          {conf.description}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {isLive ? (
                    <>
                      <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-700">
                        Live
                      </span>
                      {conf.join_url && (
                        <a
                          href={conf.join_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-primary-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-700"
                        >
                          Join
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </>
                  ) : (
                    <span className="text-xs text-neutral-400">
                      {isEnded ? 'Ended' : 'Upcoming'}
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
