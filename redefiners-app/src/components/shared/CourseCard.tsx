import { memo } from 'react'
import { Link } from 'react-router'
import type { CanvasCourse } from '@/types/canvas'

function getCourseSlug(name: string): string {
  const lower = name.toLowerCase()
  if (lower.includes('spanish')) return 'spanish'
  if (lower.includes('biology')) return 'biology'
  if (lower.includes('english')) return 'english'
  if (lower.includes('environment')) return 'enviro'
  if (lower.includes('history') && lower.includes('world')) return 'history'
  if (lower.includes('math')) return 'math'
  if (lower.includes('computer')) return 'cs'
  if (lower.includes('psych')) return 'psych'
  if (lower.includes('art')) return 'art'
  if (lower.includes('music')) return 'music'
  return 'spanish' // fallback
}

interface CourseCardProps {
  course: CanvasCourse
}

const PROGRESS_GRADIENTS = [
  'linear-gradient(90deg, #2DB88A 0%, #00D99A 100%)',
  'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
  'linear-gradient(90deg, #FF6B35 0%, #FF8A5C 100%)',
]

export const CourseCard = memo(function CourseCard({ course }: CourseCardProps) {
  // Find grade from student enrollment
  const studentEnrollment = course.enrollments?.find(
    (e) => e.type === 'StudentEnrollment',
  )
  const currentScore = studentEnrollment?.computed_current_score ?? null

  // Get teacher names
  const teacherNames = course.teachers?.map((t) => t.display_name).join(', ')

  // Pick a gradient based on course id
  const gradientIdx = course.id % PROGRESS_GRADIENTS.length

  return (
    <Link
      to={`/courses/${course.id}`}
      className="group block overflow-hidden no-underline transition-all duration-300 hover:-translate-y-[3px]"
      style={{
        background: 'var(--color-surface)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--color-surface-200)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card-hover)'
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.boxShadow = 'var(--shadow-card)'
      }}
    >
      {/* Course image */}
      <div className="relative w-full overflow-hidden" style={{ height: '150px' }}>
        <img
          src={course.image_download_url ?? `${import.meta.env.BASE_URL}Images/course-${getCourseSlug(course.name)}.svg`}
          alt={course.name}
          loading="lazy"
          width={400}
          height={150}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Course info */}
      <div style={{ padding: '16px' }}>
        <h5
          className="mb-1 line-clamp-2 font-semibold"
          style={{ fontSize: '16px', color: 'var(--color-text-primary)' }}
        >
          {course.name}
        </h5>
        {course.course_code && (
          <p className="mb-0.5" style={{ fontSize: '12px', color: 'var(--color-text-secondary)', margin: '0 0 2px' }}>
            {course.course_code}
          </p>
        )}
        {course.term?.name && (
          <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 2px' }}>
            {course.term.name}
          </p>
        )}
        {teacherNames && (
          <p className="truncate" style={{ fontSize: '11px', color: 'var(--color-text-muted)', margin: '0 0 8px' }}>
            {teacherNames}
          </p>
        )}

        {/* Progress bar */}
        {currentScore !== null && (
          <div style={{ marginTop: '8px' }}>
            <div className="mb-1 flex items-center justify-between">
              <span style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Progress</span>
              <span className="font-semibold" style={{ fontSize: '12px', color: 'var(--color-text-primary)' }}>
                {Math.round(currentScore)}%
              </span>
            </div>
            <div
              className="w-full overflow-hidden"
              style={{ height: '6px', borderRadius: '9999px', background: 'var(--color-surface-200)' }}
            >
              <div
                className="h-full transition-all"
                style={{
                  width: `${Math.min(currentScore, 100)}%`,
                  borderRadius: '9999px',
                  background: PROGRESS_GRADIENTS[gradientIdx],
                }}
              />
            </div>
          </div>
        )}
      </div>
    </Link>
  )
})
