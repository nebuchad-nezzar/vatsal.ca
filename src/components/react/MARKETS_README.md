# Financial Markets Integration

This directory contains React components that integrate TradingView widgets to display real-time financial market data.

## Components

### 1. MarketOverview.tsx
Displays a tabbed market overview with mini charts for different market categories.

**Features:**
- Tabs for US, Europe, Asia, FX, Rates, Futures, and Crypto markets
- Real-time price data with sparkline charts
- Shows price, change, and percentage change
- Responsive design

**Usage:**
```astro
import MarketOverview from '@/components/react/MarketOverview'

<MarketOverview client:load />
```

### 2. AdvancedChart.tsx
Full-featured interactive charting component with technical analysis tools.

**Features:**
- Symbol search with popular symbols
- Time interval selection (1m, 5m, 15m, 1H, 4H, 1D, 1W, 1M)
- Technical indicators (SMA, etc.)
- Drawing tools
- Multiple chart types (candlestick, line, area, etc.)
- News and calendar integration

**Usage:**
```astro
import AdvancedChart from '@/components/react/AdvancedChart'

<AdvancedChart client:load defaultSymbol="NASDAQ:AAPL" />
```

### 3. MarketTreemap.tsx
Visualizes market performance as a treemap/heatmap.

**Features:**
- Market selection (US Stock Market, World Markets, Cryptocurrency)
- Color-coded by performance (green = up, red = down)
- Size weighted by market capitalization
- Interactive zoom and tooltips
- Sector grouping

**Usage:**
```astro
import MarketTreemap from '@/components/react/MarketTreemap'

<MarketTreemap client:load />
```

### 4. MarketDataTable.tsx
Comprehensive market data table with filtering and categorization.

**Features:**
- Category tabs: Indices, Stocks, Commodities, Currencies, ETFs, Bonds, Funds, Crypto
- Region filtering for indices (Majors, Americas, Europe, Asia/Pacific, etc.)
- Real-time price updates
- Sortable columns
- Integrated mini charts

**Usage:**
```astro
import MarketDataTable from '@/components/react/MarketDataTable'

<MarketDataTable client:load />
```

## Pages

### /markets
A dedicated page showcasing all market components together.

## TradingView Integration

All components use the official TradingView widget library. The script is loaded in `src/components/Head.astro`:

```html
<script src="https://s3.tradingview.com/tv.js" is:inline></script>
```

## Customization

### Changing Symbols
Edit the symbol arrays in each component to display different securities:

```typescript
// In MarketOverview.tsx
const marketSymbols: Record<MarketTab, string[][]> = {
  us: [
    ['Dow Jones', 'FOREXCOM:DJI'],
    ['S&P 500', 'FOREXCOM:SPXUSD'],
    // Add more symbols here
  ]
}
```

### Styling
Components use Tailwind CSS classes that respect your theme configuration. The dark theme is automatically applied based on the `colorTheme: 'dark'` setting in widget configurations.

### Time Intervals
Modify the `timeIntervals` array in `AdvancedChart.tsx` to add or remove time period options:

```typescript
const timeIntervals: { label: string; value: TimeInterval }[] = [
  { label: '1m', value: '1' },
  { label: '5m', value: '5' },
  // Add custom intervals
]
```

## Performance Considerations

- All components use `client:load` directive for immediate interactivity
- TradingView widgets are loaded asynchronously
- Each widget cleans up properly on unmount to prevent memory leaks
- Consider using `client:visible` for below-the-fold components to improve initial page load

## Browser Compatibility

TradingView widgets are supported in:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Data Attribution

Market data is provided by TradingView and various exchanges. Please ensure you comply with TradingView's terms of service and display appropriate attribution as required.

## Troubleshooting

### Widgets not loading
1. Check browser console for errors
2. Ensure TradingView script is loaded in the head
3. Verify internet connection (widgets require external resources)

### Dark mode not applying
Widgets are configured with `colorTheme: 'dark'`. If you need light mode, change this to `'light'` in each component's widget configuration.

### Symbol not found
- Verify the symbol format (exchange:ticker)
- Check TradingView's symbol search for the correct format
- Some symbols may require a subscription

## Future Enhancements

Potential improvements:
- Add watchlist functionality
- Implement portfolio tracking
- Add price alerts
- Create custom screeners
- Add economic calendar widget
- Integrate news feed
