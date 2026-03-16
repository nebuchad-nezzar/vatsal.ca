import type { APIRoute } from 'astro'

export const prerender = true

const getRobotsTxt = (sitemapURL: URL, siteURL: string) => `
User-agent: *
Allow: /

# AI Crawlers — explicitly allowed for indexing
User-agent: GPTBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: Anthropic
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Bytespider
Allow: /

User-agent: CCBot
Allow: /

Sitemap: ${sitemapURL.href}

# AI-readable content
# LLMs.txt: ${siteURL}/llms.txt
# LLMs-full.txt: ${siteURL}/llms-full.txt
`

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL('sitemap-index.xml', site)
  const siteURL = site?.href.replace(/\/$/, '') ?? ''
  return new Response(getRobotsTxt(sitemapURL, siteURL))
}
