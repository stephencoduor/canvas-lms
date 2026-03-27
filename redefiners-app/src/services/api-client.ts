// Canvas LMS API Client
// Ported from ReDefiners/js/api.js core HTTP methods (lines 54-172)

import { ApiError, type ApiResponse, type PaginationLinks } from '@/types/canvas';

const BASE_URL = '/api';

// ───────────────────────────────────────
// URL Construction
// ───────────────────────────────────────

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

function buildUrl(path: string, params?: Record<string, ParamValue>): string {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue;

      if (Array.isArray(value)) {
        for (const v of value) {
          url.searchParams.append(`${key}[]`, String(v));
        }
      } else {
        url.searchParams.set(key, String(value));
      }
    }
  }

  return url.toString();
}

// ───────────────────────────────────────
// Link Header Pagination Parsing
// ───────────────────────────────────────

function parseLinkHeader(header: string | null): PaginationLinks | null {
  if (!header) return null;

  const links: PaginationLinks = {};

  for (const part of header.split(',')) {
    const match = part.match(/<([^>]+)>;\s*rel="([^"]+)"/);
    if (match) {
      const [, url, rel] = match;
      if (rel === 'current' || rel === 'next' || rel === 'prev' || rel === 'first' || rel === 'last') {
        links[rel] = url;
      }
    }
  }

  return links;
}

// ───────────────────────────────────────
// Core Request
// ───────────────────────────────────────

interface RequestOptions {
  params?: Record<string, ParamValue>;
  body?: unknown;
}

async function request<T>(
  method: string,
  path: string,
  options: RequestOptions = {},
): Promise<ApiResponse<T>> {
  const url = buildUrl(path, options.params);

  // Get CSRF token from Canvas cookie or meta tag
  const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content')
    ?? document.cookie.match(/_csrf_token=([^;]+)/)?.[1]
    ?? '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  // Include CSRF token on state-changing requests
  if (method !== 'GET' && csrfToken) {
    headers['X-CSRF-Token'] = decodeURIComponent(csrfToken);
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    credentials: 'same-origin',
  };

  if (options.body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, fetchOptions);

    const pagination = parseLinkHeader(response.headers.get('Link'));

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: response.statusText,
      })) as { message?: string; errors?: string };
      throw new ApiError(
        response.status,
        error.message ?? String(error.errors ?? response.statusText),
        path,
      );
    }

    const data = (await response.json()) as T;
    return { data, pagination };
  } catch (error: unknown) {
    if (error instanceof ApiError) throw error;
    const message = error instanceof Error ? error.message : 'Unknown network error';
    throw new ApiError(0, `Network error: ${message}`, path);
  }
}

// ───────────────────────────────────────
// Exported HTTP Methods
// ───────────────────────────────────────

export function apiGet<T>(
  path: string,
  params?: Record<string, ParamValue>,
): Promise<ApiResponse<T>> {
  return request<T>('GET', path, { params });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  params?: Record<string, ParamValue>,
): Promise<ApiResponse<T>> {
  return request<T>('POST', path, { body, params });
}

export function apiPut<T>(
  path: string,
  body?: unknown,
  params?: Record<string, ParamValue>,
): Promise<ApiResponse<T>> {
  return request<T>('PUT', path, { body, params });
}

export function apiDelete<T>(
  path: string,
  params?: Record<string, ParamValue>,
): Promise<ApiResponse<T>> {
  return request<T>('DELETE', path, { params });
}

// ───────────────────────────────────────
// Paginated Fetch (all pages)
// ───────────────────────────────────────

export async function apiGetAll<T>(
  path: string,
  params: Record<string, ParamValue> = {},
): Promise<T[]> {
  const allData: T[] = [];
  const mergedParams = { per_page: 50, ...params };

  const first = await apiGet<T | T[]>(path, mergedParams);
  const firstData = first.data;
  if (Array.isArray(firstData)) {
    allData.push(...firstData);
  } else {
    allData.push(firstData);
  }

  let nextUrl = first.pagination?.next ?? null;

  while (nextUrl) {
    const response = await fetch(nextUrl, {
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });

    const data = (await response.json()) as T | T[];
    if (Array.isArray(data)) {
      allData.push(...data);
    } else {
      allData.push(data);
    }

    const linkHeader = response.headers.get('Link');
    nextUrl = parseLinkHeader(linkHeader)?.next ?? null;
  }

  return allData;
}
