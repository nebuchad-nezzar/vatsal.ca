import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

export const prerender = false;

export const GET: APIRoute = async (context) => {
  const { request, locals } = context;
  const runtimeEnv = (locals as any).runtime?.env || {};

  const url = new URL(request.url);
  const isSummary = url.searchParams.get('summary') === 'true';

  const redis = new Redis({
    url: runtimeEnv.UPSTASH_REDIS_REST_URL || import.meta.env.UPSTASH_REDIS_REST_URL,
    token: runtimeEnv.UPSTASH_REDIS_REST_TOKEN || import.meta.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    if (isSummary) {
      const keys = await redis.keys('pageviews:*');
      const totalViewsVal = await redis.get<number>('pageviews:total');
      const totalVisitsVal = await redis.get<number>('visits:total');
      
      const pageKeys = keys.filter(k => k !== 'pageviews:total');
      let topPages: { path: string; views: number; visits: number }[] = [];
      let calculatedTotalViews = 0;

      if (pageKeys.length > 0) {
        const values = await redis.mget<number[]>(...pageKeys);
        
        // Also fetch corresponding visits keys
        const visitKeys = pageKeys.map(k => k.replace('pageviews:', 'visits:'));
        const visitValues = await redis.mget<number[]>(...visitKeys);

        topPages = pageKeys.map((k, i) => {
          const views = Number(values[i] || 0);
          const visits = Number(visitValues[i] || Math.ceil(views * 0.7)); // fallback estimate if zero
          calculatedTotalViews += views;
          return {
            path: k.replace('pageviews:', ''),
            views,
            visits
          };
        }).sort((a, b) => b.views - a.views).slice(0, 6);
      }

      const totalViews = totalViewsVal ? Math.max(totalViewsVal, calculatedTotalViews) : calculatedTotalViews;
      const totalVisits = totalVisitsVal || Math.ceil(totalViews * 0.75);

      return new Response(JSON.stringify({ totalViews, totalVisits, topPages }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const path = url.searchParams.get('path');
    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path' }), { status: 400 });
    }

    const key = `pageviews:${path}`;
    const views = await redis.get<number>(key);

    return new Response(JSON.stringify({ pageviews: views ?? 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('GET pageviews error:', err.message || err);
    return new Response(JSON.stringify({ pageviews: 0, totalViews: 0, totalVisits: 0, topPages: [], error: 'Failed to fetch' }), { status: 500 });
  }
};

export const POST: APIRoute = async (context) => {
  const { request, locals } = context;
  const runtimeEnv = (locals as any).runtime?.env || {};

  const redis = new Redis({
    url: runtimeEnv.UPSTASH_REDIS_REST_URL || import.meta.env.UPSTASH_REDIS_REST_URL,
    token: runtimeEnv.UPSTASH_REDIS_REST_TOKEN || import.meta.env.UPSTASH_REDIS_REST_TOKEN,
  });

  try {
    const url = new URL(request.url);
    const path = url.searchParams.get('path');
    if (!path) {
      return new Response(JSON.stringify({ error: 'Missing path' }), { status: 400 });
    }

    const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || 'anon';
    const today = new Date().toISOString().slice(0, 10);
    const sessionKey = `session:${ip}:${today}:${path}`;

    const key = `pageviews:${path}`;
    const visitPathKey = `visits:${path}`;

    // Always increment pageview
    const promises: Promise<any>[] = [
      redis.incr(key),
      redis.incr('pageviews:total')
    ];

    // Deduplicate unique visit per IP per path per day
    const isNewVisit = await redis.set(sessionKey, '1', { nx: true, ex: 86400 });
    if (isNewVisit) {
      promises.push(redis.incr(visitPathKey));
      promises.push(redis.incr('visits:total'));
    }

    const [newViews] = await Promise.all(promises);

    return new Response(JSON.stringify({ pageviews: newViews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('POST pageviews error:', err.message || err);
    return new Response(JSON.stringify({ error: 'Failed to increment' }), { status: 500 });
  }
};