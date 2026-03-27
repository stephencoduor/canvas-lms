import { useState } from 'react'
import { useParams } from 'react-router'
import { UserPlus, CheckCircle2, AlertTriangle } from 'lucide-react'

const ROLES = [
  { value: 'StudentEnrollment', label: 'Student' },
  { value: 'TeacherEnrollment', label: 'Teacher' },
  { value: 'TaEnrollment', label: 'TA' },
  { value: 'ObserverEnrollment', label: 'Observer' },
  { value: 'DesignerEnrollment', label: 'Designer' },
]

const SECTIONS = [
  { value: 'default', label: 'Default Section' },
  { value: 'section-a', label: 'Section A' },
  { value: 'section-b', label: 'Section B' },
]

export function AddPeoplePage() {
  const { courseId } = useParams()
  const [emails, setEmails] = useState('')
  const [role, setRole] = useState('StudentEnrollment')
  const [section, setSection] = useState('default')
  const [validated, setValidated] = useState(false)

  const emailList = emails
    .split(/[\n,;]+/)
    .map((e) => e.trim())
    .filter(Boolean)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <UserPlus className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Add People</h3>
          <p className="mt-1 text-sm text-neutral-500">Course {courseId}</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Email Addresses or Login IDs
            </label>
            <textarea
              value={emails}
              onChange={(e) => {
                setEmails(e.target.value)
                setValidated(false)
              }}
              rows={5}
              placeholder="Enter email addresses or login IDs, one per line or separated by commas..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
            <p className="mt-1 text-xs text-neutral-400">
              {emailList.length} {emailList.length === 1 ? 'entry' : 'entries'} detected
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {ROLES.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Section</label>
              <select
                value={section}
                onChange={(e) => setSection(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              >
                {SECTIONS.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          {validated && emailList.length > 0 && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-800">
                  {emailList.length} {emailList.length === 1 ? 'user' : 'users'} validated
                </span>
              </div>
              <ul className="mt-2 space-y-1">
                {emailList.slice(0, 5).map((email) => (
                  <li key={email} className="text-xs text-emerald-700">{email}</li>
                ))}
                {emailList.length > 5 && (
                  <li className="text-xs text-emerald-600">
                    ... and {emailList.length - 5} more
                  </li>
                )}
              </ul>
            </div>
          )}

          {validated && emailList.length === 0 && (
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                <span className="text-sm text-amber-800">No valid entries found.</span>
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setValidated(true)}
              className="rounded-lg border border-neutral-200 px-5 py-2.5 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              Validate
            </button>
            <button
              type="button"
              disabled={!validated || emailList.length === 0}
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add People
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
