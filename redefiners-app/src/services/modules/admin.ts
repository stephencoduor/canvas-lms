// Admin / Account API module
// Ported from ReDefiners/js/api.js AdminAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export interface CanvasAccount {
  id: number;
  name: string;
  parent_account_id: number | null;
  root_account_id: number | null;
  workflow_state: string;
  default_storage_quota_mb: number;
  default_user_storage_quota_mb: number;
}

export interface CanvasRole {
  id: number;
  role: string;
  label: string;
  base_role_type: string;
  workflow_state: string;
  permissions: Record<string, { enabled: boolean; locked: boolean; readonly: boolean }>;
}

export interface CanvasPermissions {
  [key: string]: boolean;
}

export interface CanvasReport {
  id: number;
  report: string;
  title: string;
  parameters?: Record<string, unknown>;
  last_run?: string;
  progress?: number;
  status?: string;
}

export interface CanvasTerm {
  id: number;
  name: string;
  start_at: string | null;
  end_at: string | null;
  workflow_state: string;
  course_count?: number;
}

export interface CanvasDeveloperKey {
  id: number;
  name: string;
  api_key: string;
  created_at: string;
  workflow_state: string;
  icon_url?: string;
}

export interface CanvasSisImport {
  id: number;
  created_at: string;
  ended_at: string | null;
  workflow_state: string;
  progress: string;
}

export interface CanvasAccountUser {
  id: number;
  name: string;
  sortable_name: string;
  login_id: string;
  email?: string;
  avatar_url?: string;
  created_at: string;
  last_login?: string;
}

export function getAccounts(): Promise<ApiResponse<CanvasAccount[]>> {
  return apiGet<CanvasAccount[]>('/v1/accounts');
}

export function getAccount(
  accountId: number | string,
): Promise<ApiResponse<CanvasAccount>> {
  return apiGet<CanvasAccount>(`/v1/accounts/${accountId}`);
}

export function getSubAccounts(
  accountId: number | string,
): Promise<ApiResponse<CanvasAccount[]>> {
  return apiGet<CanvasAccount[]>(`/v1/accounts/${accountId}/sub_accounts`, {
    recursive: true,
  });
}

export function getRoles(
  accountId: number | string,
): Promise<ApiResponse<CanvasRole[]>> {
  return apiGet<CanvasRole[]>(`/v1/accounts/${accountId}/roles`);
}

export function getPermissions(
  accountId: number | string,
): Promise<ApiResponse<CanvasPermissions>> {
  return apiGet<CanvasPermissions>(`/v1/accounts/${accountId}/permissions`);
}

export function getAccountUsers(
  accountId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasAccountUser[]>> {
  return apiGet<CanvasAccountUser[]>(`/v1/accounts/${accountId}/users`, {
    include: ['avatar_url', 'email'],
    ...params,
  });
}

export function getReports(
  accountId: number | string,
): Promise<ApiResponse<CanvasReport[]>> {
  return apiGet<CanvasReport[]>(`/v1/accounts/${accountId}/reports`);
}

export function getAnalytics(
  accountId: number | string,
  type: string = 'current',
): Promise<ApiResponse<unknown>> {
  return apiGet<unknown>(`/v1/accounts/${accountId}/analytics/${type}/activity`);
}

export function getSisImports(
  accountId: number | string,
): Promise<ApiResponse<CanvasSisImport[]>> {
  return apiGet<CanvasSisImport[]>(`/v1/accounts/${accountId}/sis_imports`);
}

export function getTerms(
  accountId: number | string,
): Promise<ApiResponse<{ enrollment_terms: CanvasTerm[] }>> {
  return apiGet<{ enrollment_terms: CanvasTerm[] }>(`/v1/accounts/${accountId}/terms`);
}

export function getDeveloperKeys(
  accountId: number | string,
): Promise<ApiResponse<CanvasDeveloperKey[]>> {
  return apiGet<CanvasDeveloperKey[]>(`/v1/accounts/${accountId}/developer_keys`);
}

export function getGradeChangeLog(
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<unknown>> {
  return apiGet<unknown>('/v1/audit/grade_change', params);
}
