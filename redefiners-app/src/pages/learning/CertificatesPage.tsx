import { Medal, Download, Share2, Calendar } from 'lucide-react'

const CERTIFICATES = [
  { id: 1, title: 'Spanish Language Basics', issuer: 'ReDefiners World Languages', date: '2026-02-15', type: 'Certificate', image: 'certificate' },
  { id: 2, title: 'Cultural Competency Level 1', issuer: 'Global Education Institute', date: '2026-01-20', type: 'Badge', image: 'badge' },
  { id: 3, title: 'Academic Writing Excellence', issuer: 'ReDefiners World Languages', date: '2025-12-10', type: 'Certificate', image: 'certificate' },
  { id: 4, title: 'Peer Mentor Training', issuer: 'Student Services', date: '2025-11-05', type: 'Badge', image: 'badge' },
]

export function CertificatesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Medal className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Certificates &amp; Badges</h3>
          <p className="mt-1 text-sm text-neutral-500">Your earned credentials and achievements</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg bg-primary-50 p-4">
          <p className="text-2xl font-bold text-primary-700">{CERTIFICATES.filter((c) => c.type === 'Certificate').length}</p>
          <p className="text-xs text-primary-600">Certificates Earned</p>
        </div>
        <div className="rounded-lg bg-amber-50 p-4">
          <p className="text-2xl font-bold text-amber-700">{CERTIFICATES.filter((c) => c.type === 'Badge').length}</p>
          <p className="text-xs text-amber-600">Badges Earned</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {CERTIFICATES.map((cert) => (
          <div key={cert.id} className="rounded-lg bg-white p-5 shadow-sm">
            <div className="flex items-start gap-4">
              <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${cert.type === 'Certificate' ? 'bg-primary-100 text-primary-600' : 'bg-amber-100 text-amber-600'}`}>
                <Medal className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-semibold text-neutral-800">{cert.title}</h4>
                <p className="text-xs text-neutral-500">{cert.issuer}</p>
                <div className="mt-1 flex items-center gap-1 text-xs text-neutral-400">
                  <Calendar className="h-3 w-3" />
                  Issued {cert.date}
                </div>
                <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium ${cert.type === 'Certificate' ? 'bg-primary-50 text-primary-700' : 'bg-amber-50 text-amber-700'}`}>
                  {cert.type}
                </span>
              </div>
            </div>
            <div className="mt-4 flex gap-2 border-t pt-3">
              <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
                <Download className="h-3.5 w-3.5" /> Download
              </button>
              <button type="button" className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs text-neutral-600 hover:bg-neutral-50">
                <Share2 className="h-3.5 w-3.5" /> Share
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
