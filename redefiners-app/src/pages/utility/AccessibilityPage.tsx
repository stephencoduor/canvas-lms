import { Accessibility, Keyboard, Monitor, Eye } from 'lucide-react'

const FEATURES = [
  {
    icon: Keyboard,
    title: 'Keyboard Navigation',
    description:
      'All interactive elements are fully accessible via keyboard. Use Tab to navigate between elements, Enter or Space to activate, and Escape to close dialogs.',
  },
  {
    icon: Monitor,
    title: 'Screen Reader Support',
    description:
      'Our application is built with semantic HTML and ARIA attributes to ensure compatibility with popular screen readers including JAWS, NVDA, and VoiceOver.',
  },
  {
    icon: Eye,
    title: 'Visual Accessibility',
    description:
      'We maintain a minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text. The interface supports browser zoom up to 200% without loss of content.',
  },
  {
    icon: Accessibility,
    title: 'WCAG 2.1 Compliance',
    description:
      'We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA standards across all pages and features of the application.',
  },
]

export function AccessibilityPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8 py-8">
      <div className="text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary-50">
          <Accessibility className="h-8 w-8 text-primary-600" />
        </div>
        <h1 className="text-3xl font-bold text-primary-800">Accessibility Statement</h1>
        <p className="mt-2 text-neutral-500">
          We are committed to ensuring digital accessibility for all users.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {FEATURES.map((feature) => (
          <div key={feature.title} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center gap-3">
              <div className="rounded-lg bg-primary-50 p-2">
                <feature.icon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-sm font-semibold text-neutral-800">{feature.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-neutral-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <h3 className="mb-3 text-lg font-semibold text-neutral-800">
          Reporting Accessibility Issues
        </h3>
        <p className="text-sm leading-relaxed text-neutral-600">
          If you encounter any accessibility barriers while using our platform, please
          contact our support team. We take all feedback seriously and will work to
          address any issues promptly. You can reach us through the Help Center or by
          emailing our accessibility team directly.
        </p>
      </div>
    </div>
  )
}
