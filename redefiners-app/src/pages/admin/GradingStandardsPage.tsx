import { useState } from 'react'
import { GraduationCap, Plus, Pencil, Trash2 } from 'lucide-react'

interface GradingStandard {
  id: string
  name: string
  grades: { letter: string; minPercentage: number }[]
}

const INITIAL_STANDARDS: GradingStandard[] = [
  {
    id: '1',
    name: 'Default Letter Grade',
    grades: [
      { letter: 'A', minPercentage: 94 },
      { letter: 'A-', minPercentage: 90 },
      { letter: 'B+', minPercentage: 87 },
      { letter: 'B', minPercentage: 84 },
      { letter: 'B-', minPercentage: 80 },
      { letter: 'C+', minPercentage: 77 },
      { letter: 'C', minPercentage: 74 },
      { letter: 'C-', minPercentage: 70 },
      { letter: 'D+', minPercentage: 67 },
      { letter: 'D', minPercentage: 64 },
      { letter: 'D-', minPercentage: 61 },
      { letter: 'F', minPercentage: 0 },
    ],
  },
  {
    id: '2',
    name: 'Pass/Fail',
    grades: [
      { letter: 'Pass', minPercentage: 70 },
      { letter: 'Fail', minPercentage: 0 },
    ],
  },
]

export function GradingStandardsPage() {
  const [standards] = useState<GradingStandard[]>(INITIAL_STANDARDS)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-6 w-6 text-primary-600" />
          <h3 className="text-2xl font-bold text-primary-800">Grading Standards</h3>
        </div>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus className="h-4 w-4" />
          Add Standard
        </button>
      </div>

      <div className="space-y-4">
        {standards.map((standard) => (
          <div key={standard.id} className="rounded-lg bg-white shadow-sm">
            <div className="flex items-center justify-between p-5">
              <button
                type="button"
                onClick={() =>
                  setExpandedId(expandedId === standard.id ? null : standard.id)
                }
                className="flex-1 text-left"
              >
                <h4 className="text-sm font-semibold text-neutral-800">
                  {standard.name}
                </h4>
                <p className="mt-0.5 text-xs text-neutral-500">
                  {standard.grades.length} grade levels
                </p>
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            {expandedId === standard.id && (
              <div className="border-t border-neutral-100 px-5 pb-5 pt-3">
                <table className="w-full">
                  <thead>
                    <tr className="text-xs text-neutral-500">
                      <th className="pb-2 text-left font-medium">Letter Grade</th>
                      <th className="pb-2 text-right font-medium">Min Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {standard.grades.map((grade) => (
                      <tr key={grade.letter}>
                        <td className="py-2 text-sm font-medium text-neutral-700">
                          {grade.letter}
                        </td>
                        <td className="py-2 text-right text-sm text-neutral-600">
                          {grade.minPercentage}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
