import type { APIRoute } from 'astro';
export const prerender = false;
export const GET: APIRoute = async () => {
  const envVars = {
    UPSTASH_REDIS_REST_URL: import.meta.env.UPSTASH_REDIS_REST_URL || 'MISSING',
    UPSTASH_REDIS_REST_TOKEN: import.meta.env.UPSTASH_REDIS_REST_TOKEN ? 
      `${import.meta.env.UPSTASH_REDIS_REST_TOKEN.substring(0, 10)}...` : 'MISSING',
  };
  console.log('Environment check:', envVars);
  return new Response(JSON.stringify(envVars, null, 2), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};