import { useState, useRef, useEffect } from 'react'
import {
  ChevronDown,
  TrendingUp,
  Cpu,
  Brain,
  Network,
  Sparkles,
  Briefcase,
  CandlestickChart,
  Calendar,
} from 'lucide-react'

const MENU_ITEMS = [
  {
    category: 'Core Engineering Services',
    items: [
      {
        title: 'Quant & Algo Trading',
        desc: 'Proprietary execution bots, SOR, tick backtesting & risk switches.',
        href: '/services',
        icon: TrendingUp,
        iconColor: 'text-blue-400',
      },
      {
        title: 'AI Integrations & Agents',
        desc: 'Production LLM applications, RAG pipelines & MCP database tools.',
        href: '/services',
        icon: Cpu,
        iconColor: 'text-purple-400',
      },
      {
        title: 'Data Science & ML',
        desc: 'Predictive financial analytics, CUDA models & NLP sentiment extraction.',
        href: '/services',
        icon: Brain,
        iconColor: 'text-emerald-400',
      },
      {
        title: 'System Design & Architecture',
        desc: 'Low-latency WebSockets, FIX exchange gateways & microservices.',
        href: '/services',
        icon: Network,
        iconColor: 'text-amber-400',
      },
    ],
  },
  {
    category: 'Client Solutions & Tools',
    items: [
      {
        title: 'Engineering Readiness Quiz',
        desc: 'Take the 60-sec assessment & unlock your firm’s score.',
        href: '/readiness',
        icon: Sparkles,
        iconColor: 'text-blue-400',
      },
      {
        title: 'Case Studies & Work',
        desc: 'Explore built software, models, and published research.',
        href: '/work',
        icon: Briefcase,
        iconColor: 'text-purple-400',
      },
      {
        title: 'Financial Markets Telemetry',
        desc: 'Real-time order-book depth, VWAP & market charts.',
        href: '/markets',
        icon: CandlestickChart,
        iconColor: 'text-emerald-400',
      },
      {
        title: 'Book an Advisory Call',
        desc: 'Direct 1-on-1 architecture & strategy consultation.',
        href: '/book-a-call',
        icon: Calendar,
        iconColor: 'text-amber-400',
      },
    ],
  },
]

export default function ServicesDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false)
    }, 150)
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  return (
    <div
      className="relative inline-block text-left"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Trigger Button */}
      <a
        href="/services"
        onClick={(e) => {
          // Allow clicking directly or toggling
        }}
        className="inline-flex items-center gap-1 text-sm text-foreground/60 hover:text-foreground/80 capitalize transition-colors font-sans cursor-pointer py-1"
      >
        Services
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-foreground' : ''}`}
        />
      </a>

      {/* Mega Menu Dropdown */}
      {isOpen && (
        <div className="absolute right-1/2 translate-x-1/2 md:right-0 md:translate-x-0 mt-2 w-[90vw] max-w-2xl rounded-xl border border-white/10 bg-[#0a0a0a]/95 backdrop-blur-xl p-5 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-900/10 to-transparent pointer-events-none rounded-xl" />

          <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            {MENU_ITEMS.map((group, groupIdx) => (
              <div key={groupIdx} className="space-y-3">
                <span className="text-[11px] font-mono font-semibold text-gray-400 uppercase tracking-wider block border-b border-white/10 pb-1.5">
                  {group.category}
                </span>

                <div className="space-y-1">
                  {group.items.map((item, idx) => {
                    const ItemIcon = item.icon
                    return (
                      <a
                        key={idx}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group flex items-start gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-all duration-200"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 group-hover:scale-105 transition-transform">
                          <ItemIcon className={`size-4 ${item.iconColor}`} />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors font-mono">
                            {item.title}
                          </h4>
                          <p className="text-[11px] text-gray-400 leading-snug mt-0.5">
                            {item.desc}
                          </p>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
