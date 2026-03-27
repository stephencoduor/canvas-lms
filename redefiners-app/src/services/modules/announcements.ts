// Announcements API module
// Ported from ReDefiners/js/api.js AnnouncementsAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse, CanvasAnnouncement } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listAnnouncements(
  contextCodes: string[],
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasAnnouncement[]>> {
  return apiGet<CanvasAnnouncement[]>('/v1/announcements', {
    context_codes: contextCodes,
    ...params,
  });
}
