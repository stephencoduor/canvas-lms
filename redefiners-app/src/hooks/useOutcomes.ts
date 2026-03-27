import { useQuery } from '@tanstack/react-query'
import { getOutcomeGroups, getGroupOutcomes } from '@/services/modules/outcomes'
import type { CanvasOutcomeGroup, CanvasOutcome } from '@/services/modules/outcomes'

export function useOutcomeGroups(courseId: number | string) {
  return useQuery<CanvasOutcomeGroup[]>({
    queryKey: ['outcomes', 'groups', courseId],
    queryFn: async () => {
      const response = await getOutcomeGroups(courseId)
      return response.data
    },
    enabled: !!courseId,
  })
}

export function useGroupOutcomes(courseId: number | string, groupId: number | string) {
  return useQuery<CanvasOutcome[]>({
    queryKey: ['outcomes', 'groups', courseId, groupId],
    queryFn: async () => {
      const response = await getGroupOutcomes(courseId, groupId)
      return response.data
    },
    enabled: !!courseId && !!groupId,
  })
}
