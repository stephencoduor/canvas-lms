import { useQuery } from '@tanstack/react-query'
import { listRubrics, getRubric } from '@/services/modules/rubrics'
import type { CanvasRubric } from '@/services/modules/rubrics'

export function useRubrics(courseId: number | string) {
  return useQuery<CanvasRubric[]>({
    queryKey: ['rubrics', courseId],
    queryFn: async () => {
      const response = await listRubrics(courseId)
      return response.data
    },
    enabled: !!courseId,
  })
}

export function useRubric(courseId: number | string, rubricId: number | string) {
  return useQuery<CanvasRubric>({
    queryKey: ['rubrics', courseId, rubricId],
    queryFn: async () => {
      const response = await getRubric(courseId, rubricId)
      return response.data
    },
    enabled: !!courseId && !!rubricId,
  })
}
