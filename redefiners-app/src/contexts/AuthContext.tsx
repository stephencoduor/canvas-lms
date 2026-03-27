import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { apiGet } from '@/services/api-client'
import type { CanvasUser } from '@/types/canvas'

export type UserRole = 'student' | 'teacher' | 'admin'

export interface AuthContextValue {
  user: CanvasUser | null
  isAuthenticated: boolean
  isLoading: boolean
  role: UserRole
  login: (username: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

function computeRole(user: CanvasUser | null): UserRole {
  if (!user) return 'student'

  // Check admin permissions
  if (user.permissions?.can_manage_account || user.permissions?.become_user) {
    return 'admin'
  }

  // Check teacher enrollment
  if (user.enrollments?.some((e) => e.role === 'TeacherEnrollment')) {
    return 'teacher'
  }

  return 'student'
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CanvasUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const isAuthenticated = user !== null

  const role = useMemo(() => computeRole(user), [user])

  const checkAuth = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await apiGet<CanvasUser>('/v1/users/self/profile')
      setUser(response.data)
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const login = useCallback(
    async (
      username: string,
      password: string,
    ): Promise<{ success: boolean; error?: string }> => {
      try {
        const response = await fetch('/login/canvas', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          credentials: 'same-origin',
          body: new URLSearchParams({
            'pseudonym_session[unique_id]': username,
            'pseudonym_session[password]': password,
            'pseudonym_session[remember_me]': '1',
          }),
          redirect: 'manual',
        })

        // Canvas returns 302 on success
        if (response.status === 302 || response.type === 'opaqueredirect' || response.ok) {
          await checkAuth()
          return { success: true }
        }

        return {
          success: false,
          error: 'Invalid username or password. Please try again.',
        }
      } catch {
        return {
          success: false,
          error: 'Unable to connect. Please check your network and try again.',
        }
      }
    },
    [checkAuth],
  )

  const logout = useCallback(async () => {
    setUser(null)
    // Canvas logout requires DELETE to /logout with the session cookie
    try {
      await fetch('/logout', {
        method: 'DELETE',
        credentials: 'same-origin',
        headers: { 'Accept': 'application/json' },
      })
    } catch {
      // Logout may fail - still redirect to login
    }
    // Mark as explicitly logged out so PublicRoute doesn't auto-redirect
    sessionStorage.setItem('just_logged_out', '1')
    // Full page reload to clear all React state and Canvas session
    window.location.href = '/login'
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated,
      isLoading,
      role,
      login,
      logout,
      checkAuth,
    }),
    [user, isAuthenticated, isLoading, role, login, logout, checkAuth],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
