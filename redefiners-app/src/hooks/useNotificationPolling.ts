import { useEffect, useRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { listConversations } from '@/services/modules/conversations'

export function useNotificationPolling() {
  const prevCountRef = useRef<number>(0)
  const audioRef = useRef<AudioContext | null>(null)

  const { data: conversations } = useQuery({
    queryKey: ['conversations', 'unread'],
    queryFn: async () => {
      const response = await listConversations({ scope: 'unread', per_page: 50 })
      return response.data
    },
    refetchInterval: 30_000,
    staleTime: 15_000,
  })

  const unreadCount = conversations?.length ?? 0

  useEffect(() => {
    // Skip on first load
    if (prevCountRef.current === 0 && unreadCount > 0) {
      prevCountRef.current = unreadCount
      return
    }

    if (unreadCount > prevCountRef.current) {
      // New unread message arrived
      // Browser notification
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('ReDefiners LMS', {
          body: `You have ${unreadCount} unread message${unreadCount > 1 ? 's' : ''}`,
          icon: '/Images/logo.PNG',
        })
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission()
      }

      // Play notification beep
      try {
        if (!audioRef.current) {
          audioRef.current = new AudioContext()
        }
        const ctx = audioRef.current
        const oscillator = ctx.createOscillator()
        const gain = ctx.createGain()
        oscillator.connect(gain)
        gain.connect(ctx.destination)
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        gain.gain.value = 0.1
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3)
        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + 0.3)
      } catch {
        // Audio API not available
      }
    }

    prevCountRef.current = unreadCount
  }, [unreadCount])

  return { unreadCount }
}
