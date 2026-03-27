import { useState, useEffect } from 'react'
import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import { getCourse } from '@/services/modules/courses'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { Settings, Save } from 'lucide-react'
import type { CanvasCourse } from '@/types/canvas'

export function CourseSettingsPage() {
  const { courseId } = useParams<{ courseId: string }>()
  const { data: course, isLoading } = useQuery<CanvasCourse>({
    queryKey: ['course', courseId],
    queryFn: async () => {
      const response = await getCourse(courseId!)
      return response.data
    },
    enabled: !!courseId,
  })

  const [name, setName] = useState('')
  const [courseCode, setCourseCode] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [visibility, setVisibility] = useState('course')
  const [enableDiscussions, setEnableDiscussions] = useState(true)
  const [enablePages, setEnablePages] = useState(true)
  const [enableFiles, setEnableFiles] = useState(true)
  const [enableOutcomes, setEnableOutcomes] = useState(false)

  useEffect(() => {
    if (course) {
      setName(course.name ?? '')
      setCourseCode(course.course_code ?? '')
      setStartDate(course.start_at ? course.start_at.split('T')[0] : '')
      setEndDate(course.end_at ? course.end_at.split('T')[0] : '')
    }
  }, [course])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h3 className="text-2xl font-bold text-primary-800">
          Course Settings
        </h3>
        <LoadingSkeleton type="row" count={8} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-6 w-6 text-primary-600" />
        <h3 className="text-2xl font-bold text-primary-800">
          Course Settings
        </h3>
      </div>

      <div className="mx-auto max-w-2xl rounded-lg bg-white p-6 shadow-sm">
        <div className="space-y-5">
          {/* Course Name */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Course Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Course Code */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Course Code
            </label>
            <input
              type="text"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-neutral-700">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
              />
            </div>
          </div>

          {/* Visibility */}
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
              className="w-full rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-700 focus:border-primary-300 focus:outline-none focus:ring-2 focus:ring-primary-100"
            >
              <option value="course">Course Members Only</option>
              <option value="institution">Institution</option>
              <option value="public">Public</option>
            </select>
          </div>

          {/* Features */}
          <div className="border-t border-neutral-100 pt-5">
            <h4 className="mb-3 text-sm font-semibold text-neutral-800">
              Features
            </h4>
            <div className="space-y-3">
              {[
                {
                  label: 'Discussions',
                  value: enableDiscussions,
                  set: setEnableDiscussions,
                },
                { label: 'Pages', value: enablePages, set: setEnablePages },
                { label: 'Files', value: enableFiles, set: setEnableFiles },
                {
                  label: 'Outcomes',
                  value: enableOutcomes,
                  set: setEnableOutcomes,
                },
              ].map((feature) => (
                <label
                  key={feature.label}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm text-neutral-700">
                    {feature.label}
                  </span>
                  <button
                    type="button"
                    onClick={() => feature.set(!feature.value)}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors ${
                      feature.value ? 'bg-primary-600' : 'bg-neutral-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
                        feature.value ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="border-t border-neutral-100 pt-5">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
            >
              <Save className="h-4 w-4" />
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
