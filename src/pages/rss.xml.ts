export const prerender = true
import { SITE } from '@/consts'
import rss from '@astrojs/rss'
import type { APIContext } from 'astro'
import { getAllPosts } from '@/lib/data-utils'

export async function GET(context: APIContext) {
  try {
    const posts = await getAllPosts()

    return rss({
      title: SITE.title,
      description: SITE.description,
      site: context.site ?? SITE.href,
      xmlns: {
        atom: 'http://www.w3.org/2005/Atom',
      },
      customData: [
        `<language>${SITE.locale.replace('-', '_')}</language>`,
        `<atom:link href="${new URL('rss.xml', context.site ?? SITE.href)}" rel="self" type="application/rss+xml"/>`,
        `<managingEditor>vatswork10@gmail.com (${SITE.author})</managingEditor>`,
        `<webMaster>vatswork10@gmail.com (${SITE.author})</webMaster>`,
      ].join(''),
      items: posts.map((post) => ({
        title: post.data.title,
        description: post.data.description,
        pubDate: post.data.date,
        link: `/blog/${post.id}/`,
        author: `vatswork10@gmail.com (${post.data.authors && post.data.authors.length > 0
          ? post.data.authors.join(', ')
          : SITE.author
          })`,
        categories: post.data.tags ?? [],
      })),
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}
