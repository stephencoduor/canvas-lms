import { useQuery } from '@tanstack/react-query';
import { listPeople } from '@/services/modules/people';
import type { CanvasUser } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function usePeople(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
) {
  return useQuery<CanvasUser[]>({
    queryKey: ['people', courseId, params],
    queryFn: async () => {
      const response = await listPeople(courseId, params);
      return response.data;
    },
    enabled: !!courseId,
    staleTime: 5 * 60 * 1000,
  });
}
