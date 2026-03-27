// Assignments API module
// Ported from ReDefiners/js/api.js AssignmentsAPI class

import { apiGet, apiPost, apiPut } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasAssignment,
  CanvasAssignmentGroup,
  CanvasPeerReview,
  CanvasRubric,
  CanvasSubmission,
} from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listAssignments(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasAssignment[]>> {
  return apiGet<CanvasAssignment[]>(`/v1/courses/${courseId}/assignments`, {
    include: ['submission', 'score_statistics'],
    order_by: 'position',
    ...params,
  });
}

export function getAssignment(
  courseId: number | string,
  assignmentId: number | string,
): Promise<ApiResponse<CanvasAssignment>> {
  return apiGet<CanvasAssignment>(`/v1/courses/${courseId}/assignments/${assignmentId}`, {
    include: ['submission', 'rubric_assessment'],
  });
}

export function getAssignmentGroups(
  courseId: number | string,
): Promise<ApiResponse<CanvasAssignmentGroup[]>> {
  return apiGet<CanvasAssignmentGroup[]>(`/v1/courses/${courseId}/assignment_groups`, {
    include: ['assignments', 'submission'],
  });
}

export function getSubmission(
  courseId: number | string,
  assignmentId: number | string,
  userId: number | string = 'self',
): Promise<ApiResponse<CanvasSubmission>> {
  return apiGet<CanvasSubmission>(
    `/v1/courses/${courseId}/assignments/${assignmentId}/submissions/${userId}`,
  );
}

export function submitAssignment(
  courseId: number | string,
  assignmentId: number | string,
  submission: Record<string, ParamValue>,
): Promise<ApiResponse<CanvasSubmission>> {
  return apiPost<CanvasSubmission>(
    `/v1/courses/${courseId}/assignments/${assignmentId}/submissions`,
    { submission },
  );
}

export function getRubric(
  courseId: number | string,
  rubricId: number | string,
): Promise<ApiResponse<CanvasRubric>> {
  return apiGet<CanvasRubric>(`/v1/courses/${courseId}/rubrics/${rubricId}`);
}

export function getPeerReviews(
  courseId: number | string,
  assignmentId: number | string,
): Promise<ApiResponse<CanvasPeerReview[]>> {
  return apiGet<CanvasPeerReview[]>(
    `/v1/courses/${courseId}/assignments/${assignmentId}/peer_reviews`,
  );
}

export function createAssignment(
  courseId: number | string,
  data: Record<string, ParamValue>,
): Promise<ApiResponse<CanvasAssignment>> {
  return apiPost<CanvasAssignment>(
    `/v1/courses/${courseId}/assignments`,
    { assignment: data },
  );
}

export function updateAssignment(
  courseId: number | string,
  assignmentId: number | string,
  data: Record<string, ParamValue>,
): Promise<ApiResponse<CanvasAssignment>> {
  return apiPut<CanvasAssignment>(
    `/v1/courses/${courseId}/assignments/${assignmentId}`,
    { assignment: data },
  );
}
