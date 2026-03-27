import type { LucideIcon } from 'lucide-react'
import {
  LayoutDashboard, ClipboardList, Send, GraduationCap,
  Users, HandHelping, CalendarDays, TrendingUp, UserCircle,
  HelpCircle, ShieldCheck, Server, ArrowLeft, Home, Megaphone, FileText,
  CircleHelp, MessageSquare, Layers, BarChart3, FileEdit, Folder, BookOpen,
  Star, UserPlus, Video, Handshake, Settings, Bell, BookMarked,
} from 'lucide-react'

// ─── Types ───────────────────────────────────────────

export interface NavItem {
  label: string
  icon?: LucideIcon
  href: string
  matchPaths?: string[]
  children?: NavItem[]
  requiredRole?: 'admin' | 'teacher'
  badge?: number
  description?: string
}

export interface NavSection {
  title?: string
  items: NavItem[]
  collapsible?: boolean
  defaultOpen?: boolean
}

// ─── Favorites (localStorage) ───────────────────────

const FAVORITES_KEY = 'redefiners_favorites'

export function getFavorites(): string[] {
  try { return JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]') } catch { return [] }
}

export function toggleFavorite(href: string): string[] {
  const favs = getFavorites()
  const idx = favs.indexOf(href)
  if (idx >= 0) favs.splice(idx, 1); else favs.push(href)
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(favs))
  return favs
}

export function isFavorite(href: string): boolean {
  return getFavorites().includes(href)
}

// ─── Recent Pages (localStorage) ────────────────────

const RECENT_KEY = 'redefiners_recent'

export function getRecentPages(): { href: string; label: string }[] {
  try { return JSON.parse(localStorage.getItem(RECENT_KEY) || '[]') } catch { return [] }
}

export function addRecentPage(href: string, label: string): void {
  const recent = getRecentPages().filter(r => r.href !== href)
  recent.unshift({ href, label })
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent.slice(0, 5)))
}

// ─── Search ─────────────────────────────────────────

export function searchNavItems(query: string): NavItem[] {
  if (!query || query.length < 2) return []
  const q = query.toLowerCase()
  const results: NavItem[] = []
  const search = (sections: NavSection[]) => {
    for (const sec of sections) {
      for (const item of sec.items) {
        if (item.label.toLowerCase().includes(q) || item.description?.toLowerCase().includes(q)) results.push(item)
        if (item.children) for (const c of item.children) {
          if (c.label.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)) results.push(c)
        }
      }
    }
  }
  search(getGlobalNavSections())
  return results.slice(0, 8)
}

// ─── Global Navigation (5 clean sections) ───────────

