import { memo, useRef, useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { cn } from '@/lib/utils'
import { isNavItemActive } from '@/lib/navigation'
import type { NavItem } from '@/lib/navigation'

interface SidebarSubmenuProps {
  items: NavItem[]
  open: boolean
}

export const SidebarSubmenu = memo(function SidebarSubmenu({ items, open }: SidebarSubmenuProps) {
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  const { pathname } = useLocation()

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight)
    }
  }, [items])

  return (
    <div
      className="overflow-hidden transition-all duration-200 ease-in-out"
      style={{ maxHeight: open ? `${height}px` : '0px' }}
    >
      <div ref={contentRef} className="py-1">
        {items.map((child) => {
          const active = isNavItemActive(pathname, child)
          return (
            <Link
              key={child.href}
              to={child.href}
              className={cn(
                'flex items-center gap-2 rounded-md px-3 py-1.5 text-[13px] no-underline transition-colors ml-7',
                active
                  ? 'text-white font-medium'
                  : 'text-white/60 hover:text-white/90 hover:bg-white/[0.06]'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 rounded-full shrink-0',
                  active ? 'bg-[#2DB88A]' : 'bg-white/30'
                )}
              />
              <span className="truncate">{child.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
})
