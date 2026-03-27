import { useState } from 'react'
import { Video, Upload, Play, Clock, HardDrive, Trash2, Plus } from 'lucide-react'

type VideoTab = 'recordings' | 'upload'

const RECORDINGS = [
  { id: 1, title: 'Week 5 Lecture — Verb Conjugation', duration: '42:15', size: '320 MB', date: '2026-03-22', thumbnail: 'lecture' },
  { id: 2, title: 'Student Presentation — Cultural Project', duration: '15:30', size: '115 MB', date: '2026-03-20', thumbnail: 'presentation' },
  { id: 3, title: 'Lab Session — Conversation Practice', duration: '28:45', size: '210 MB', date: '2026-03-18', thumbnail: 'lab' },
  { id: 4, title: 'Office Hours Recording — Q&A', duration: '35:00', size: '265 MB', date: '2026-03-15', thumbnail: 'office' },
]

export function VideoStudioPage() {
  const [tab, setTab] = useState<VideoTab>('recordings')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Video className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Video Studio</h3>
            <p className="mt-1 text-sm text-neutral-500">Record, upload, and manage video content</p>
          </div>
        </div>
        <button type="button" className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">
          <Plus className="h-4 w-4" /> New Recording
        </button>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['recordings', 'upload'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t === 'recordings' ? 'My Recordings' : 'Upload'}
          </button>
        ))}
      </div>

      {tab === 'recordings' ? (
        <div className="grid gap-4 sm:grid-cols-2">
          {RECORDINGS.map((rec) => (
            <div key={rec.id} className="overflow-hidden rounded-lg bg-white shadow-sm">
              <div className="flex h-40 items-center justify-center bg-neutral-800">
                <button type="button" className="rounded-full bg-white/20 p-3 transition-colors hover:bg-white/30">
                  <Play className="h-6 w-6 text-white" />
                </button>
              </div>
              <div className="p-4">
                <h4 className="text-sm font-semibold text-neutral-800">{rec.title}</h4>
                <div className="mt-2 flex items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{rec.duration}</span>
                  <span className="flex items-center gap-1"><HardDrive className="h-3 w-3" />{rec.size}</span>
                  <span>{rec.date}</span>
                </div>
                <div className="mt-3 flex gap-2">
                  <button type="button" className="rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-medium text-primary-700 hover:bg-primary-100">Share</button>
                  <button type="button" className="rounded-lg p-1.5 text-neutral-400 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-neutral-200 px-6 py-12">
            <Upload className="h-12 w-12 text-neutral-300" />
            <p className="mt-3 text-sm font-medium text-neutral-700">Drop your video files here</p>
            <p className="mt-1 text-xs text-neutral-400">MP4, MOV, or WebM up to 2 GB</p>
            <button type="button" className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">Browse Files</button>
          </div>
        </div>
      )}
    </div>
  )
}
