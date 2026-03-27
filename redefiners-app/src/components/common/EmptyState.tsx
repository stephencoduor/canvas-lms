import { memo } from 'react'
import type { LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'

interface EmptyStateProps {
  icon: LucideIcon
  heading: string
  description: string
  ctaText?: string
  ctaHref?: string
}

export const EmptyState = memo(function EmptyState({
  icon: Icon,
  heading,
  description,
  ctaText,
  ctaHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ background: 'var(--color-surface-100)' }}
      >
        <Icon className="h-8 w-8" style={{ color: 'var(--color-text-muted)' }} />
      </div>
      <h3 className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-text-primary)' }}>
        {heading}
      </h3>
      <p className="mb-6 max-w-sm text-sm" style={{ color: 'var(--color-text-secondary)' }}>
        {description}
      </p>
      {ctaText && ctaHref && (
        <Button render={<Link to={ctaHref} />}>{ctaText}</Button>
      )}
    </div>
  )
})
