// Users API module
// Ported from ReDefiners/js/api.js UsersAPI class

import { apiGet, apiPut } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasActivityStreamItem,
  CanvasAssignment,
  CanvasColors,
  CanvasCourse,
  CanvasTodoCount,
  CanvasTodoItem,
  CanvasUser,
  CanvasUserSettings,
} from '@/types/canvas';

export function getSelf(): Promise<ApiResponse<CanvasUser>> {
  return apiGet<CanvasUser>('/v1/users/self');
}

export function getProfile(): Promise<ApiResponse<CanvasUser>> {
  return apiGet<CanvasUser>('/v1/users/self/profile');
}

export function getSettings(): Promise<ApiResponse<CanvasUserSettings>> {
  return apiGet<CanvasUserSettings>('/v1/users/self/settings');
}

export function getTodo(): Promise<ApiResponse<CanvasTodoItem[]>> {
  return apiGet<CanvasTodoItem[]>('/v1/users/self/todo');
}

export function getTodoCount(): Promise<ApiResponse<CanvasTodoCount>> {
  return apiGet<CanvasTodoCount>('/v1/users/self/todo_item_count');
}

export function getUpcoming(): Promise<ApiResponse<CanvasAssignment[]>> {
  return apiGet<CanvasAssignment[]>('/v1/users/self/upcoming_events');
}

export function getMissing(): Promise<ApiResponse<CanvasAssignment[]>> {
  return apiGet<CanvasAssignment[]>('/v1/users/self/missing_submissions');
}

export function getActivityStream(): Promise<ApiResponse<CanvasActivityStreamItem[]>> {
  return apiGet<CanvasActivityStreamItem[]>('/v1/users/self/activity_stream');
}

export function getColors(): Promise<ApiResponse<CanvasColors>> {
  return apiGet<CanvasColors>('/v1/users/self/colors');
}

export function getFavorites(): Promise<ApiResponse<CanvasCourse[]>> {
  return apiGet<CanvasCourse[]>('/v1/users/self/favorites/courses');
}

export function updateProfile(
  data: Partial<Pick<CanvasUser, 'name' | 'short_name' | 'bio' | 'title' | 'locale' | 'time_zone'>>,
): Promise<ApiResponse<CanvasUser>> {
  return apiPut<CanvasUser>('/v1/users/self', { user: data });
}

export function updateSettings(
  data: Partial<CanvasUserSettings>,
): Promise<ApiResponse<CanvasUserSettings>> {
  return apiPut<CanvasUserSettings>('/v1/users/self/settings', data);
}
