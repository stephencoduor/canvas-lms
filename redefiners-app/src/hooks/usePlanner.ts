import { useQuery } from '@tanstack/react-query'
import { getPlannerItems } from '@/services/modules/planner'
import type { CanvasPlannerItem } from '@/services/modules/planner'

export function usePlannerItems() {
  return useQuery<CanvasPlannerItem[]>({
    queryKey: ['planner', 'items'],
    queryFn: async () => {
      const response = await getPlannerItems()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}
