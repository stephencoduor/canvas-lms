// Grades API module
// Ported from ReDefiners/js/api.js GradesAPI class

import { apiGet } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasAssignmentGroup,
  CanvasEnrollment,
} from '@/types/canvas';

export function getEnrollments(
  courseId: number | string,
): Promise<ApiResponse<CanvasEnrollment[]>> {
  return apiGet<CanvasEnrollment[]>(`/v1/courses/${courseId}/enrollments`, {
    user_id: 'self',
    include: ['grades'],
  });
}

export function getAssignmentGroupsWithGrades(
  courseId: number | string,
): Promise<ApiResponse<CanvasAssignmentGroup[]>> {
  return apiGet<CanvasAssignmentGroup[]>(`/v1/courses/${courseId}/assignment_groups`, {
    include: ['assignments', 'submission'],
  });
}
