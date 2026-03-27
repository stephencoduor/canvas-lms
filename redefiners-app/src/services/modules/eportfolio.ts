// ePortfolio API module
// Ported from ReDefiners/js/api.js EPortfolioAPI class

import { apiGet } from '@/services/api-client';
import type { ApiResponse } from '@/types/canvas';

export interface CanvasEPortfolio {
  id: number;
  user_id: number;
  name: string;
  public: boolean;
  created_at: string;
  updated_at: string;
  workflow_state: string;
  deleted_at: string | null;
  spam_status: string | null;
}

export interface CanvasEPortfolioPage {
  id: number;
  eportfolio_id: number;
  position: number;
  name: string;
  created_at: string;
  updated_at: string;
}

export function listPortfolios(): Promise<ApiResponse<CanvasEPortfolio[]>> {
  return apiGet<CanvasEPortfolio[]>('/v1/users/self/eportfolios');
}

export function getPortfolio(
  id: number | string,
): Promise<ApiResponse<CanvasEPortfolio>> {
  return apiGet<CanvasEPortfolio>(`/v1/eportfolios/${id}`);
}

export function getPortfolioPages(
  id: number | string,
): Promise<ApiResponse<CanvasEPortfolioPage[]>> {
  return apiGet<CanvasEPortfolioPage[]>(`/v1/eportfolios/${id}/pages`);
}
