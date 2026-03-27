import { useQuery } from '@tanstack/react-query';
import { listPages, getPage } from '@/services/modules/pages';
import type { CanvasPage } from '@/types/canvas';

export function usePages(courseId: number | string) {
  return useQuery<CanvasPage[]>({
    queryKey: ['pages', courseId],
    queryFn: async () => {
      const response = await listPages(courseId);
      return response.data;
    },
    staleTime: 10 * 60 * 1000, // 600000ms — matches original cacheTTL
    enabled: !!courseId,
  });
}

export function usePage(courseId: number | string, pageUrl: string) {
  return useQuery<CanvasPage>({
    queryKey: ['page', courseId, pageUrl],
    queryFn: async () => {
      const response = await getPage(courseId, pageUrl);
      return response.data;
    },
    enabled: !!courseId && !!pageUrl,
  });
}
