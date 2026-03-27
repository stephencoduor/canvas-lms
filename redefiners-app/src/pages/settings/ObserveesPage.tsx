import { useState } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { apiGet, apiPost, apiDelete } from '@/services/api-client'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { EmptyState } from '@/components/common/EmptyState'
import { Eye, Plus, Trash2, X } from 'lucide-react'

interface Observee {
  id: number
  name: string
  email?: string
  avatar_url?: string
}

export function ObserveesPage() {
  const [showAdd, setShowAdd] = useState(false)
  const [pairingCode, setPairingCode] = useState('')

  const { data: observees, isLoading, refetch } = useQuery<Observee[]>({
    queryKey: ['observees'],
    queryFn: async () => {
      const response = await apiGet<Observee[]>(
        '/v1/users/self/observees',
        { include: ['avatar_url'] },
      )
      return response.data
    },
  })

  const addMutation = useMutation({
    mutationFn: async () => {
      return apiPost('/v1/users/self/observees', {
        pairing_code: pairingCode,
      })
    },
    onSuccess: () => {
      setPairingCode('')
      setShowAdd(false)
      refetch()
    },
  })

  const removeMutation = useMutation({
    mutationFn: async (observeeId: number) => {
      return apiDelete(`/v1/users/self/observees/${observeeId}`)
    },
    onSuccess: () => {
      refetch()
    },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-primary-800">
            Linked Students
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            Manage students you are observing
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Student
        </button>
      </div>

      {showAdd && (
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-semibold text-neutral-700">
            Add Student with Pairing Code
          </h4>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Pairing Code
              </label>
              <input
                value={pairingCode}
                onChange={(e) => setPairingCode(e.target.value)}
                placeholder="Enter 6-digit pairing code"
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="flex items-center gap-2 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <X className="h-4 w-4" />
              Cancel
            </button>
            <button
              type="button"
              onClick={() => addMutation.mutate()}
              disabled={addMutation.isPending || !pairingCode.trim()}
              className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {addMutation.isPending ? 'Adding...' : 'Link Student'}
            </button>
          </div>
          {addMutation.isError && (
            <p className="mt-2 text-sm text-red-600">
              Invalid pairing code. Please try again.
            </p>
          )}
        </div>
      )}

      {isLoading ? (
        <LoadingSkeleton type="row" count={4} />
      ) : !observees || observees.length === 0 ? (
        <EmptyState
          icon={Eye}
          heading="No linked students"
          description="Use a pairing code to link a student to your observer account."
        />
      ) : (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          {observees.map((student) => (
            <div
              key={student.id}
              className="flex items-center justify-between border-b border-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-50"
            >
              <div className="flex items-center gap-3">
                <img
                  src={student.avatar_url || '/images/default-avatar.png'}
                  alt=""
                  className="h-9 w-9 shrink-0 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-neutral-800">
                    {student.name}
                  </p>
                  {student.email && (
                    <p className="text-xs text-neutral-500">{student.email}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeMutation.mutate(student.id)}
                disabled={removeMutation.isPending}
                className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
