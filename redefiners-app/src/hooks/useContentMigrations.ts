import { useQuery } from '@tanstack/react-query'
import { listMigrations, getMigration } from '@/services/modules/contentMigrations'
import type { CanvasContentMigration } from '@/services/modules/contentMigrations'

export function useContentMigrations(courseId: number | string) {
  return useQuery<CanvasContentMigration[]>({
    queryKey: ['contentMigrations', courseId],
    queryFn: async () => {
      const response = await listMigrations(courseId)
      return response.data
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  })
}

export function useContentMigration(courseId: number | string, id: number | string) {
  return useQuery<CanvasContentMigration>({
    queryKey: ['contentMigration', courseId, id],
    queryFn: async () => {
      const response = await getMigration(courseId, id)
      return response.data
    },
    enabled: !!courseId && !!id,
    staleTime: 5 * 60 * 1000,
  })
}
