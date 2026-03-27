// Modules API module
// Ported from ReDefiners/js/api.js ModulesAPI class

import { apiGet, apiPut } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasModule,
  CanvasModuleItem,
  CanvasModuleItemSequence,
} from '@/types/canvas';

export function listModules(
  courseId: number | string,
): Promise<ApiResponse<CanvasModule[]>> {
  return apiGet<CanvasModule[]>(`/v1/courses/${courseId}/modules`, {
    include: ['items', 'content_details'],
  });
}

export function getModuleItems(
  courseId: number | string,
  moduleId: number | string,
): Promise<ApiResponse<CanvasModuleItem[]>> {
  return apiGet<CanvasModuleItem[]>(`/v1/courses/${courseId}/modules/${moduleId}/items`, {
    include: ['content_details'],
  });
}

export function markItemDone(
  courseId: number | string,
  moduleId: number | string,
  itemId: number | string,
): Promise<ApiResponse<void>> {
  return apiPut<void>(
    `/v1/courses/${courseId}/modules/${moduleId}/items/${itemId}/done`,
  );
}

export function getItemSequence(
  courseId: number | string,
  assetType: string,
  assetId: number | string,
): Promise<ApiResponse<CanvasModuleItemSequence>> {
  return apiGet<CanvasModuleItemSequence>(`/v1/courses/${courseId}/module_item_sequence`, {
    asset_type: assetType,
    asset_id: String(assetId),
  });
}
