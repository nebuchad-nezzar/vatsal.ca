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
  FlaskConical,
  Rocket,
  Sliders,
} from 'lucide-react'

const MENU_ITEMS = [
  {
    category: 'Engineering & Services',
    items: [
      {
        title: 'Quant Work & Algo Trading',
        desc: 'Proprietary execution bots, SOR, tick backtesting & risk switches.',
        href: '/services/quant-trading',
        icon: TrendingUp,
      },
      {
        title: 'AI Integrations & Agents',
        desc: 'Production LLM applications, RAG pipelines & MCP database tools.',
        href: '/services/ai-integrations',
        icon: Cpu,
      },
      {
        title: 'Data Science & ML',
        desc: 'Predictive financial analytics, CUDA models & NLP sentiment extraction.',
        href: '/services/data-science',
        icon: Brain,
      },
      {
        title: 'System Design & Architecture',
        desc: 'Low-latency WebSockets, FIX exchange gateways & microservices.',
        href: '/services/system-architecture',
        icon: Network,
      },
    ],
  },
  {
    category: 'Engagements & Capabilities',
    items: [
      {
        title: '2-Week Production Pilot',
        desc: 'Fixed-scope, 2-week engagement shipping a working AI/Quant prototype.',
        href: '/services/production-pilot',
        icon: FlaskConical,
      },
      {
        title: 'AI Product Launch',
        desc: 'Take an AI/Quant prototype to a shippable production v1 with paying users.',
        href: '/services/product-launch',
        icon: Rocket,
      },
      {
        title: 'Capabilities',
        desc: 'Custom software, app modernization, distributed microservices & web apps.',
        href: '/services/capabilities',
        icon: Sliders,
      },
      {
        title: 'Engineering Readiness Quiz',
        desc: 'Take the 60-sec assessment & unlock your firm’s score.',
        href: '/readiness',
        icon: Sparkles,
      },
    ],
  },
]

export default function WorkDropdown() {
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
      {/* Trigger Button - Matches exact navbar font and colors */}
      <a
        href="/work"
        className="inline-flex items-center gap-1 text-foreground/60 hover:text-foreground/80 capitalize transition-colors duration-300 ease-in-out cursor-pointer py-1 text-sm font-mono"
      >
        Work
        <ChevronDown
          className={`size-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180 text-foreground/80' : ''}`}
        />
      </a>

      {/* Mega Menu Dropdown — Solid Opaque Dark Background */}
      {isOpen && (
        <div className="absolute right-[-4rem] sm:right-0 mt-3 w-[92vw] sm:w-[640px] max-w-2xl rounded-xl border border-white/15 bg-[#0d0d0d] p-5 shadow-2xl z-[100] animate-in fade-in zoom-in-95 duration-200">
          <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 gap-6">
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
                        className="group flex items-start gap-3 p-2 rounded-lg hover:bg-white/10 transition-all duration-200"
                      >
                        <div className="p-2 rounded-lg bg-white/5 border border-white/10 shrink-0 group-hover:border-white/20 transition-colors">
                          <ItemIcon className="size-4 text-white/80 group-hover:text-blue-400 transition-colors" />
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
