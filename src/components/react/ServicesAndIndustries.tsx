import {
  TrendingUp,
  Cpu,
  Brain,
  Network,
  ArrowRight,
  Code2,
  Zap,
  Lock,
  Layers,
  Building2,
  CheckCircle2,
  ShieldCheck,
  Wrench,
} from 'lucide-react'

// Reusable Laboratory Card Classes
const cardClass =
  'group relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] transition-all duration-500 hover:scale-[1.01] hover:shadow-xl hover:border-white/20 p-6'
const gradientClass =
  'absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-900/10 to-transparent opacity-100 pointer-events-none'
const iconContainerClass =
  'inline-flex items-center justify-center rounded-lg bg-white/5 border border-white/10 p-2 text-foreground backdrop-blur-md transition-transform duration-300 group-hover:scale-105'

// Core 4 Services
const SERVICES = [
  {
    id: '01',
    title: 'Quant Work & Algorithmic Trading',
    category: 'Quantitative Engineering',
    icon: TrendingUp,
    description:
      'End-to-end development of proprietary trading algorithms, high-speed execution engines, tick-level backtesting frameworks, smart order routing (SOR), and automated risk control switches.',
    tags: ['Python', 'C++', 'FIX Protocol', 'Options Pricing', 'Backtesting', 'Execution Bots'],
  },
  {
    id: '02',
    title: 'AI Integrations & Agentic Workflows',
    category: 'LLM & Agent Architecture',
    icon: Cpu,
    description:
      'Replacing manual operational workflows with production-grade AI agents. Building RAG retrieval pipelines, Model Context Protocol (MCP) integrations, and autonomous market research tools.',
    tags: ['Claude 3.5', 'Gemini Flash', 'LangChain', 'RAG Architecture', 'Vector DB', 'MCP Tools'],
  },
  {
    id: '03',
    title: 'Data Science & Machine Learning',
    category: 'Predictive Financial Analytics',
    icon: Brain,
    description:
      'Designing predictive financial models, microstructure feature engineering, volatility clustering, NLP sentiment extraction from earnings calls, and custom CUDA-accelerated ML pipelines.',
    tags: ['PyTorch', 'Scikit-Learn', 'Pandas', 'Feature Engineering', 'CUDA', 'Financial NLP'],
  },
  {
    id: '04',
    title: 'System Design & Architecture',
    category: 'Distributed Infrastructure',
    icon: Network,
    description:
      'Architecting fault-tolerant microservice backbones, low-latency WebSocket market telemetry, high-throughput database schemas, and microsecond-optimized cloud/hybrid infrastructure.',
    tags: ['Distributed Systems', 'WebSockets', 'Redis', 'Docker', 'PostgreSQL', 'Microservices'],
  },
]

const INDUSTRIES = [
  {
    id: '01',
    name: 'Quantitative & Hedge Funds',
    subtitle: 'High-speed execution & signal infrastructure',
    icon: TrendingUp,
    href: '/services/quant-trading',
    description:
      'Building custom trading engines, tick-level backtesters, automated execution algorithms, and gateway kill switches for quantitative desks.',
    deliverables: [
      'Smart Order Routing (SOR) & Microsecond Execution',
      'Historical Order-Book Tick Backtesting Engines',
      'Real-Time Pre-Trade Risk & Drawdown Monitors',
    ],
  },
  {
    id: '02',
    name: 'Enterprise AI & SaaS',
    subtitle: 'Agentic workflows & production LLM systems',
    icon: Cpu,
    href: '/services/ai-agents',
    description:
      'Replacing legacy manual processes with production AI agents, structured database retrieval (RAG), and Model Context Protocol (MCP) tooling.',
    deliverables: [
      'SEC Filings & Earnings Call NLP Agents',
      'Model Context Protocol (MCP) Database Tools',
      'Hybrid Vector RAG with Hallucination Guardrails',
    ],
  },
  {
    id: '03',
    name: 'FinTech & Trading Platforms',
    subtitle: 'Real-time telemetry & exchange connectivity',
    icon: Zap,
    href: '/services/quant-trading',
    description:
      'Scaling streaming WebSocket feeds, FIX protocol exchange gateways, and high-throughput order management systems for active trading platforms.',
    deliverables: [
      'Low-Latency VWAP & Order Depth WebSockets',
      'Native FIX Protocol & Exchange API Gateways',
      'High-Scale Rate-Limited Backend Architecture',
    ],
  },
]

