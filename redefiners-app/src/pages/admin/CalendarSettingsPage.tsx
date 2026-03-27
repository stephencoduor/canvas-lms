import { useState } from 'react'
import { Calendar, Save } from 'lucide-react'

const DAYS_OF_WEEK = [
  { value: '0', label: 'Sunday' },
  { value: '1', label: 'Monday' },
  { value: '2', label: 'Saturday' },
]

export function CalendarSettingsPage() {
  const [firstDay, setFirstDay] = useState('0')
  const [showWeekends, setShowWeekends] = useState(true)
  const [defaultView, setDefaultView] = useState('month')
  const [showScheduler, setShowScheduler] = useState(true)
  const [feedEnabled, setFeedEnabled] = useState(true)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Calendar className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Calendar Settings</h3>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              First Day of Week
            </label>
            <select
              value={firstDay}
              onChange={(e) => setFirstDay(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              {DAYS_OF_WEEK.map((day) => (
                <option key={day.value} value={day.value}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Default Calendar View
            </label>
            <select
              value={defaultView}
              onChange={(e) => setDefaultView(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="month">Month</option>
              <option value="week">Week</option>
              <option value="agenda">Agenda</option>
            </select>
          </div>

          <div className="border-t border-neutral-100 pt-5">
            <h4 className="mb-3 text-sm font-semibold text-neutral-800">Display Options</h4>
            <div className="space-y-3">
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Show Weekends</span>
                <button
                  type="button"
                  onClick={() => setShowWeekends(!showWeekends)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    showWeekends ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      showWeekends ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Enable Scheduler</span>
                <button
                  type="button"
                  onClick={() => setShowScheduler(!showScheduler)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    showScheduler ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      showScheduler ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-neutral-700">Calendar Feed (iCal)</span>
                <button
                  type="button"
                  onClick={() => setFeedEnabled(!feedEnabled)}
                  className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                    feedEnabled ? 'bg-primary-600' : 'bg-neutral-300'
                  }`}
                >
                  <span
                    className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                      feedEnabled ? 'translate-x-4' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </label>
            </div>
          </div>

          <div className="border-t border-neutral-100 pt-5">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Calendar Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
