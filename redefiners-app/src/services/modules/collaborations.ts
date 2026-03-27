// Collaborations API module

import { apiGet } from '@/services/api-client'
import type { ApiResponse } from '@/types/canvas'

export interface CanvasCollaboration {
  id: number
  collaboration_type: string
  document_id: string
  user_id: number
  context_id: number
  context_type: string
  url: string
  created_at: string
  updated_at: string
  description: string | null
  title: string
  type: string
  update_url: string
  user_name: string
}

export function listCollaborations(
  courseId: number | string,
): Promise<ApiResponse<CanvasCollaboration[]>> {
  return apiGet<CanvasCollaboration[]>(
    `/v1/courses/${courseId}/collaborations`,
  )
}
