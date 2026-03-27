import { useQuery } from '@tanstack/react-query';
import {
  listConferences,
  type CanvasConference,
} from '@/services/modules/conferences';

export function useConferences(courseId: number | string) {
  return useQuery<CanvasConference[]>({
    queryKey: ['conferences', courseId],
    queryFn: async () => {
      const response = await listConferences(courseId);
      const data = response.data;
      return data.conferences ?? [];
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
