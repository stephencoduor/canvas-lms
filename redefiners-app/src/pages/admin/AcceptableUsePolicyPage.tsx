import { ShieldCheck, FileText, Users, AlertTriangle } from 'lucide-react'

const SECTIONS = [
  {
    icon: Users,
    title: 'User Responsibilities',
    items: [
      'Use the platform solely for educational purposes as intended by your institution.',
      'Maintain the confidentiality of your login credentials and never share your account.',
      'Respect the intellectual property rights of instructors, students, and third parties.',
      'Communicate respectfully with all members of the learning community.',
    ],
  },
  {
    icon: AlertTriangle,
    title: 'Prohibited Activities',
    items: [
      'Uploading malicious software, viruses, or any harmful code to the platform.',
      'Attempting to gain unauthorized access to other accounts or system resources.',
      'Distributing spam, unsolicited messages, or commercial advertisements.',
      'Engaging in academic dishonesty, including plagiarism and cheating.',
      'Harassing, threatening, or discriminating against any community member.',
    ],
  },
  {
    icon: FileText,
    title: 'Content Guidelines',
    items: [
      'All uploaded content must comply with applicable copyright laws.',
      'Content must be relevant to the educational context of the course.',
      'Offensive, obscene, or inappropriate material is strictly prohibited.',
      'Users retain ownership of original content but grant the platform a license to display it.',
    ],
  },
  {
    icon: ShieldCheck,
    title: 'Privacy & Data Protection',
    items: [
      'Personal data is collected and processed in accordance with our Privacy Policy.',
      'Users should not share personal information of others without consent.',
      'The platform employs industry-standard security measures to protect user data.',
      'Users are responsible for the security of their own devices and connections.',
    ],
  },
]

export function AcceptableUsePolicyPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <ShieldCheck className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary-800">Acceptable Use Policy</h1>
        <p className="mt-2 text-neutral-500">
          Guidelines for responsible use of the learning platform.
        </p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <p className="text-sm leading-relaxed text-neutral-600">
          This Acceptable Use Policy governs the use of the ReDefiners learning management
          platform. By accessing or using the platform, you agree to comply with these
          guidelines. Violations may result in restricted access or account suspension.
        </p>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((section) => (
          <div key={section.title} className="rounded-lg bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-2">
                <section.icon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-lg font-semibold text-neutral-800">{section.title}</h3>
            </div>
            <ul className="space-y-2">
              {section.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-neutral-600">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary-400" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-neutral-50 p-6 text-center">
        <p className="text-xs text-neutral-400">
          Last updated: January 2026. This policy is subject to change. Users will be
          notified of significant updates.
        </p>
      </div>
    </div>
  )
}
