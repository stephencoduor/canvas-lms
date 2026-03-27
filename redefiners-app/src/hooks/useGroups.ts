import { useQuery } from '@tanstack/react-query';
import { listGroups, type CanvasGroup } from '@/services/modules/groups';

export function useGroups(courseId: number | string) {
  return useQuery<CanvasGroup[]>({
    queryKey: ['groups', courseId],
    queryFn: async () => {
      const response = await listGroups(courseId);
      return response.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
