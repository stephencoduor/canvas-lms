import { useState } from 'react'
import { DoorClosed, Clock, Users, Monitor, Wifi, CheckCircle2 } from 'lucide-react'

const ROOMS = [
  { id: 1, name: 'Library Study Room A', capacity: 6, floor: '2nd Floor', amenities: ['Whiteboard', 'Wi-Fi', 'Power outlets'], available: true },
  { id: 2, name: 'Library Study Room B', capacity: 8, floor: '2nd Floor', amenities: ['Projector', 'Whiteboard', 'Wi-Fi'], available: true },
  { id: 3, name: 'Student Center — Meeting Room 1', capacity: 12, floor: '1st Floor', amenities: ['TV Screen', 'Video conferencing', 'Wi-Fi'], available: false },
  { id: 4, name: 'Language Lab — Practice Booth 1', capacity: 2, floor: '3rd Floor', amenities: ['Audio equipment', 'Sound proofing'], available: true },
  { id: 5, name: 'Language Lab — Practice Booth 2', capacity: 2, floor: '3rd Floor', amenities: ['Audio equipment', 'Sound proofing'], available: true },
  { id: 6, name: 'Computer Lab C', capacity: 20, floor: '1st Floor', amenities: ['Desktop computers', 'Printer', 'Wi-Fi'], available: false },
]

const TIME_SLOTS = ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM']

export function RoomBookingPage() {
  const [selectedDate, setSelectedDate] = useState('2026-03-28')
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <DoorClosed className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Room Booking</h3>
          <p className="mt-1 text-sm text-neutral-500">Reserve study rooms and meeting spaces</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-neutral-700">Date:</label>
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="rounded-lg border border-neutral-200 px-3 py-2 text-sm" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-neutral-700">Available Rooms</h4>
          {ROOMS.map((room) => (
            <button
              key={room.id}
              type="button"
              onClick={() => room.available && setSelectedRoom(room.id)}
              disabled={!room.available}
              className={`w-full rounded-lg bg-white p-4 text-left shadow-sm transition-all disabled:cursor-not-allowed disabled:opacity-50 ${selectedRoom === room.id ? 'ring-2 ring-primary-400' : 'hover:shadow-md'}`}
            >
              <div className="flex items-start justify-between">
                <h5 className="text-sm font-semibold text-neutral-800">{room.name}</h5>
                <span className={`rounded-full px-2 py-0.5 text-xs ${room.available ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                  {room.available ? 'Available' : 'Booked'}
                </span>
              </div>
              <p className="text-xs text-neutral-400">{room.floor}</p>
              <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" />{room.capacity} seats</span>
                {room.amenities.includes('Wi-Fi') && <span className="flex items-center gap-1"><Wifi className="h-3 w-3" />Wi-Fi</span>}
                {(room.amenities.includes('Projector') || room.amenities.includes('TV Screen')) && <span className="flex items-center gap-1"><Monitor className="h-3 w-3" />Display</span>}
              </div>
            </button>
          ))}
        </div>

        <div>
          <h4 className="mb-3 text-sm font-semibold text-neutral-700">Select Time Slot</h4>
          {selectedRoom ? (
            <div className="space-y-2">
              {TIME_SLOTS.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedSlot(slot)}
                  className={`flex w-full items-center gap-3 rounded-lg bg-white px-4 py-3 shadow-sm transition-all ${selectedSlot === slot ? 'ring-2 ring-primary-400' : 'hover:shadow-md'}`}
                >
                  <Clock className="h-4 w-4 text-neutral-400" />
                  <span className="text-sm text-neutral-700">{slot} — {slot.replace(/\d+/, (m) => String(Number(m) + 1))}</span>
                  {selectedSlot === slot && <CheckCircle2 className="ml-auto h-4 w-4 text-primary-600" />}
                </button>
              ))}
              {selectedSlot && (
                <button type="button" className="mt-4 w-full rounded-lg bg-primary-600 py-2.5 text-sm font-medium text-white hover:bg-primary-700">
                  Confirm Booking
                </button>
              )}
            </div>
          ) : (
            <div className="flex h-48 items-center justify-center rounded-lg bg-neutral-50">
              <p className="text-sm text-neutral-400">Select a room to view available time slots</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
