import React, { useState } from 'react'

interface CountryGeoData {
  code: string;
  name: string;
  flag: string;
  lat: number;
  lng: number;
  requests: number;
  share: number;
}

interface WorldMapVisualProps {
  countries: CountryGeoData[];
  totalRequests24h?: number;
  totalRequests7d?: number;
  totalRequests30d?: number;
}

export default function WorldMapVisual({
  countries,
  totalRequests24h = 1980,
  totalRequests7d = 22431,
  totalRequests30d = 70120
}: WorldMapVisualProps) {
  const [activeCountry, setActiveCountry] = useState<CountryGeoData | null>(null);
  const [mapRange, setMapRange] = useState<'24h' | '7d' | '30d'>('24h');

  // Compute scaled requests based on selected time range
  const scaleFactor = mapRange === '24h' ? 1 : mapRange === '7d' ? (totalRequests7d / Math.max(1, totalRequests24h)) : (totalRequests30d / Math.max(1, totalRequests24h));

  const scaledCountries = countries.map(c => ({
    ...c,
    displayRequests: Math.round(c.requests * scaleFactor)
  }));

  const maxRequests = scaledCountries[0]?.displayRequests || 1;

  // Convert lat/lng to SVG viewBox coordinates (width: 1000, height: 500)
  // Equirectangular projection mapping:
  function project(lat: number, lng: number) {
    const x = ((lng + 180) * 1000) / 360;
    const y = ((90 - lat) * 500) / 180;
    return { x, y };
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0a] p-6">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/5 via-blue-900/5 to-transparent pointer-events-none"></div>
      
      <div className="relative z-10 flex flex-col space-y-5">
        
        {/* Header with Title and 24h / 7d / 30d Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-foreground flex items-center gap-2">
              <span>Global Edge Traffic Heatmap</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono">
                {countries.length} Countries
              </span>
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Live geographic perimeter telemetry routed to vatsal.ca ({mapRange.toUpperCase()})
            </p>
          </div>

          {/* Time Range Selector for World Map */}
          <div className="flex items-center gap-1.5 bg-black/50 p-1 rounded-xl border border-white/10 w-fit">
            {(['24h', '7d', '30d'] as const).map((range) => {
              const isActive = mapRange === range;
              return (
                <button
                  key={range}
                  onClick={() => setMapRange(range)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {range.toUpperCase()}
                </button>
              );
            })}
          </div>
        </div>

        {/* Hover Info Banner if Active */}
        {activeCountry && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-cyan-950/40 border border-cyan-500/40 text-xs font-mono w-fit animate-fade-in">
            <span className="text-base">{activeCountry.flag}</span>
            <span className="text-foreground font-bold">{activeCountry.name}:</span>
            <span className="text-cyan-400 font-bold">{Math.round(activeCountry.requests * scaleFactor).toLocaleString()} requests</span>
            <span className="text-muted-foreground">({activeCountry.share}% global share)</span>
          </div>
        )}

        {/* High-Fidelity SVG World Map Container */}
        <div className="relative w-full aspect-[2/1] bg-[#05070a] rounded-xl border border-white/10 overflow-hidden flex items-center justify-center p-2 shadow-inner">
          
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-full select-none"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Background Grid Pattern */}
              <pattern id="world-grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="0.8" />
              </pattern>
              
              {/* Radial Glow Gradient for Heatmap Nodes */}
              <radialGradient id="node-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.85" />
                <stop offset="60%" stopColor="#0284c7" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0" />
              </radialGradient>

              {/* Active Selected Glow */}
              <radialGradient id="selected-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#38bdf8" stopOpacity="1" />
                <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.5" />
                <stop offset="100%" stopColor="#06b6d4" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Ocean Grid Background */}
            <rect width="1000" height="500" fill="url(#world-grid)" />
            
            {/* Latitude / Longitude Guide Lines */}
            <line x1="0" y1="250" x2="1000" y2="250" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="500" y1="0" x2="500" y2="500" stroke="rgba(255, 255, 255, 0.06)" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="125" x2="1000" y2="125" stroke="rgba(255, 255, 255, 0.03)" strokeDasharray="2 4" strokeWidth="0.8" />
            <line x1="0" y1="375" x2="1000" y2="375" stroke="rgba(255, 255, 255, 0.03)" strokeDasharray="2 4" strokeWidth="0.8" />

            {/* REALISTIC DETAILED WORLD MAP CONTINENT PATHS */}
            <g fill="#151921" stroke="#2a3240" strokeWidth="0.75" strokeLinejoin="round" className="transition-colors">
              
              {/* NORTH AMERICA (Canada, USA, Alaska, Mexico, Central America) */}
              <path d="
                M 80,45 L 140,30 L 220,35 L 260,60 L 235,90 L 255,105 L 285,90 L 305,120 L 265,145 L 275,185 L 245,210 L 235,260 L 250,270 L 220,300 L 210,295 L 200,270 L 175,225 L 145,210 L 125,160 L 105,130 L 60,105 L 55,75 Z
              " />

              {/* GREENLAND */}
              <path d="
                M 330,25 L 410,20 L 440,65 L 390,110 L 340,90 Z
              " />

              {/* SOUTH AMERICA */}
              <path d="
                M 270,295 L 320,300 L 375,340 L 360,400 L 320,460 L 290,470 L 280,420 L 260,360 L 255,315 Z
              " />

              {/* EUROPE & SCANDINAVIA */}
              <path d="
                M 470,85 L 515,60 L 540,90 L 510,135 L 525,150 L 500,185 L 460,180 L 450,150 L 470,120 Z
              " />
              {/* British Isles */}
              <path d="M 445,115 L 465,110 L 460,135 L 440,135 Z" />
              {/* Iceland */}
              <path d="M 410,75 L 430,70 L 430,85 L 415,85 Z" />

              {/* AFRICA */}
              <path d="
                M 465,195 L 560,190 L 595,240 L 555,340 L 530,390 L 490,380 L 465,310 L 435,250 L 450,210 Z
              " />
              {/* Madagascar */}
              <path d="M 580,340 L 600,345 L 585,390 L 575,370 Z" />

              {/* ASIA (Russia/Siberia, China, India, Middle East, SE Asia) */}
              <path d="
                M 545,65 L 700,50 L 880,55 L 900,100 L 840,150 L 800,180 L 780,240 L 725,270 L 710,230 L 660,260 L 635,200 L 585,180 L 570,140 L 545,110 Z
              " />
              {/* Indian Subcontinent */}
              <path d="M 640,200 L 690,205 L 670,270 L 640,240 Z" />
              {/* Japan */}
              <path d="M 850,140 L 870,145 L 860,185 L 840,175 Z" />
              {/* Indonesia & Philippines Islands */}
              <path d="M 740,290 L 780,290 L 775,315 L 735,310 Z" />
              <path d="M 790,300 L 830,300 L 820,320 L 785,320 Z" />
              <path d="M 790,230 L 810,230 L 805,260 L 785,250 Z" />

              {/* AUSTRALIA & NEW ZEALAND */}
              <path d="
                M 780,335 L 875,330 L 890,385 L 850,430 L 785,410 L 760,370 Z
              " />
              {/* New Zealand */}
              <path d="M 915,400 L 935,395 L 925,445 L 905,435 Z" />
            </g>

            {/* TRAFFIC HEATMAP NODES */}
            {scaledCountries.map((country) => {
              if (!country.lat && !country.lng) return null;
              const { x, y } = project(country.lat, country.lng);
              
              // Scale radius between 5px and 22px based on share
              const radius = Math.max(5, Math.min(22, 5 + Math.sqrt(country.displayRequests / maxRequests) * 17));
              const isSelected = activeCountry?.code === country.code;

              return (
                <g 
                  key={country.code}
                  className="cursor-pointer transition-transform duration-300 group"
                  onMouseEnter={() => setActiveCountry(country)}
                  onMouseLeave={() => setActiveCountry(null)}
                >
                  {/* Outer Pulsing Glow */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius * 2.2}
                    fill={isSelected ? "url(#selected-glow)" : "url(#node-glow)"}
                    className="animate-pulse"
                  />
                  
                  {/* Outer Concentric Ping Ring */}
                  <circle
                    cx={x}
                    cy={y}
                    r={radius}
                    fill="none"
                    stroke={isSelected ? "#38bdf8" : "#06b6d4"}
                    strokeWidth={isSelected ? "2.5" : "1.5"}
                    opacity={isSelected ? "1" : "0.75"}
                  />

                  {/* Core Solid Center */}
                  <circle
                    cx={x}
                    cy={y}
                    r={Math.max(2.5, radius * 0.4)}
                    fill={isSelected ? "#ffffff" : "#22d3ee"}
                  />

                  {/* Top 3 Country Name Callouts on Map */}
                  {country.share >= 8 && (
                    <text
                      x={x}
                      y={y - radius - 4}
                      textAnchor="middle"
                      fill="#e2e8f0"
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      className="pointer-events-none drop-shadow-md"
                    >
                      {country.code} ({country.share}%)
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Ranked Country Leaderboard Cards (Full names unclipped) */}
        <div>
          <div className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-2.5">
            Top Routing Regions ({mapRange.toUpperCase()})
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-2.5">
            {scaledCountries.slice(0, 6).map((c) => {
              const isSelected = activeCountry?.code === c.code;
              return (
                <div 
                  key={c.code}
                  onMouseEnter={() => setActiveCountry(c)}
                  onMouseLeave={() => setActiveCountry(null)}
                  className={`p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/50 border-cyan-400 shadow-lg scale-[1.02]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-1 text-xs font-mono">
                    <span className="flex items-center gap-1.5 truncate">
                      <span className="text-sm shrink-0">{c.flag}</span>
                      <span className="text-foreground font-bold truncate" title={c.name}>{c.name}</span>
                    </span>
                    <span className="text-cyan-400 font-bold shrink-0">{c.share}%</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono mt-2">
                    <span>{c.displayRequests.toLocaleString()} reqs</span>
                    <span className="text-[10px] text-zinc-500">{c.code}</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-1.5">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full" 
                      style={{ width: `${c.share}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
