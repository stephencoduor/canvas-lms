import { useQuery } from '@tanstack/react-query';
import {
  listConversations,
  getConversation,
  type CanvasConversationDetail,
} from '@/services/modules/conversations';
import type { CanvasConversation } from '@/types/canvas';

export function useConversations() {
  return useQuery<CanvasConversation[]>({
    queryKey: ['conversations'],
    queryFn: async () => {
      const response = await listConversations();
      return response.data;
    },
    staleTime: 2 * 60 * 1000,
  });
}

export function useConversation(id: number | string | undefined) {
  return useQuery<CanvasConversationDetail>({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const response = await getConversation(id!);
      return response.data;
    },
    enabled: !!id,
    staleTime: 1 * 60 * 1000,
  });
}
