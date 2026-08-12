import type { APIRoute } from 'astro'
import { getAllPostsIncludingNewsletters } from '@/lib/data-utils'
import { generateDigestEmail, postToDigest, generateWelcomeEmail } from '@/lib/newsletter-template'

export const prerender = false

export const GET: APIRoute = async (context) => {
    return POST(context)
}

export const POST: APIRoute = async (context) => {
    const { request, locals } = context
    const runtimeEnv = (locals as any).runtime?.env || (locals as any).env || {}

    const url = new URL(request.url)
    const testMode = url.searchParams.get('test') === 'true' || url.searchParams.get('testMode') === 'true'
    const sendTest = url.searchParams.get('sendTest') === 'true'
    const getSubscribers = url.searchParams.get('subscribers') === 'true'
    const testWelcome = url.searchParams.get('testWelcome') === 'true'

    if (testWelcome) {
        const siteUrl = import.meta.env.SITE || 'https://vatsal.ca'
        const welcomeHtml = generateWelcomeEmail('Vatsal', siteUrl)
        return new Response(welcomeHtml, {
            status: 200,
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
        })
    }

    // Auth check (skipped in test mode or local dev sendTest/subscribers mode)
    const isDev = import.meta.env.DEV || url.hostname === 'localhost' || url.hostname === '127.0.0.1'
    const bypassAuth = testMode || ((sendTest || getSubscribers) && isDev)

    // Broad lookup for NEWSLETTER_SECRET across all Cloudflare binding patterns
    const platformEnv = (locals as any).runtime?.env || (locals as any).env || {}
    const secret = platformEnv.NEWSLETTER_SECRET || import.meta.env.NEWSLETTER_SECRET || ''
    const authHeader = request.headers.get('x-newsletter-secret') || url.searchParams.get('secret') || ''

    // Debug mode: show what the server sees (remove after testing)
    if (url.searchParams.get('debug') === 'true') {
        return new Response(JSON.stringify({
            hasSecret: !!secret,
            secretLength: secret.length,
            authHeaderLength: authHeader.length,
            match: secret === authHeader,
            runtimeKeys: Object.keys(platformEnv),
            bypassAuth,
            isDev,
        }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    if (!bypassAuth) {
        if (!secret || authHeader !== secret) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
        }
    }

    const BREVO_API_KEY = runtimeEnv.BREVO_API_KEY || import.meta.env.BREVO_API_KEY
    const LIST_ID = Number(runtimeEnv.BREVO_LIST_ID || import.meta.env.BREVO_LIST_ID) || 2
    const SENDER_EMAIL = runtimeEnv.BREVO_SENDER_EMAIL || import.meta.env.BREVO_SENDER_EMAIL || 'newsletter@vatsal.ca'
    const SENDER_NAME = runtimeEnv.BREVO_SENDER_NAME || import.meta.env.BREVO_SENDER_NAME || 'Vatsal Sharma'
    const REPLY_TO = runtimeEnv.BREVO_REPLY_TO || import.meta.env.BREVO_REPLY_TO || 'vatswork10@gmail.com'

    // Only require Brevo configuration when actually sending the campaign
    if (!testMode && !BREVO_API_KEY) {
        return new Response(JSON.stringify({ error: 'Brevo API key not configured' }), { status: 500 })
    }

    try {
        if (getSubscribers) {
            const listResponse = await fetch(`https://api.brevo.com/v3/contacts/lists/${LIST_ID}`, {
                method: 'GET',
                headers: {
                    'api-key': BREVO_API_KEY,
                    accept: 'application/json',
                }
            })
            if (!listResponse.ok) {
                const listErr = await listResponse.json()
                return new Response(JSON.stringify({ error: 'Failed to fetch list info from Brevo', details: listErr }), { status: listResponse.status })
            }
            const listData = await listResponse.json() as Record<string, any>
            return new Response(JSON.stringify({
                listId: LIST_ID,
                listName: listData.name,
                totalSubscribers: listData.totalSubscribers,
                totalBlacklisted: listData.totalBlacklisted
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            })
        }

        // Parse optional query params
        // Get all posts
        const allPosts = await getAllPostsIncludingNewsletters()

        // Check if the latest post is a newsletter or daily outlook
        const latestPost = allPosts[0]
        let newsletterData = undefined

        if (latestPost && (latestPost.data.isNewsletter || latestPost.data.isDaily)) {
            // Auto-calculate issueNumber if not defined in frontmatter
            let issueNumber = latestPost.data.issueNumber
            if (!issueNumber) {
                const targetFlag = latestPost.data.isDaily ? 'isDaily' : 'isNewsletter'
                const otherIssues = allPosts.filter(p => p.data[targetFlag] && p.data.issueNumber && p.id !== latestPost.id)
                const highestNumber = otherIssues.reduce((max, p) => {
                    const num = parseInt(p.data.issueNumber || '0', 10)
                    return isNaN(num) ? max : Math.max(max, num)
                }, latestPost.data.isDaily ? 123 : 0)
                issueNumber = String(highestNumber + 1)
            }

            newsletterData = {
                title: latestPost.data.title,
                description: latestPost.body || latestPost.data.description || '',
                date: latestPost.data.date,
                isDaily: latestPost.data.isDaily,
                issueNumber,
                topThree: latestPost.data.topThree,
                events: latestPost.data.events,
                keyTakeaways: latestPost.data.keyTakeaways,
                conceptCornerTitle: latestPost.data.conceptCornerTitle,
                conceptCornerText: latestPost.data.conceptCornerText,
                onMyDesk: latestPost.data.onMyDesk,
            }
        }

        // Filter to show exactly the last 3 regular blog posts (excluding newsletters and dailies)
        const regularBlogs = allPosts.filter((post) => {
            // Exclude the current newsletter/daily itself
            if (latestPost && post.id === latestPost.id) return false
            // Exclude other newsletters/dailies
            if (post.data.isNewsletter || post.data.isDaily) return false
            return true
        })

        // Cap at the latest 3 regular blog posts
        const postsForDigest = regularBlogs.slice(0, 3)

        const siteUrl = import.meta.env.SITE || 'https://vatsal.ca'
        const digestPosts = postsForDigest.map((post) => postToDigest(post, siteUrl))
        const htmlContent = generateDigestEmail(digestPosts, siteUrl, newsletterData)

        // In test mode, return the HTML preview without sending
        if (testMode) {
            return new Response(htmlContent, {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            })
        }

        // Send via Brevo Campaign API
        const campaignName = newsletterData
            ? (newsletterData.isDaily 
                ? `Trade The News — ${new Date(newsletterData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
                : `Weekly Market Outlook — Issue ${newsletterData.issueNumber || '01'} (${new Date(newsletterData.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})`)
            : `Weekly Digest — ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`

        const campaignSubject = newsletterData
            ? (newsletterData.isDaily
                ? `Trade The News | ${newsletterData.title}`
                : `Weekly Market Outlook | ${newsletterData.title}`)
            : `📬 Weekly Digest | ${digestPosts.length} new post${digestPosts.length !== 1 ? 's' : ''} on vatsal.ca`

        // Step 1: Create the campaign
        const createResponse = await fetch('https://api.brevo.com/v3/emailCampaigns', {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                accept: 'application/json',
            },
            body: JSON.stringify({
                name: campaignName,
                subject: campaignSubject,
                sender: { name: SENDER_NAME, email: SENDER_EMAIL },
                htmlContent,
                recipients: { listIds: [LIST_ID] },
                replyTo: REPLY_TO,
            }),
        })

        const createData = await createResponse.json() as Record<string, any>

        if (!createResponse.ok) {
            console.error('Brevo campaign creation failed:', createData)
            return new Response(
                JSON.stringify({ error: 'Failed to create campaign', details: createData }),
                { status: createResponse.status }
            )
        }

        const campaignId = createData.id

        if (sendTest) {
            // Step 2: Send test email to specified recipients
            const testRecipients = ['vatswork10@gmail.com', 'vats360@gmail.com']
            const testResponse = await fetch(
                `https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendTest`,
                {
                    method: 'POST',
                    headers: {
                        'api-key': BREVO_API_KEY,
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    },
                    body: JSON.stringify({
                        emailTo: testRecipients,
                    }),
                }
            )

            // Step 3: Delete draft campaign to keep Brevo campaign list clean
            await fetch(`https://api.brevo.com/v3/emailCampaigns/${campaignId}`, {
                method: 'DELETE',
                headers: {
                    'api-key': BREVO_API_KEY,
                },
            })

            if (!testResponse.ok) {
                const testData = await testResponse.json()
                console.error('Brevo campaign sendTest failed:', testData)
                return new Response(
                    JSON.stringify({ error: 'Campaign created but failed to send test emails', details: testData }),
                    { status: testResponse.status }
                )
            }

            return new Response(
                JSON.stringify({ success: true, message: `Test email successfully sent to: ${testRecipients.join(', ')}` }),
                { status: 200, headers: { 'Content-Type': 'application/json' } }
            )
        }

        // Step 2: Send the campaign immediately
        const sendResponse = await fetch(
            `https://api.brevo.com/v3/emailCampaigns/${campaignId}/sendNow`,
            {
                method: 'POST',
                headers: {
                    'api-key': BREVO_API_KEY,
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                },
            }
        )

        if (!sendResponse.ok) {
            const sendData = await sendResponse.json()
            console.error('Brevo campaign send failed:', sendData)
            return new Response(
                JSON.stringify({ error: 'Campaign created but failed to send', campaignId, details: sendData }),
                { status: sendResponse.status }
            )
        }

        return new Response(
            JSON.stringify({
                message: 'Weekly digest sent successfully',
                campaignId,
                postsIncluded: digestPosts.length,
                postTitles: digestPosts.map((p) => p.title),
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
        )
    } catch (error) {
        console.error('Newsletter digest error:', error)
        return new Response(
            JSON.stringify({ error: 'Internal server error', message: String(error) }),
            { status: 500 }
        )
    }
}