// Principles / Why Work With Me
const PRINCIPLES = [
  {
    num: '01',
    title: 'Direct Senior Technical Contact',
    icon: Code2,
    description:
      'No account managers, sales reps, or junior proxies. The senior engineer who scopes your architecture is the same person building and deploying your production codebase.',
  },
  {
    num: '02',
    title: 'Production Software Shipped in Weeks',
    icon: Zap,
    description:
      'We move at modern AI-tooling speed. Working software is deployed directly to your environment within weeks through structured sprints and weekly live demos.',
  },
  {
    num: '03',
    title: '100% Code & IP Ownership',
    icon: Lock,
    description:
      'Everything we build lives directly in your repository from day one. Fixed scope, complete documentation, zero vendor lock-in, and zero recurring license fees.',
  },
  {
    num: '04',
    title: 'Ongoing Maintenance & System Support',
    icon: Wrench,
    description:
      'Post-launch software monitoring, SLA-backed maintenance, bug fixes, and continuous model/pipeline upgrades so your infrastructure stays operational 24/7 under live market conditions.',
  },
]

export default function ServicesAndIndustries() {
  return (
    <section className="w-full max-w-5xl mx-auto py-12 px-2 space-y-16">
      {/* SECTION 1: Services I Provide */}
      <div className="space-y-6">
        <div className="flex flex-col mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Services I Provide</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Production-grade engineering across quantitative finance, AI systems, machine learning pipelines, and distributed architecture.
          </p>
        </div>

        {/* 4 Full-Width Bento Cards */}
        <div className="flex flex-col gap-4">
          {SERVICES.map((service) => {
            const IconComp = service.icon

            return (
              <a key={service.id} href={(service as any).href || '#'} className={cardClass + " block cursor-pointer"}>
                <div className={gradientClass} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={iconContainerClass}>
                        <IconComp className="size-5" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                        {service.category}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground/60">
                      {service.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{service.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>

                  {/* Skill Tag Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[11px] text-foreground/80 font-mono"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                </a>
              )
            })}
        </div>

        {/* Single Discussion CTA */}
        <div className="pt-2 flex justify-center">
          <a
            href="/book-a-call"
            className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/15 text-foreground font-mono text-xs font-semibold transition-all duration-300"
          >
            Discuss Your System & Build <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      </div>

      {/* SECTION 2: Industries We Work With */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex flex-col mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Industries We Work With</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Specialized engineering for high-stakes domains where low latency, financial security, and model accuracy matter most.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {INDUSTRIES.map((ind) => {
            const IndIcon = ind.icon

            return (
              <a key={ind.id} href={ind.href} className={cardClass + " block cursor-pointer"}>
                <div className={gradientClass} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={iconContainerClass}>
                        <IndIcon className="size-5" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                        {ind.subtitle}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground/60">
                      {ind.id}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{ind.name}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed mb-3">{ind.description}</p>
                  </div>

                  {/* Clean Deliverables List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
                    {ind.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-foreground/80">
                        <CheckCircle2 className="size-3.5 text-blue-400 shrink-0" />
                        <span className="leading-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                </a>
              )
            })}
        </div>
      </div>

      {/* SECTION 3: Why Work With Me */}
      <div className="space-y-6 pt-4 border-t border-white/10">
        <div className="flex flex-col mb-4">
          <h2 className="text-3xl font-bold tracking-tight">Why Work With Me</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Three core principles guaranteed across every system build and technical advisory engagement.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {PRINCIPLES.map((p) => {
            const PIcon = p.icon

            return (
              <div key={p.num} className={cardClass}>
                <div className={gradientClass} />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

                <div className="relative z-10 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={iconContainerClass}>
                        <PIcon className="size-5" />
                      </div>
                      <span className="text-xs text-muted-foreground font-mono uppercase tracking-wider">
                        Principle {p.num}
                      </span>
                    </div>
                    <span className="text-xs font-mono font-bold text-muted-foreground/60">
                      {p.num}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-foreground mb-1">{p.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{p.description}</p>
                  </div>
                </div>
                </div>
              )
            })}
        </div>
      </div>
    </section>
  )
}
