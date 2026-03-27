import { useCurrentUser } from '@/hooks/useCurrentUser'
import { useCourses } from '@/hooks/useCourses'
import { CourseCard } from '@/components/shared/CourseCard'
import { TodoItem } from '@/components/shared/TodoItem'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { BookOpen, ClipboardList, ChevronLeft, ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import type { CanvasTodoItem } from '@/types/canvas'
import { useState, useRef } from 'react'

function useTodoItems() {
  return useQuery({
    queryKey: ['todo'],
    queryFn: async () => {
      const response = await apiGet<CanvasTodoItem[]>('/v1/users/self/todo')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
  })
}

const PROGRESS_CARDS = [
  { title: 'Language Level', value: 85, color: 'green' as const },
  { title: 'Points', value: 55, color: 'purple' as const },
  { title: 'Class Points', value: 95, color: 'orange' as const },
]

const CALENDAR_DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

function MiniCalendar() {
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = now.getDate()
  const monthName = now.toLocaleString('default', { month: 'long', year: 'numeric' })

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div
      className="rounded-2xl p-5 shadow-sm"
      style={{ background: 'var(--color-surface)' }}
    >
      <h5 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {monthName}
      </h5>
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {CALENDAR_DAYS.map((d, i) => (
          <div key={i} className="py-1 font-semibold" style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
            {d}
          </div>
        ))}
        {cells.map((day, i) => (
          <div
            key={i}
            className="flex h-7 w-7 items-center justify-center rounded-full text-xs"
            style={
              day === today
                ? { background: '#2DB88A', color: 'white', fontWeight: 600 }
                : { color: day ? 'var(--color-text-primary)' : 'transparent' }
            }
          >
            {day ?? ''}
          </div>
        ))}
      </div>
    </div>
  )
}

function ProgressBar({ value, color }: { value: number; color: 'green' | 'purple' | 'orange' }) {
  const gradients = {
    green: 'linear-gradient(90deg, #2DB88A 0%, #00D99A 100%)',
    purple: 'linear-gradient(90deg, #8B5CF6 0%, #A78BFA 100%)',
    orange: 'linear-gradient(90deg, #FF6B35 0%, #FF8A5C 100%)',
  }

  return (
    <div className="h-5 w-full overflow-hidden rounded-full" style={{ background: 'var(--color-surface-200)' }}>
      <div
        className="h-full rounded-full transition-all duration-600"
        style={{
          width: `${Math.min(value, 100)}%`,
          background: gradients[color],
        }}
      />
    </div>
  )
}

export function DashboardPage() {
  const { data: user, isLoading: userLoading } = useCurrentUser()
  const { data: courses, isLoading: coursesLoading } = useCourses()
  const { data: todoItems, isLoading: todosLoading } = useTodoItems()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [_scrollPos, setScrollPos] = useState(0)

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 300
    const newPos = direction === 'left'
      ? scrollRef.current.scrollLeft - amount
      : scrollRef.current.scrollLeft + amount
    scrollRef.current.scrollTo({ left: newPos, behavior: 'smooth' })
    setScrollPos(newPos)
  }

  return (
    <div className="flex gap-6">
      {/* Main Content - Left */}
      <div className="min-w-0 flex-1 space-y-6">
        {/* Welcome Section */}
        <div className="flex items-center gap-4 py-2">
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full"
            style={{ background: 'var(--color-page)', border: '3px solid #2DB88A' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Images/profile.png`}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <div>
            {userLoading ? (
              <LoadingSkeleton type="text" count={1} />
            ) : (
              <h3 className="font-bold" style={{ color: 'var(--color-text-primary)', fontSize: '22px' }}>
                Welcome, {user?.short_name ?? 'Student'}!
              </h3>
            )}
          </div>
        </div>

        {/* Progress Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PROGRESS_CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl p-5 transition-all duration-300 hover:-translate-y-px"
              style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}
            >
              <div className="mb-2.5 flex items-center justify-between">
                <h5 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
                  {card.title}
                </h5>
                <span className="text-xs font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                  Details
                </span>
              </div>
              <ProgressBar value={card.value} color={card.color} />
            </div>
          ))}
        </div>

        {/* Course Cards Carousel */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h4 className="text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              My Courses
            </h4>
            {courses && courses.length > 3 && (
              <div className="flex gap-2">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-surface-50)]"
                  style={{ borderColor: 'var(--color-surface-200)' }}
                >
                  <ChevronLeft className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="flex h-8 w-8 items-center justify-center rounded-full border transition-colors hover:bg-[var(--color-surface-50)]"
                  style={{ borderColor: 'var(--color-surface-200)' }}
                >
                  <ChevronRight className="h-4 w-4" style={{ color: 'var(--color-text-secondary)' }} />
                </button>
              </div>
            )}
          </div>
          {coursesLoading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : !courses || courses.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              heading="No courses found"
              description="You are not enrolled in any courses yet."
            />
          ) : (
            <div
              ref={scrollRef}
              className="flex gap-4 overflow-x-auto pb-2"
              style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none' }}
            >
              {courses.slice(0, 8).map((course) => (
                <div key={course.id} className="w-64 flex-shrink-0">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Assignments Section */}
        <section>
          <div
            className="rounded-2xl p-5"
            style={{ background: 'var(--color-surface)', boxShadow: 'var(--shadow-card)' }}
          >
            <h5 className="mb-4 text-base font-semibold" style={{ color: 'var(--color-text-primary)' }}>
              Assignments
            </h5>
            {todosLoading ? (
              <LoadingSkeleton type="row" count={4} />
            ) : !todoItems || todoItems.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                heading="All caught up!"
                description="Nothing to do right now."
              />
            ) : (
              <div>
                {todoItems.slice(0, 8).map((item, idx) => (
                  <TodoItem key={`${item.assignment?.id ?? idx}`} item={item} />
                ))}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Right Sidebar */}
      <div className="hidden w-72 shrink-0 space-y-5 xl:block">
        {/* User Profile Card */}
        <div
          className="rounded-2xl p-5 text-center shadow-sm"
          style={{ background: 'var(--color-surface)' }}
        >
          <div
            className="mx-auto mb-3 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full"
            style={{ border: '3px solid #2DB88A' }}
          >
            <img
              src={`${import.meta.env.BASE_URL}Images/profile.png`}
              alt=""
              className="h-full w-full object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
          <h5 className="text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            {user?.short_name ?? 'Student'}
          </h5>
          <p className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>
            {user?.email ?? 'student@redefiners.com'}
          </p>
        </div>

        {/* Calendar Widget */}
        <MiniCalendar />

        {/* Recent Chats */}
        <div
          className="rounded-2xl p-5 shadow-sm"
          style={{ background: 'var(--color-surface)' }}
        >
          <h5 className="mb-3 text-sm font-semibold" style={{ color: 'var(--color-text-primary)' }}>
            Recent Chats
          </h5>
          {[
            { name: 'Jake', message: 'Has anyone figured out...', time: '2m' },
            { name: 'Reena', message: 'Great session today!', time: '15m' },
            { name: 'Teacher', message: 'Don\'t forget homework', time: '1h' },
          ].map((chat, i) => (
            <div
              key={i}
              className="flex items-center gap-3 rounded-xl px-2 py-2 transition-colors hover:bg-[var(--color-surface-50)]"
              style={{ cursor: 'pointer' }}
            >
              <div
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
                style={{
                  background: ['#2DB88A', '#8B5CF6', '#FF6B35'][i],
                }}
              >
                {chat.name[0]}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-semibold" style={{ color: 'var(--color-text-primary)', margin: 0 }}>
                  {chat.name}
                </p>
                <p className="truncate text-xs" style={{ color: 'var(--color-text-secondary)', margin: 0 }}>
                  {chat.message}
                </p>
              </div>
              <span className="shrink-0 text-xs" style={{ color: 'var(--color-text-muted)' }}>
                {chat.time}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
