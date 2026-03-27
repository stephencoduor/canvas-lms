// Groups API module
// Ported from ReDefiners/js/api.js GroupsAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

export interface CanvasGroup {
  id: number;
  name: string;
  description: string | null;
  members_count: number;
  context_type: string;
  course_id: number | null;
  group_category_id: number | null;
  created_at: string;
  avatar_url: string | null;
  join_level: string;
  leader: { id: number; display_name: string } | null;
}

export interface CanvasGroupCategory {
  id: number;
  name: string;
  context_type: string;
  group_limit: number | null;
  auto_leader: string | null;
  groups_count: number;
}

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listGroups(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasGroup[]>> {
  return apiGet<CanvasGroup[]>(
    `/v1/courses/${courseId}/groups`,
    { per_page: 50, ...params },
  );
}

export function getGroup(
  groupId: number | string,
): Promise<ApiResponse<CanvasGroup>> {
  return apiGet<CanvasGroup>(
    `/v1/groups/${groupId}`,
  );
}
