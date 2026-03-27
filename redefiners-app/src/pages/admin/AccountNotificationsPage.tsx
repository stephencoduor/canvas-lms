import { useState } from 'react'
import { Bell, Plus, Trash2, Send } from 'lucide-react'

interface Announcement {
  id: string
  subject: string
  message: string
  startDate: string
  endDate: string
  roles: string[]
}

const MOCK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    subject: 'System Maintenance Scheduled',
    message: 'The platform will undergo maintenance on Saturday from 2:00 AM to 6:00 AM EST.',
    startDate: '2026-03-20',
    endDate: '2026-03-28',
    roles: ['StudentEnrollment', 'TeacherEnrollment', 'AccountAdmin'],
  },
  {
    id: '2',
    subject: 'New Feature: Improved Gradebook',
    message: 'We have released a new gradebook interface with enhanced filtering and sorting capabilities.',
    startDate: '2026-03-15',
    endDate: '2026-04-15',
    roles: ['TeacherEnrollment'],
  },
]

const AVAILABLE_ROLES = [
  { value: 'StudentEnrollment', label: 'Students' },
  { value: 'TeacherEnrollment', label: 'Teachers' },
  { value: 'TaEnrollment', label: 'TAs' },
  { value: 'ObserverEnrollment', label: 'Observers' },
  { value: 'AccountAdmin', label: 'Admins' },
]

export function AccountNotificationsPage() {
  const [announcements] = useState<Announcement[]>(MOCK_ANNOUNCEMENTS)
  const [showForm, setShowForm] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [selectedRoles, setSelectedRoles] = useState<string[]>([])

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bell className="h-6 w-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-800">Global Announcements</h3>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Announcement
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Create Announcement</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Announcement subject..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="Announcement message..."
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Target Roles</label>
              <div className="flex flex-wrap gap-2">
                {AVAILABLE_ROLES.map((role) => (
                  <button
                    key={role.value}
                    type="button"
                    onClick={() => toggleRole(role.value)}
                    className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                      selectedRoles.includes(role.value)
                        ? 'bg-primary-100 text-primary-700'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {role.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Send className="h-4 w-4" />
              Publish Announcement
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-neutral-800">Active Announcements</h4>
        {announcements.map((ann) => (
          <div key={ann.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <h5 className="text-sm font-semibold text-neutral-800">{ann.subject}</h5>
                <p className="mt-1 text-sm text-neutral-600">{ann.message}</p>
                <div className="mt-3 flex items-center gap-4">
                  <span className="text-xs text-neutral-400">
                    {ann.startDate} to {ann.endDate}
                  </span>
                  <div className="flex gap-1">
                    {ann.roles.map((role) => (
                      <span
                        key={role}
                        className="rounded-full bg-primary-50 px-2 py-0.5 text-xs text-primary-600"
                      >
                        {AVAILABLE_ROLES.find((r) => r.value === role)?.label ?? role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
