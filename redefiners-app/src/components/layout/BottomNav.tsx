import { Link, useLocation } from 'react-router'
import { Home, BookOpen, Calendar, Mail, User } from 'lucide-react'

const NAV_ITEMS = [
  { icon: Home, label: 'Dashboard', href: '/dashboard' },
  { icon: BookOpen, label: 'Courses', href: '/courses' },
  { icon: Calendar, label: 'Calendar', href: '/calendar' },
  { icon: Mail, label: 'Inbox', href: '/inbox' },
  { icon: User, label: 'Profile', href: '/profile' },
]

export function BottomNav() {
  const { pathname } = useLocation()

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 flex items-center justify-around md:hidden"
      style={{
        height: '60px',
        background: 'var(--color-surface)',
        borderTop: '1px solid var(--color-surface-200)',
      }}
    >
      {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
        const isActive = pathname === href || pathname.startsWith(href + '/')
        return (
          <Link
            key={href}
            to={href}
            className="flex flex-1 flex-col items-center justify-center gap-0.5 no-underline"
            style={{ height: '100%' }}
          >
            <Icon
              className="h-5 w-5"
              style={{ color: isActive ? '#2DB88A' : 'var(--color-text-muted)' }}
            />
            <span
              style={{
                fontSize: '10px',
                fontWeight: isActive ? 600 : 400,
                color: isActive ? '#2DB88A' : 'var(--color-text-muted)',
              }}
            >
              {label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
