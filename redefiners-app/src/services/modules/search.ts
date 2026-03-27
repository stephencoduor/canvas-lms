// Search API module

import { apiGet } from '@/services/api-client'
import type { ApiResponse, CanvasCourse } from '@/types/canvas'

type ParamValue = string | number | boolean | string[] | number[] | undefined | null

export interface SearchRecipient {
  id: number
  name: string
  full_name: string
  avatar_url: string
  user_count?: number
  common_courses?: Record<string, string[]>
  common_groups?: Record<string, string[]>
}

export function searchRecipients(
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<SearchRecipient[]>> {
  return apiGet<SearchRecipient[]>('/v1/search/recipients', {
    per_page: 20,
    ...params,
  })
}

export function searchCourses(
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasCourse[]>> {
  return apiGet<CanvasCourse[]>('/v1/courses', {
    include: ['term', 'teachers', 'total_scores'],
    per_page: 20,
    ...params,
  })
}
