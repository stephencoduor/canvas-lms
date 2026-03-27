import { Navigate, Outlet } from 'react-router'
import { useAuth } from '@/hooks/useAuth'

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-400 border-t-transparent" />
      </div>
    )
  }

  // Check if user just logged out — don't auto-redirect back to dashboard
  const justLoggedOut = sessionStorage.getItem('just_logged_out')
  if (justLoggedOut) {
    sessionStorage.removeItem('just_logged_out')
    return <Outlet />
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