export function getGlobalNavSections(): NavSection[] {
  return [
    {
      items: [
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard', matchPaths: ['/dashboard'], description: 'Home overview' },
        { label: 'Courses', icon: ClipboardList, href: '/courses', matchPaths: ['/courses'], description: 'My courses', children: [] },
        {
          label: 'Calendar', icon: CalendarDays, href: '/calendar',
          matchPaths: ['/calendar', '/academic-calendar', '/events', '/planner'],
          description: 'Schedule and events',
          children: [
            { label: 'My Calendar', href: '/calendar', matchPaths: ['/calendar'] },
            { label: 'Planner', href: '/planner', matchPaths: ['/planner'] },
            { label: 'Academic Calendar', href: '/academic-calendar', matchPaths: ['/academic-calendar'] },
            { label: 'Events', href: '/events', matchPaths: ['/events'] },
          ],
        },
        {
          label: 'Inbox', icon: Send, href: '/inbox',
          matchPaths: ['/inbox', '/chat'],
          description: 'Messages',
          children: [
            { label: 'Messages', href: '/inbox', matchPaths: ['/inbox'] },
            { label: 'Live Chat', href: '/chat', matchPaths: ['/chat'] },
          ],
        },
        { label: 'Notifications', icon: Bell, href: '/notifications', matchPaths: ['/notifications'] },
      ],
    },
    {
      title: 'Learn & Grow',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          label: 'My Learning', icon: GraduationCap, href: '/learning-objectives',
          matchPaths: ['/learning-objectives', '/competencies', '/learning-paths', '/certificates', '/goal-setting', '/progress-tracker'],
          description: 'Objectives, competencies, certificates',
          children: [
            { label: 'Objectives', href: '/learning-objectives', matchPaths: ['/learning-objectives'] },
            { label: 'Competencies', href: '/competencies', matchPaths: ['/competencies'] },
            { label: 'Learning Paths', href: '/learning-paths', matchPaths: ['/learning-paths'] },
            { label: 'Certificates', href: '/certificates', matchPaths: ['/certificates'] },
            { label: 'Goals', href: '/goal-setting', matchPaths: ['/goal-setting'] },
            { label: 'Progress', href: '/progress-tracker', matchPaths: ['/progress-tracker'] },
          ],
        },
        {
          label: 'Resources', icon: BookMarked, href: '/content-library',
          matchPaths: ['/content-library', '/resource-library', '/video-studio', '/interactive-tools', '/commons'],
          description: 'Content, media, tools',
          children: [
            { label: 'Content Library', href: '/content-library', matchPaths: ['/content-library'] },
            { label: 'Resource Library', href: '/resource-library', matchPaths: ['/resource-library'] },
            { label: 'Video Studio', href: '/video-studio', matchPaths: ['/video-studio'] },
            { label: 'Interactive Tools', href: '/interactive-tools', matchPaths: ['/interactive-tools'] },
            { label: 'Commons', href: '/commons', matchPaths: ['/commons'] },
          ],
        },
        {
          label: 'Analytics', icon: TrendingUp, href: '/analytics',
          matchPaths: ['/analytics', '/learning-analytics', '/engagement', '/completion-reports', '/analytics-hub'],
          description: 'Performance and engagement',
          children: [
            { label: 'Overview', href: '/analytics', matchPaths: ['/analytics'] },
            { label: 'Learning Analytics', href: '/learning-analytics', matchPaths: ['/learning-analytics'] },
            { label: 'Engagement', href: '/engagement', matchPaths: ['/engagement'] },
            { label: 'Completion Reports', href: '/completion-reports', matchPaths: ['/completion-reports'] },
            { label: 'Analytics Hub', href: '/analytics-hub', matchPaths: ['/analytics-hub'] },
          ],
        },
      ],
    },
    {
      title: 'Community',
      collapsible: true,
      defaultOpen: true,
      items: [
        {
          label: 'Collaborate', icon: Users, href: '/study-groups',
          matchPaths: ['/study-groups', '/workspaces', '/conferences', '/recordings', '/group-assignments'],
          description: 'Groups and teamwork',
          children: [
            { label: 'Study Groups', href: '/study-groups', matchPaths: ['/study-groups'] },
            { label: 'Workspaces', href: '/workspaces', matchPaths: ['/workspaces'] },
            { label: 'Conferences', href: '/conferences', matchPaths: ['/conferences'] },
            { label: 'Recordings', href: '/recordings', matchPaths: ['/recordings'] },
            { label: 'Group Projects', href: '/group-assignments', matchPaths: ['/group-assignments'] },
          ],
        },
        {
          label: 'Support', icon: HandHelping, href: '/tutoring',
          matchPaths: ['/tutoring', '/mentoring', '/career-services', '/support', '/wellness', '/office-hours', '/room-booking', '/attendance'],
          description: 'Services and wellbeing',
          children: [
            { label: 'Tutoring', href: '/tutoring', matchPaths: ['/tutoring'] },
            { label: 'Mentoring', href: '/mentoring', matchPaths: ['/mentoring'] },
            { label: 'Career Services', href: '/career-services', matchPaths: ['/career-services'] },
            { label: 'Wellness', href: '/wellness', matchPaths: ['/wellness'] },
            { label: 'Office Hours', href: '/office-hours', matchPaths: ['/office-hours'] },
            { label: 'Room Booking', href: '/room-booking', matchPaths: ['/room-booking'] },
            { label: 'Attendance', href: '/attendance', matchPaths: ['/attendance'] },
          ],
        },
        {
          label: 'Communicate', icon: MessageSquare, href: '/announcements/editor',
          matchPaths: ['/announcements/editor', '/feedback', '/message-templates'],
          description: 'Announcements and feedback',
          children: [
            { label: 'Announcements', href: '/announcements/editor', matchPaths: ['/announcements/editor'] },
            { label: 'Feedback', href: '/feedback', matchPaths: ['/feedback'] },
            { label: 'Templates', href: '/message-templates', matchPaths: ['/message-templates'] },
          ],
        },
      ],
    },
    {
      title: 'Account',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          label: 'My Account', icon: UserCircle, href: '/profile',
          matchPaths: ['/profile', '/settings', '/eportfolio', '/change-password'],
          children: [
            { label: 'Profile', href: '/profile', matchPaths: ['/profile'] },
            { label: 'Settings', href: '/settings', matchPaths: ['/settings'] },
            { label: 'ePortfolio', href: '/eportfolio', matchPaths: ['/eportfolio'] },
            { label: 'Password', href: '/change-password', matchPaths: ['/change-password'] },
          ],
        },
        { label: 'Help', icon: HelpCircle, href: '/help', matchPaths: ['/help', '/support'] },
      ],
    },
    {
      title: 'Administration',
      collapsible: true,
      defaultOpen: false,
      items: [
        {
          label: 'People & Access', icon: ShieldCheck, href: '/admin', requiredRole: 'admin',
          matchPaths: ['/admin', '/admin/users', '/admin/enrollments', '/admin/reports', '/admin/audit-log', '/admin/developer-keys', '/admin/permissions', '/admin/authentication', '/admin/sub-accounts', '/admin/sis-import'],
          children: [
            { label: 'Users', href: '/admin/users', matchPaths: ['/admin/users'] },
            { label: 'Enrollments', href: '/admin/enrollments', matchPaths: ['/admin/enrollments'] },
            { label: 'Permissions', href: '/admin/permissions', matchPaths: ['/admin/permissions'] },
            { label: 'Auth Providers', href: '/admin/authentication', matchPaths: ['/admin/authentication'] },
            { label: 'Reports', href: '/admin/reports', matchPaths: ['/admin/reports'] },
            { label: 'Audit Log', href: '/admin/audit-log', matchPaths: ['/admin/audit-log'] },
            { label: 'Dev Keys', href: '/admin/developer-keys', matchPaths: ['/admin/developer-keys'] },
            { label: 'Sub-Accounts', href: '/admin/sub-accounts', matchPaths: ['/admin/sub-accounts'] },
            { label: 'SIS Import', href: '/admin/sis-import', matchPaths: ['/admin/sis-import'] },
          ],
        },
        {
          label: 'System', icon: Server, href: '/admin/system', requiredRole: 'admin',
          matchPaths: ['/admin/system', '/admin/institution', '/admin/terms', '/admin/course-templates', '/admin/system-health', '/admin/backup', '/admin/data-privacy', '/admin/api-tokens', '/admin/accessibility'],
          children: [
            { label: 'Institution', href: '/admin/institution', matchPaths: ['/admin/institution'] },
            { label: 'Terms', href: '/admin/terms', matchPaths: ['/admin/terms'] },
            { label: 'Templates', href: '/admin/course-templates', matchPaths: ['/admin/course-templates'] },
            { label: 'Health', href: '/admin/system-health', matchPaths: ['/admin/system-health'] },
            { label: 'Backup', href: '/admin/backup', matchPaths: ['/admin/backup'] },
            { label: 'Privacy', href: '/admin/data-privacy', matchPaths: ['/admin/data-privacy'] },
            { label: 'API Tokens', href: '/admin/api-tokens', matchPaths: ['/admin/api-tokens'] },
            { label: 'Accessibility', href: '/admin/accessibility', matchPaths: ['/admin/accessibility'] },
          ],
        },
      ],
    },
  ]
}

