import { useEffect, useState } from 'react'

interface MarketItem {
  id: string
  question: string
  outcomePrices?: string
  volume?: number | string
  volume24hr?: number | string
  slug?: string
}

interface EventItem {
  id: string
  title: string
  slug: string
  volume24hr?: number
  markets?: MarketItem[]
}

const FALLBACK_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'Fed Interest Rate Decision',
    slug: 'fed-decision-in-july-181',
    markets: [
      {
        id: 'm1',
        question: 'Will the Fed decrease interest rates by 25 bps?',
        outcomePrices: '["0.04", "0.96"]',
        volume: 13092306,
      },
    ],
  },
  {
    id: '2',
    title: 'World Cup Champions Photo',
    slug: 'will-trump-be-in-the-wc-champions-photo-20260608152527021',
    markets: [
      {
        id: 'm2',
        question: 'Will Trump be in the WC Champions Photo?',
        outcomePrices: '["0.995", "0.005"]',
        volume: 5724955,
      },
    ],
  },
]

export default function PolymarketBanner() {
  const [events, setEvents] = useState<EventItem[]>(FALLBACK_EVENTS)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    let isMounted = true
    async function fetchLiveMarkets() {
      try {
        const res = await fetch(
          'https://gamma-api.polymarket.com/events?closed=false&limit=300&active=true&order=volume24hr&ascending=false',
        )
        if (res.ok) {
          const data = await res.json()
          if (Array.isArray(data) && data.length > 0 && isMounted) {
            // Filter by requested tags AND high volume (>$10M total volume)
            const allowedTags = ['politics', 'finance', 'economy', 'tech']
            const filteredData = data.filter((event) => {
              // Check volume - require at least $10M in total volume to be considered "high volume"
              const hasHighVolume = event.volume && event.volume >= 10000000
              if (!hasHighVolume) return false
              
              // Check tags
              if (!event.tags || !Array.isArray(event.tags)) return false
              return event.tags.some((t: any) =>
                allowedTags.includes(t.slug?.toLowerCase())
              )
            })
            // Take top 12
            setEvents(filteredData.slice(0, 12))
          }
        }
      } catch (err) {
        console.error('Failed to fetch Polymarket live data:', err)
      }
    }

    fetchLiveMarkets()
    const interval = setInterval(fetchLiveMarkets, 60000)
    return () => {
      isMounted = false
      clearInterval(interval)
    }
  }, [])

  // Auto-carousel effect
  useEffect(() => {
    if (events.length <= 4) return
    const carouselInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 4 >= events.length ? 0 : prev + 4))
    }, 8500) // Change every 8.5 seconds
    return () => clearInterval(carouselInterval)
  }, [events.length])

  const formatVolume = (vol?: number | string) => {
    if (!vol) return '$0'
    const num = typeof vol === 'string' ? parseFloat(vol) : vol
    if (isNaN(num)) return '$0'
    if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M vol`
    if (num >= 1_000) return `$${Math.round(num / 1_000)}K vol`
    return `$${Math.round(num)} vol`
  }

  const getYesPrice = (pricesStr?: string) => {
    if (!pricesStr) return 50
    try {
      const prices = JSON.parse(pricesStr)
      const yes = parseFloat(prices[0])
      return Math.min(100, Math.max(0, Math.round(yes * 100)))
    } catch {
      return 50
    }
  }

  // Get current slice of events (show 4 at a time)
  const visibleEvents = events.slice(currentIndex, currentIndex + 4)
  // If we're at the end and don't have enough events, pad with the first ones
  if (visibleEvents.length < 4 && events.length >= 4) {
    const needed = 4 - visibleEvents.length
    visibleEvents.push(...events.slice(0, needed))
  }

  return (
    <div className="bg-[#111318] border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-300 shadow-md space-y-3.5 max-w-[280px] mx-auto font-sans mt-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-neutral-800/80 pb-2.5">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-white shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2L3 7v10l9 5 9-5V7l-9-5zm0 2.2L19 8v8l-7 3.9L5 16V8l7-3.8z" />
            <path d="M12 6L6 9.5v5L12 18l6-3.5v-5L12 6z" />
          </svg>
          <span className="font-bold text-sm text-white tracking-wide">Polymarket</span>
        </div>
        <div className="flex items-center gap-2">
          {events.length > 4 && (
            <div className="flex gap-1 mr-2">
              {Array.from({ length: Math.ceil(events.length / 4) }).map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    Math.floor(currentIndex / 4) === i ? 'w-3 bg-white' : 'w-1.5 bg-neutral-700'
                  }`}
                />
              ))}
            </div>
          )}
          <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-mono font-medium">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            LIVE
          </span>
        </div>
      </div>

      {/* Events */}
      <div className="space-y-3 divide-y divide-neutral-800/60 h-[380px] overflow-hidden flex flex-col">
        {visibleEvents.map((event, idx) => {
          const topMarket = event.markets?.[0]
          const pct = getYesPrice(topMarket?.outcomePrices)
          const isHighPct = pct >= 50

          return (
            <div
              key={event.id || idx}
              className={`flex-1 flex flex-col justify-between overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500 ${
                idx > 0 ? 'pt-3' : ''
              }`}
            >
              <div className="space-y-1">
                <a
                  href={`https://polymarket.com/event/${event.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-xs text-white leading-tight hover:text-blue-400 transition-colors line-clamp-1 block"
                >
                  {event.title}
                </a>

                {topMarket && (
                  <p className="text-[11px] text-neutral-400 leading-snug line-clamp-2">
                    {topMarket.question}
                  </p>
                )}
              </div>

              {topMarket && (
                <div className="flex items-center gap-2 text-[11px] pb-1">
                  <span
                    className={`font-semibold flex items-center shrink-0 ${
                      isHighPct ? 'text-emerald-400' : 'text-red-400'
                    }`}
                  >
                    {isHighPct ? '↑' : '↓'} {pct}%
                  </span>
                  <div className="flex-1 bg-neutral-800 h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isHighPct ? 'bg-emerald-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                  <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                    {formatVolume(topMarket.volume || event.volume24hr)}
                  </span>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* CTA Button */}
      <a
        href="https://polymarket.com"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 w-full py-2 px-3 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/70 rounded-lg text-white font-medium text-xs transition-colors duration-200"
      >
        <span>See more on Polymarket</span>
        <svg className="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
    </div>
  )
}
