import type { CollectionEntry } from 'astro:content'

interface DigestPost {
    title: string
    description: string
    date: Date
    url: string
    tags: string[]
}

/**
 * Generates a branded weekly digest email matching vatsal.ca's dark sepia theme.
 */
export function generateDigestEmail(posts: DigestPost[], siteUrl: string): string {
    const postCards = posts.map((post) => {
        const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        const tags = post.tags
            .map(
                (tag) =>
                    `<span style="display:inline-block;padding:2px 8px;background-color:#3a332c;color:#c4b494;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;border-radius:3px;margin-right:4px;margin-bottom:4px;">${tag}</span>`
            )
            .join('')

        return `
      <tr>
        <td style="padding:0 0 24px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#232019;border:1px solid #3a332c;border-radius:8px;">
            <tr>
              <td style="padding:24px;">
                <p style="margin:0 0 8px 0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a7e6a;">${formattedDate}</p>
                <h2 style="margin:0 0 12px 0;font-size:18px;font-weight:600;letter-spacing:-0.02em;">
                  <a href="${post.url}" style="color:#f0e4d0;text-decoration:none;">${post.title}</a>
                </h2>
                <p style="margin:0 0 16px 0;font-size:13px;line-height:1.6;color:#8a7e6a;">${post.description}</p>
                <div style="margin:0 0 16px 0;">${tags}</div>
                <a href="${post.url}" style="display:inline-block;padding:8px 20px;background-color:#dcc8a0;color:#2b2520;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;border-radius:4px;">Read More →</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>`
    }).join('')

    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - 7)
    const dateRange = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Weekly Digest — Vatsal Sharma</title>
  <!--[if mso]><style>* { font-family: Consolas, monospace !important; }</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#1a1612;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#1a1612;">
    <tr>
      <td align="center" style="padding:40px 16px;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">
          
          <!-- Header -->
          <tr>
            <td style="padding:0 0 32px 0;text-align:center;">
              <h1 style="margin:0 0 4px 0;font-size:28px;font-weight:700;color:#f0e4d0;letter-spacing:-0.03em;">Vatsal Sharma</h1>
              <p style="margin:0;font-size:10px;letter-spacing:0.2em;text-transform:uppercase;color:#8a7e6a;">Weekly Digest</p>
            </td>
          </tr>

          <!-- Divider -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <div style="height:1px;background-color:#3a332c;"></div>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding:0 0 32px 0;">
              <p style="margin:0 0 4px 0;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#8a7e6a;">${dateRange}</p>
              <p style="margin:0;font-size:14px;line-height:1.7;color:#c4b494;">
                Here's what I published this week on System Design, Quant, AI, and Markets.
              </p>
            </td>
          </tr>

          <!-- Posts -->
          ${postCards}

          ${posts.length === 0 ? `
          <tr>
            <td style="padding:24px;text-align:center;background-color:#232019;border:1px solid #3a332c;border-radius:8px;">
              <p style="margin:0;font-size:13px;color:#8a7e6a;">No new posts this week. Stay tuned!</p>
              <a href="${siteUrl}/blog" style="display:inline-block;margin-top:16px;padding:8px 20px;background-color:#dcc8a0;color:#2b2520;font-size:10px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;text-decoration:none;border-radius:4px;">Browse All Posts →</a>
            </td>
          </tr>` : ''}

          <!-- Divider -->
          <tr>
            <td style="padding:24px 0;">
              <div style="height:1px;background-color:#3a332c;"></div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="text-align:center;">
              <p style="margin:0 0 8px 0;font-size:13px;color:#c4b494;">
                <a href="${siteUrl}" style="color:#dcc8a0;text-decoration:none;">vatsal.ca</a>
              </p>
              <p style="margin:0 0 16px 0;font-size:10px;letter-spacing:0.1em;text-transform:uppercase;color:#5a5246;">
                Quantitative Research · System Design · AI · Markets
              </p>
              <p style="margin:0;font-size:10px;color:#5a5246;">
                <a href="${siteUrl}/rss.xml" style="color:#8a7e6a;text-decoration:none;">RSS Feed</a>
                &nbsp;&middot;&nbsp;
                <a href="{{ unsubscribe }}" style="color:#8a7e6a;text-decoration:none;">Unsubscribe</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

/**
 * Convert a blog post collection entry to a DigestPost
 */
export function postToDigest(post: CollectionEntry<'blog'>, siteUrl: string): DigestPost {
    return {
        title: post.data.title,
        description: post.data.description || '',
        date: post.data.date,
        url: `${siteUrl}/blog/${post.id}/`,
        tags: post.data.tags || [],
    }
}
