import { useEffect, useRef, useState } from 'react';

interface CommoditiesTableProps {
    className?: string;
}

type CommodityCategory = 'energy' | 'metals' | 'agriculture';

const categoryLabels: Record<CommodityCategory, string> = {
    energy: 'Energy',
    metals: 'Metals',
    agriculture: 'Agriculture'
};

export default function CommoditiesTable({ className = '' }: CommoditiesTableProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [activeCategory, setActiveCategory] = useState<CommodityCategory>('energy');

    const getCommoditySymbols = (category: CommodityCategory) => {
        const symbols: Record<CommodityCategory, any[]> = {
            energy: [
                { s: 'NYMEX:CL1!', d: 'Crude Oil' },
                { s: 'NYMEX:NG1!', d: 'Natural Gas' },
                { s: 'NYMEX:RB1!', d: 'Gasoline' },
                { s: 'NYMEX:HO1!', d: 'Heating Oil' },
                { s: 'ICE:BRN1!', d: 'Brent Crude' }
            ],
            metals: [
                { s: 'COMEX:GC1!', d: 'Gold' },
                { s: 'COMEX:SI1!', d: 'Silver' },
                { s: 'COMEX:HG1!', d: 'Copper' },
                { s: 'NYMEX:PL1!', d: 'Platinum' },
                { s: 'NYMEX:PA1!', d: 'Palladium' }
            ],
            agriculture: [
                { s: 'CBOT:ZW1!', d: 'Wheat' },
                { s: 'CBOT:ZC1!', d: 'Corn' },
                { s: 'CBOT:ZS1!', d: 'Soybeans' },
                { s: 'ICEUS:CC1!', d: 'Cocoa' },
                { s: 'ICEUS:CT1!', d: 'Cotton' },
                { s: 'ICEUS:KC1!', d: 'Coffee' }
            ]
        };
        return symbols[category];
    };

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            width: '100%',
            height: '500',
            symbolsGroups: [
                {
                    name: categoryLabels[activeCategory],
                    symbols: getCommoditySymbols(activeCategory)
                }
            ],
            showSymbolLogo: true,
            colorTheme: 'dark',
            isTransparent: false,
            locale: 'en',
            largeChartUrl: '',
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
        });

        containerRef.current.appendChild(script);
    }, [activeCategory]);

    return (
        <div className={`commodities-table ${className}`}>
            <div className="mb-4">
                <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
                    <div>
                        <h2 className="text-2xl font-semibold">Commodities</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Live futures prices and performance
                        </p>
                    </div>

                    {/* Category Selector */}
                    <div className="flex gap-2">
                        {(Object.keys(categoryLabels) as CommodityCategory[]).map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeCategory === category
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:text-foreground hover:bg-muted border border-border'
                                    }`}
                            >
                                {categoryLabels[category]}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* TradingView Commodities Widget */}
            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .commodities-table {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 500px;
        }
      `}</style>
        </div>
    );
}
