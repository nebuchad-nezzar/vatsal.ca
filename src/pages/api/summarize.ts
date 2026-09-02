import type { APIRoute } from 'astro'
import { Redis } from '@upstash/redis'

export const prerender = false

async function callGemini(apiKey: string, truncated: string, signal: AbortSignal) {
  return await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal,
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are a concise financial analyst. Summarize the following article in 3-4 bullet points. Each bullet should be one clear sentence capturing a key insight. Do not use markdown headers. Use bullet points (•) only.\n\n---\n\n${truncated}`,
              },
            ],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature: 0.3,
        },
      }),
    }
  )
}

export const POST: APIRoute = async (context) => {
  try {
    const { request, locals } = context
    const runtimeEnv = (locals as any)?.runtime?.env || (locals as any)?.env || {}
    const { content, path } = await request.json()

    if (!content) {
      return new Response(JSON.stringify({ error: 'Missing content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 1. Initialize Redis & Check Cache
    const upstashUrl = runtimeEnv.UPSTASH_REDIS_REST_URL || import.meta.env.UPSTASH_REDIS_REST_URL
    const upstashToken = runtimeEnv.UPSTASH_REDIS_REST_TOKEN || import.meta.env.UPSTASH_REDIS_REST_TOKEN
    let redis: Redis | null = null

    if (upstashUrl && upstashToken) {
      try {
        redis = new Redis({ url: upstashUrl, token: upstashToken })
      } catch (e) {
        console.warn('Redis init failed:', e)
      }
    }

    const cleanPath = typeof path === 'string' ? path.replace(/^\/|\/$/g, '') : null
    const cacheKey = cleanPath ? `summary:${cleanPath}` : null

    if (redis && cacheKey) {
      try {
        const cachedSummary = await redis.get<string>(cacheKey)
        if (cachedSummary) {
          return new Response(JSON.stringify({ summary: cachedSummary, cached: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
          })
        }
      } catch (cacheErr) {
        console.warn('Cache lookup failed, proceeding to API:', cacheErr)
      }
    }

    const apiKey = runtimeEnv.GOOGLE_AI_API_KEY || import.meta.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const truncated = content.slice(0, 4000)

    // 2. Call Gemini with an 8-second timeout & automatic 1-time retry on 503
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 8000)

    let res: Response
    try {
      res = await callGemini(apiKey, truncated, controller.signal)

      // If Google returns 503 (high demand spike), wait 1.2s and retry once
      if (res.status === 503) {
        await new Promise((r) => setTimeout(r, 1200))
        res = await callGemini(apiKey, truncated, controller.signal)
      }
    } finally {
      clearTimeout(timeoutId)
    }

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', errText)

      const isHighDemand = res.status === 503 || errText.includes('high demand') || errText.includes('UNAVAILABLE')
      const message = isHighDemand
        ? 'Google AI is currently experiencing high demand. Click below to retry.'
        : 'Failed to generate summary. Please try again.'

      return new Response(JSON.stringify({ error: message, retryable: true }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary.'

    // 3. Cache summary in Redis permanently for this post
    if (redis && cacheKey && summary && !summary.startsWith('Unable to')) {
      try {
        await redis.set(cacheKey, summary)
      } catch (cacheSetErr) {
        console.warn('Failed to cache summary:', cacheSetErr)
      }
    }

    return new Response(JSON.stringify({ summary, cached: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err: any) {
    console.error('Summarize API error:', err)
    const isTimeout = err?.name === 'AbortError'
    return new Response(
      JSON.stringify({
        error: isTimeout
          ? 'Google AI took too long to respond. Click below to retry.'
          : 'Failed to generate summary. Please try again.',
        retryable: true,
      }),
      {
        status: isTimeout ? 504 : 500,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
