import { useState } from 'react'
import { Layout, Plus, Users, Clock, FileText, MessageSquare } from 'lucide-react'

type WorkspaceTab = 'active' | 'archived'

const WORKSPACES = [
  { id: 1, name: 'Group Project — Cultural Presentation', course: 'Spanish 101', members: 4, lastActivity: '2 hours ago', files: 12, messages: 34, archived: false },
  { id: 2, name: 'Research Paper Collaboration', course: 'World History', members: 3, lastActivity: '1 day ago', files: 8, messages: 19, archived: false },
  { id: 3, name: 'Lab Report Team', course: 'Chemistry', members: 5, lastActivity: '3 hours ago', files: 6, messages: 47, archived: false },
  { id: 4, name: 'Fall Semester Project', course: 'English Comp', members: 3, lastActivity: '2 months ago', files: 15, messages: 62, archived: true },
]

export function WorkspacesPage() {
  const [tab, setTab] = useState<WorkspaceTab>('active')

  const items = WORKSPACES.filter((w) => tab === 'active' ? !w.archived : w.archived)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Layout className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Workspaces</h3>
            <p className="mt-1 text-sm text-neutral-500">Collaborative spaces for group projects</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Workspace
        </button>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['active', 'archived'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {items.map((ws) => (
          <button key={ws.id} type="button" className="group rounded-lg bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md">
            <h4 className="text-sm font-semibold text-neutral-800 group-hover:text-primary-700">{ws.name}</h4>
            <p className="mt-0.5 text-xs text-primary-600">{ws.course}</p>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400"><Users className="h-3 w-3" />{ws.members} members</div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400"><Clock className="h-3 w-3" />{ws.lastActivity}</div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400"><FileText className="h-3 w-3" />{ws.files} files</div>
              <div className="flex items-center gap-1.5 text-xs text-neutral-400"><MessageSquare className="h-3 w-3" />{ws.messages} messages</div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
