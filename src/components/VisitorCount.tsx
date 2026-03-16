import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

interface VisitorCountProps {
  path: string
  trackView?: boolean  // If true, increment pageviews. If false, just display count.
}

export default function VisitorCount({ path, trackView = true }: VisitorCountProps) {
  const [views, setViews] = useState<number | null>(null)
  const [error, setError] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchAndTrackViews() {
      try {
        console.log('[VisitorCount] Fetching views for path:', path, '| Track:', trackView)

        // Only increment if trackView is true
        if (trackView) {
          await fetch(`/api/pageviews?path=${encodeURIComponent(path)}`, {
            method: 'POST',
            cache: 'no-store',
          })
        }

        // Get current count
        const res = await fetch(`/api/pageviews?path=${encodeURIComponent(path)}`, {
          cache: 'no-store',
        })

        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const data = await res.json()
        console.log('[VisitorCount] Received data for', path, ':', data)
        setViews(data.pageviews ?? 0)
      } catch (err) {
        console.error('Visitor count error:', err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndTrackViews()
  }, [path, trackView])

  // ──────────────────────────────────────────────────────────────
  // Format large numbers (1.2k, 34M, 5.7B, etc.)
  // ──────────────────────────────────────────────────────────────
  const formatViews = (num: number): string => {
    if (num < 1000) return num.toString()

    const units = ['', 'k', 'M', 'B', 'T']
    const exponent = Math.min(Math.floor(Math.log10(num) / 3), units.length - 1)
    const divisor = Math.pow(1000, exponent)

    const value = num / divisor
    const formatted = value.toFixed(1)

    // Remove trailing .0
    const clean = formatted.endsWith('.0') ? formatted.slice(0, -2) : formatted

    return clean + units[exponent]
  }

  // ──────────────────────────────────────────────────────────────
  // Display logic
  // ──────────────────────────────────────────────────────────────
  let displayText: string
  let ariaText: string

  if (isLoading) {
    displayText = '⋯'
    ariaText = 'Loading view count'
  } else if (error || views === null) {
    displayText = '0 views'
    ariaText = '0 views'
  } else {
    const formattedNum = formatViews(views)
    const viewWord = views === 1 ? 'view' : 'views'
    displayText = `${formattedNum} ${viewWord}`
    ariaText = `${views.toLocaleString()} ${viewWord}`
  }

  return (
    <span
      className={cn(
        'text-muted-foreground whitespace-nowrap text-xs',
        isLoading && 'opacity-100',
        (error || views === null) && 'text-muted-foreground/100'
      )}
      aria-live="polite"
      aria-label={ariaText}
    >
      {displayText}
    </span>
  )
}