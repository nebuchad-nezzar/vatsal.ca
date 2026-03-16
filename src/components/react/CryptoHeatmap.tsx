import { useEffect, useRef } from 'react';

interface CryptoHeatmapProps {
    className?: string;
}

export default function CryptoHeatmap({ className = '' }: CryptoHeatmapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            dataSource: "Crypto",
            blockSize: "market_cap_calc",
            blockColor: "change",
            locale: "en",
            symbolUrl: "",
            colorTheme: "dark",
            hasTopBar: true,
            isDataSetEnabled: true,
            isZoomEnabled: true,
            hasSymbolTooltip: true,
            width: "100%",
            height: "600"
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className={`crypto-heatmap ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Cryptocurrency Heatmap</h2>
                <p className="text-sm text-muted-foreground">
                    Market capitalization and performance of leading crypto assets
                </p>
            </div>

            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .crypto-heatmap {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
