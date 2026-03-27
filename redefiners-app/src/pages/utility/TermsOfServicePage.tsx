import { ScrollText } from 'lucide-react'

const SECTIONS = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By accessing and using this learning management system, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this platform.',
  },
  {
    title: '2. User Accounts',
    content:
      'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account or any other breach of security.',
  },
  {
    title: '3. Acceptable Use',
    content:
      'You agree to use the platform only for lawful educational purposes. You may not use the platform to upload, share, or distribute content that is illegal, harmful, threatening, abusive, harassing, defamatory, or otherwise objectionable.',
  },
  {
    title: '4. Intellectual Property',
    content:
      'Course content, materials, and resources provided through this platform are protected by copyright and other intellectual property laws. You may not reproduce, distribute, or create derivative works without explicit permission from the content owner.',
  },
  {
    title: '5. Privacy',
    content:
      'Your use of the platform is also governed by our Privacy Policy. We collect and process personal data in accordance with applicable data protection regulations, including FERPA for educational records.',
  },
  {
    title: '6. Disclaimer of Warranties',
    content:
      'The platform is provided on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the reliability, accuracy, or availability of the platform or its content.',
  },
  {
    title: '7. Limitation of Liability',
    content:
      'In no event shall the platform operators be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the platform.',
  },
  {
    title: '8. Modifications',
    content:
      'We reserve the right to modify these terms at any time. Continued use of the platform after changes constitute acceptance of the modified terms. Users will be notified of significant changes.',
  },
]

export function TermsOfServicePage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <ScrollText className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary-800">Terms of Service</h1>
        <p className="mt-2 text-neutral-500">
          Last updated: March 2026
        </p>
      </div>

      <div className="rounded-lg bg-white shadow-sm">
        {SECTIONS.map((section, index) => (
          <div
            key={section.title}
            className={`px-6 py-5 ${index < SECTIONS.length - 1 ? 'border-b border-neutral-100' : ''}`}
          >
            <h3 className="mb-2 text-sm font-semibold text-neutral-800">
              {section.title}
            </h3>
            <p className="text-sm leading-relaxed text-neutral-600">
              {section.content}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
