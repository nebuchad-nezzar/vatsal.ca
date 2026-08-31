import { useState } from 'react'
import { Check, Clock, Calendar, ShieldCheck, UserCheck, Globe2, TrendingUp, Cpu, Network } from 'lucide-react'

interface ServiceOption {
  id: string
  badge: string
  badgeColor: string
  title: string
  subtitle: string
  duration: string
  description: string
  bullets: string[]
  calLink: string
  popular?: boolean
}

const OPTIONS: ServiceOption[] = [
  {
    id: 'discovery',
    badge: 'Free',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    title: 'Discovery Call',
    subtitle: 'Quick project overview & fit assessment',
    duration: '15 minutes',
    description: 'Perfect for getting acquainted, discussing technical feasibility, and evaluating mutual fit for your project or advisory needs.',
    bullets: [
      'Quick project overview & scope',
      'Initial technical fit assessment',
      'Recommended architecture roadmap & next steps',
    ],
    calLink: 'https://cal.com/vats1910',
  },
  {
    id: 'strategy',
    badge: 'Most Popular',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    title: 'Technical Strategy Session',
    subtitle: 'Deep technical guidance & architecture review',
    duration: '60 minutes',
    description: 'Comprehensive 1-on-1 session covering quant trading models, low-latency infrastructure, AI/ML pipelines, or code review.',
    bullets: [
      'In-depth system & algorithm architecture review',
      'Latency optimization & data pipeline design',
      'Production roadmap planning & code review',
      'Post-call summary with actionable next steps',
    ],
    calLink: 'https://cal.com/vats1910',
    popular: true,
  },
]

const EXPECTATIONS = [
  {
    icon: TrendingUp,
    iconColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    title: 'Quantitative Finance & Alpha Systems',
    description:
      'Strategic guidance on algorithmic trading architecture, backtesting framework audits, execution algorithms, risk management models, and statistical arbitrage pipelines.',
  },
  {
    icon: Cpu,
    iconColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    title: 'AI & ML Infrastructure',
    description:
      'Designing agentic workflows, model context engineering vs fine-tuning, automated market research agents, and machine learning feature engineering for financial data.',
  },
  {
    icon: Network,
    iconColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    title: 'High-Performance Technology Strategy',
    description:
      'Comprehensive system roadmaps, low-latency execution optimization, C++/Python telemetry, WebSocket data pipelines, and scalable cloud/hybrid infrastructure.',
  },
]

export default function BookingScheduler() {
  const [selectedId, setSelectedId] = useState<string>('strategy')

  const selectedOption = OPTIONS.find((o) => o.id === selectedId) || OPTIONS[1]

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-12 py-6">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground font-mono">
          Schedule a Consultation
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          Choose the right session for your goals. Start with a quick discovery chat or dive straight into a 60-minute technical strategy session.
        </p>
      </div>

      {/* Option Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {OPTIONS.map((option) => {
          const isSelected = selectedId === option.id

          return (
            <div
              key={option.id}
              onClick={() => setSelectedId(option.id)}
              className={`
                relative rounded-xl border p-6 flex flex-col justify-between transition-all duration-300 cursor-pointer
                ${isSelected
                  ? 'border-blue-500/60 bg-gradient-to-b from-blue-950/20 via-card to-card shadow-lg shadow-blue-500/5 ring-1 ring-blue-500/30'
                  : 'border-border/60 bg-card/40 hover:border-border hover:bg-card/70'
                }
              `}
            >
              {/* Badge */}
              <div className="flex items-center justify-between mb-4">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${option.badgeColor}`}>
                  {option.badge}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1 font-mono">
                  <Clock className="size-3.5" />
                  {option.duration}
                </span>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h3 className="text-xl font-bold text-foreground mb-1 font-mono">{option.title}</h3>
                <p className="text-xs text-muted-foreground mb-3">{option.subtitle}</p>
                <p className="text-xs sm:text-sm text-foreground/80 leading-relaxed mb-6">
                  {option.description}
                </p>

                {/* Bullets */}
                <ul className="space-y-2 mb-6">
                  {option.bullets.map((bullet, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-foreground/90">
                      <div className="mt-0.5 rounded-full bg-emerald-500/20 p-0.5 text-emerald-400 shrink-0">
                        <Check className="size-3" />
                      </div>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Select Button */}
              <button
                type="button"
                className={`
                  w-full py-2.5 px-4 rounded-lg text-xs sm:text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 font-mono
                  ${isSelected
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                    : 'bg-secondary/60 hover:bg-secondary text-secondary-foreground border border-border/50'
                  }
                `}
              >
                {isSelected ? (
                  <>
                    <Check className="size-4" />
                    Selected for Booking
                  </>
                ) : (
                  'Click to Select'
                )}
              </button>
            </div>
          )
        })}
      </div>

      {/* Embedded Calendar Section */}
      <div className="rounded-2xl border border-border/60 bg-card/30 backdrop-blur-md overflow-hidden shadow-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-border/50 bg-card/60 gap-2">
          <div>
            <h2 className="text-lg font-semibold text-foreground font-mono flex items-center gap-2">
              <Calendar className="size-4 text-blue-400" />
              Book your {selectedOption.title}
            </h2>
            <p className="text-xs text-muted-foreground">Select your preferred date & time slot below</p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-md bg-muted/50 text-muted-foreground border border-border/40 w-fit">
            Duration: {selectedOption.duration}
          </span>
        </div>

        <div className="w-full min-h-[700px] bg-background/50">
          <iframe
            key={selectedOption.id}
            src={selectedOption.calLink}
            style={{ width: '100%', height: '720px', border: 0 }}
            allowFullScreen
            title={`Schedule ${selectedOption.title}`}
          />
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="space-y-6 pt-4">
        <div className="text-center space-y-2 max-w-xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-mono">
            What to Expect from Our Consultation
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            Our consultations focus on quantitative finance, AI engineering, and high-performance technology strategy. We evaluate your specific requirements, audit existing architecture, and deliver actionable technical roadmaps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {EXPECTATIONS.map((exp, idx) => {
            const IconComp = exp.icon
            return (
              <div
                key={idx}
                className="rounded-xl border border-border/60 bg-card/40 p-6 flex flex-col gap-3 hover:border-border hover:bg-card/70 transition-all duration-300"
              >
                <div className={`p-2.5 rounded-lg border w-fit ${exp.iconColor}`}>
                  <IconComp className="size-5" />
                </div>
                <h3 className="text-base font-bold text-foreground font-mono">{exp.title}</h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Trust & Guarantees Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-border/40">
        <div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20">
          <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground font-mono">Confidentiality & NDAs</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Mutual NDAs available prior to technical or quantitative strategy disclosures.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
            <UserCheck className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground font-mono">Direct 1-on-1 Access</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Speak directly with Vatsal Sharma — no account managers or proxy engineers.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-4 rounded-xl border border-border/40 bg-card/20">
          <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 shrink-0">
            <Globe2 className="size-5" />
          </div>
          <div>
            <h4 className="text-xs font-semibold text-foreground font-mono">Global Timezones</h4>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              Automatic time-slot adjustment for North American, European, and Asian trading hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
