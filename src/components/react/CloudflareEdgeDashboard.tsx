import React, { useEffect, useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, LineChart, Line, PieChart, Pie, Cell
} from 'recharts'
import EdgeGlobeVisual from './EdgeGlobeVisual'

type TimeRange = '24h' | '7d' | '30d';

export default function CloudflareEdgeDashboard() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeRange, setActiveRange] = useState<TimeRange>('30d')
  const [activeChartTab, setActiveChartTab] = useState<'requests' | 'uniques' | 'threats' | 'all'>('all')

  useEffect(() => {
    fetch('/api/admin/cloudflare-analytics')
      .then(async (res) => {
        if (!res.ok) {
          const err = await res.json()
          throw new Error(err.error || 'Failed to fetch analytics')
        }
        return res.json()
      })
      .then(json => {
        setData(json)
        setLoading(false)
      })
      .catch(err => {
        console.error('Failed to load Cloudflare analytics:', err)
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="w-full flex flex-col items-center justify-center py-24 space-y-4">
        <div className="size-8 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-xs text-muted-foreground font-mono animate-pulse">
          Querying Cloudflare GraphQL Edge Analytics (24h, 7d, 30d)...
        </div>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="rounded-xl border border-red-500/20 bg-red-950/20 p-8 text-center space-y-3">
        <div className="text-red-400 font-bold text-base font-mono">Unable to connect to Cloudflare Edge API</div>
        <p className="text-xs text-muted-foreground">{error || 'Please verify CLOUDFLARE_ANALYTICS_TOKEN in your environment.'}</p>
      </div>
    )
  }

  const periodData = data.periods[activeRange]
  const metrics = periodData?.metrics || {}
  const timeSeries = periodData?.timeSeries || []
  const { topCountries = [], topPaths = [], statusCodes = [], httpProtocols = [] } = data

  const dateLabel = activeRange === '24h' ? 'time' : 'date'

  // Format Visits (Unique IPs)
  const formattedVisits = metrics.uniques >= 1000 
    ? (metrics.uniques / 1000).toFixed(2) + 'k' 
    : metrics.uniques;

  // Bot vs Human Proxy (Clean vs Threats)
  // Note: On free tier, we use WAF threats as a proxy for malicious bots
  const cleanTraffic = Math.max(0, metrics.requests - metrics.threats);
  const botTrafficData = [
    { name: 'Clean / Human', value: cleanTraffic, color: '#10b981' },
    { name: 'Mitigated Bots / Threats', value: metrics.threats, color: '#ef4444' }
  ];
  const botRatio = metrics.requests > 0 ? ((metrics.threats / metrics.requests) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-8">
      
      {/* Header Bar with Time Range Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-xs text-orange-300 font-mono mb-2">
            <span className="size-1.5 rounded-full bg-orange-400 animate-pulse"></span>
            Cloudflare Edge Engine
          </div>
          <h2 className="text-2xl font-bold text-foreground">Perimeter Telemetry & Growth</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time global CDN cache performance, DDoS mitigation, and edge traffic dynamics.
          </p>
        </div>

        {/* 24h / 7d / 30d Toggle */}
        <div className="flex items-center gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10 w-fit">
          {(['24h', '7d', '30d'] as TimeRange[]).map((range) => {
            const isActive = activeRange === range
            return (
              <button
                key={range}
                onClick={() => setActiveRange(range)}
                className={`px-4 py-2 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-orange-500/20 text-orange-300 border border-orange-500/40 shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                }`}
              >
                {range.toUpperCase()}
              </button>
            )
          })}
        </div>
      </div>

      {/* Edge KPI Growth Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">

        {/* Total Edge Requests */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-amber-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>EDGE REQUESTS</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                metrics.requestsGrowth?.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30' : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
              }`}>
                {metrics.requestsGrowth}
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground font-mono">
              {metrics.requests?.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground">{activeRange.toUpperCase()} total edge hits</p>
          </div>
        </div>

        {/* Visits (Unique Edge IPs) */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 via-blue-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>VISITS</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold font-mono ${
                metrics.uniquesGrowth?.startsWith('+') ? 'text-cyan-400 bg-cyan-500/10 border border-cyan-500/30' : 'text-rose-400 bg-rose-500/10 border border-rose-500/30'
              }`}>
                {metrics.uniquesGrowth}
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground font-mono">
              {metrics.uniques?.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground">Distinct IP perimeter contacts</p>
          </div>
        </div>

        {/* Threats Blocked */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-rose-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>THREATS MITIGATED</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 border border-red-500/30 text-red-400 font-bold font-mono">
                WAF
              </span>
            </div>
            <div className="text-3xl font-bold text-foreground font-mono">
              {metrics.threats?.toLocaleString()}
            </div>
            <p className="text-[11px] text-muted-foreground">Scrapers & bad bots blocked</p>
          </div>
        </div>

        {/* Cache Hit Ratio */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 via-green-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>CACHE HIT RATE</span>
              <span className="text-xs text-emerald-400 font-bold">CDN</span>
            </div>
            <div className="text-3xl font-bold text-emerald-400 font-mono">
              {metrics.cacheHitRatio}%
            </div>
            <p className="text-[11px] text-muted-foreground">{metrics.cachedRequests?.toLocaleString()} edge hits served</p>
          </div>
        </div>

        {/* Bandwidth Saved */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-indigo-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-2">
            <div className="flex items-center justify-between text-xs text-muted-foreground font-mono">
              <span>BANDWIDTH</span>
              <span className="text-xs text-purple-400 font-bold">{metrics.bandwidthSavedRatio}% saved</span>
            </div>
            <div className="text-3xl font-bold text-foreground font-mono">
              {metrics.bytesFormatted}
            </div>
            <p className="text-[11px] text-muted-foreground">{metrics.cachedBytesFormatted} offloaded to CDN</p>
          </div>
        </div>

      </div>

      {/* Traffic Quality & Interactive Growth Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bot vs Human Traffic Breakdown */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-6 lg:col-span-1 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-teal-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10">
            <h3 className="text-base font-bold text-foreground">Traffic Quality & Bot Breakdown</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Verified clean traffic vs. malicious scrapers, crawlers, and WAF threats.
            </p>
          </div>

          <div className="flex-1 relative mt-4 h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={botTrafficData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {botTrafficData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#e5e5e5' }}
                  formatter={(value: number) => value.toLocaleString()}
                />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold text-foreground font-mono">{botRatio}%</span>
              <span className="text-[10px] text-muted-foreground uppercase">Threats</span>
            </div>
          </div>

          <div className="relative z-10 flex flex-col gap-2 mt-2">
            {botTrafficData.map((item, idx) => {
              const pct = metrics.requests > 0 ? ((item.value / metrics.requests) * 100).toFixed(1) : '0';
              return (
                <div key={idx} className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="text-foreground font-bold">{item.value.toLocaleString()}</span>
                    <span className="text-muted-foreground w-8 text-right">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Primary Chart Area */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-6 lg:col-span-2 flex flex-col space-y-6">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-600/5 via-amber-900/5 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-foreground">
                Edge Growth & Traffic Trajectory ({activeRange.toUpperCase()})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Chronological breakdown of requests, cache efficiency, and unique visitor trends.
              </p>
            </div>

            {/* Chart View Selector */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-lg border border-white/10">
              {[
                { key: 'all', label: 'Overview' },
                { key: 'requests', label: 'Requests' },
                { key: 'uniques', label: 'Visits' },
                { key: 'threats', label: 'Threats' }
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveChartTab(tab.key as any)}
                  className={`px-3 py-1.5 rounded text-xs font-mono transition-all cursor-pointer ${
                    activeChartTab === tab.key
                      ? 'bg-white/15 text-foreground font-bold shadow-sm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative z-10 flex-1 w-full min-h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              {activeChartTab === 'threats' ? (
                <BarChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey={dateLabel} stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="threats" fill="#ef4444" name="Mitigated Threats" radius={[4, 4, 0, 0]} />
                </BarChart>
              ) : activeChartTab === 'uniques' ? (
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorUniquesOnly" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.5} />
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey={dateLabel} stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="uniques" stroke="#06b6d4" strokeWidth={2} fill="url(#colorUniquesOnly)" name="Visits" />
                </AreaChart>
              ) : (
                <AreaChart data={timeSeries} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorReqs" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorCch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorUnq" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey={dateLabel} stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#525252" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0a0a0a', borderColor: '#262626', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#e5e5e5' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Area type="monotone" dataKey="requests" stroke="#f97316" strokeWidth={2} fill="url(#colorReqs)" name="Total Edge Requests" />
                  <Area type="monotone" dataKey="cached" stroke="#10b981" strokeWidth={1.5} fill="url(#colorCch)" name="Cached Hits" />
                  {activeChartTab === 'all' && (
                    <Area type="monotone" dataKey="uniques" stroke="#38bdf8" strokeWidth={1.5} fill="url(#colorUnq)" name="Visits" />
                  )}
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* 3D Global Edge Globe */}
      <EdgeGlobeVisual 
        countries={periodData?.countries || []} 
        timeRange={activeRange}
        onRangeChange={setActiveRange}
      />

      {/* 3-Column Grid: Status Codes, Protocols & Top Endpoints */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* HTTP Status Codes */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 via-blue-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground font-mono">Response Status Codes</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">HTTP response health & caching distribution</p>
            </div>

            <div className="space-y-2.5">
              {statusCodes.map((s: any, idx: number) => {
                const total = statusCodes.reduce((acc: number, cur: any) => acc + cur.count, 0) || 1;
                const pct = ((s.count / total) * 100).toFixed(1);
                const is2xx = s.code >= 200 && s.code < 300;
                const is3xx = s.code >= 300 && s.code < 400;
                const is4xx = s.code >= 400 && s.code < 500;
                const is5xx = s.code >= 500;

                const colorClass = is2xx ? 'text-emerald-400 bg-emerald-500' : is3xx ? 'text-blue-400 bg-blue-500' : is4xx ? 'text-amber-400 bg-amber-500' : 'text-red-400 bg-red-500';

                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className={`font-bold ${colorClass.split(' ')[0]}`}>HTTP {s.code}</span>
                      <span className="text-muted-foreground">{s.count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${colorClass.split(' ')[1]}`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Protocols & Encryption */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/5 via-indigo-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground font-mono">Protocols & Performance</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Modern web protocol adoption</p>
            </div>

            <div className="space-y-2.5">
              {httpProtocols.map((p: any, idx: number) => {
                const total = httpProtocols.reduce((acc: number, cur: any) => acc + cur.count, 0) || 1;
                const pct = ((p.count / total) * 100).toFixed(1);
                return (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-foreground font-bold">{p.protocol}</span>
                      <span className="text-muted-foreground">{p.count.toLocaleString()} ({pct}%)</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Top Requested Paths */}
        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-5">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600/5 via-orange-900/5 to-transparent pointer-events-none"></div>
          <div className="relative z-10 space-y-4">
            <div>
              <h4 className="text-sm font-bold text-foreground font-mono">Top Requested Endpoints</h4>
              <p className="text-[11px] text-muted-foreground mt-0.5">Most hit edge routes in 24h</p>
            </div>

            <div className="space-y-2 max-h-[170px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
              {topPaths.slice(0, 6).map((p: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs font-mono py-1 border-b border-white/5">
                  <span className="text-foreground truncate max-w-[140px]" title={p.path}>{p.path}</span>
                  <span className="text-orange-400 font-bold">{p.requests.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
