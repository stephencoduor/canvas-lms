import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useMutation } from '@tanstack/react-query'
import { apiPost } from '@/services/api-client'
import { Save, X, Plus, Trash2 } from 'lucide-react'

interface TimeSlot {
  id: string
  start: string
  end: string
}

export function AppointmentGroupPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [location, setLocation] = useState('')
  const [maxParticipants, setMaxParticipants] = useState(1)
  const [slots, setSlots] = useState<TimeSlot[]>([
    { id: '1', start: '', end: '' },
  ])

  const addSlot = () => {
    setSlots((prev) => [
      ...prev,
      { id: String(Date.now()), start: '', end: '' },
    ])
  }

  const removeSlot = (id: string) => {
    setSlots((prev) => prev.filter((s) => s.id !== id))
  }

  const updateSlot = (id: string, field: 'start' | 'end', value: string) => {
    setSlots((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    )
  }

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        appointment_group: {
          title,
          location_name: location,
          participant_visibility: 'protected',
          max_appointments_per_participant: maxParticipants,
          new_appointments: slots
            .filter((s) => s.start && s.end)
            .map((s) => [
              new Date(s.start).toISOString(),
              new Date(s.end).toISOString(),
            ]),
        },
      }
      return apiPost('/v1/appointment_groups', payload)
    },
    onSuccess: () => {
      navigate('/calendar')
    },
  })

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-primary-800">
        New Appointment Group
      </h3>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          saveMutation.mutate()
        }}
        className="space-y-5"
      >
        {/* Details */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Title
              </label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Location
              </label>
              <input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700">
                Max Participants Per Slot
              </label>
              <input
                type="number"
                min={1}
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                className="w-40 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Time Slots */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-sm font-semibold text-neutral-700">
              Time Slots
            </h4>
            <button
              type="button"
              onClick={addSlot}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Slot
            </button>
          </div>
          <div className="space-y-3">
            {slots.map((slot) => (
              <div key={slot.id} className="flex items-center gap-3">
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-neutral-500">
                    Start
                  </label>
                  <input
                    type="datetime-local"
                    value={slot.start}
                    onChange={(e) => updateSlot(slot.id, 'start', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="mb-1 block text-xs text-neutral-500">
                    End
                  </label>
                  <input
                    type="datetime-local"
                    value={slot.end}
                    onChange={(e) => updateSlot(slot.id, 'end', e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeSlot(slot.id)}
                  disabled={slots.length <= 1}
                  className="mt-5 rounded-lg p-2 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:opacity-30"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          {saveMutation.isError && (
            <p className="mr-auto text-sm text-red-600">
              Failed to save. Please try again.
            </p>
          )}
          <button
            type="button"
            onClick={() => navigate('/calendar')}
            className="flex items-center gap-2 rounded-lg border border-neutral-300 px-5 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saveMutation.isPending || !title.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saveMutation.isPending ? 'Saving...' : 'Create'}
          </button>
        </div>
      </form>
    </div>
  )
}
