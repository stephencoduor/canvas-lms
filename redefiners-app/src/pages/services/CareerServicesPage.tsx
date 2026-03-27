import { Briefcase, MapPin, Clock, ExternalLink, FileText, Users, ArrowRight } from 'lucide-react'
import { useState } from 'react'

type CareerTab = 'jobs' | 'resources'

const JOB_LISTINGS = [
  { id: 1, title: 'Teaching Assistant — Spanish', org: 'ReDefiners Language Center', location: 'Miami, FL', type: 'Part-time', posted: '2 days ago', description: 'Assist lead instructor with Spanish classes for K-8 students.' },
  { id: 2, title: 'Summer Intern — Translation', org: 'Global Connect Corp', location: 'Remote', type: 'Internship', posted: '5 days ago', description: 'Translate materials between English and Spanish/Mandarin.' },
  { id: 3, title: 'Community Outreach Coordinator', org: 'Language Bridge Foundation', location: 'Orlando, FL', type: 'Full-time', posted: '1 week ago', description: 'Coordinate multilingual community education programs.' },
]

const RESOURCES = [
  { id: 1, title: 'Resume Builder', description: 'Create a professional resume with our guided builder.', icon: FileText, color: 'text-blue-600 bg-blue-50' },
  { id: 2, title: 'Mock Interviews', description: 'Practice with AI-powered interview simulations.', icon: Users, color: 'text-purple-600 bg-purple-50' },
  { id: 3, title: 'Career Assessment', description: 'Discover career paths that match your skills and interests.', icon: Briefcase, color: 'text-emerald-600 bg-emerald-50' },
]

export function CareerServicesPage() {
  const [tab, setTab] = useState<CareerTab>('jobs')

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Briefcase className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Career Services</h3>
          <p className="mt-1 text-sm text-neutral-500">Job listings and career development resources</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['jobs', 'resources'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'jobs' ? 'Job Listings' : 'Career Resources'}
          </button>
        ))}
      </div>

      {tab === 'jobs' ? (
        <div className="space-y-4">
          {JOB_LISTINGS.map((job) => (
            <div key={job.id} className="rounded-lg bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-neutral-800">{job.title}</h4>
                  <p className="text-xs font-medium text-primary-600">{job.org}</p>
                </div>
                <span className="rounded-full bg-primary-50 px-2.5 py-0.5 text-xs font-medium text-primary-700">{job.type}</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{job.description}</p>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{job.location}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{job.posted}</span>
                </div>
                <button type="button" className="flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700">
                  Apply <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {RESOURCES.map((r) => (
            <button key={r.id} type="button" className="group rounded-lg bg-white p-5 text-left shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between">
                <div className={`rounded-lg p-2.5 ${r.color}`}>
                  <r.icon className="h-5 w-5" />
                </div>
                <ArrowRight className="h-4 w-4 text-neutral-300 transition-colors group-hover:text-primary-500" />
              </div>
              <h4 className="mt-3 text-sm font-semibold text-neutral-800">{r.title}</h4>
              <p className="mt-1 text-xs text-neutral-500">{r.description}</p>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
