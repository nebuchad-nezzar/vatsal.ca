import { useEffect, useRef } from 'react';

interface HighsLowsProps {
    type: 'highs' | 'lows';
    className?: string;
}

export default function HighsLows({ type, className = '' }: HighsLowsProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
        script.async = true;

        const screen = type === 'highs' ? 'new_52_week_high' : 'new_52_week_low';

        script.innerHTML = JSON.stringify({
            width: '100%',
            height: '600',
            defaultColumn: 'overview',
            defaultScreen: screen,
            market: 'america',
            showToolbar: true,
            colorTheme: 'dark',
            locale: 'en'
        });

        containerRef.current.appendChild(script);
    }, [type]);

    return (
        <div className={`highs-lows ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold">{type === 'highs' ? '52-Week Highs' : '52-Week Lows'}</h2>
                <p className="text-sm text-muted-foreground mt-1">
                    Stocks hitting fresh yearly records
                </p>
            </div>

            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .highs-lows {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
