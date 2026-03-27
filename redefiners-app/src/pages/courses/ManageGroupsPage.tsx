import { useState } from 'react'
import { useParams } from 'react-router'
import { Users, Plus, Settings, Trash2 } from 'lucide-react'

interface GroupSet {
  id: string
  name: string
  groupCount: number
  assignmentType: 'manual' | 'auto'
  memberCount: number
}

const MOCK_GROUP_SETS: GroupSet[] = [
  { id: '1', name: 'Project Teams', groupCount: 6, assignmentType: 'auto', memberCount: 24 },
  { id: '2', name: 'Lab Partners', groupCount: 12, assignmentType: 'manual', memberCount: 24 },
  { id: '3', name: 'Study Groups', groupCount: 8, assignmentType: 'auto', memberCount: 32 },
]

export function ManageGroupsPage() {
  const { courseId } = useParams()
  const [groupSets] = useState<GroupSet[]>(MOCK_GROUP_SETS)
  const [showForm, setShowForm] = useState(false)
  const [setName, setSetName] = useState('')
  const [numGroups, setNumGroups] = useState('4')
  const [assignType, setAssignType] = useState<'manual' | 'auto'>('auto')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Manage Groups</h3>
            <p className="mt-1 text-sm text-neutral-500">Course {courseId}</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          New Group Set
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Create Group Set</h4>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Group Set Name</label>
              <input
                type="text"
                value={setName}
                onChange={(e) => setSetName(e.target.value)}
                placeholder="e.g., Final Project Teams"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Number of Groups</label>
              <input
                type="number"
                value={numGroups}
                onChange={(e) => setNumGroups(e.target.value)}
                min="1"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">Assignment Method</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={assignType === 'auto'}
                    onChange={() => setAssignType('auto')}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-neutral-700">Auto-assign students</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={assignType === 'manual'}
                    onChange={() => setAssignType('manual')}
                    className="text-primary-600"
                  />
                  <span className="text-sm text-neutral-700">Manual assignment</span>
                </label>
              </div>
            </div>
            <button
              type="button"
              className="rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              Create Group Set
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {groupSets.map((gs) => (
          <div key={gs.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-neutral-800">{gs.name}</h4>
                <p className="mt-1 text-xs text-neutral-500">
                  {gs.groupCount} groups &middot; {gs.memberCount} members &middot;{' '}
                  <span className="capitalize">{gs.assignmentType}</span> assignment
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <Settings className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
