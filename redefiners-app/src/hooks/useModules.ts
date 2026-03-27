import { useQuery } from '@tanstack/react-query';
import { listModules } from '@/services/modules/modules';
import type { CanvasModule } from '@/types/canvas';

export function useModules(courseId: number | string) {
  return useQuery<CanvasModule[]>({
    queryKey: ['modules', courseId],
    queryFn: async () => {
      const response = await listModules(courseId);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 300000ms — matches original cacheTTL
    enabled: !!courseId,
  });
}
