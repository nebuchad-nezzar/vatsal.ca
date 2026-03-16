import { useEffect, useRef } from 'react';

interface MarketOverviewProps {
    market: MarketTab;
    className?: string;
}

type MarketTab = 'us' | 'europe' | 'asia' | 'fx' | 'rates' | 'futures' | 'crypto';

const marketSymbols: Record<MarketTab, string[][]> = {
    us: [
        ['Dow Jones', 'FOREXCOM:DJI'],
        ['S&P 500', 'FOREXCOM:SPXUSD'],
        ['Nasdaq', 'NASDAQ:NDX'],
        ['VIX', 'TVC:VIX'],
        ['Gold', 'FOREXCOM:XAUUSD'],
        ['Oil', 'TVC:USOIL']
    ],
    europe: [
        ['FTSE 100', 'INDEX:UKX'],
        ['DAX', 'XETR:DAX'],
        ['CAC 40', 'INDEX:CAC40'],
        ['EURO STOXX 50', 'INDEX:SX5E'],
        ['IBEX 35', 'BME:IBC'],
        ['SMI', 'INDEX:SMI']
    ],
    asia: [
        ['Nikkei 225', 'INDEX:NKY'],
        ['Hang Seng', 'HSI:HSI'],
        ['Shanghai', 'SSE:000001'],
        ['KOSPI', 'KRX:KOSPI'],
        ['ASX 200', 'ASX:XJO'],
        ['Sensex', 'BSE:SENSEX']
    ],
    fx: [
        ['EUR/USD', 'FX:EURUSD'],
        ['GBP/USD', 'FX:GBPUSD'],
        ['USD/JPY', 'FX:USDJPY'],
        ['USD/CHF', 'FX:USDCHF'],
        ['AUD/USD', 'FX:AUDUSD'],
        ['USD/CAD', 'FX:USDCAD']
    ],
    rates: [
        ['US 10Y', 'TVC:US10Y'],
        ['US 2Y', 'TVC:US02Y'],
        ['US 30Y', 'TVC:US30Y'],
        ['DE 10Y', 'TVC:DE10Y'],
        ['GB 10Y', 'TVC:GB10Y'],
        ['JP 10Y', 'TVC:JP10Y']
    ],
    futures: [
        ['Crude Oil', 'NYMEX:CL1!'],
        ['Natural Gas', 'NYMEX:NG1!'],
        ['Gold', 'COMEX:GC1!'],
        ['Silver', 'COMEX:SI1!'],
        ['Copper', 'COMEX:HG1!'],
        ['Wheat', 'CBOT:ZW1!']
    ],
    crypto: [
        ['Bitcoin', 'BINANCE:BTCUSDT'],
        ['Ethereum', 'BINANCE:ETHUSDT'],
        ['BNB', 'BINANCE:BNBUSDT'],
        ['Solana', 'BINANCE:SOLUSDT'],
        ['XRP', 'BINANCE:XRPUSDT'],
        ['Cardano', 'BINANCE:ADAUSDT']
    ]
};

const tabLabels: Record<MarketTab, string> = {
    us: 'US',
    europe: 'Europe',
    asia: 'Asia',
    fx: 'FX',
    rates: 'Rates',
    futures: 'Futures',
    crypto: 'Crypto'
};

export default function MarketOverview({ market, className = '' }: MarketOverviewProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: "100%",
            height: "450",
            symbolsGroups: [
                {
                    name: tabLabels[market],
                    symbols: marketSymbols[market].map(item => ({ name: item[1], displayName: item[0] }))
                }
            ],
            showSymbolLogo: true,
            colorTheme: "dark",
            isTransparent: false,
            locale: "en",
            headerFontSize: "normal"
        });

        containerRef.current.appendChild(script);
    }, [market]);

    return (
        <div className={`market-overview ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">{tabLabels[market]} Overview</h2>
            </div>

            {/* TradingView Widget */}
            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .market-overview {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 450px;
        }
      `}</style>
        </div>
    );
}
