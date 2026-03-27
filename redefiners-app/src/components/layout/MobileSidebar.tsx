import { useMemo } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetTitle,
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { SidebarItem } from '@/components/layout/SidebarItem'
import {
  getGlobalNavSections,
  getCourseNavSections,
  type NavSection,
} from '@/lib/navigation'

export function MobileSidebar() {
  const { pathname } = useLocation()
  const params = useParams()

  const courseId = params.courseId ?? extractCourseId(pathname)

  const sections: NavSection[] = useMemo(() => {
    if (courseId) {
      return getCourseNavSections(courseId)
    }
    return getGlobalNavSections()
  }, [courseId])

  return (
    <div className="lg:hidden">
      <Sheet>
        <SheetTrigger
          render={
            <Button
              variant="ghost"
              size="icon"
              className="text-white/80 hover:text-white hover:bg-white/10"
            />
          }
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </SheetTrigger>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="w-[280px] p-0 border-none gradient-sidebar"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5 px-5 py-5 pb-3">
            <SheetTitle render={<span />} className="sr-only">
              Navigation
            </SheetTitle>
            <Link to="/dashboard" className="flex items-center gap-2 no-underline">
              <img
                src={`${import.meta.env.BASE_URL}Images/logo.PNG`}
                alt="ReDefiners"
                className="h-8"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).style.display = 'none'
                }}
              />
              <span
                className="text-white font-semibold text-base"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                ReDefiners
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-3 pb-4 h-[calc(100vh-72px)]">
            <nav className="flex flex-col gap-0.5">
              {sections.map((section, idx) => (
                <div key={section.title ?? idx}>
                  {section.title && (
                    <div className="px-3 pt-5 pb-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/40">
                        {section.title}
                      </span>
                    </div>
                  )}
                  {section.items.map((item) => (
                    <SidebarItem key={item.href + item.label} item={item} />
                  ))}
                </div>
              ))}
            </nav>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </div>
  )
}

function extractCourseId(pathname: string): string | undefined {
  const match = pathname.match(/^\/courses\/(\d+)/)
  return match?.[1]
}
