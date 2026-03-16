import { useEffect, useState } from 'react';

interface MarketData {
    symbol: string;
    shortName: string;
    regularMarketPrice: number;
    regularMarketChange: number;
    regularMarketChangePercent: number;
    regularMarketOpen: number;
    regularMarketDayHigh: number;
    regularMarketDayLow: number;
    regularMarketPreviousClose: number;
}

interface MarketTableProps {
    className?: string;
}

type MarketTab = 'us' | 'europe' | 'asia' | 'fx' | 'rates' | 'futures' | 'crypto';

const marketConfig: Record<MarketTab, { label: string, symbols: string[] }> = {
    us: {
        label: 'US',
        symbols: ['^DJI', '^GSPC', '^IXIC', '^RUT', '^VIX']
    },
    europe: {
        label: 'Europe',
        symbols: ['^FTSE', '^GDAXI', '^FCHI', '^STOXX50E', '^IBEX']
    },
    asia: {
        label: 'Asia',
        symbols: ['^N225', '^HSI', '000001.SS', '^KS11', '^STI']
    },
    fx: {
        label: 'FX',
        symbols: ['EURUSD=X', 'GBPUSD=X', 'JPY=X', 'AUDUSD=X', 'CAD=X']
    },
    rates: {
        label: 'Rates',
        symbols: ['^TNX', '^FVX', '^TYX', '^IRX']
    },
    futures: {
        label: 'Futures',
        symbols: ['ES=F', 'NQ=F', 'YM=F', 'CL=F', 'GC=F', 'SI=F']
    },
    crypto: {
        label: 'Crypto',
        symbols: ['BTC-USD', 'ETH-USD', 'SOL-USD', 'BNB-USD', 'XRP-USD']
    }
};

const formatNumber = (num: number, digits = 2) => {
    if (num === undefined || num === null) return '-';
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(num);
};

const getDisplayName = (shortName: string, symbol: string) => {
    // Custom overrides for cleaner names
    const names: Record<string, string> = {
        '^DJI': 'Dow Jones Industrial Average',
        '^GSPC': 'S&P 500',
        '^IXIC': 'Nasdaq Composite',
        '^RUT': 'Russell 2000',
        '^VIX': 'VIX Volatility Index',
        '^FTSE': 'FTSE 100',
        '^GDAXI': 'DAX Performance Index',
        '^FCHI': 'CAC 40',
        '^N225': 'Nikkei 225',
        '^HSI': 'Hang Seng Index',
        'EURUSD=X': 'EUR/USD',
        'GBPUSD=X': 'GBP/USD',
        'JPY=X': 'USD/JPY',
        'BTC-USD': 'Bitcoin USD',
        'ETH-USD': 'Ethereum USD',
        'ES=F': 'S&P 500 Futures',
        'NQ=F': 'Nasdaq 100 Futures',
        'YM=F': 'Dow Jones Futures',
        'CL=F': 'Crude Oil',
        'GC=F': 'Gold',
        'SI=F': 'Silver'
    };
    return names[symbol] || shortName || symbol;
}

export default function YahooFinanceTable({ className = '' }: MarketTableProps) {
    const [activeTab, setActiveTab] = useState<MarketTab>('us');
    const [data, setData] = useState<MarketData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const symbols = marketConfig[activeTab].symbols.join(',');
                const response = await fetch(`/api/market-data?symbols=${encodeURIComponent(symbols)}`);

                if (!response.ok) throw new Error('Failed to fetch data');

                const json = await response.json();

                if (json.result) {
                    setData(json.result);
                } else {
                    setData([]);
                }
            } catch (err) {
                console.error("Error fetching market data:", err);
                setError('Failed to load market data.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Refresh every 60 seconds
        const interval = setInterval(fetchData, 60000);
        return () => clearInterval(interval);
    }, [activeTab]);

    return (
        <div className={`w-full rounded-lg border border-border bg-card overflow-hidden ${className}`}>
            {/* Tabs */}
            <div className="flex gap-2 p-4 border-b border-border overflow-x-auto">
                {(Object.keys(marketConfig) as MarketTab[]).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap ${activeTab === tab
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                            }`}
                    >
                        {marketConfig[tab].label}
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted/50 text-muted-foreground font-medium uppercase text-xs">
                        <tr>
                            <th className="px-4 py-3 min-w-[200px]">Name</th>
                            <th className="px-4 py-3 text-right">Value</th>
                            <th className="px-4 py-3 text-right">Change</th>
                            <th className="px-4 py-3 text-right">Chg%</th>
                            <th className="px-4 py-3 text-right hidden sm:table-cell">Open</th>
                            <th className="px-4 py-3 text-right hidden md:table-cell">High</th>
                            <th className="px-4 py-3 text-right hidden md:table-cell">Low</th>
                            <th className="px-4 py-3 text-right hidden lg:table-cell">Prev</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-muted-foreground">
                                    Loading market data...
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-red-500">
                                    {error}
                                </td>
                            </tr>
                        ) : (data.map((item) => {
                            const isPositive = item.regularMarketChange >= 0;
                            const changeColor = isPositive ? 'text-emerald-500' : 'text-red-500';

                            return (
                                <tr key={item.symbol} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-4 py-3 font-medium">
                                        <div className="flex items-center gap-2">
                                            {/* Simple circle icon */}
                                            <div className={`w-2 h-2 rounded-full ${isPositive ? 'bg-emerald-500' : 'bg-red-500'}`}></div>
                                            <div className="flex flex-col">
                                                <span className="text-foreground">{getDisplayName(item.shortName, item.symbol)}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-right font-medium">
                                        {formatNumber(item.regularMarketPrice)}
                                    </td>
                                    <td className={`px-4 py-3 text-right ${changeColor}`}>
                                        {isPositive ? '+' : ''}{formatNumber(item.regularMarketChange)}
                                    </td>
                                    <td className={`px-4 py-3 text-right ${changeColor}`}>
                                        {isPositive ? '+' : ''}{formatNumber(item.regularMarketChangePercent)}%
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground hidden sm:table-cell">
                                        {formatNumber(item.regularMarketOpen)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                                        {formatNumber(item.regularMarketDayHigh)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground hidden md:table-cell">
                                        {formatNumber(item.regularMarketDayLow)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-muted-foreground hidden lg:table-cell">
                                        {formatNumber(item.regularMarketPreviousClose)}
                                    </td>
                                </tr>
                            );
                        }))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
