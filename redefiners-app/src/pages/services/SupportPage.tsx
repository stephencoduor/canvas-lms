import { useState } from 'react'
import { LifeBuoy, Search, ChevronDown, ChevronUp, Plus, Clock, CheckCircle2, AlertCircle } from 'lucide-react'

type SupportTab = 'tickets' | 'faq'

const TICKETS = [
  { id: 'TK-1042', subject: 'Cannot access course materials', status: 'open' as const, date: '2026-03-25', priority: 'High' },
  { id: 'TK-1038', subject: 'Grade discrepancy in Spanish 101', status: 'in-progress' as const, date: '2026-03-22', priority: 'Medium' },
  { id: 'TK-1031', subject: 'Password reset not working', status: 'resolved' as const, date: '2026-03-18', priority: 'Low' },
]

const FAQ_ITEMS = [
  { q: 'How do I reset my password?', a: 'Go to Settings > Security and click "Change Password". You\'ll need your current password to set a new one.' },
  { q: 'How do I enroll in a new course?', a: 'Navigate to All Courses and use the enrollment code provided by your instructor, or contact the registrar.' },
  { q: 'Where can I find my grades?', a: 'Your grades are available under each course\'s Grades tab, or view all grades from your Dashboard.' },
  { q: 'How do I contact my instructor?', a: 'Use the Inbox to send a message, or check the course syllabus for office hours and contact info.' },
]

function statusStyle(status: string) {
  switch (status) {
    case 'open': return { icon: AlertCircle, color: 'text-red-600 bg-red-50', label: 'Open' }
    case 'in-progress': return { icon: Clock, color: 'text-amber-600 bg-amber-50', label: 'In Progress' }
    default: return { icon: CheckCircle2, color: 'text-green-600 bg-green-50', label: 'Resolved' }
  }
}

export function SupportPage() {
  const [tab, setTab] = useState<SupportTab>('tickets')
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <LifeBuoy className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Support</h3>
            <p className="mt-1 text-sm text-neutral-500">Submit tickets and browse FAQs</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Ticket
        </button>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['tickets', 'faq'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'tickets' ? 'My Tickets' : 'FAQ'}
          </button>
        ))}
      </div>

      {tab === 'tickets' ? (
        <div className="overflow-hidden rounded-lg bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-neutral-50">
              <tr>
                <th className="px-5 py-3 text-xs font-medium text-neutral-500">ID</th>
                <th className="px-5 py-3 text-xs font-medium text-neutral-500">Subject</th>
                <th className="px-5 py-3 text-xs font-medium text-neutral-500">Status</th>
                <th className="px-5 py-3 text-xs font-medium text-neutral-500">Priority</th>
                <th className="px-5 py-3 text-xs font-medium text-neutral-500">Date</th>
              </tr>
            </thead>
            <tbody>
              {TICKETS.map((t) => {
                const s = statusStyle(t.status)
                return (
                  <tr key={t.id} className="border-b border-neutral-50 hover:bg-neutral-50">
                    <td className="px-5 py-3 font-mono text-xs text-neutral-600">{t.id}</td>
                    <td className="px-5 py-3 text-sm text-neutral-800">{t.subject}</td>
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs ${s.color}`}>
                        <s.icon className="h-3 w-3" />{s.label}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-xs text-neutral-600">{t.priority}</td>
                    <td className="px-5 py-3 text-xs text-neutral-400">{t.date}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input type="text" placeholder="Search FAQs..." className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm" />
          </div>
          {FAQ_ITEMS.map((faq, i) => (
            <div key={i} className="rounded-lg bg-white shadow-sm">
              <button type="button" onClick={() => setExpandedFaq(expandedFaq === i ? null : i)} className="flex w-full items-center justify-between px-5 py-4 text-left">
                <span className="text-sm font-medium text-neutral-800">{faq.q}</span>
                {expandedFaq === i ? <ChevronUp className="h-4 w-4 text-neutral-400" /> : <ChevronDown className="h-4 w-4 text-neutral-400" />}
              </button>
              {expandedFaq === i && <div className="border-t px-5 py-4 text-sm text-neutral-600">{faq.a}</div>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
