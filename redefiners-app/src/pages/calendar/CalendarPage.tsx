import { useState, useMemo } from 'react'
import { useCalendarEvents } from '@/hooks/useCalendar'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function formatMonthYear(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
}

function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`
}

function toDateString(d: Date): string {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const startDate = `${year}-${pad(month + 1)}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const endDate = `${year}-${pad(month + 1)}-${pad(lastDay)}`

  const { data: events, isLoading } = useCalendarEvents(startDate, endDate)

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof events>()
    if (!events) return map
    for (const event of events) {
      const dateStr = event.start_at?.split('T')[0]
      if (!dateStr) continue
      const existing = map.get(dateStr) ?? []
      existing.push(event)
      map.set(dateStr, existing)
    }
    return map
  }, [events])

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)
  while (cells.length % 7 !== 0) cells.push(null)

  const today = toDateString(new Date())

  function prevMonth() {
    setCurrentDate(new Date(year, month - 1, 1))
  }
  function nextMonth() {
    setCurrentDate(new Date(year, month + 1, 1))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-primary-800">Calendar</h3>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={prevMonth}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="min-w-[160px] text-center text-sm font-semibold text-neutral-800">
            {formatMonthYear(currentDate)}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-neutral-100"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {isLoading ? (
        <LoadingSkeleton type="card" count={1} />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {/* Day headers */}
          <div className="grid grid-cols-7 border-b border-neutral-200">
            {DAYS.map((day) => (
              <div
                key={day}
                className="px-2 py-2.5 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7">
            {cells.map((day, idx) => {
              if (day === null) {
                return (
                  <div
                    key={`empty-${idx}`}
                    className="min-h-[80px] border-b border-r border-neutral-100 bg-neutral-50"
                  />
                )
              }

              const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
              const dayEvents = eventsByDate.get(dateStr) ?? []
              const isToday = dateStr === today

              return (
                <div
                  key={day}
                  className={`min-h-[80px] border-b border-r border-neutral-100 p-1.5 ${
                    isToday ? 'bg-primary-50' : ''
                  }`}
                >
                  <span
                    className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                      isToday
                        ? 'bg-primary-600 text-white'
                        : 'text-neutral-700'
                    }`}
                  >
                    {day}
                  </span>
                  <div className="mt-0.5 space-y-0.5">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className="truncate rounded bg-primary-100 px-1 py-0.5 text-[10px] font-medium text-primary-700"
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="px-1 text-[10px] text-neutral-400">
                        +{dayEvents.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
