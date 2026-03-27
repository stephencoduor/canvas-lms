// Files API module
// Ported from ReDefiners/js/api.js FilesAPI class

import { apiGet } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasFile,
  CanvasFolder,
  CanvasQuota,
} from '@/types/canvas';

export function getRootFolder(
  courseId: number | string,
): Promise<ApiResponse<CanvasFolder>> {
  return apiGet<CanvasFolder>(`/v1/courses/${courseId}/folders/root`);
}

export function listFilesInFolder(
  courseId: number | string,
  folderId: number | string,
): Promise<ApiResponse<CanvasFile[]>> {
  return apiGet<CanvasFile[]>(`/v1/courses/${courseId}/folders/${folderId}/files`);
}

export function listFolders(
  courseId: number | string,
  folderId: number | string,
): Promise<ApiResponse<CanvasFolder[]>> {
  return apiGet<CanvasFolder[]>(`/v1/courses/${courseId}/folders/${folderId}/folders`);
}

export function getQuota(
  courseId: number | string,
): Promise<ApiResponse<CanvasQuota>> {
  return apiGet<CanvasQuota>(`/v1/courses/${courseId}/files/quota`);
}
