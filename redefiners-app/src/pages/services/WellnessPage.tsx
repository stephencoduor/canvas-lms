import { useState } from 'react'
import { Heart, Smile, Frown, Meh, Sun, Moon, Phone, BookOpen, ArrowRight } from 'lucide-react'

const MOODS = [
  { label: 'Great', icon: Smile, color: 'text-green-600 bg-green-50 hover:bg-green-100' },
  { label: 'Good', icon: Smile, color: 'text-blue-600 bg-blue-50 hover:bg-blue-100' },
  { label: 'Okay', icon: Meh, color: 'text-amber-600 bg-amber-50 hover:bg-amber-100' },
  { label: 'Not great', icon: Frown, color: 'text-orange-600 bg-orange-50 hover:bg-orange-100' },
  { label: 'Struggling', icon: Frown, color: 'text-red-600 bg-red-50 hover:bg-red-100' },
]

const RESOURCES = [
  { title: 'Counseling Services', description: 'Free confidential counseling for all students.', icon: Phone, color: 'text-blue-600 bg-blue-50', action: 'Schedule' },
  { title: 'Mindfulness Library', description: 'Guided meditations and breathing exercises.', icon: Sun, color: 'text-amber-600 bg-amber-50', action: 'Explore' },
  { title: 'Sleep Guide', description: 'Tips for better sleep habits and routines.', icon: Moon, color: 'text-indigo-600 bg-indigo-50', action: 'Read' },
  { title: 'Wellness Articles', description: 'Expert articles on student wellness topics.', icon: BookOpen, color: 'text-emerald-600 bg-emerald-50', action: 'Browse' },
]

export function WellnessPage() {
  const [selectedMood, setSelectedMood] = useState<string | null>(null)
  const [checkedIn, setCheckedIn] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Heart className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Wellness</h3>
          <p className="mt-1 text-sm text-neutral-500">Check in on your well-being and find resources</p>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h4 className="text-sm font-semibold text-neutral-800">Daily Check-In</h4>
        <p className="mt-1 text-xs text-neutral-500">How are you feeling today?</p>
        {checkedIn ? (
          <div className="mt-4 rounded-lg bg-green-50 p-4 text-center">
            <Smile className="mx-auto h-8 w-8 text-green-600" />
            <p className="mt-2 text-sm font-medium text-green-800">Thanks for checking in!</p>
            <p className="text-xs text-green-600">Your wellness streak: 5 days</p>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-2">
            {MOODS.map((mood) => (
              <button
                key={mood.label}
                type="button"
                onClick={() => { setSelectedMood(mood.label); setCheckedIn(true) }}
                className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${selectedMood === mood.label ? 'ring-2 ring-primary-400' : ''} ${mood.color}`}
              >
                <mood.icon className="h-4 w-4" /> {mood.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h4 className="mb-3 text-sm font-semibold text-neutral-700">Wellness Resources</h4>
        <div className="grid gap-4 sm:grid-cols-2">
          {RESOURCES.map((r) => (
            <button key={r.title} type="button" className="group flex items-start gap-4 rounded-lg bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md">
              <div className={`shrink-0 rounded-lg p-2.5 ${r.color}`}>
                <r.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-semibold text-neutral-800">{r.title}</h5>
                <p className="mt-0.5 text-xs text-neutral-500">{r.description}</p>
              </div>
              <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-neutral-300 group-hover:text-primary-500" />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
