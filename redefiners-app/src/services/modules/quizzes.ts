// Quizzes API module
// Ported from ReDefiners/js/api.js QuizzesAPI class

import { apiGet, apiPost } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

export interface CanvasQuiz {
  id: number;
  title: string;
  description: string | null;
  quiz_type: string;
  points_possible: number;
  time_limit: number | null;
  question_count: number;
  due_at: string | null;
  lock_at: string | null;
  unlock_at: string | null;
  published: boolean;
  html_url: string;
  allowed_attempts: number;
  scoring_policy: string;
  show_correct_answers: boolean;
  assignment_group_id: number | null;
}

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listQuizzes(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasQuiz[]>> {
  return apiGet<CanvasQuiz[]>(
    `/v1/courses/${courseId}/quizzes`,
    { per_page: 50, ...params },
  );
}

export function getQuiz(
  courseId: number | string,
  quizId: number | string,
): Promise<ApiResponse<CanvasQuiz>> {
  return apiGet<CanvasQuiz>(
    `/v1/courses/${courseId}/quizzes/${quizId}`,
  );
}

export interface QuizSubmission {
  id: number;
  quiz_id: number;
  user_id: number;
  submission_id: number;
  started_at: string;
  finished_at: string | null;
  end_at: string | null;
  attempt: number;
  extra_attempts: number;
  extra_time: number | null;
  manually_unlocked: boolean | null;
  time_spent: number | null;
  score: number | null;
  score_before_regrade: number | null;
  kept_score: number | null;
  fudge_points: number | null;
  has_seen_results: boolean | null;
  workflow_state: string;
  overdue_and_needs_submission: boolean;
  validation_token: string;
}

export interface QuizQuestion {
  id: number;
  quiz_id: number;
  position: number;
  question_name: string;
  question_type: string;
  question_text: string;
  points_possible: number;
  answers: Array<{
    id: number;
    text: string;
    html: string;
    weight: number;
    match_id?: number;
    left?: string;
    right?: string;
  }>;
  matches?: Array<{
    match_id: number;
    text: string;
  }>;
}

export interface QuizStatisticsData {
  id: number;
  quiz_id: number;
  multiple_attempts_exist: boolean;
  generated_at: string;
  url: string;
  question_statistics: Array<{
    id: number;
    question_type: string;
    question_text: string;
    responses: number;
    answers: Array<{
      id: string;
      text: string;
      correct: boolean;
      responses: number;
    }>;
    correct: number;
    partially_correct: number;
    incorrect: number;
    point_biserials: Array<{
      answer_id: number;
      point_biserial: number | null;
      correct: boolean;
    }>;
  }>;
  submission_statistics: {
    scores: Record<string, number>;
    score_average: number;
    score_high: number;
    score_low: number;
    score_stdev: number;
    correct_count_average: number;
    incorrect_count_average: number;
    duration_average: number;
    unique_count: number;
  };
}

export function startQuizSubmission(
  courseId: number | string,
  quizId: number | string,
): Promise<ApiResponse<{ quiz_submissions: QuizSubmission[] }>> {
  return apiPost<{ quiz_submissions: QuizSubmission[] }>(
    `/v1/courses/${courseId}/quizzes/${quizId}/submissions`,
  );
}

export function getQuizQuestions(
  courseId: number | string,
  quizId: number | string,
  submissionId: number | string,
): Promise<ApiResponse<QuizQuestion[]>> {
  return apiGet<QuizQuestion[]>(
    `/v1/courses/${courseId}/quizzes/${quizId}/questions`,
    { quiz_submission_id: Number(submissionId) },
  );
}

export function completeQuizSubmission(
  courseId: number | string,
  quizId: number | string,
  submissionId: number | string,
  data: { attempt: number; validation_token: string; quiz_questions?: Array<{ id: number; answer: unknown }> },
): Promise<ApiResponse<{ quiz_submissions: QuizSubmission[] }>> {
  return apiPost<{ quiz_submissions: QuizSubmission[] }>(
    `/v1/courses/${courseId}/quizzes/${quizId}/submissions/${submissionId}/complete`,
    data,
  );
}

export function getQuizStatistics(
  courseId: number | string,
  quizId: number | string,
): Promise<ApiResponse<{ quiz_statistics: QuizStatisticsData[] }>> {
  return apiGet<{ quiz_statistics: QuizStatisticsData[] }>(
    `/v1/courses/${courseId}/quizzes/${quizId}/statistics`,
  );
}

export function getQuizSubmissions(
  courseId: number | string,
  quizId: number | string,
): Promise<ApiResponse<{ quiz_submissions: QuizSubmission[] }>> {
  return apiGet<{ quiz_submissions: QuizSubmission[] }>(
    `/v1/courses/${courseId}/quizzes/${quizId}/submissions`,
  );
}
