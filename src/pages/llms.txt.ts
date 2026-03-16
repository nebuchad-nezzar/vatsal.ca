import type { APIRoute } from 'astro'
import { getAllPosts } from '@/lib/data-utils'
import { SITE } from '@/consts'

export const prerender = true

export const GET: APIRoute = async () => {
    const posts = await getAllPosts()
    const recentPosts = posts.slice(0, 20)

    const lines = [
        `# ${SITE.title}`,
        '',
        `> ${SITE.description}`,
        '',
        `${SITE.author} is a Quantitative Researcher and Data Scientist based in Toronto. This site features blog posts on quantitative trading, AI/ML, data science, and software engineering.`,
        '',
        '## Main Pages',
        '',
        `- [Home](${SITE.href})`,
        `- [Blog](${SITE.href}/blog)`,
        `- [Markets](${SITE.href}/markets)`,
        `- [Work](${SITE.href}/work)`,
        `- [About](${SITE.href}/about)`,
        '',
        '## Recent Blog Posts',
        '',
        ...recentPosts.map(
            (post) =>
                `- [${post.data.title}](${SITE.href}/blog/${post.id}/): ${post.data.description}`,
        ),
        '',
        '## Feeds',
        '',
        `- [RSS Feed](${SITE.href}/rss.xml)`,
        `- [Sitemap](${SITE.href}/sitemap-index.xml)`,
        `- [Full LLM Content](${SITE.href}/llms-full.txt)`,
        '',
    ]

    return new Response(lines.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    })
}
