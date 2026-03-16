import { useEffect, useRef } from 'react';

interface MarketTreemapProps {
    market?: TreemapMarket;
    className?: string;
}

type TreemapMarket = 'sp500' | 'nasdaq' | 'crypto';

const marketConfig: Record<TreemapMarket, { title: string; symbols: string; dataSource: string }> = {
    sp500: {
        title: 'S&P 500',
        symbols: '',
        dataSource: 'SPX500'
    },
    nasdaq: {
        title: 'Nasdaq Composite',
        symbols: '',
        dataSource: 'IXIC'
    },
    crypto: {
        title: 'Cryptocurrency',
        symbols: '',
        dataSource: 'Crypto'
    }
};

export default function MarketTreemap({ market = 'sp500', className = '' }: MarketTreemapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const config = marketConfig[market] || marketConfig.sp500;

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-stock-heatmap.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            exchanges: [],
            dataSource: config.dataSource,
            grouping: 'sector',
            blockSize: 'market_cap_basic',
            blockColor: 'change',
            locale: 'en',
            symbolUrl: '',
            colorTheme: 'dark',
            hasTopBar: true,
            isDataSetEnabled: true,
            isZoomEnabled: true,
            hasSymbolTooltip: true,
            width: '100%',
            height: '600'
        });

        containerRef.current.appendChild(script);
    }, [market]);

    const currentConfig = marketConfig[market] || marketConfig.sp500;

    return (
        <div className={`market-treemap ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">{currentConfig?.title || 'Market'} Heatmap</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Day's change by market capitalization
                </p>
            </div>

            {/* TradingView Heatmap Widget */}
            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .market-treemap {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
