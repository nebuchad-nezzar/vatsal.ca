import { useEffect, useRef } from 'react';

interface EconomicCalendarProps {
    className?: string;
}

export default function EconomicCalendar({ className = '' }: EconomicCalendarProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-events.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            colorTheme: 'dark',
            isTransparent: false,
            width: '100%',
            height: '600',
            locale: 'en',
            importanceFilter: '0,1',
            countryFilter: 'ar,au,br,ca,cn,fr,de,in,id,it,jp,kr,mx,ru,sa,za,tr,gb,us,eu'
        });

        containerRef.current.appendChild(script);
    }, []);

    return (
        <div className={`economic-calendar ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Economic Calendar</h2>
                <p className="text-sm text-muted-foreground">
                    Upcoming economic events and data releases that could impact markets
                </p>
            </div>

            {/* TradingView Economic Calendar Widget */}
            <div className="tradingview-widget-container rounded-lg border border-border overflow-hidden bg-card">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .economic-calendar {
          width: 100%;
        }
        .tradingview-widget-container {
          min-height: 600px;
        }
      `}</style>
        </div>
    );
}
