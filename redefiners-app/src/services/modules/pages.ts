// Pages API module
// Ported from ReDefiners/js/api.js PagesAPI class

import { apiGet, apiPost, apiPut } from '@/services/api-client';
import type { ApiResponse, CanvasPage } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listPages(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasPage[]>> {
  return apiGet<CanvasPage[]>(`/v1/courses/${courseId}/pages`, {
    sort: 'title',
    ...params,
  });
}

export function getFrontPage(
  courseId: number | string,
): Promise<ApiResponse<CanvasPage>> {
  return apiGet<CanvasPage>(`/v1/courses/${courseId}/front_page`);
}

export function getPage(
  courseId: number | string,
  pageUrl: string,
): Promise<ApiResponse<CanvasPage>> {
  return apiGet<CanvasPage>(`/v1/courses/${courseId}/pages/${pageUrl}`);
}

export function createPage(
  courseId: number | string,
  data: Record<string, ParamValue>,
): Promise<ApiResponse<CanvasPage>> {
  return apiPost<CanvasPage>(
    `/v1/courses/${courseId}/pages`,
    { wiki_page: data },
  );
}

export function updatePage(
  courseId: number | string,
  pageUrl: string,
  data: Record<string, ParamValue>,
): Promise<ApiResponse<CanvasPage>> {
  return apiPut<CanvasPage>(
    `/v1/courses/${courseId}/pages/${pageUrl}`,
    { wiki_page: data },
  );
}
