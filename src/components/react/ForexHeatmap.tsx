import { useEffect, useRef } from 'react';

interface ForexHeatmapProps {
    className?: string;
}

export default function ForexHeatmap({ className = '' }: ForexHeatmapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-heat-map.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "500",
            currencies: [
                "EUR",
                "USD",
                "JPY",
                "GBP",
                "CHF",
                "AUD",
                "CAD",
                "NZD",
                "CNY"
            ],
            isTransparent: false,
            colorTheme: "dark",
            locale: "en"
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className={`forex-heatmap ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Forex Heatmap</h2>
                <p className="text-sm text-muted-foreground">
                    Real-time relative strength of major currency pairs
                </p>
            </div>

            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .forex-heatmap {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 500px;
        }
      `}</style>
        </div>
    );
}
