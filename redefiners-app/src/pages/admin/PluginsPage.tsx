import { useState } from 'react'
import { Puzzle, Search } from 'lucide-react'

interface Plugin {
  id: string
  name: string
  description: string
  version: string
  enabled: boolean
}

const INITIAL_PLUGINS: Plugin[] = [
  { id: '1', name: 'Google Drive Integration', description: 'Allow students and teachers to link Google Drive files.', version: '2.3.1', enabled: true },
  { id: '2', name: 'Turnitin Plagiarism Checker', description: 'Automatic plagiarism detection for assignment submissions.', version: '4.1.0', enabled: true },
  { id: '3', name: 'Microsoft Teams Meeting', description: 'Schedule and join Teams meetings from within courses.', version: '1.8.2', enabled: false },
  { id: '4', name: 'YouTube Video Embed', description: 'Embed and track YouTube video views in course content.', version: '1.2.0', enabled: true },
  { id: '5', name: 'Accessibility Checker', description: 'Automatic accessibility checks on uploaded content.', version: '3.0.5', enabled: false },
]

export function PluginsPage() {
  const [plugins, setPlugins] = useState<Plugin[]>(INITIAL_PLUGINS)
  const [filter, setFilter] = useState('')

  const togglePlugin = (id: string) => {
    setPlugins((prev) =>
      prev.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p))
    )
  }

  const filtered = plugins.filter((p) =>
    p.name.toLowerCase().includes(filter.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Puzzle className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Plugins</h3>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter plugins..."
          className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
        />
      </div>

      <div className="space-y-3">
        {filtered.map((plugin) => (
          <div key={plugin.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-semibold text-neutral-800">{plugin.name}</h4>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500">
                    v{plugin.version}
                  </span>
                </div>
                <p className="mt-1 text-xs text-neutral-500">{plugin.description}</p>
              </div>
              <button
                type="button"
                onClick={() => togglePlugin(plugin.id)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                  plugin.enabled ? 'bg-primary-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                    plugin.enabled ? 'translate-x-4' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
