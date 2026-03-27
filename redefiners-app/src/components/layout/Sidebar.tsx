import { useState, useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Search, ChevronDown, Clock, Pin } from 'lucide-react'
import { SidebarItem } from '@/components/layout/SidebarItem'
import {
  getGlobalNavSections,
  getCourseNavSections,
  searchNavItems,
  getRecentPages,
  getFavorites,
  getAllNavItems,
  type NavSection,
  type NavItem,
} from '@/lib/navigation'

export function Sidebar() {
  const { pathname } = useLocation()
  const params = useParams()
  const [searchQuery, setSearchQuery] = useState('')
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({})

  const courseId = params.courseId ?? extractCourseId(pathname)

  const sections: NavSection[] = useMemo(() => {
    if (courseId) return getCourseNavSections(courseId)
    return getGlobalNavSections()
  }, [courseId])

  const searchResults = useMemo(() => searchNavItems(searchQuery), [searchQuery])
  const recentPages = useMemo(() => getRecentPages(), [pathname])
  const favorites = useMemo(() => {
    const favHrefs = getFavorites()
    if (favHrefs.length === 0) return []
    const allItems = getAllNavItems()
    return favHrefs.map(h => allItems.find(i => i.href === h)).filter(Boolean) as NavItem[]
  }, [pathname])

  const toggleSection = (title: string) => {
    setCollapsedSections(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const isSectionOpen = (section: NavSection) => {
    const title = section.title || ''
    if (title in collapsedSections) return !collapsedSections[title]
    return section.defaultOpen !== false
  }

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden w-[240px] flex-col lg:flex"
      style={{ background: 'var(--sidebar-bg)', overflowY: 'auto', overflowX: 'hidden' }}
    >
      {/* Logo */}
      <div style={{ paddingBottom: '12px', paddingTop: '5px' }}>
        <Link to="/dashboard" className="flex items-center gap-2 px-5 pt-4 no-underline">
          <img
            src={`${import.meta.env.BASE_URL}Images/logo.PNG`}
            alt="ReDefiners"
            style={{ maxWidth: '160px', paddingTop: '15px', filter: 'var(--sidebar-logo-filter, none)' }}
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        </Link>
      </div>

      {/* Sidebar Search */}
      <div style={{ padding: '0 12px 8px' }}>
        <div
          style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(255,255,255,0.08)', borderRadius: '8px',
            padding: '6px 10px',
          }}
        >
          <Search style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.4)', flexShrink: 0 }} />
          <input
            type="text"
            placeholder="Search pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              background: 'transparent', border: 'none', outline: 'none',
              color: '#fff', fontSize: '12px', width: '100%',
              fontFamily: "'Inter', sans-serif",
            }}
          />
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && searchResults.length > 0 && (
        <div style={{ padding: '0 8px 8px' }}>
          <div style={{ fontSize: '10px', color: 'var(--sidebar-section-header)', padding: '4px 12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Results
          </div>
          {searchResults.map(item => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSearchQuery('')}
              className="no-underline"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', borderRadius: '8px', margin: '0 4px',
                fontSize: '12px', color: 'var(--sidebar-text)',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              {item.icon && <item.icon style={{ width: '14px', height: '14px' }} />}
              <span>{item.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Favorites Section */}
      {!searchQuery && favorites.length > 0 && (
        <div style={{ padding: '0 0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 20px 4px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sidebar-section-header)' }}>
            <Pin style={{ width: '10px', height: '10px' }} /> Pinned
          </div>
          {favorites.map(item => (
            <SidebarItem key={'fav-' + item.href} item={{ ...item, children: undefined }} />
          ))}
        </div>
      )}

      {/* Recent Pages */}
      {!searchQuery && recentPages.length > 0 && !courseId && (
        <div style={{ padding: '0 0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 20px 4px', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--sidebar-section-header)' }}>
            <Clock style={{ width: '10px', height: '10px' }} /> Recent
          </div>
          {recentPages.slice(0, 3).map(r => (
            <Link
              key={'recent-' + r.href}
              to={r.href}
              className="no-underline"
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '6px 16px 6px 20px', fontSize: '12px',
                color: 'var(--sidebar-text)', borderRadius: '8px', margin: '0 10px',
              }}
              onMouseOver={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)' }}
              onMouseOut={(e) => { e.currentTarget.style.background = 'transparent' }}
            >
              <Clock style={{ width: '12px', height: '12px', opacity: 0.5 }} />
              <span className="truncate">{r.label}</span>
            </Link>
          ))}
        </div>
      )}

      {/* Main Navigation */}
      {!searchQuery && (
        <nav
          className="flex flex-1 flex-col gap-0.5 pb-5"
          style={{ overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.15) transparent' }}
        >
          {sections.map((section, idx) => {
            const isOpen = isSectionOpen(section)
            return (
              <div key={section.title ?? idx}>
                {section.title && (
                  <div
                    onClick={() => section.collapsible && toggleSection(section.title!)}
                    style={{
                      padding: '12px 20px 6px', fontSize: '10px', fontWeight: 600,
                      textTransform: 'uppercase', letterSpacing: '0.08em',
                      color: 'var(--sidebar-section-header)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      cursor: section.collapsible ? 'pointer' : 'default',
                      userSelect: 'none',
                    }}
                  >
                    {section.title}
                    {section.collapsible && (
                      <ChevronDown
                        style={{
                          width: '12px', height: '12px', transition: 'transform 0.2s',
                          transform: isOpen ? 'rotate(0deg)' : 'rotate(-90deg)',
                          opacity: 0.5,
                        }}
                      />
                    )}
                  </div>
                )}
                {isOpen && section.items.map((item) => (
                  <SidebarItem key={item.href + item.label} item={item} />
                ))}
              </div>
            )
          })}
        </nav>
      )}

      <style>{`
        aside::-webkit-scrollbar { width: 4px; }
        aside::-webkit-scrollbar-track { background: transparent; }
        aside::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 4px; }
      `}</style>
    </aside>
  )
}

function extractCourseId(pathname: string): string | undefined {
  const match = pathname.match(/^\/courses\/(\d+)/)
  return match?.[1]
}
