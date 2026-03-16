import { useEffect, useRef } from 'react';

interface EconomicMapProps {
    className?: string;
}

export default function EconomicMap({ className = '' }: EconomicMapProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Clear previous content
        containerRef.current.innerHTML = '';

        // Create script element
        const script = document.createElement('script');
        script.type = 'module';
        script.src = 'https://widgets.tradingview-widget.com/w/en/tv-economic-map.js';
        script.async = true;

        // Create the custom element
        const widgetElement = document.createElement('tv-economic-map');
        widgetElement.setAttribute('color-theme', 'dark');
        widgetElement.setAttribute('is-transparent', 'false');
        widgetElement.setAttribute('locale', 'en');
        widgetElement.setAttribute('width', '100%');
        widgetElement.setAttribute('height', '500');

        containerRef.current.appendChild(script);
        containerRef.current.appendChild(widgetElement);
    }, []);

    return (
        <div className={`economic-map ${className}`}>
            <div className="mb-4">
                <h2 className="text-2xl font-semibold mb-2">Global Economic Map</h2>
                <p className="text-sm text-muted-foreground">
                    Geographic overview of global market news and economic trends
                </p>
            </div>

            <div className="rounded-lg border border-border overflow-hidden bg-card min-h-[500px]">
                <div ref={containerRef} className="w-full h-full"></div>
            </div>
        </div>
    );
}