// ─── Course Context Navigation ──────────────────────

export function getCourseNavSections(courseId: string): NavSection[] {
  const base = `/courses/${courseId}`
  return [
    { items: [{ label: 'Back to Dashboard', icon: ArrowLeft, href: '/dashboard' }] },
    {
      title: 'Course',
      items: [
        { label: 'Home', icon: Home, href: `${base}`, matchPaths: [base] },
        { label: 'Announcements', icon: Megaphone, href: `${base}/announcements`, matchPaths: [`${base}/announcements`] },
        { label: 'Assignments', icon: FileText, href: `${base}/assignments`, matchPaths: [`${base}/assignments`] },
        { label: 'Quizzes', icon: CircleHelp, href: `${base}/quizzes`, matchPaths: [`${base}/quizzes`] },
        { label: 'Discussions', icon: MessageSquare, href: `${base}/discussions`, matchPaths: [`${base}/discussions`] },
        { label: 'Modules', icon: Layers, href: `${base}/modules`, matchPaths: [`${base}/modules`] },
        { label: 'Grades', icon: BarChart3, href: `${base}/grades`, matchPaths: [`${base}/grades`] },
        { label: 'Pages', icon: FileEdit, href: `${base}/pages`, matchPaths: [`${base}/pages`] },
        { label: 'Files', icon: Folder, href: `${base}/files`, matchPaths: [`${base}/files`] },
        { label: 'People', icon: Users, href: `${base}/people`, matchPaths: [`${base}/people`] },
        { label: 'Syllabus', icon: BookOpen, href: `${base}/syllabus`, matchPaths: [`${base}/syllabus`] },
      ],
    },
    {
      title: 'Assessment',
      collapsible: true,
      defaultOpen: false,
      items: [{
        label: 'Assessment Tools', icon: Star, href: `${base}/grades`,
        matchPaths: [`${base}/rubrics`, `${base}/outcomes`, `${base}/speed-grader`, `${base}/gradebook`],
        children: [
          { label: 'Rubrics', href: `${base}/rubrics`, matchPaths: [`${base}/rubrics`] },
          { label: 'Outcomes', href: `${base}/outcomes`, matchPaths: [`${base}/outcomes`] },
          { label: 'SpeedGrader', href: `${base}/speed-grader`, matchPaths: [`${base}/speed-grader`] },
          { label: 'Gradebook', href: `${base}/gradebook`, matchPaths: [`${base}/gradebook`] },
        ],
      }],
    },
    {
      title: 'Collaborate',
      collapsible: true,
      defaultOpen: false,
      items: [
        { label: 'Groups', icon: UserPlus, href: `${base}/groups`, matchPaths: [`${base}/groups`] },
        { label: 'Conferences', icon: Video, href: `${base}/conferences`, matchPaths: [`${base}/conferences`] },
        { label: 'Collaborations', icon: Handshake, href: `${base}/collaborations`, matchPaths: [`${base}/collaborations`] },
        { label: 'Analytics', icon: TrendingUp, href: `${base}/analytics`, matchPaths: [`${base}/analytics`] },
        { label: 'Settings', icon: Settings, href: `${base}/settings`, matchPaths: [`${base}/settings`], requiredRole: 'teacher' },
      ],
    },
  ]
}

// ─── Helpers ────────────────────────────────────────

export function isNavItemActive(pathname: string, item: NavItem): boolean {
  if (item.matchPaths) return item.matchPaths.some(p => pathname === p || pathname.startsWith(p + '/'))
  return pathname === item.href || pathname.startsWith(item.href + '/')
}

export function isNavItemOrChildActive(pathname: string, item: NavItem): boolean {
  if (isNavItemActive(pathname, item)) return true
  if (item.children) return item.children.some(child => isNavItemActive(pathname, child))
  return false
}

export function getAllNavItems(): NavItem[] {
  const items: NavItem[] = []
  for (const sec of getGlobalNavSections()) {
    for (const item of sec.items) {
      items.push(item)
      if (item.children) items.push(...item.children)
    }
  }
  return items
}
