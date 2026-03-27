import { useState } from 'react'
import { Split, Search, AlertTriangle, History } from 'lucide-react'

interface MergeRecord {
  mergedAt: string
  fromUser: string
  toUser: string
}

const MOCK_MERGE_HISTORY: MergeRecord[] = [
  { mergedAt: '2026-02-15', fromUser: 'john.doe2@example.com', toUser: 'john.doe@example.com' },
  { mergedAt: '2026-01-20', fromUser: 'jsmith_old@example.com', toUser: 'jane.smith@example.com' },
]

export function AdminSplitPage() {
  const [query, setQuery] = useState('')
  const [searched, setSearched] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Split className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Split User Accounts</h3>
      </div>

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-600" />
          <div>
            <h4 className="text-sm font-semibold text-amber-800">Caution</h4>
            <p className="mt-1 text-sm text-amber-700">
              Splitting a user account reverses a previous merge. This will restore the
              original accounts and reassign enrollments. This action should be used carefully.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <h4 className="mb-4 text-lg font-semibold text-neutral-800">Find User to Split</h4>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full rounded-lg border border-neutral-200 py-2.5 pl-10 pr-4 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>
          <button
            type="button"
            onClick={() => setSearched(true)}
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            Search
          </button>
        </div>

        {searched && (
          <div className="mt-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-4 w-4 text-neutral-500" />
              <h5 className="text-sm font-semibold text-neutral-800">Merge History</h5>
            </div>
            {MOCK_MERGE_HISTORY.length === 0 ? (
              <p className="text-sm text-neutral-500">No merge history found for this user.</p>
            ) : (
              <div className="divide-y divide-neutral-100 rounded-lg border border-neutral-200">
                {MOCK_MERGE_HISTORY.map((record, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm text-neutral-700">
                        <span className="font-medium">{record.fromUser}</span>
                        {' merged into '}
                        <span className="font-medium">{record.toUser}</span>
                      </p>
                      <p className="text-xs text-neutral-400">Merged on {record.mergedAt}</p>
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 transition-colors hover:bg-red-100"
                    >
                      <Split className="h-3.5 w-3.5" />
                      Split
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
