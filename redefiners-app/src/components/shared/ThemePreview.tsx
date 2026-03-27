import type { ThemeConfig } from '@/lib/theme-registry'

interface ThemePreviewProps {
  theme: ThemeConfig
  size?: 'sm' | 'md'
}

/**
 * Renders a small preview card showing theme colors in a mini layout.
 * - Left sidebar strip in sidebar color
 * - Top bar strip
 * - Content area in page bg color
 * - Small colored dots for accent colors
 */
export function ThemePreview({ theme, size = 'md' }: ThemePreviewProps) {
  const { colors } = theme
  const w = size === 'sm' ? 120 : 200
  const h = size === 'sm' ? 84 : 140

  const sidebarW = Math.round(w * 0.22)
  const topbarH = Math.round(h * 0.14)
  const dotR = size === 'sm' ? 4 : 6
  const cardW = Math.round((w - sidebarW) * 0.35)
  const cardH = Math.round((h - topbarH) * 0.32)

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      xmlns="http://www.w3.org/2000/svg"
      style={{ borderRadius: size === 'sm' ? 6 : 8, overflow: 'hidden', display: 'block' }}
    >
      {/* Page background */}
      <rect width={w} height={h} fill={colors.pageBg} />

      {/* Sidebar */}
      <rect x={0} y={0} width={sidebarW} height={h} fill={colors.sidebarBg} />

      {/* Sidebar active item indicator */}
      <rect
        x={3}
        y={Math.round(h * 0.35)}
        width={sidebarW - 6}
        height={size === 'sm' ? 8 : 12}
        rx={3}
        fill={colors.accentGreen}
        opacity={0.9}
      />

      {/* Sidebar text lines */}
      {[0.2, 0.52, 0.65].map((yFrac) => (
        <rect
          key={yFrac}
          x={6}
          y={Math.round(h * yFrac)}
          width={sidebarW - 12}
          height={3}
          rx={1.5}
          fill={colors.sidebarText}
          opacity={0.3}
        />
      ))}

      {/* Top bar */}
      <rect x={sidebarW} y={0} width={w - sidebarW} height={topbarH} fill="#FFFFFF" />
      <line
        x1={sidebarW}
        y1={topbarH}
        x2={w}
        y2={topbarH}
        stroke="#E5E7EB"
        strokeWidth={1}
      />

      {/* Content cards */}
      {[0, 1].map((i) => {
        const cx = sidebarW + 10 + i * (cardW + 8)
        const cy = topbarH + 12
        return (
          <rect
            key={i}
            x={cx}
            y={cy}
            width={cardW}
            height={cardH}
            rx={4}
            fill="#FFFFFF"
            stroke="#E5E7EB"
            strokeWidth={0.5}
          />
        )
      })}

      {/* Accent color dots */}
      <circle
        cx={w - dotR * 4 - 8}
        cy={h - dotR - 8}
        r={dotR}
        fill={colors.accentGreen}
      />
      <circle
        cx={w - dotR - 6}
        cy={h - dotR - 8}
        r={dotR}
        fill={colors.accentOrange}
      />
    </svg>
  )
}
