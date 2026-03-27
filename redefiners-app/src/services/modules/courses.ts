// Courses API module
// Ported from ReDefiners/js/api.js CoursesAPI class

import { apiGet } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasCourse,
  CanvasCourseSettings,
  CanvasSection,
  CanvasTab,
  CanvasUser,
} from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listCourses(
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasCourse[]>> {
  return apiGet<CanvasCourse[]>('/v1/courses', {
    include: ['term', 'teachers', 'total_scores', 'enrollments'],
    ...params,
  });
}

export function getCourse(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasCourse>> {
  return apiGet<CanvasCourse>(`/v1/courses/${courseId}`, {
    include: ['syllabus_body', 'teachers', 'term'],
    ...params,
  });
}

export function getCourseTabs(
  courseId: number | string,
): Promise<ApiResponse<CanvasTab[]>> {
  return apiGet<CanvasTab[]>(`/v1/courses/${courseId}/tabs`);
}

export function getCourseSettings(
  courseId: number | string,
): Promise<ApiResponse<CanvasCourseSettings>> {
  return apiGet<CanvasCourseSettings>(`/v1/courses/${courseId}/settings`);
}

export function getCourseUsers(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasUser[]>> {
  return apiGet<CanvasUser[]>(`/v1/courses/${courseId}/users`, {
    include: ['enrollments', 'avatar_url'],
    ...params,
  });
}

export function getCourseSections(
  courseId: number | string,
): Promise<ApiResponse<CanvasSection[]>> {
  return apiGet<CanvasSection[]>(`/v1/courses/${courseId}/sections`);
}
