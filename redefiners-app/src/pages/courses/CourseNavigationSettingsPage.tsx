import { useState } from 'react'
import { useParams } from 'react-router'
import { Navigation, GripVertical, Eye, EyeOff, Save } from 'lucide-react'

interface NavItem {
  id: string
  label: string
  visible: boolean
}

const DEFAULT_NAV: NavItem[] = [
  { id: 'home', label: 'Home', visible: true },
  { id: 'announcements', label: 'Announcements', visible: true },
  { id: 'assignments', label: 'Assignments', visible: true },
  { id: 'discussions', label: 'Discussions', visible: true },
  { id: 'grades', label: 'Grades', visible: true },
  { id: 'people', label: 'People', visible: true },
  { id: 'pages', label: 'Pages', visible: true },
  { id: 'files', label: 'Files', visible: true },
  { id: 'syllabus', label: 'Syllabus', visible: true },
  { id: 'outcomes', label: 'Outcomes', visible: false },
  { id: 'rubrics', label: 'Rubrics', visible: false },
  { id: 'quizzes', label: 'Quizzes', visible: true },
  { id: 'modules', label: 'Modules', visible: true },
  { id: 'conferences', label: 'Conferences', visible: false },
  { id: 'collaborations', label: 'Collaborations', visible: false },
]

export function CourseNavigationSettingsPage() {
  const { courseId } = useParams()
  const [navItems, setNavItems] = useState<NavItem[]>(DEFAULT_NAV)

  const toggleVisibility = (id: string) => {
    setNavItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, visible: !item.visible } : item
      )
    )
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...navItems]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setNavItems(newItems)
  }

  const visibleItems = navItems.filter((item) => item.visible)
  const hiddenItems = navItems.filter((item) => !item.visible)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Navigation className="h-6 w-6 text-primary-600" />
        <div>
          <h3 className="text-2xl font-bold text-primary-800">Course Navigation</h3>
          <p className="mt-1 text-sm text-neutral-500">
            Course {courseId} &mdash; Drag to reorder, toggle visibility
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-800">
            <Eye className="h-4 w-4 text-emerald-500" />
            Visible Tabs ({visibleItems.length})
          </h4>
          <div className="space-y-1">
            {navItems.map((item, index) =>
              item.visible ? (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-neutral-100 bg-neutral-50 px-4 py-3"
                >
                  <div className="flex items-center gap-3">
                    <GripVertical className="h-4 w-4 cursor-grab text-neutral-300" />
                    <span className="text-sm font-medium text-neutral-800">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'up')}
                      className="rounded p-1 text-xs text-neutral-400 hover:bg-neutral-200"
                    >
                      &uarr;
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(index, 'down')}
                      className="rounded p-1 text-xs text-neutral-400 hover:bg-neutral-200"
                    >
                      &darr;
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(item.id)}
                      className="ml-2 rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ) : null
            )}
          </div>
        </div>

        {hiddenItems.length > 0 && (
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <h4 className="mb-4 flex items-center gap-2 text-lg font-semibold text-neutral-800">
              <EyeOff className="h-4 w-4 text-neutral-400" />
              Hidden Tabs ({hiddenItems.length})
            </h4>
            <div className="space-y-1">
              {navItems.map((item) =>
                !item.visible ? (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-100 px-4 py-3 opacity-60"
                  >
                    <span className="text-sm text-neutral-600">{item.label}</span>
                    <button
                      type="button"
                      onClick={() => toggleVisibility(item.id)}
                      className="rounded-md p-1.5 text-neutral-400 transition-colors hover:bg-emerald-50 hover:text-emerald-500"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                ) : null
              )}
            </div>
          </div>
        )}

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Save className="h-4 w-4" />
          Save Navigation Settings
        </button>
      </div>
    </div>
  )
}
