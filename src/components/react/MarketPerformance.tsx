import { useEffect, useRef } from 'react';

interface MarketPerformanceProps {
    className?: string;
}

export default function MarketPerformance({ className = '' }: MarketPerformanceProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "550",
            symbolsGroups: [
                {
                    name: "US Sectors",
                    symbols: [
                        { s: "SP:SPX", d: "S&P 500" },
                        { s: "SP:XLK", d: "Technology" },
                        { s: "SP:XLF", d: "Financials" },
                        { s: "SP:XLV", d: "Health Care" },
                        { s: "SP:XLY", d: "Consumer Discret." },
                        { s: "SP:XLP", d: "Consumer Staples" },
                        { s: "SP:XLE", d: "Energy" },
                        { s: "SP:XLC", d: "Comm. Services" },
                        { s: "SP:XLI", d: "Industrials" },
                        { s: "SP:XLB", d: "Materials" },
                        { s: "SP:XLU", d: "Utilities" },
                        { s: "SP:XLRE", d: "Real Estate" }
                    ]
                },
                {
                    name: "Global Indices",
                    symbols: [
                        { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
                        { s: "FOREXCOM:NSXUSD", d: "Nasdaq 100" },
                        { s: "FOREXCOM:DJI", d: "Dow Jones" },
                        { s: "INDEX:NKY", d: "Nikkei 225" },
                        { s: "INDEX:DEU40", d: "DAX" },
                        { s: "INDEX:UKX", d: "FTSE 100" },
                        { s: "INDEX:CAC40", d: "CAC 40" },
                        { s: "INDEX:HSI", d: "Hang Seng" }
                    ]
                }
            ],
            showSymbolLogo: true,
            colorTheme: "dark",
            isTransparent: false,
            locale: "en",
            headerFontSize: "medium"
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className={`market-performance ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Sector & Market Performance</h2>
                <p className="text-sm text-muted-foreground">
                    Performance overview of key US sectors and global markets
                </p>
            </div>

            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .market-performance {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 550px;
        }
      `}</style>
        </div>
    );
}
