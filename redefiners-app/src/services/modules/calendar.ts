// Calendar API module
// Ported from ReDefiners/js/api.js CalendarAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export interface CanvasCalendarEvent {
  id: number;
  title: string;
  start_at: string;
  end_at: string;
  description: string | null;
  location_name: string | null;
  location_address: string | null;
  context_code: string;
  workflow_state: string;
  type: string;
  all_day: boolean;
  html_url: string;
  assignment?: {
    id: number;
    name: string;
    due_at: string;
    points_possible: number;
  };
}

export function getCalendarEvents(
  startDate: string,
  endDate: string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasCalendarEvent[]>> {
  return apiGet<CanvasCalendarEvent[]>('/v1/calendar_events', {
    start_date: startDate,
    end_date: endDate,
    all_events: true,
    ...params,
  });
}

export function getCalendarAssignments(
  startDate: string,
  endDate: string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasCalendarEvent[]>> {
  return apiGet<CanvasCalendarEvent[]>('/v1/calendar_events', {
    type: 'assignment',
    start_date: startDate,
    end_date: endDate,
    ...params,
  });
}
