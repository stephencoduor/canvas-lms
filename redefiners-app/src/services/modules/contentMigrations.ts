// Content Migrations API module

import { apiGet } from '@/services/api-client'
import type { ApiResponse } from '@/types/canvas'

export interface CanvasContentMigration {
  id: number
  migration_type: string
  migration_type_title: string
  workflow_state: 'pre_processing' | 'pre_processed' | 'running' | 'waiting_for_select' | 'completed' | 'failed'
  started_at: string | null
  finished_at: string | null
  created_at: string
  progress_url: string
  migration_issues_url: string
  migration_issues_count: number
  attachment?: {
    url: string
    filename: string
  }
}

export function listMigrations(
  courseId: number | string,
): Promise<ApiResponse<CanvasContentMigration[]>> {
  return apiGet<CanvasContentMigration[]>(
    `/v1/courses/${courseId}/content_migrations`,
  )
}

export function getMigration(
  courseId: number | string,
  id: number | string,
): Promise<ApiResponse<CanvasContentMigration>> {
  return apiGet<CanvasContentMigration>(
    `/v1/courses/${courseId}/content_migrations/${id}`,
  )
}
