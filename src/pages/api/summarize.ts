import type { APIRoute } from 'astro'

export const prerender = false

export const POST: APIRoute = async (context) => {
  try {
    const { request, locals } = context
    const runtimeEnv = (locals as any)?.runtime?.env || (locals as any)?.env || {}
    const { content } = await request.json()

    if (!content) {
      return new Response(JSON.stringify({ error: 'Missing content' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const apiKey = runtimeEnv.GOOGLE_AI_API_KEY || import.meta.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const truncated = content.slice(0, 4000)

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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

    if (!res.ok) {
      const errText = await res.text()
      console.error('Gemini API error:', errText)
      return new Response(JSON.stringify({ error: 'Failed to generate summary' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const data = await res.json()
    const summary = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Unable to generate summary.'

    return new Response(JSON.stringify({ summary }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Summarize API error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
