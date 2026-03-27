import { Building2, Globe, Mail, Phone, MapPin, Clock } from 'lucide-react'

const INSTITUTION_INFO = {
  name: 'ReDefiners World Languages',
  domain: 'learn.redefiners.org',
  email: 'admin@redefiners.org',
  phone: '+1 (305) 555-0100',
  address: '1234 Language Lane, Miami, FL 33101',
  timezone: 'America/New_York',
  language: 'English (US)',
  academicYear: '2025-2026',
}

const STATS = [
  { label: 'Total Students', value: '1,247' },
  { label: 'Total Instructors', value: '86' },
  { label: 'Active Courses', value: '124' },
  { label: 'Sub-Accounts', value: '12' },
]

export function InstitutionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Institution Settings</h3>
          <p className="mt-1 text-sm text-neutral-500">Manage your institution profile and configuration</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.label} className="rounded-lg bg-white p-4 shadow-sm">
            <p className="text-2xl font-bold text-primary-700">{s.value}</p>
            <p className="text-xs text-neutral-500">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        <div className="border-b px-5 py-4">
          <h4 className="text-sm font-semibold text-neutral-800">Institution Details</h4>
        </div>
        <div className="divide-y">
          <div className="flex items-center gap-4 px-5 py-4">
            <Building2 className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Institution Name</p>
              <p className="text-sm font-medium text-neutral-800">{INSTITUTION_INFO.name}</p>
            </div>
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <Globe className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Domain</p>
              <p className="text-sm font-medium text-neutral-800">{INSTITUTION_INFO.domain}</p>
            </div>
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <Mail className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Admin Email</p>
              <p className="text-sm font-medium text-neutral-800">{INSTITUTION_INFO.email}</p>
            </div>
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <Phone className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Phone</p>
              <p className="text-sm font-medium text-neutral-800">{INSTITUTION_INFO.phone}</p>
            </div>
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <MapPin className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Address</p>
              <p className="text-sm font-medium text-neutral-800">{INSTITUTION_INFO.address}</p>
            </div>
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
          </div>
          <div className="flex items-center gap-4 px-5 py-4">
            <Clock className="h-5 w-5 text-neutral-400" />
            <div className="flex-1">
              <p className="text-xs text-neutral-400">Timezone</p>
              <p className="text-sm font-medium text-neutral-800">{INSTITUTION_INFO.timezone}</p>
            </div>
            <button type="button" className="text-xs text-primary-600 hover:text-primary-700">Edit</button>
          </div>
        </div>
      </div>
    </div>
  )
}
