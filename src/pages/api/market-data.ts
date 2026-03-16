
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    const url = new URL(request.url);
    const symbols = url.searchParams.get('symbols');

    if (!symbols) {
        return new Response(JSON.stringify({ error: 'No symbols provided' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        // Yahoo Finance API endpoint
        const yahooUrl = `https://query1.finance.yahoo.com/v7/finance/quote?symbols=${symbols}`;

        // Add User-Agent to prevent 403 Forbidden errors
        const response = await fetch(yahooUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`Yahoo API Error: ${response.status} ${response.statusText}`);
            throw new Error(`Yahoo Finance API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        return new Response(JSON.stringify(data.quoteResponse), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 's-maxage=60, stale-while-revalidate=30' // Cache for 1 minute
            }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: 'Failed to fetch market data' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
