import { useEffect, useRef } from 'react';

interface TickerTapeProps {
    className?: string;
    showSymbolLogo?: boolean;
}

export default function TickerTape({
    className = '',
    showSymbolLogo = true
}: TickerTapeProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous widget
        containerRef.current.innerHTML = '';

        const script = document.createElement('script');
        script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
        script.async = true;
        script.innerHTML = JSON.stringify({
            symbols: [
                {
                    proName: 'FOREXCOM:SPXUSD',
                    title: 'S&P 500'
                },
                {
                    proName: 'FOREXCOM:NSXUSD',
                    title: 'US 100'
                },
                {
                    proName: 'FX:EURUSD',
                    title: 'EUR to USD'
                },
                {
                    proName: 'BITSTAMP:BTCUSD',
                    title: 'Bitcoin'
                },
                {
                    proName: 'BITSTAMP:ETHUSD',
                    title: 'Ethereum'
                },
                {
                    description: 'Dow Jones',
                    proName: 'FOREXCOM:DJI'
                },
                {
                    description: 'Nasdaq',
                    proName: 'NASDAQ:NDX'
                },
                {
                    description: 'Apple',
                    proName: 'NASDAQ:AAPL'
                },
                {
                    description: 'Microsoft',
                    proName: 'NASDAQ:MSFT'
                },
                {
                    description: 'Tesla',
                    proName: 'NASDAQ:TSLA'
                },
                {
                    description: 'Amazon',
                    proName: 'NASDAQ:AMZN'
                },
                {
                    description: 'Google',
                    proName: 'NASDAQ:GOOGL'
                },
                {
                    description: 'Gold',
                    proName: 'FOREXCOM:XAUUSD'
                },
                {
                    description: 'Crude Oil',
                    proName: 'TVC:USOIL'
                },
                {
                    description: 'VIX',
                    proName: 'TVC:VIX'
                }
            ],
            showSymbolLogo: showSymbolLogo,
            colorTheme: 'dark',
            isTransparent: false,
            displayMode: 'adaptive',
            locale: 'en'
        });

        containerRef.current.appendChild(script);
    }, [showSymbolLogo]);

    return (
        <div className={`ticker-tape ${className}`}>
            <div className="tradingview-widget-container">
                <div ref={containerRef} className="tradingview-widget-container__widget"></div>
            </div>

            <style>{`
        .ticker-tape {
          width: 100%;
          position: relative;
          margin: 0;
          padding: 0;
        }
        .ticker-tape .tradingview-widget-container {
          height: 46px;
          margin: 0;
          padding: 0;
        }
        .ticker-tape .tradingview-widget-container__widget {
          margin: 0;
          padding: 0;
        }
      `}</style>
        </div>
    );
}
