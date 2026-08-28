'use client'

import { useMemo } from 'react'
import { InfiniteScroll } from './InfiniteScroll'
import { getIcon } from './SkillsIconLoader'

type Category = {
  text: string
  logo: string
}

type Technologies = {
  [key: string]: Category[]
}

// 4 Premier Holistic Pillars for Homepage Landing
const technologies: Technologies = {
  'Languages & Performance Computing': [
    { text: 'C++20 / C++23', logo: 'simple-icons:cplusplus' },
    { text: 'Python', logo: 'simple-icons:python' },
    { text: 'Rust', logo: 'simple-icons:rust' },
    { text: 'CUDA (GPU)', logo: 'lucide:zap' },
    { text: 'SQL', logo: 'lucide:database' },
    { text: 'Cython', logo: 'simple-icons:python' },
    { text: 'Julia', logo: 'simple-icons:julia' },
    { text: 'R', logo: 'simple-icons:r' },
    { text: 'Bash', logo: 'lucide:terminal' },
  ],
  'Quantitative Trading & Alpha Strategies': [
    { text: 'Statistical Arbitrage', logo: 'lucide:bar-chart' },
    { text: 'Market Microstructure', logo: 'lucide:activity' },
    { text: 'Order Book Dynamics (L2/L3)', logo: 'lucide:layers' },
    { text: 'Option Pricing & Volatility Skew', logo: 'lucide:line-chart' },
    { text: 'Factor Models & Alpha Signals', logo: 'lucide:trending-up' },
    { text: 'Portfolio Optimization', logo: 'lucide:pie-chart' },
    { text: 'Risk Management (VaR / ES)', logo: 'lucide:shield' },
    { text: 'Execution Algorithms (VWAP/TWAP)', logo: 'lucide:cpu' },
  ],
  'Quant Research & ML Frameworks': [
    { text: 'QuantConnect / LEAN', logo: 'lucide:line-chart' },
    { text: 'QuantLib', logo: 'lucide:briefcase' },
    { text: 'Polars (Fast DataFrames)', logo: 'lucide:zap' },
    { text: 'PyTorch (Quant ML)', logo: 'simple-icons:pytorch' },
    { text: 'Pandas & NumPy', logo: 'simple-icons:pandas' },
    { text: 'SciPy & Statsmodels', logo: 'lucide:calculator' },
    { text: 'TA-Lib', logo: 'lucide:chart-line' },
    { text: 'Zipline / Backtrader', logo: 'lucide:refresh-cw' },
  ],
  'Low-Latency Systems & Tick Infrastructure': [
    { text: 'FIX Protocol', logo: 'lucide:network' },
    { text: 'UDP Multicast / ITCH & OUCH', logo: 'lucide:zap' },
    { text: 'Kernel Bypass (Solarflare)', logo: 'lucide:cpu' },
    { text: 'KDB+ / q', logo: 'lucide:database' },
    { text: 'ClickHouse (L2/L3 Analytics)', logo: 'simple-icons:clickhouse' },
    { text: 'Linux Kernel Tuning', logo: 'simple-icons:linux' },
    { text: 'Docker & Kubernetes', logo: 'mdi:docker' },
    { text: 'ZeroMQ & Shared Memory IPC', logo: 'lucide:network' },
  ],
}

export default function Skills() {
  const categories = useMemo(() => Object.keys(technologies), [])

  return (
    <div className="flex flex-col gap-4">
      {categories.map((category, idx) => {
        const techs = technologies[category]
        const isReverse = idx % 2 === 1

        return (
          <div key={category}>
            <InfiniteScroll direction={isReverse ? 'reverse' : 'normal'}>
              {techs.map((tech) => {
                const IconComponent = getIcon(tech.logo)

                return (
                  <div
                    key={tech.text}
                    className="flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2 text-sm font-medium text-foreground shadow-sm backdrop-blur-sm transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    {IconComponent && <IconComponent className="size-4 text-primary shrink-0" />}
                    <span className="whitespace-nowrap">{tech.text}</span>
                  </div>
                )
              })}
            </InfiniteScroll>
          </div>
        )
      })}
    </div>
  )
}