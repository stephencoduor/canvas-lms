// Outcomes API module
// Ported from ReDefiners/js/api.js OutcomesAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export interface CanvasOutcomeGroup {
  id: number;
  title: string;
  description: string | null;
  context_id: number;
  context_type: string;
  parent_outcome_group?: { id: number; title: string };
  subgroups_url: string;
  outcomes_url: string;
  can_edit: boolean;
}

export interface CanvasOutcome {
  id: number;
  title: string;
  display_name: string;
  description: string | null;
  points_possible: number;
  mastery_points: number;
  calculation_method: string;
  calculation_int: number | null;
  ratings: {
    description: string;
    points: number;
    color?: string;
  }[];
}

export interface CanvasOutcomeResult {
  id: number;
  score: number;
  submitted_or_assessed_at: string;
  links: {
    user: string;
    learning_outcome: string;
    assignment: string;
  };
}

export interface CanvasOutcomeRollup {
  scores: {
    score: number;
    links: { outcome: string };
  }[];
  links: { user: string };
}

export function getOutcomeGroups(
  courseId: number | string,
): Promise<ApiResponse<CanvasOutcomeGroup[]>> {
  return apiGet<CanvasOutcomeGroup[]>(`/v1/courses/${courseId}/outcome_groups`);
}

export function getGroupOutcomes(
  courseId: number | string,
  groupId: number | string,
): Promise<ApiResponse<CanvasOutcome[]>> {
  return apiGet<CanvasOutcome[]>(
    `/v1/courses/${courseId}/outcome_groups/${groupId}/outcomes`,
  );
}

export function getOutcome(
  outcomeId: number | string,
): Promise<ApiResponse<CanvasOutcome>> {
  return apiGet<CanvasOutcome>(`/v1/outcomes/${outcomeId}`);
}

export function getResults(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<{ outcome_results: CanvasOutcomeResult[] }>> {
  return apiGet<{ outcome_results: CanvasOutcomeResult[] }>(
    `/v1/courses/${courseId}/outcome_results`,
    params,
  );
}

export function getRollups(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<{ rollups: CanvasOutcomeRollup[] }>> {
  return apiGet<{ rollups: CanvasOutcomeRollup[] }>(
    `/v1/courses/${courseId}/outcome_rollups`,
    params,
  );
}
