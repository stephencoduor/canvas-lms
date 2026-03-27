import { useQuery } from '@tanstack/react-query';
import { listAnnouncements } from '@/services/modules/announcements';
import type { CanvasAnnouncement } from '@/types/canvas';

export function useAnnouncements(contextCodes: string[]) {
  return useQuery<CanvasAnnouncement[]>({
    queryKey: ['announcements', contextCodes],
    queryFn: async () => {
      const response = await listAnnouncements(contextCodes);
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 300000ms — matches original cacheTTL
    enabled: contextCodes.length > 0,
  });
}
