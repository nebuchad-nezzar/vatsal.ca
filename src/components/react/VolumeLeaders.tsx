import { useEffect, useRef } from 'react';

interface VolumeLeadersProps {
    className?: string;
}

export default function VolumeLeaders({ className = '' }: VolumeLeadersProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: '100%',
            height: '600',
            defaultColumn: 'overview',
            defaultScreen: 'most_capitalized', // Using most capitalized as a proxy for high visibility/volume often, but can be customized if 'most_active' is an option in this specific widget config, usually via sorting.
            // TradingView Screener widget defaultScreen options include 'top_gainers', 'top_losers', 'most_active', 'most_capitalized', 'dividend_yield_leaders', 'most_volatile'
            // Changing to 'most_active' is better for "Volume Leaders"
            sort: 'volume|desc',
            market: 'america',
            showToolbar: true,
            colorTheme: 'dark',
            locale: 'en'
        });

        // Quick fix: The standard embed doesn't always support 'sort' directly in top-level JSON for some presets.
        // However, the best way to get Volume Leaders is using the screener with defaultScreen: "most_active" if supported or generic screener.
        // Let's rely on defaultColumn overview which usually includes Volume and sorting by it.
        // Better strategy for "Volume Leaders" specifically:

        const config = {
            width: '100%',
            height: '600',
            defaultColumn: "overview",
            defaultScreen: "most_active", // Specific screen for volume leaders
            market: "america",
            showToolbar: true,
            colorTheme: "dark",
            locale: "en"
        };

        script.innerHTML = JSON.stringify(config);

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className={`volume-leaders ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Most Active Stocks</h2>
                <p className="text-sm text-muted-foreground">
                    Top volume leaders with intraday volume data
                </p>
            </div>

            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .volume-leaders {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
