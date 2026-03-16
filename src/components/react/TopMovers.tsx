import { useEffect, useRef } from 'react';

interface TopMoversProps {
    className?: string;
}

export default function TopMovers({ className = '' }: TopMoversProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-hotlists.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            colorTheme: 'dark',
            dateRange: '12M',
            exchange: 'US',
            showChart: true,
            locale: 'en',
            largeChartUrl: '',
            isTransparent: false,
            showSymbolLogo: true,
            showFloatingTooltip: false,
            width: '100%',
            height: '600',
            plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
            plotLineColorFalling: 'rgba(41, 98, 255, 1)',
            gridLineColor: 'rgba(240, 243, 250, 0)',
            scaleFontColor: 'rgba(106, 109, 120, 1)',
            belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
            belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
            belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
            belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
            symbolActiveColor: 'rgba(41, 98, 255, 0.12)'
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className={`top-movers ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Top Movers</h2>
                <p className="text-sm text-muted-foreground">
                    Daily biggest gainers and losers in the US market
                </p>
            </div>

            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .top-movers {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
