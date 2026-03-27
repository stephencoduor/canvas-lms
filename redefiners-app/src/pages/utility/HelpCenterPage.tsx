import { useState } from 'react'
import { HelpCircle, ChevronDown, ChevronUp, Mail, ExternalLink } from 'lucide-react'

interface FaqItem {
  question: string
  answer: string
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: 'How do I reset my password?',
    answer:
      'Navigate to the Change Password page from your profile settings. Enter your current password and your new password, then confirm the change. If you have forgotten your password, use the "Forgot Password" link on the login page.',
  },
  {
    question: 'How do I enroll in a course?',
    answer:
      'You can browse all available courses from the All Courses page. Click the "View Course" button to see course details. Your instructor or administrator may also send you an enrollment invitation via email.',
  },
  {
    question: 'How do I submit an assignment?',
    answer:
      'Navigate to the assignment within your course, then click the submission area. Depending on the assignment type, you may be able to upload a file, enter text, or provide a URL. Click "Submit" when ready.',
  },
  {
    question: 'Where can I view my grades?',
    answer:
      'Grades are accessible from the Grades page within each course. You can also view your overall performance on the Student Analytics page for a summary across all courses.',
  },
  {
    question: 'How do I contact my instructor?',
    answer:
      'Use the Inbox to send messages to your instructor. You can also post in course discussion forums. Check the course syllabus for office hours and additional contact methods.',
  },
  {
    question: 'How do I change notification preferences?',
    answer:
      'Go to your Account Settings page to manage notification preferences. You can choose which types of notifications you receive and how frequently they are delivered.',
  },
]

const SUPPORT_LINKS = [
  {
    label: 'Canvas Community',
    description: 'Browse guides and community discussions',
    url: 'https://community.canvaslms.com',
  },
  {
    label: 'Canvas Guides',
    description: 'Step-by-step documentation',
    url: 'https://community.canvaslms.com/t5/Canvas/ct-p/canvas',
  },
  {
    label: 'Video Tutorials',
    description: 'Watch how-to videos',
    url: 'https://community.canvaslms.com/t5/Video-Guide/tkb-p/videos',
  },
]

export function HelpCenterPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [contactName, setContactName] = useState('')
  const [contactEmail, setContactEmail] = useState('')
  const [contactMessage, setContactMessage] = useState('')

  function toggleFaq(index: number) {
    setOpenIndex(openIndex === index ? null : index)
  }

  function handleContactSubmit(e: React.FormEvent) {
    e.preventDefault()
    // In production, this would submit to the support API
    setContactName('')
    setContactEmail('')
    setContactMessage('')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="rounded-lg bg-primary-50 p-2.5">
          <HelpCircle className="h-5 w-5 text-primary-600" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Help Center</h3>
          <p className="text-sm text-neutral-500">Find answers and get support</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FAQ Accordion */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">
            Frequently Asked Questions
          </h4>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, index) => (
              <div
                key={item.question}
                className="rounded-lg border border-neutral-100"
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="flex w-full items-center justify-between px-4 py-3 text-left"
                >
                  <span className="text-sm font-medium text-neutral-700">
                    {item.question}
                  </span>
                  {openIndex === index ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-neutral-400" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-neutral-400" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="border-t border-neutral-100 px-4 py-3">
                    <p className="text-sm leading-relaxed text-neutral-600">
                      {item.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {/* Support Links */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-neutral-800">
              Support Resources
            </h4>
            <div className="space-y-2">
              {SUPPORT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-md p-3 transition-colors hover:bg-neutral-50"
                >
                  <div>
                    <p className="text-sm font-medium text-neutral-700">{link.label}</p>
                    <p className="text-xs text-neutral-400">{link.description}</p>
                  </div>
                  <ExternalLink className="h-4 w-4 text-neutral-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-lg bg-white p-5 shadow-sm">
            <h4 className="mb-4 text-lg font-semibold text-neutral-800">
              Contact Support
            </h4>
            <form onSubmit={handleContactSubmit} className="space-y-3">
              <div>
                <label htmlFor="contact-name" className="mb-1 block text-xs font-medium text-neutral-600">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1 block text-xs font-medium text-neutral-600">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-1 block text-xs font-medium text-neutral-600">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm text-neutral-800 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-md bg-primary-600 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
              >
                <Mail className="h-4 w-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
