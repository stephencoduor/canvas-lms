import { useQuery } from '@tanstack/react-query'
import {
  getAccountUsers,
  getReports,
  getTerms,
  getDeveloperKeys,
  getRoles,
  getPermissions,
  getAccounts,
  getAnalytics,
} from '@/services/modules/admin'
import type {
  CanvasAccountUser,
  CanvasReport,
  CanvasTerm,
  CanvasDeveloperKey,
  CanvasRole,
  CanvasPermissions,
  CanvasAccount,
} from '@/services/modules/admin'

export function useAccounts() {
  return useQuery<CanvasAccount[]>({
    queryKey: ['admin', 'accounts'],
    queryFn: async () => {
      const response = await getAccounts()
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}

export function useAccountUsers(accountId: number | string) {
  return useQuery<CanvasAccountUser[]>({
    queryKey: ['admin', 'users', accountId],
    queryFn: async () => {
      const response = await getAccountUsers(accountId)
      return response.data
    },
    enabled: !!accountId,
  })
}

export function useReports(accountId: number | string) {
  return useQuery<CanvasReport[]>({
    queryKey: ['admin', 'reports', accountId],
    queryFn: async () => {
      const response = await getReports(accountId)
      return response.data
    },
    enabled: !!accountId,
  })
}

export function useTerms(accountId: number | string) {
  return useQuery<CanvasTerm[]>({
    queryKey: ['admin', 'terms', accountId],
    queryFn: async () => {
      const response = await getTerms(accountId)
      return response.data.enrollment_terms
    },
    enabled: !!accountId,
  })
}

export function useDeveloperKeys(accountId: number | string) {
  return useQuery<CanvasDeveloperKey[]>({
    queryKey: ['admin', 'developerKeys', accountId],
    queryFn: async () => {
      const response = await getDeveloperKeys(accountId)
      return response.data
    },
    enabled: !!accountId,
  })
}

export function useRoles(accountId: number | string) {
  return useQuery<CanvasRole[]>({
    queryKey: ['admin', 'roles', accountId],
    queryFn: async () => {
      const response = await getRoles(accountId)
      return response.data
    },
    enabled: !!accountId,
  })
}

export function usePermissions(accountId: number | string) {
  return useQuery<CanvasPermissions>({
    queryKey: ['admin', 'permissions', accountId],
    queryFn: async () => {
      const response = await getPermissions(accountId)
      return response.data
    },
    enabled: !!accountId,
  })
}

export function useAnalytics(accountId: number | string) {
  return useQuery<unknown>({
    queryKey: ['admin', 'analytics', accountId],
    queryFn: async () => {
      const response = await getAnalytics(accountId)
      return response.data
    },
    enabled: !!accountId,
  })
}
