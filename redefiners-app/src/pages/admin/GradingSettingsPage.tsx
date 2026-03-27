import { useState } from 'react'
import { GraduationCap, Save } from 'lucide-react'

export function GradingSettingsPage() {
  const [defaultScheme, setDefaultScheme] = useState('letter')
  const [latePolicyEnabled, setLatePolicyEnabled] = useState(true)
  const [lateDeduction, setLateDeduction] = useState('10')
  const [lateDeductionInterval, setLateDeductionInterval] = useState('day')
  const [lowestPossible, setLowestPossible] = useState('0')
  const [missingPolicy, setMissingPolicy] = useState('zero')
  const [passbackEnabled, setPassbackEnabled] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">Grading Settings</h3>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Default Grading Scheme */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Default Grading Scheme</h4>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Scheme Type
            </label>
            <select
              value={defaultScheme}
              onChange={(e) => setDefaultScheme(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="letter">Letter Grade (A-F)</option>
              <option value="percentage">Percentage</option>
              <option value="points">Points</option>
              <option value="passfail">Pass/Fail</option>
              <option value="gpa">GPA Scale</option>
            </select>
          </div>
        </div>

        {/* Late Policy */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h4 className="text-lg font-semibold text-neutral-800">Late Policy Defaults</h4>
            <button
              type="button"
              onClick={() => setLatePolicyEnabled(!latePolicyEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                latePolicyEnabled ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                  latePolicyEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
          {latePolicyEnabled && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Deduction (%)
                  </label>
                  <input
                    type="number"
                    value={lateDeduction}
                    onChange={(e) => setLateDeduction(e.target.value)}
                    min="0"
                    max="100"
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                    Per
                  </label>
                  <select
                    value={lateDeductionInterval}
                    onChange={(e) => setLateDeductionInterval(e.target.value)}
                    className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                  >
                    <option value="hour">Hour</option>
                    <option value="day">Day</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                  Lowest Possible Grade (%)
                </label>
                <input
                  type="number"
                  value={lowestPossible}
                  onChange={(e) => setLowestPossible(e.target.value)}
                  min="0"
                  max="100"
                  className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>
            </div>
          )}
        </div>

        {/* Missing Submission Policy */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 text-lg font-semibold text-neutral-800">Missing Submission Policy</h4>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Treat Missing As
            </label>
            <select
              value={missingPolicy}
              onChange={(e) => setMissingPolicy(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="zero">Zero (0%)</option>
              <option value="excused">Excused</option>
              <option value="ungraded">Leave Ungraded</option>
            </select>
          </div>
        </div>

        {/* Grade Passback */}
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-lg font-semibold text-neutral-800">Grade Passback</h4>
              <p className="mt-1 text-sm text-neutral-500">
                Automatically sync grades back to the SIS
              </p>
            </div>
            <button
              type="button"
              onClick={() => setPassbackEnabled(!passbackEnabled)}
              className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                passbackEnabled ? 'bg-primary-600' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                  passbackEnabled ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        <div>
          <button
            type="button"
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
          >
            <Save className="h-4 w-4" />
            Save Grading Settings
          </button>
        </div>
      </div>
    </div>
  )
}
