// Discussions API module
// Ported from ReDefiners/js/api.js DiscussionsAPI class

import { apiGet, apiPost } from '@/services/api-client';
import type {
  ApiResponse,
  CanvasDiscussionTopic,
  CanvasDiscussionView,
} from '@/types/canvas';

type ParamValue = string | number | boolean | string[] | number[] | undefined | null;

export function listDiscussions(
  courseId: number | string,
  params: Record<string, ParamValue> = {},
): Promise<ApiResponse<CanvasDiscussionTopic[]>> {
  return apiGet<CanvasDiscussionTopic[]>(
    `/v1/courses/${courseId}/discussion_topics`,
    params,
  );
}

export function getDiscussion(
  courseId: number | string,
  topicId: number | string,
): Promise<ApiResponse<CanvasDiscussionTopic>> {
  return apiGet<CanvasDiscussionTopic>(
    `/v1/courses/${courseId}/discussion_topics/${topicId}`,
  );
}

export function getFullThread(
  courseId: number | string,
  topicId: number | string,
): Promise<ApiResponse<CanvasDiscussionView>> {
  return apiGet<CanvasDiscussionView>(
    `/v1/courses/${courseId}/discussion_topics/${topicId}/view`,
  );
}

export function postEntry(
  courseId: number | string,
  topicId: number | string,
  message: string,
): Promise<ApiResponse<CanvasDiscussionTopic>> {
  return apiPost<CanvasDiscussionTopic>(
    `/v1/courses/${courseId}/discussion_topics/${topicId}/entries`,
    { message },
  );
}

export function postReply(
  courseId: number | string,
  topicId: number | string,
  entryId: number | string,
  message: string,
): Promise<ApiResponse<CanvasDiscussionTopic>> {
  return apiPost<CanvasDiscussionTopic>(
    `/v1/courses/${courseId}/discussion_topics/${topicId}/entries/${entryId}/replies`,
    { message },
  );
}

export function createDiscussion(
  courseId: number | string,
  data: Record<string, ParamValue>,
): Promise<ApiResponse<CanvasDiscussionTopic>> {
  return apiPost<CanvasDiscussionTopic>(
    `/v1/courses/${courseId}/discussion_topics`,
    data,
  );
}
