import { useState } from 'react'
import { MessageCircle, Star, ThumbsUp, ThumbsDown } from 'lucide-react'

type FeedbackTab = 'give' | 'received'

const RECEIVED_FEEDBACK = [
  { id: 1, course: 'Spanish 101', instructor: 'Prof. Martinez', date: '2026-03-20', rating: 5, comment: 'Excellent participation in class discussions.' },
  { id: 2, course: 'World History', instructor: 'Dr. Chen', date: '2026-03-15', rating: 4, comment: 'Great improvement on the last essay. Keep focusing on thesis structure.' },
  { id: 3, course: 'Mathematics', instructor: 'Prof. Adams', date: '2026-03-10', rating: 3, comment: 'Good effort but needs more practice with integration problems.' },
]

export function FeedbackPage() {
  const [tab, setTab] = useState<FeedbackTab>('received')
  const [rating, setRating] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <MessageCircle className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Feedback Hub</h3>
          <p className="mt-1 text-sm text-neutral-500">Give and receive course feedback</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['received', 'give'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'received' ? 'Received Feedback' : 'Give Feedback'}
          </button>
        ))}
      </div>

      {tab === 'received' ? (
        <div className="space-y-4">
          {RECEIVED_FEEDBACK.map((fb) => (
            <div key={fb.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-800">{fb.course}</h4>
                  <p className="text-xs text-neutral-500">{fb.instructor} &middot; {fb.date}</p>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className={`h-4 w-4 ${i < fb.rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-200'}`} />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-neutral-600">{fb.comment}</p>
              <div className="mt-3 flex gap-3">
                <button type="button" className="flex items-center gap-1 text-xs text-neutral-400 hover:text-green-600"><ThumbsUp className="h-3.5 w-3.5" /> Helpful</button>
                <button type="button" className="flex items-center gap-1 text-xs text-neutral-400 hover:text-red-500"><ThumbsDown className="h-3.5 w-3.5" /> Not helpful</button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-6 shadow-sm">
          {submitted ? (
            <div className="py-8 text-center">
              <MessageCircle className="mx-auto h-12 w-12 text-green-500" />
              <h4 className="mt-3 text-lg font-semibold text-neutral-800">Thank you!</h4>
              <p className="mt-1 text-sm text-neutral-500">Your feedback has been submitted successfully.</p>
              <button type="button" onClick={() => { setSubmitted(false); setRating(0) }} className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">Submit Another</button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Course</label>
                <select className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm">
                  <option>Spanish 101</option>
                  <option>World History</option>
                  <option>Mathematics</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700">Rating</label>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }, (_, i) => (
                    <button key={i} type="button" onClick={() => setRating(i + 1)}>
                      <Star className={`h-6 w-6 ${i < rating ? 'fill-amber-400 text-amber-400' : 'text-neutral-300'}`} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700">Comments</label>
                <textarea rows={4} className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm" placeholder="Share your feedback..." />
              </div>
              <button type="button" onClick={() => setSubmitted(true)} className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">Submit Feedback</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
