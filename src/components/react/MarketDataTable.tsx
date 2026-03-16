import { useEffect, useRef, useState } from 'react';

interface MarketDataTableProps {
    category: MarketCategory;
    className?: string;
}

type MarketCategory = 'indices' | 'stocks' | 'currencies' | 'crypto';
type Region = 'majors' | 'futures' | 'americas' | 'europe' | 'asiapacific' | 'middleeast' | 'africa';

const categoryConfig: Record<MarketCategory, { title: string; regions?: Region[] }> = {
    indices: {
        title: 'Indices',
        regions: ['majors', 'futures', 'americas', 'europe', 'asiapacific', 'middleeast', 'africa']
    },
    stocks: {
        title: 'Stocks'
    },
    currencies: {
        title: 'Currencies'
    },
    crypto: {
        title: 'Cryptocurrency'
    }
};

const regionLabels: Record<Region, string> = {
    majors: 'Majors',
    futures: 'Indices Futures',
    americas: 'Americas',
    europe: 'Europe',
    asiapacific: 'Asia/Pacific',
    middleeast: 'Middle East',
    africa: 'Africa'
};

export default function MarketDataTable({ category, className = '' }: MarketDataTableProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeRegion, setActiveRegion] = useState<Region>('majors');

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const widgetConfig: any = {
            colorTheme: 'dark',
            dateRange: '12M',
            showChart: true,
            locale: 'en',
            width: '100%',
            height: '600',
            largeChartUrl: '',
            isTransparent: false,
            showSymbolLogo: true,
            showFloatingTooltip: true,
            plotLineColorGrowing: 'rgba(41, 98, 255, 1)',
            plotLineColorFalling: 'rgba(41, 98, 255, 1)',
            gridLineColor: 'rgba(240, 243, 250, 0)',
            scaleFontColor: 'rgba(106, 109, 120, 1)',
            belowLineFillColorGrowing: 'rgba(41, 98, 255, 0.12)',
            belowLineFillColorFalling: 'rgba(41, 98, 255, 0.12)',
            belowLineFillColorGrowingBottom: 'rgba(41, 98, 255, 0)',
            belowLineFillColorFallingBottom: 'rgba(41, 98, 255, 0)',
            symbolActiveColor: 'rgba(41, 98, 255, 0.12)'
        };

        let script: HTMLScriptElement | undefined = undefined;

        if (category === 'indices') {
            script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                ...widgetConfig,
                title: 'Indices',
                tabs: [
                    {
                        title: regionLabels[activeRegion],
                        symbols: getIndicesSymbols(activeRegion)
                    }
                ]
            });
        } else if (category === 'stocks') {
            script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                width: '100%',
                height: '600',
                defaultColumn: 'overview',
                defaultScreen: 'most_capitalized',
                market: 'america',
                showToolbar: true,
                colorTheme: 'dark',
                locale: 'en'
            });
        } else if (category === 'currencies') {
            script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-forex-cross-rates.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                width: '100%',
                height: '600',
                currencies: ['EUR', 'USD', 'JPY', 'GBP', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY'],
                isTransparent: false,
                colorTheme: 'dark',
                locale: 'en'
            });
        } else if (category === 'crypto') {
            script = document.createElement('script');
            script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
            script.async = true;
            script.innerHTML = JSON.stringify({
                width: '100%',
                height: '600',
                defaultColumn: 'overview',
                defaultScreen: 'general',
                market: 'crypto',
                showToolbar: true,
                colorTheme: 'dark',
                locale: 'en'
            });
        }

        if (script) {
            containerRef.current.appendChild(script);
        }
    }, [category, activeRegion]);

    function getIndicesSymbols(region: Region) {
        const symbols: Record<Region, any[]> = {
            majors: [
                { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
                { s: 'FOREXCOM:NSXUSD', d: 'US 100' },
                { s: 'FOREXCOM:DJI', d: 'Dow 30' },
                { s: 'INDEX:NKY', d: 'Nikkei 225' },
                { s: 'INDEX:DEU40', d: 'DAX Index' },
                { s: 'FOREXCOM:UKXGBP', d: 'UK 100' }
            ],
            futures: [
                { s: 'CME_MINI:ES1!', d: 'S&P 500' },
                { s: 'CME_MINI:NQ1!', d: 'Nasdaq 100' },
                { s: 'CBOT_MINI:YM1!', d: 'Dow 30' },
                { s: 'CME:6E1!', d: 'Euro' },
                { s: 'COMEX:GC1!', d: 'Gold' },
                { s: 'NYMEX:CL1!', d: 'Crude Oil' }
            ],
            americas: [
                { s: 'FOREXCOM:SPXUSD', d: 'S&P 500' },
                { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
                { s: 'NASDAQ:NDX', d: 'Nasdaq 100' },
                { s: 'INDEX:RUT', d: 'Russell 2000' },
                { s: 'TSX:TSX', d: 'S&P/TSX' },
                { s: 'BMV:ME', d: 'IPC Mexico' },
                { s: 'INDEX:IBOV', d: 'Bovespa' }
            ],
            europe: [
                { s: 'INDEX:DEU40', d: 'DAX' },
                { s: 'INDEX:UKX', d: 'FTSE 100' },
                { s: 'INDEX:CAC40', d: 'CAC 40' },
                { s: 'INDEX:SX5E', d: 'EURO STOXX 50' },
                { s: 'BME:IBC', d: 'IBEX 35' },
                { s: 'INDEX:SMI', d: 'SMI' }
            ],
            asiapacific: [
                { s: 'INDEX:NKY', d: 'Nikkei 225' },
                { s: 'HSI:HSI', d: 'Hang Seng' },
                { s: 'SSE:000001', d: 'Shanghai Composite' },
                { s: 'KRX:KOSPI', d: 'KOSPI' },
                { s: 'ASX:XJO', d: 'ASX 200' },
                { s: 'BSE:SENSEX', d: 'Sensex' }
            ],
            middleeast: [
                { s: 'TADAWUL:TASI', d: 'TASI' },
                { s: 'DFM:DFMGI', d: 'DFM' },
                { s: 'ADX:ADI', d: 'ADX General' },
                { s: 'QSE:GNRI', d: 'QE Index' }
            ],
            africa: [
                { s: 'JSE:J203', d: 'FTSE/JSE Top 40' },
                { s: 'EGX:EGX30', d: 'EGX 30' },
                { s: 'NGSE:NSE30', d: 'NSE 30' }
            ]
        };

        return symbols[region] || symbols.majors;
    }

    return (
        <div className={`market-data-table ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-4">{categoryConfig[category].title}</h2>

                {/* Region Tabs (for Indices only) */}
                {category === 'indices' && categoryConfig[category].regions && (
                    <div className="flex gap-2 overflow-x-auto pb-2 border-b border-border mb-4">
                        {categoryConfig[category].regions!.map((region) => (
                            <button
                                key={region}
                                onClick={() => setActiveRegion(region)}
                                className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors whitespace-nowrap ${activeRegion === region
                                    ? 'bg-primary text-primary-foreground'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                    }`}
                            >
                                {regionLabels[region]}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* TradingView Widget */}
            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .market-data-table {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
