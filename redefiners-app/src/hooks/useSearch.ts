import { useQuery } from '@tanstack/react-query'
import { searchRecipients, searchCourses } from '@/services/modules/search'
import type { SearchRecipient } from '@/services/modules/search'
import type { CanvasCourse } from '@/types/canvas'

export function useSearchRecipients(query: string) {
  return useQuery<SearchRecipient[]>({
    queryKey: ['search', 'recipients', query],
    queryFn: async () => {
      const response = await searchRecipients({ search: query })
      return response.data
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}

export function useSearchCourses(query: string) {
  return useQuery<CanvasCourse[]>({
    queryKey: ['search', 'courses', query],
    queryFn: async () => {
      const response = await searchCourses({ search_term: query })
      return response.data
    },
    enabled: query.length >= 2,
    staleTime: 30 * 1000,
  })
}
