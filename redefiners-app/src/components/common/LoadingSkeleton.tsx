import { memo } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface LoadingSkeletonProps {
  type: 'card' | 'row' | 'text' | 'avatar'
  count?: number
}

export const LoadingSkeleton = memo(function LoadingSkeleton({ type, count = 1 }: LoadingSkeletonProps) {
  const items = Array.from({ length: count }, (_, i) => i)

  switch (type) {
    case 'card':
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((i) => (
            <div
              key={i}
              className="rounded-lg p-4 shadow-sm"
              style={{ background: 'var(--color-surface)' }}
            >
              <Skeleton className="mb-3 h-[150px] w-full rounded-lg" />
              <Skeleton className="mb-2 h-5 w-3/4" />
              <Skeleton className="mb-1 h-3 w-1/2" />
              <Skeleton className="h-3 w-1/3" />
            </div>
          ))}
        </div>
      )

    case 'row':
      return (
        <div className="space-y-3">
          {items.map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-lg" />
          ))}
        </div>
      )

    case 'text':
      return (
        <div className="space-y-2">
          {items.map((i) => (
            <Skeleton key={i} className="h-3.5 w-full" />
          ))}
        </div>
      )

    case 'avatar':
      return (
        <div className="flex gap-3">
          {items.map((i) => (
            <Skeleton key={i} className="h-12 w-12 rounded-full" />
          ))}
        </div>
      )
  }
})
