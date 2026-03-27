// People API module
// Ported from ReDefiners/js/api.js PeopleAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse, CanvasUser } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listPeople(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasUser[]>> {
  return apiGet<CanvasUser[]>(
    `/v1/courses/${courseId}/users`,
    {
      include: ['avatar_url', 'enrollments', 'email'],
      per_page: 50,
      ...params,
    },
  );
}
