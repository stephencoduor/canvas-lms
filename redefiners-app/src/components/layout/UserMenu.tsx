import { useAuth } from '@/hooks/useAuth'
import { useCurrentUser } from '@/hooks/useCurrentUser'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { User, Settings, Bell, LogOut } from 'lucide-react'
import { Link } from 'react-router'

export function UserMenu() {
  const { logout, user: authUser } = useAuth()
  const { data: user } = useCurrentUser()

  const displayUser = user ?? authUser
  const initials = displayUser?.short_name
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) ?? '?'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="cursor-pointer rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
        style={{ background: 'transparent', border: 'none', padding: 0 }}
      >
        {displayUser?.avatar_url ? (
          <img
            src={displayUser.avatar_url}
            alt={displayUser.short_name ?? 'User'}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              objectFit: 'cover',
              border: '2px solid var(--color-accent-green)',
            }}
          />
        ) : (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'var(--color-accent-green)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '13px',
              fontWeight: 700,
              fontFamily: "'Inter', sans-serif",
              border: '2px solid var(--color-surface-200)',
            }}
          >
            {initials}
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" sideOffset={8} style={{ minWidth: '220px' }}>
          <div style={{ padding: '10px 14px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)' }}>
              {displayUser?.short_name ?? 'User'}
            </p>
            <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {displayUser?.email ?? displayUser?.login_id ?? ''}
            </p>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem render={<Link to="/profile" />}>
            <User className="mr-2 h-4 w-4" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to="/settings" />}>
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem render={<Link to="/notifications" />}>
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            style={{ color: '#EF4444', cursor: 'pointer' }}
            onClick={(e) => {
              e.preventDefault()
              logout()
            }}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  )
}
