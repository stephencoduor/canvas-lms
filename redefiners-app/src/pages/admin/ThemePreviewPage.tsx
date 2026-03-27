import { Palette, BookOpen, Users, Bell, FileText, CheckCircle2 } from 'lucide-react'

export function ThemePreviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Palette className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Theme Preview</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Preview how your theme looks with sample components
          </p>
        </div>
      </div>

      {/* Sample Buttons */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Buttons</h4>
        <div className="flex flex-wrap gap-3">
          <button type="button" className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700">
            Primary
          </button>
          <button type="button" className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
            Success
          </button>
          <button type="button" className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white hover:bg-amber-700">
            Warning
          </button>
          <button type="button" className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700">
            Danger
          </button>
          <button type="button" className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50">
            Secondary
          </button>
        </div>
      </div>

      {/* Sample Cards */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Stat Cards</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: 'Active Courses', value: '12', icon: BookOpen, color: 'text-blue-600 bg-blue-50' },
            { label: 'Students', value: '234', icon: Users, color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Notifications', value: '8', icon: Bell, color: 'text-amber-600 bg-amber-50' },
            { label: 'Submissions', value: '56', icon: FileText, color: 'text-purple-600 bg-purple-50' },
          ].map((card) => (
            <div key={card.label} className="rounded-lg border border-neutral-100 p-4">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2 ${card.color}`}>
                  <card.icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs text-neutral-500">{card.label}</p>
                  <p className="text-lg font-bold text-neutral-800">{card.value}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Navigation */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Navigation Bar</h4>
        <div className="rounded-lg bg-primary-800 px-4 py-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-white">ReDefiners LMS</span>
            <div className="flex gap-4">
              <span className="border-b-2 border-white pb-1 text-xs font-medium text-white">Dashboard</span>
              <span className="text-xs text-primary-200">Courses</span>
              <span className="text-xs text-primary-200">Calendar</span>
              <span className="text-xs text-primary-200">Inbox</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sample Form */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Form Elements</h4>
        <div className="max-w-md space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Text Input</label>
            <input
              type="text"
              placeholder="Sample input..."
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">Select</label>
            <select className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
        </div>
      </div>

      {/* Sample Alert */}
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Alerts</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3 rounded-lg bg-emerald-50 p-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span className="text-sm text-emerald-800">Success message - changes saved.</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-amber-50 p-4">
            <Bell className="h-5 w-5 text-amber-600" />
            <span className="text-sm text-amber-800">Warning message - review required.</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg bg-red-50 p-4">
            <FileText className="h-5 w-5 text-red-600" />
            <span className="text-sm text-red-800">Error message - submission failed.</span>
          </div>
        </div>
      </div>
    </div>
  )
}
