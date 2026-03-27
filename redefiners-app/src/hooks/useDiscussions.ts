import { useQuery } from '@tanstack/react-query';
import { listDiscussions } from '@/services/modules/discussions';
import type { CanvasDiscussionTopic } from '@/types/canvas';

export function useDiscussions(courseId: number | string) {
  return useQuery<CanvasDiscussionTopic[]>({
    queryKey: ['discussions', courseId],
    queryFn: async () => {
      const response = await listDiscussions(courseId);
      return response.data;
    },
    enabled: !!courseId,
  });
}
