import { Outlet } from 'react-router'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'
import { BottomNav } from '@/components/layout/BottomNav'

export function AppLayout() {
  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Inter, Poppins, system-ui, sans-serif' }}>
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex flex-1 flex-col lg:ml-[240px]">
        <TopBar />
        <div
          className="flex-1 p-4 pb-20 md:p-6 md:pb-6 lg:p-8"
          style={{ background: 'var(--color-page)' }}
        >
          <Outlet />
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  )
}
