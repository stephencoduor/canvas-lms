// Conferences API module
// Ported from ReDefiners/js/api.js ConferencesAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

export interface CanvasConference {
  id: number;
  title: string;
  description: string | null;
  conference_type: string;
  conference_key: string;
  url: string | null;
  started_at: string | null;
  ended_at: string | null;
  duration: number | null;
  participant_count: number;
  join_url: string | null;
  user_settings: Record<string, unknown>;
  has_advanced_settings: boolean;
  long_running: boolean;
  recordings: Array<{
    title: string;
    duration_minutes: number;
    playback_url: string;
    created_at: string;
  }>;
}

export interface CanvasConferencesResponse {
  conferences: CanvasConference[];
}

export function listConferences(
  courseId: number | string,
): Promise<ApiResponse<CanvasConferencesResponse>> {
  return apiGet<CanvasConferencesResponse>(
    `/v1/courses/${courseId}/conferences`,
  );
}
