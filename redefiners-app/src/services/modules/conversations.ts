// Conversations API module
// Ported from ReDefiners/js/api.js ConversationsAPI class

import { apiGet, apiPost } from '@/services/api-client';
import type { ApiResponse, CanvasConversation } from '@/types/canvas';

export interface CanvasConversationMessage {
  id: number;
  author_id: number;
  body: string;
  created_at: string;
  generated: boolean;
  media_comment: unknown | null;
  forwarded_messages: CanvasConversationMessage[];
  attachments: Array<{
    id: number;
    display_name: string;
    filename: string;
    url: string;
    size: number;
    content_type: string;
  }>;
  participating_user_ids?: number[];
}

export interface CanvasConversationDetail extends CanvasConversation {
  messages: CanvasConversationMessage[];
}

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listConversations(
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasConversation[]>> {
  return apiGet<CanvasConversation[]>(
    '/v1/conversations',
    { scope: 'inbox', per_page: 50, ...params },
  );
}

export function getConversation(
  id: number | string,
): Promise<ApiResponse<CanvasConversationDetail>> {
  return apiGet<CanvasConversationDetail>(
    `/v1/conversations/${id}`,
  );
}

export function createConversation(
  recipients: string[],
  body: string,
  subject?: string,
): Promise<ApiResponse<CanvasConversation[]>> {
  return apiPost<CanvasConversation[]>(
    '/v1/conversations',
    { recipients, body, subject, group_conversation: true },
  );
}

export function addMessage(
  conversationId: number | string,
  body: string,
): Promise<ApiResponse<CanvasConversationDetail>> {
  return apiPost<CanvasConversationDetail>(
    `/v1/conversations/${conversationId}/add_message`,
    { body },
  );
}
