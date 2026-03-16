import { useEffect, useRef, useState } from 'react';

interface AdvancedChartProps {
    className?: string;
    defaultSymbol?: string;
}

type TimeInterval = '1' | '5' | '15' | '60' | '240' | 'D' | 'W' | 'M';

const timeIntervals: { label: string; value: TimeInterval }[] = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1H', value: '60' },
    { label: '4H', value: '240' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' },
    { label: '1M', value: 'M' }
];

const popularSymbols = [
    { name: 'S&P 500', symbol: 'FOREXCOM:SPXUSD' },
    { name: 'Dow Jones', symbol: 'FOREXCOM:DJI' },
    { name: 'Nasdaq', symbol: 'NASDAQ:NDX' },
    { name: 'Bitcoin', symbol: 'BINANCE:BTCUSDT' },
    { name: 'Ethereum', symbol: 'BINANCE:ETHUSDT' },
    { name: 'Gold', symbol: 'FOREXCOM:XAUUSD' },
    { name: 'Crude Oil', symbol: 'TVC:USOIL' },
    { name: 'EUR/USD', symbol: 'FX:EURUSD' },
    { name: 'Apple', symbol: 'NASDAQ:AAPL' },
    { name: 'Tesla', symbol: 'NASDAQ:TSLA' },
    { name: 'Microsoft', symbol: 'NASDAQ:MSFT' },
    { name: 'Amazon', symbol: 'NASDAQ:AMZN' }
];

export default function AdvancedChart({
    className = '',
    defaultSymbol = 'FOREXCOM:SPXUSD'
}: AdvancedChartProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [symbol, setSymbol] = useState(defaultSymbol);
    const [interval, setInterval] = useState<TimeInterval>('D');
    const [searchQuery, setSearchQuery] = useState('');
    const [showSearch, setShowSearch] = useState(false);

    const filteredSymbols = popularSymbols.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            autosize: true,
            symbol: symbol,
            interval: interval,
            timezone: 'Etc/UTC',
            theme: 'dark',
            style: '1',
            locale: 'en',
            enable_publishing: false,
            allow_symbol_change: true,
            support_host: 'https://www.tradingview.com',
            container_id: 'tradingview_chart',
            studies: [
                'STD;SMA'
            ],
            show_popup_button: true,
            popup_width: '1000',
            popup_height: '650',
            hide_top_toolbar: false,
            hide_legend: false,
            save_image: true,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            gridColor: 'rgba(255, 255, 255, 0.06)',
            hide_side_toolbar: false,
            withdateranges: true,
            range: '12M',
            details: true,
            hotlist: true,
            calendar: true,
            news: ['headlines']
        });

        containerRef.current.appendChild(script);
    }, [symbol, interval]);

    return (
        <div className={`advanced-chart ${className}`}>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Advanced Chart</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Interactive price chart with technical indicators
                        </p>
                    </div>

                    <div className="flex gap-2 items-center flex-wrap">
                        {/* Symbol Search */}
                        <div className="relative">
                            <button
                                onClick={() => setShowSearch(!showSearch)}
                                className="px-4 py-2 text-sm font-medium rounded-lg border border-border bg-card hover:bg-muted transition-colors flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                {popularSymbols.find(s => s.symbol === symbol)?.name || 'Select Symbol'}
                            </button>

                            {showSearch && (
                                <div className="absolute top-full mt-2 right-0 w-64 bg-card border border-border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                                    <div className="p-2 border-b border-border sticky top-0 bg-card">
                                        <input
                                            type="text"
                                            placeholder="Search symbols..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                                            autoFocus
                                        />
                                    </div>
                                    <div className="p-1">
                                        {filteredSymbols.map((item) => (
                                            <button
                                                key={item.symbol}
                                                onClick={() => {
                                                    setSymbol(item.symbol);
                                                    setShowSearch(false);
                                                    setSearchQuery('');
                                                }}
                                                className={`w-full text-left px-3 py-2 text-sm rounded hover:bg-muted transition-colors ${symbol === item.symbol ? 'bg-primary text-primary-foreground' : ''
                                                    }`}
                                            >
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-xs text-muted-foreground">{item.symbol}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Time Interval Selector */}
                        <div className="flex gap-1 bg-card border border-border rounded-lg p-1">
                            {timeIntervals.map((ti) => (
                                <button
                                    key={ti.value}
                                    onClick={() => setInterval(ti.value)}
                                    className={`px-3 py-1 text-xs font-medium rounded transition-colors ${interval === ti.value
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                                        }`}
                                >
                                    {ti.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* TradingView Advanced Chart Widget */}
            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div
                    ref={containerRef}
                    id="tradingview_chart"
                    className="tradingview-widget-container__widget"
                ></div>
            </div>

            {/* Click outside to close search */}
            {showSearch && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowSearch(false)}
                />
            )}

            <style>{`
        .advanced-chart {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
        #tradingview_chart {
          height: 600px;
        }
      `}</style>
        </div>
    );
}
