import React, { useEffect, useRef } from 'react';

interface TradingViewWidgetProps {
  symbol: string;
  height?: number;
  type?: 'candles' | 'line' | 'area';
}

export default function TradingViewWidget({ symbol, height = 350, type = 'area' }: TradingViewWidgetProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    
    // Clear previous widget content for hot reloading
    containerRef.current.innerHTML = '';
    
    const id = 'tv_' + Math.random().toString(36).substring(7);
    const div = document.createElement('div');
    div.id = id;
    div.style.height = '100%';
    div.style.width = '100%';
    containerRef.current.appendChild(div);

    const styleMap = { candles: '1', line: '2', area: '3' };

    const initWidget = () => {
      if (typeof (window as any).TradingView !== 'undefined') {
        new (window as any).TradingView.widget({
          autosize: true,
          symbol: symbol,
          interval: 'D',
          timezone: 'Etc/UTC',
          theme: 'dark',
          style: styleMap[type],
          locale: 'en',
          enable_publishing: false,
          backgroundColor: 'rgba(0,0,0,0)', // Blend into the site's dark mode
          gridColor: 'rgba(255, 255, 255, 0.05)',
          hide_top_toolbar: true,
          hide_legend: false,
          save_image: false,
          container_id: id
        });
      }
    };

    if (!(window as any).tvScriptLoaded) {
       (window as any).tvScriptLoaded = true;
       const script = document.createElement('script');
       script.src = 'https://s3.tradingview.com/tv.js';
       script.async = true;
       script.onload = initWidget;
       document.head.appendChild(script);
    } else {
       // Wait a brief moment if the script was just injected by another widget
       setTimeout(initWidget, 100);
    }
  }, [symbol, type]);

  return (
    <div className="not-prose my-8 w-full overflow-hidden rounded-xl border border-border bg-card shadow-sm" style={{ height }}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
