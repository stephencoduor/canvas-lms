import { useState } from 'react'
import { HardDrive, Download, Upload, Clock, CheckCircle2, AlertCircle, Play } from 'lucide-react'

type BackupTab = 'backups' | 'restore'

const BACKUPS = [
  { id: 1, name: 'Full Backup — 2026-03-25', date: '2026-03-25 02:00 AM', size: '4.2 GB', status: 'completed' as const, type: 'Automatic' },
  { id: 2, name: 'Full Backup — 2026-03-24', date: '2026-03-24 02:00 AM', size: '4.1 GB', status: 'completed' as const, type: 'Automatic' },
  { id: 3, name: 'Manual Backup — Pre-Migration', date: '2026-03-20 10:30 AM', size: '4.0 GB', status: 'completed' as const, type: 'Manual' },
  { id: 4, name: 'Full Backup — 2026-03-18', date: '2026-03-18 02:00 AM', size: '3.9 GB', status: 'completed' as const, type: 'Automatic' },
]

export function BackupPage() {
  const [tab, setTab] = useState<BackupTab>('backups')
  const [backing, setBacking] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <HardDrive className="h-6 w-6 text-primary-600" />
          <div>
            <h3 className="text-2xl font-bold text-primary-800">Backup &amp; Restore</h3>
            <p className="mt-1 text-sm text-neutral-500">Manage system backups and restore points</p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => { setBacking(true); setTimeout(() => setBacking(false), 3000) }}
          disabled={backing}
          className="flex items-center gap-1.5 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700 disabled:opacity-50"
        >
          {backing ? <><Clock className="h-4 w-4 animate-spin" /> Backing up...</> : <><Play className="h-4 w-4" /> Create Backup</>}
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-400">Last Backup</p>
          <p className="text-sm font-semibold text-neutral-800">Today 2:00 AM</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-400">Total Storage Used</p>
          <p className="text-sm font-semibold text-neutral-800">16.2 GB</p>
        </div>
        <div className="rounded-lg bg-white p-4 shadow-sm">
          <p className="text-xs text-neutral-400">Retention Policy</p>
          <p className="text-sm font-semibold text-neutral-800">30 days</p>
        </div>
      </div>

      <div className="flex gap-1 rounded-lg bg-neutral-100 p-1">
        {(['backups', 'restore'] as const).map((t) => (
          <button key={t} type="button" onClick={() => setTab(t)} className={`rounded-md px-4 py-2 text-sm font-medium capitalize transition-colors ${tab === t ? 'bg-white text-primary-700 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 'backups' ? (
        <div className="space-y-2">
          {BACKUPS.map((b) => (
            <div key={b.id} className="flex items-center gap-4 rounded-lg bg-white px-5 py-4 shadow-sm">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-neutral-800">{b.name}</h4>
                <div className="mt-0.5 flex gap-3 text-xs text-neutral-400">
                  <span>{b.date}</span>
                  <span>{b.size}</span>
                  <span className="rounded bg-neutral-100 px-1.5 py-0.5">{b.type}</span>
                </div>
              </div>
              <button type="button" className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-50 hover:text-primary-600"><Download className="h-4 w-4" /></button>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-lg bg-white p-8 shadow-sm">
          <div className="flex flex-col items-center rounded-lg border-2 border-dashed border-neutral-200 px-6 py-12">
            <Upload className="h-12 w-12 text-neutral-300" />
            <p className="mt-3 text-sm font-medium text-neutral-700">Upload a backup file to restore</p>
            <p className="mt-1 text-xs text-neutral-400">.tar.gz or .sql backup files</p>
            <div className="mt-4 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <p className="text-xs text-amber-600">Restoring will overwrite current data. This action cannot be undone.</p>
            </div>
            <button type="button" className="mt-4 rounded-lg bg-primary-600 px-4 py-2 text-sm text-white hover:bg-primary-700">Select Backup File</button>
          </div>
        </div>
      )}
    </div>
  )
}
