import { Search, Bell, Mail, Menu, Sun, Moon, Palette, Check } from 'lucide-react'
import { UserMenu } from '@/components/layout/UserMenu'
import { useTheme } from '@/contexts/ThemeContext'
import { useNotificationPolling } from '@/hooks/useNotificationPolling'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface TopBarProps {
  onMenuClick?: () => void
}

export function TopBar({ onMenuClick }: TopBarProps) {
  const { mode, toggleMode, themeId, setTheme, availableThemes } = useTheme()
  const { unreadCount } = useNotificationPolling()

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between"
      style={{
        height: '64px',
        background: 'var(--color-surface)',
        borderBottom: '1px solid var(--color-surface-200)',
        padding: '0 24px',
      }}
    >
      {/* Left: hamburger + search */}
      <div className="flex items-center gap-3">
        <button
          className="flex h-9 w-9 items-center justify-center rounded-lg lg:hidden"
          onClick={onMenuClick}
          aria-label="Toggle sidebar"
          style={{
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <Menu className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <div
          className="hidden items-center sm:flex"
          style={{
            borderRadius: '9999px',
            background: 'var(--color-surface-100)',
            border: '1px solid var(--color-surface-200)',
            padding: '0 16px',
            height: '40px',
            width: '400px',
            maxWidth: '400px',
            gap: '8px',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        >
          <Search className="shrink-0" style={{ color: 'var(--color-text-secondary)', width: '14px', height: '14px' }} />
          <input
            type="search"
            placeholder="Search courses, assignments..."
            style={{
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontFamily: "'Inter', 'Poppins', sans-serif",
              fontSize: '13px',
              color: 'var(--color-text-primary)',
              flex: 1,
              minWidth: 0,
            }}
          />
        </div>
      </div>

      {/* Right: theme picker + theme toggle + notification icons + avatar */}
      <div className="flex items-center gap-2">
        {/* Theme Picker Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-100)]"
            aria-label="Switch theme"
            style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
          >
            <Palette className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent align="end" sideOffset={8} style={{ minWidth: '220px' }}>
              <DropdownMenuLabel>Choose Theme</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availableThemes.map((t) => (
                <DropdownMenuItem
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
                >
                  {/* Color preview dots */}
                  <div className="flex items-center gap-1.5">
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border border-neutral-200"
                      style={{ background: t.colors.sidebarBg }}
                    />
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border border-neutral-200"
                      style={{ background: t.colors.accentGreen }}
                    />
                    <span
                      className="inline-block h-3.5 w-3.5 rounded-full border border-neutral-200"
                      style={{ background: t.colors.pageBg }}
                    />
                  </div>
                  <span className="flex-1 text-sm">{t.name}</span>
                  {themeId === t.id && (
                    <Check className="h-4 w-4 shrink-0" style={{ color: 'var(--color-accent-green)' }} />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        {/* Dark/Light mode toggle */}
        <button
          onClick={toggleMode}
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-100)]"
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          {mode === 'dark' ? (
            <Sun className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
          ) : (
            <Moon className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
          )}
        </button>

        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-100)]"
          aria-label="Notifications"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Bell className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
          {unreadCount > 0 && (
            <span
              className="absolute flex items-center justify-center rounded-full text-white"
              style={{
                top: '-2px',
                right: '-2px',
                height: '16px',
                minWidth: '16px',
                background: '#EF4444',
                fontSize: '10px',
                fontWeight: 700,
                padding: '0 4px',
              }}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </button>

        <button
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-surface-100)]"
          aria-label="Inbox"
          style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
        >
          <Mail className="h-5 w-5" style={{ color: 'var(--color-text-secondary)' }} />
        </button>

        <UserMenu />
      </div>
    </header>
  )
}
