// Notifications API module
// Ported from ReDefiners/js/api.js NotificationsAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

export interface ActivityStreamItem {
  id: number;
  title: string;
  message: string;
  type: string;
  created_at: string;
  updated_at: string;
  read_state: boolean;
  context_type: string;
  course_id?: number;
  html_url?: string;
}

export interface StreamSummary {
  type: string;
  unread_count: number;
  count: number;
}

export interface CommunicationChannel {
  id: number;
  address: string;
  type: string;
  position: number;
  workflow_state: string;
  user_id: number;
}

export interface NotificationPreference {
  notification: string;
  category: string;
  frequency: string;
}

export function getActivityStream(): Promise<ApiResponse<ActivityStreamItem[]>> {
  return apiGet<ActivityStreamItem[]>('/v1/users/self/activity_stream', {
    only_active_courses: true,
  });
}

export function getStreamSummary(): Promise<ApiResponse<StreamSummary[]>> {
  return apiGet<StreamSummary[]>('/v1/users/self/activity_stream/summary');
}

export function getCommunicationChannels(): Promise<ApiResponse<CommunicationChannel[]>> {
  return apiGet<CommunicationChannel[]>('/v1/users/self/communication_channels');
}

export function getPreferences(
  channelId: number | string,
): Promise<ApiResponse<{ notification_preferences: NotificationPreference[] }>> {
  return apiGet<{ notification_preferences: NotificationPreference[] }>(
    `/v1/users/self/communication_channels/${channelId}/notification_preferences`,
  );
}
