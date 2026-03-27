// Planner API module
// Ported from ReDefiners/js/api.js PlannerAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export interface CanvasPlannerItem {
  plannable_id: number;
  plannable_type: string;
  plannable_date: string;
  plannable: {
    id: number;
    title: string;
    due_at?: string;
    points_possible?: number;
    course_id?: number;
    created_at: string;
    updated_at: string;
  };
  context_type: string;
  context_name?: string;
  context_image?: string;
  course_id?: number;
  html_url: string;
  planner_override?: {
    id: number;
    plannable_type: string;
    plannable_id: number;
    marked_complete: boolean;
    dismissed: boolean;
  } | null;
  submissions?: {
    submitted: boolean;
    graded: boolean;
    excused: boolean;
  };
}

export function getPlannerItems(
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasPlannerItem[]>> {
  return apiGet<CanvasPlannerItem[]>('/v1/planner/items', params);
}

export function getPlannerOverrides(): Promise<ApiResponse<unknown[]>> {
  return apiGet<unknown[]>('/v1/planner/overrides');
}
