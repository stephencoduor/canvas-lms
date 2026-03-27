import { useState } from 'react'
import { useParams } from 'react-router'
import { GraduationCap, Plus, Save, Trash2 } from 'lucide-react'

interface GradeRow {
  letter: string
  minPercentage: string
}

const DEFAULT_GRADES: GradeRow[] = [
  { letter: 'A', minPercentage: '94' },
  { letter: 'A-', minPercentage: '90' },
  { letter: 'B+', minPercentage: '87' },
  { letter: 'B', minPercentage: '84' },
  { letter: 'B-', minPercentage: '80' },
  { letter: 'C+', minPercentage: '77' },
  { letter: 'C', minPercentage: '74' },
  { letter: 'C-', minPercentage: '70' },
  { letter: 'D+', minPercentage: '67' },
  { letter: 'D', minPercentage: '64' },
  { letter: 'D-', minPercentage: '61' },
  { letter: 'F', minPercentage: '0' },
]

export function CourseGradingStandardsPage() {
  const { courseId } = useParams()
  const [schemeName, setSchemeName] = useState('Course Grading Scheme')
  const [grades, setGrades] = useState<GradeRow[]>(DEFAULT_GRADES)

  const updateGrade = (index: number, field: keyof GradeRow, value: string) => {
    setGrades((prev) =>
      prev.map((g, i) => (i === index ? { ...g, [field]: value } : g))
    )
  }

  const addGrade = () => {
    setGrades((prev) => [...prev, { letter: '', minPercentage: '0' }])
  }

  const removeGrade = (index: number) => {
    setGrades((prev) => prev.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Course Grading Standards</h3>
          <p className="mt-1 text-sm text-neutral-500">Course {courseId}</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-5">
          <label className="mb-1.5 block text-sm font-medium text-neutral-700">
            Scheme Name
          </label>
          <input
            type="text"
            value={schemeName}
            onChange={(e) => setSchemeName(e.target.value)}
            className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
          />
        </div>

        <div className="space-y-2">
          <div className="grid grid-cols-12 gap-2 text-xs font-medium uppercase text-neutral-500">
            <span className="col-span-5 px-1">Letter Grade</span>
            <span className="col-span-5 px-1">Min Percentage</span>
            <span className="col-span-2" />
          </div>
          {grades.map((grade, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input
                type="text"
                value={grade.letter}
                onChange={(e) => updateGrade(idx, 'letter', e.target.value)}
                className="col-span-5 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
              <div className="col-span-5 flex items-center gap-1">
                <input
                  type="number"
                  value={grade.minPercentage}
                  onChange={(e) => updateGrade(idx, 'minPercentage', e.target.value)}
                  min="0"
                  max="100"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
                <span className="text-sm text-neutral-400">%</span>
              </div>
              <div className="col-span-2 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeGrade(idx)}
                  className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex gap-3">
          <button
            type="button"
            onClick={addGrade}
            className="flex items-center gap-1.5 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Row
          </button>
        </div>

        <div className="mt-6 border-t border-neutral-100 pt-5">
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save Grading Scheme
          </button>
        </div>
      </div>
    </div>
  )
}
