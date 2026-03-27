// Rubrics API module
// Ported from ReDefiners/js/api.js RubricsAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

export interface CanvasRubricCriterion {
  id: string;
  description: string;
  long_description?: string;
  points: number;
  ratings: {
    id: string;
    description: string;
    long_description?: string;
    points: number;
  }[];
}

export interface CanvasRubric {
  id: number;
  title: string;
  context_id: number;
  context_type: string;
  points_possible: number;
  reusable: boolean;
  read_only: boolean;
  free_form_criterion_comments: boolean;
  hide_score_total: boolean;
  data: CanvasRubricCriterion[];
}

export function listRubrics(
  courseId: number | string,
): Promise<ApiResponse<CanvasRubric[]>> {
  return apiGet<CanvasRubric[]>(`/v1/courses/${courseId}/rubrics`);
}

export function getRubric(
  courseId: number | string,
  rubricId: number | string,
): Promise<ApiResponse<CanvasRubric>> {
  return apiGet<CanvasRubric>(`/v1/courses/${courseId}/rubrics/${rubricId}`, {
    include: ['assessments', 'associations'],
  });
}
