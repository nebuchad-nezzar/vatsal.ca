import type { APIRoute } from 'astro'
import { getAllPosts } from '@/lib/data-utils'
import { SITE } from '@/consts'

export const prerender = true

export const GET: APIRoute = async () => {
    const posts = await getAllPosts()

    const lines = [
        `# ${SITE.title} — Full Content Index`,
        '',
        `> ${SITE.description}`,
        '',
        `${SITE.author} is a Quantitative Researcher, AI Engineer, and Data Scientist based in Toronto. This site features in-depth blog posts, research, and projects on quantitative trading, machine learning, AI agents, data science, and software engineering.`,
        '',
        '---',
        '',
        '## Site Structure',
        '',
        `- **Home**: ${SITE.href} — Overview with skills, financial markets treemap, and recent posts`,
        `- **Blog**: ${SITE.href}/blog — Technical articles and research`,
        `- **Markets**: ${SITE.href}/markets — Real-time financial market data and interactive charts`,
        `- **Work**: ${SITE.href}/work — Professional experience and projects`,
        `- **About**: ${SITE.href}/about — Background and biography`,
        '',
        '---',
        '',
        '## All Blog Posts',
        '',
        ...posts.map((post) => {
            const tags = post.data.tags?.length
                ? ` [Tags: ${post.data.tags.join(', ')}]`
                : ''
            const date = post.data.date.toISOString().split('T')[0]
            return [
                `### ${post.data.title}`,
                '',
                `- **URL**: ${SITE.href}/blog/${post.id}/`,
                `- **Date**: ${date}`,
                `- **Description**: ${post.data.description}${tags}`,
                '',
            ].join('\n')
        }),
        '---',
        '',
        '## Feeds & Machine-Readable',
        '',
        `- RSS: ${SITE.href}/rss.xml`,
        `- Sitemap: ${SITE.href}/sitemap-index.xml`,
        `- LLMs Summary: ${SITE.href}/llms.txt`,
        '',
        '## Contact',
        '',
        `- Email: vatswork10@gmail.com`,
        `- GitHub: https://github.com/nebuchad-nezzar`,
        `- X: https://x.com/vats360`,
        '',
    ]

    return new Response(lines.join('\n'), {
        headers: {
            'Content-Type': 'text/plain; charset=utf-8',
        },
    })
}
