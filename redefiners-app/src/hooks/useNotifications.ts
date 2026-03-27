import { useQuery } from '@tanstack/react-query'
import {
  getActivityStream,
  getStreamSummary,
} from '@/services/modules/notifications'
import type { ActivityStreamItem, StreamSummary } from '@/services/modules/notifications'

export function useActivityStream() {
  return useQuery<ActivityStreamItem[]>({
    queryKey: ['notifications', 'activityStream'],
    queryFn: async () => {
      const response = await getActivityStream()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}

export function useStreamSummary() {
  return useQuery<StreamSummary[]>({
    queryKey: ['notifications', 'streamSummary'],
    queryFn: async () => {
      const response = await getStreamSummary()
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}
