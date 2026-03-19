// pages/api/pageviews.ts  (or src/pages/api/pageviews.ts)
import type { APIRoute } from 'astro';
import { Redis } from '@upstash/redis';

// Make sure this route runs on server (not static)
export const prerender = false;

// Use import.meta.env + PUBLIC_ prefix (Astro/Vite standard)
// Debug startup
console.log('=== PAGEVIEWS API LOADED ===');

export const GET: APIRoute = async (context) => {
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

    const key = `pageviews:${path}`;
    const views = await redis.get<number>(key);

    return new Response(JSON.stringify({ pageviews: views ?? 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('GET error:', err.message || err);
    return new Response(JSON.stringify({ pageviews: 0, error: 'Failed to fetch' }), { status: 500 });
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

    const key = `pageviews:${path}`;
    const newViews = await redis.incr(key);  // always increment

    return new Response(JSON.stringify({ pageviews: newViews }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err: any) {
    console.error('POST error:', err.message || err);
    return new Response(JSON.stringify({ error: 'Failed to increment' }), { status: 500 });
  }
};