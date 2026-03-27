import { useQuery } from '@tanstack/react-query'
import { listCollaborations } from '@/services/modules/collaborations'
import type { CanvasCollaboration } from '@/services/modules/collaborations'

export function useCollaborations(courseId: number | string) {
  return useQuery<CanvasCollaboration[]>({
    queryKey: ['collaborations', courseId],
    queryFn: async () => {
      const response = await listCollaborations(courseId)
      return response.data
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  })
}
