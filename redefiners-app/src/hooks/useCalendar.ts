import { useQuery } from '@tanstack/react-query'
import { getCalendarEvents } from '@/services/modules/calendar'
import type { CanvasCalendarEvent } from '@/services/modules/calendar'

export function useCalendarEvents(startDate: string, endDate: string) {
  return useQuery<CanvasCalendarEvent[]>({
    queryKey: ['calendar', 'events', startDate, endDate],
    queryFn: async () => {
      const response = await getCalendarEvents(startDate, endDate)
      return response.data
    },
    enabled: !!startDate && !!endDate,
    staleTime: 2 * 60 * 1000,
  })
}
