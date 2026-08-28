'use client'

import React, { useState, useEffect } from 'react'
import { Sun, Moon } from 'lucide-react'

const HUBS: { name: string; tz: string; country: string }[] = [
  { name: 'Tokyo', tz: 'Asia/Tokyo', country: 'JP' },
  { name: 'Hong Kong', tz: 'Asia/Hong_Kong', country: 'HK' },
  { name: 'Mumbai', tz: 'Asia/Kolkata', country: 'IN' },
  { name: 'London', tz: 'Europe/London', country: 'UK' },
  { name: 'New York', tz: 'America/New_York', country: 'US' },
  { name: 'Chicago', tz: 'America/Chicago', country: 'US' },
]

export default function WorldClocks() {
  const [times, setTimes] = useState<{ [key: string]: string }>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const update = () => {
      const newTimes: { [key: string]: string } = {}
      HUBS.forEach((hub) => {
        try {
          const now = new Date()
          const timeStr = now.toLocaleTimeString('en-US', {
            timeZone: hub.tz,
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
          newTimes[hub.name] = timeStr
        } catch {
          newTimes[hub.name] = '--:--:--'
        }
      })
      setTimes(newTimes)
    }

    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])

  if (!mounted) return null

  return (
    <div className="w-full mt-6 pt-4 border-t border-border/30">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 max-w-4xl mx-auto">
        {HUBS.map((hub) => {
          const time = times[hub.name] || '--:--:--'
          const hour = parseInt(time.split(':')[0], 10)
          const isDay = !isNaN(hour) && hour >= 6 && hour < 18

          return (
            <div
              key={hub.name}
              className="flex flex-col items-center justify-center p-2.5 rounded-lg border border-border/40 bg-card/40 backdrop-blur-sm shadow-xs transition-all hover:border-primary/40 group"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
                  {hub.name}
                </span>
                {isDay ? (
                  <Sun className="size-3 text-amber-400 shrink-0" />
                ) : (
                  <Moon className="size-3 text-indigo-400 shrink-0" />
                )}
              </div>
              <span className="text-xs font-mono font-bold tracking-wider text-foreground">
                {time}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
