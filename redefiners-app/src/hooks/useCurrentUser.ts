import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import type { CanvasUser } from '@/types/canvas'
import { ApiError } from '@/types/canvas'

export function useCurrentUser() {
  return useQuery({
    queryKey: ['user', 'self'],
    queryFn: async () => {
      const response = await apiGet<CanvasUser>('/v1/users/self/profile')
      return response.data
    },
    staleTime: 5 * 60 * 1000,
    retry: (count, error) => {
      if (error instanceof ApiError && error.status === 401) return false
      return count < 2
    },
  })
}
