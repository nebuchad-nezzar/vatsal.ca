import type { APIRoute } from 'astro';
import { verifySessionCookie } from '@/lib/totp';

export const prerender = false;

export const GET: APIRoute = async ({ request, locals }) => {
  const runtimeEnv = (locals as any).runtime?.env || (locals as any).env || {};
  const secretBase32 = runtimeEnv.ADMIN_2FA_SECRET || import.meta.env.ADMIN_2FA_SECRET || 'H7K2MAN4PAREWVYT';
  
  const cookieHeader = request.headers.get('cookie');
  const isAuthenticated = await verifySessionCookie(cookieHeader, secretBase32);

  if (!isAuthenticated) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const token = runtimeEnv.CLOUDFLARE_ANALYTICS_TOKEN || import.meta.env.CLOUDFLARE_ANALYTICS_TOKEN;
  const zoneTag = runtimeEnv.CLOUDFLARE_ZONE_ID || import.meta.env.CLOUDFLARE_ZONE_ID || '166c87c724f40ed6a643dbbcf1eac728';

  if (!token) {
    return new Response(JSON.stringify({ error: 'CLOUDFLARE_ANALYTICS_TOKEN is not configured.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const now = Date.now();
    const dateStart60d = new Date(now - 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const dateEnd = new Date(now).toISOString().split('T')[0];
    const datetimeStart48h = new Date(now - 48 * 60 * 60 * 1000).toISOString();
    const datetimeStart24h = new Date(now - 24 * 60 * 60 * 1000).toISOString();
    const datetimeEnd = new Date(now).toISOString();

    // Generate 7-day aliases for precise historical country breakdown
    const dayAliases = Array.from({ length: 7 }, (_, i) => {
      const start = new Date(now - (i + 1) * 24 * 60 * 60 * 1000).toISOString();
      const end = new Date(now - i * 24 * 60 * 60 * 1000).toISOString();
      return { alias: `d${i}`, start, end };
    });

    const countryQueryFields = dayAliases.map(d => `
      ${d.alias}: httpRequestsAdaptiveGroups(
        limit: 50
        filter: { datetime_geq: "${d.start}", datetime_leq: "${d.end}" }
        orderBy: [count_DESC]
      ) {
        count
        dimensions {
          clientCountryName
        }
      }
    `).join('\n');

    const query = `
      query GetFullAnalytics($zoneTag: string, $dateStart60d: string, $dateEnd: string, $datetimeStart48h: string, $datetimeStart24h: string, $datetimeEnd: string) {
        viewer {
          zones(filter: { zoneTag: $zoneTag }) {
            hourly48h: httpRequests1hGroups(
              limit: 48
              filter: { datetime_geq: $datetimeStart48h, datetime_leq: $datetimeEnd }
              orderBy: [datetime_ASC]
            ) {
              dimensions {
                datetime
              }
              sum {
                requests
                bytes
                threats
                cachedRequests
                cachedBytes
              }
              uniq {
                uniques
              }
            }
            daily60d: httpRequests1dGroups(
              limit: 60
              filter: { date_geq: $dateStart60d, date_leq: $dateEnd }
              orderBy: [date_ASC]
            ) {
              dimensions {
                date
              }
              sum {
                requests
                bytes
                threats
                cachedRequests
                cachedBytes
              }
              uniq {
                uniques
              }
            }
            statusCodes: httpRequestsAdaptiveGroups(
              limit: 10
              filter: { datetime_geq: $datetimeStart24h, datetime_leq: $datetimeEnd }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                edgeResponseStatus
              }
            }
            httpProtocols: httpRequestsAdaptiveGroups(
              limit: 10
              filter: { datetime_geq: $datetimeStart24h, datetime_leq: $datetimeEnd }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientRequestHTTPProtocol
              }
            }
            topPaths: httpRequestsAdaptiveGroups(
              limit: 15
              filter: { datetime_geq: $datetimeStart24h, datetime_leq: $datetimeEnd }
              orderBy: [count_DESC]
            ) {
              count
              dimensions {
                clientRequestPath
              }
            }
            ${countryQueryFields}
          }
        }
      }
    `;

    const cfRes = await fetch("https://api.cloudflare.com/client/v4/graphql", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        query,
        variables: {
          zoneTag,
          dateStart60d,
          dateEnd,
          datetimeStart48h,
          datetimeStart24h,
          datetimeEnd
        }
      })
    });

    const cfJson = await cfRes.json();

    if (cfJson.errors && cfJson.errors.length > 0) {
      console.error('Cloudflare GraphQL errors:', cfJson.errors);
      return new Response(JSON.stringify({ error: cfJson.errors[0].message }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const zoneData = cfJson.data?.viewer?.zones?.[0];
    if (!zoneData) {
      return new Response(JSON.stringify({ error: 'No zone data returned.' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Process 48h Hourly data
    const rawHourly = zoneData.hourly48h || [];
    const hourlyFormatted = rawHourly.map((h: any) => {
      const d = new Date(h.dimensions.datetime);
      const hourStr = d.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      return {
        datetime: h.dimensions.datetime,
        time: hourStr,
        requests: h.sum?.requests || 0,
        cached: h.sum?.cachedRequests || 0,
        bytes: h.sum?.bytes || 0,
        cachedBytes: h.sum?.cachedBytes || 0,
        uniques: h.uniq?.uniques || 0,
        threats: h.sum?.threats || 0
      };
    });

    const current24hHourly = hourlyFormatted.slice(-24);
    const prev24hHourly = hourlyFormatted.slice(-48, -24);

    // Process 60d Daily data
    const rawDaily = zoneData.daily60d || [];
    const dailyFormatted = rawDaily.map((d: any) => {
      const dateObj = new Date(d.dimensions.date + 'T00:00:00');
      const dateLabel = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return {
        rawDate: d.dimensions.date,
        date: dateLabel,
        requests: d.sum?.requests || 0,
        cached: d.sum?.cachedRequests || 0,
        bytes: d.sum?.bytes || 0,
        cachedBytes: d.sum?.cachedBytes || 0,
        uniques: d.uniq?.uniques || 0,
        threats: d.sum?.threats || 0
      };
    });

    const current30dDaily = dailyFormatted.slice(-30);
    const prev30dDaily = dailyFormatted.slice(-60, -30);

    const current7dDaily = dailyFormatted.slice(-7);
    const prev7dDaily = dailyFormatted.slice(-14, -7);

    // Helper to calculate totals & growth
    function calculateMetrics(currentItems: any[], prevItems: any[]) {
      const sum = (arr: any[], key: string) => arr.reduce((acc, item) => acc + (item[key] || 0), 0);

      const requests = sum(currentItems, 'requests');
      const prevRequests = sum(prevItems, 'requests');
      const requestsGrowth = calcGrowth(requests, prevRequests);

      const cachedRequests = sum(currentItems, 'cached');
      const uniques = sum(currentItems, 'uniques');
      const prevUniques = sum(prevItems, 'uniques');
      const uniquesGrowth = calcGrowth(uniques, prevUniques);

      const threats = sum(currentItems, 'threats');
      const prevThreats = sum(prevItems, 'threats');
      const threatsGrowth = calcGrowth(threats, prevThreats);

      const bytes = sum(currentItems, 'bytes');
      const cachedBytes = sum(currentItems, 'cachedBytes');

      const cacheHitRatio = requests > 0 ? Math.round((cachedRequests / requests) * 100) : 0;
      const bandwidthSavedRatio = bytes > 0 ? Math.round((cachedBytes / bytes) * 100) : 0;

      return {
        requests,
        requestsGrowth,
        cachedRequests,
        uniques,
        uniquesGrowth,
        threats,
        threatsGrowth,
        bytes,
        bytesFormatted: formatBytes(bytes),
        cachedBytesFormatted: formatBytes(cachedBytes),
        cacheHitRatio,
        bandwidthSavedRatio
      };
    }

    const metrics24h = calculateMetrics(current24hHourly, prev24hHourly);
    const metrics7d = calculateMetrics(current7dDaily, prev7dDaily);
    const metrics30d = calculateMetrics(current30dDaily, prev30dDaily);

    // Aggregate Country Maps for 24h, 7d, and 30d
    // 24h: d0
    const map24h = new Map<string, number>();
    (zoneData.d0 || []).forEach((c: any) => {
      const code = c.dimensions.clientCountryName || 'XX';
      map24h.set(code, (map24h.get(code) || 0) + c.count);
    });

    // 7d: d0 through d6
    const map7d = new Map<string, number>();
    for (let i = 0; i < 7; i++) {
      const dayArr = zoneData[`d${i}`] || [];
      dayArr.forEach((c: any) => {
        const code = c.dimensions.clientCountryName || 'XX';
        map7d.set(code, (map7d.get(code) || 0) + c.count);
      });
    }

    // 30d: Weighted historical aggregation based on 30d total volume
    const map30d = new Map<string, number>();
    const scale30d = metrics30d.requests / Math.max(1, metrics7d.requests);
    map7d.forEach((count, code) => {
      map30d.set(code, Math.round(count * scale30d));
    });

    function formatCountryList(map: Map<string, number>) {
      const totalHits = Array.from(map.values()).reduce((a, b) => a + b, 0) || 1;
      return Array.from(map.entries())
        .map(([code, count]) => {
          const name = COUNTRY_MAP[code]?.name || code;
          const flag = COUNTRY_MAP[code]?.flag || '🌐';
          const lat = COUNTRY_MAP[code]?.lat || 0;
          const lng = COUNTRY_MAP[code]?.lng || 0;
          const share = parseFloat(((count / totalHits) * 100).toFixed(1));
          return {
            code,
            name,
            flag,
            lat,
            lng,
            requests: count,
            share
          };
        })
        .sort((a, b) => b.requests - a.requests);
    }

    const countries24h = formatCountryList(map24h);
    const countries7d = formatCountryList(map7d);
    const countries30d = formatCountryList(map30d);

    // Top Paths
    const topPaths = (zoneData.topPaths || []).map((p: any) => ({
      path: p.dimensions.clientRequestPath || '/',
      requests: p.count
    }));

    // Status Codes
    const statusCodes = (zoneData.statusCodes || []).map((s: any) => ({
      code: s.dimensions.edgeResponseStatus,
      count: s.count
    }));

    // Protocols
    const httpProtocols = (zoneData.httpProtocols || []).map((pr: any) => ({
      protocol: pr.dimensions.clientRequestHTTPProtocol,
      count: pr.count
    }));

    return new Response(
      JSON.stringify({
        periods: {
          '24h': {
            metrics: metrics24h,
            timeSeries: current24hHourly,
            countries: countries24h
          },
          '7d': {
            metrics: metrics7d,
            timeSeries: current7dDaily,
            countries: countries7d
          },
          '30d': {
            metrics: metrics30d,
            timeSeries: current30dDaily,
            countries: countries30d
          }
        },
        topPaths,
        statusCodes,
        httpProtocols
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=180'
        }
      }
    );
  } catch (err: any) {
    console.error('Failed to fetch Cloudflare Edge analytics:', err);
    return new Response(JSON.stringify({ error: err.message || 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

function calcGrowth(current: number, previous: number) {
  if (previous === 0) return current > 0 ? '+100%' : '0%';
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(1)}%`;
}

function formatBytes(bytes: number, decimals = 1) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

const COUNTRY_MAP: Record<string, { name: string; flag: string; lat: number; lng: number }> = {
  CA: { name: 'Canada', flag: '🇨🇦', lat: 56.13, lng: -106.34 },
  US: { name: 'United States', flag: '🇺🇸', lat: 37.09, lng: -95.71 },
  HK: { name: 'Hong Kong', flag: '🇭🇰', lat: 22.31, lng: 114.16 },
  CN: { name: 'China', flag: '🇨🇳', lat: 35.86, lng: 104.19 },
  IN: { name: 'India', flag: '🇮🇳', lat: 20.59, lng: 78.96 },
  DE: { name: 'Germany', flag: '🇩🇪', lat: 51.16, lng: 10.45 },
  GB: { name: 'United Kingdom', flag: '🇬🇧', lat: 55.37, lng: -3.43 },
  NL: { name: 'Netherlands', flag: '🇳🇱', lat: 52.13, lng: 5.29 },
  SO: { name: 'Somalia', flag: '🇸🇴', lat: 5.15, lng: 46.19 },
  BR: { name: 'Brazil', flag: '🇧🇷', lat: -14.23, lng: -51.92 },
  CL: { name: 'Chile', flag: '🇨🇱', lat: -35.67, lng: -71.54 },
  LT: { name: 'Lithuania', flag: '🇱🇹', lat: 55.16, lng: 23.88 },
  SG: { name: 'Singapore', flag: '🇸🇬', lat: 1.35, lng: 103.81 },
  UZ: { name: 'Uzbekistan', flag: '🇺🇿', lat: 41.37, lng: 64.58 },
  RU: { name: 'Russia', flag: '🇷🇺', lat: 61.52, lng: 105.31 },
  FR: { name: 'France', flag: '🇫🇷', lat: 46.22, lng: 2.21 },
  TR: { name: 'Turkey', flag: '🇹🇷', lat: 38.96, lng: 35.24 },
  BD: { name: 'Bangladesh', flag: '🇧🇩', lat: 23.68, lng: 90.35 },
  VE: { name: 'Venezuela', flag: '🇻🇪', lat: 6.42, lng: -66.58 },
  ID: { name: 'Indonesia', flag: '🇮🇩', lat: -0.78, lng: 113.92 },
  SA: { name: 'Saudi Arabia', flag: '🇸🇦', lat: 23.88, lng: 45.07 },
  FI: { name: 'Finland', flag: '🇫🇮', lat: 61.92, lng: 25.74 },
  AR: { name: 'Argentina', flag: '🇦🇷', lat: -38.41, lng: -63.61 },
  JO: { name: 'Jordan', flag: '🇯🇴', lat: 30.58, lng: 36.23 },
  UA: { name: 'Ukraine', flag: '🇺🇦', lat: 48.37, lng: 31.16 },
  PE: { name: 'Peru', flag: '🇵🇪', lat: -9.18, lng: -75.01 },
  BE: { name: 'Belgium', flag: '🇧🇪', lat: 50.50, lng: 4.46 },
  MY: { name: 'Malaysia', flag: '🇲🇾', lat: 4.21, lng: 101.97 },
  PS: { name: 'Palestine', flag: '🇵🇸', lat: 31.95, lng: 35.23 },
  NP: { name: 'Nepal', flag: '🇳🇵', lat: 28.39, lng: 84.12 },
  TH: { name: 'Thailand', flag: '🇹🇭', lat: 15.87, lng: 100.99 },
  MA: { name: 'Morocco', flag: '🇲🇦', lat: 31.79, lng: -7.09 },
  IQ: { name: 'Iraq', flag: '🇮🇶', lat: 33.22, lng: 43.67 },
  ES: { name: 'Spain', flag: '🇪🇸', lat: 40.46, lng: -3.74 },
  AU: { name: 'Australia', flag: '🇦🇺', lat: -25.27, lng: 133.77 },
  JP: { name: 'Japan', flag: '🇯🇵', lat: 36.20, lng: 138.25 },
  KR: { name: 'South Korea', flag: '🇰🇷', lat: 35.90, lng: 127.76 },
  IT: { name: 'Italy', flag: '🇮🇹', lat: 41.87, lng: 12.56 },
  MX: { name: 'Mexico', flag: '🇲🇽', lat: 23.63, lng: -102.55 }
};
