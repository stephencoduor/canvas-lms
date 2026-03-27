import { useQuery } from '@tanstack/react-query'
import { apiGet } from '@/services/api-client'
import type { CanvasCourse } from '@/types/canvas'

export function useCourses() {
  return useQuery({
    queryKey: ['courses'],
    queryFn: async () => {
      const response = await apiGet<CanvasCourse[]>('/v1/courses', {
        include: ['term', 'total_students', 'teachers', 'enrollments'],
        per_page: 50,
        enrollment_state: 'active',
        'state[]': 'available',
      })
      return response.data
    },
    staleTime: 10 * 60 * 1000,
  })
}
