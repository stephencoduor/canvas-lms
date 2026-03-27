import { useState } from 'react'
import { Users, Plus, Search, MapPin, Clock, UserPlus } from 'lucide-react'

const GROUPS = [
  { id: 1, name: 'Spanish 101 Study Group', members: 8, maxMembers: 10, course: 'Spanish 101', meetTime: 'Tuesdays 4 PM', location: 'Library Room 3', joined: true },
  { id: 2, name: 'History Exam Prep', members: 5, maxMembers: 8, course: 'World History', meetTime: 'Thursdays 6 PM', location: 'Student Center', joined: false },
  { id: 3, name: 'Math Problem Solving', members: 6, maxMembers: 6, course: 'Calculus II', meetTime: 'Mondays 3 PM', location: 'Math Lab', joined: false },
  { id: 4, name: 'Language Exchange Club', members: 12, maxMembers: 20, course: 'Cross-course', meetTime: 'Fridays 5 PM', location: 'Virtual (Zoom)', joined: true },
  { id: 5, name: 'Writing Workshop', members: 4, maxMembers: 8, course: 'English Comp', meetTime: 'Wednesdays 2 PM', location: 'Humanities 201', joined: false },
]

export function StudyGroupsPage() {
  const [search, setSearch] = useState('')

  const filtered = GROUPS.filter((g) => !search || g.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Study Groups</h3>
            <p className="mt-1 text-sm text-neutral-500">Find or create study groups for your courses</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> Create Group
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search study groups..." className="w-full rounded-lg border border-neutral-200 py-2 pl-10 pr-4 text-sm" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((group) => {
          const full = group.members >= group.maxMembers
          return (
            <div key={group.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <h4 className="text-sm font-semibold text-neutral-800">{group.name}</h4>
                {group.joined && <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs text-green-700">Joined</span>}
              </div>
              <p className="mt-1 text-xs text-primary-600">{group.course}</p>
              <div className="mt-3 space-y-1.5 text-xs text-neutral-400">
                <div className="flex items-center gap-1.5"><Clock className="h-3 w-3" />{group.meetTime}</div>
                <div className="flex items-center gap-1.5"><MapPin className="h-3 w-3" />{group.location}</div>
                <div className="flex items-center gap-1.5"><Users className="h-3 w-3" />{group.members}/{group.maxMembers} members</div>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-neutral-100">
                <div className={`h-1.5 rounded-full ${full ? 'bg-red-400' : 'bg-primary-500'}`} style={{ width: `${(group.members / group.maxMembers) * 100}%` }} />
              </div>
              {!group.joined && (
                <button type="button" disabled={full} className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary-50 py-2 text-xs font-medium text-primary-700 hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50">
                  <UserPlus className="h-3.5 w-3.5" /> {full ? 'Group Full' : 'Join Group'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
