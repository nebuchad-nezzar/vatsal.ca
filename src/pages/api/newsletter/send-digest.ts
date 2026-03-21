import type { APIRoute } from 'astro'
import { getAllPosts } from '@/lib/data-utils'
import { generateDigestEmail, postToDigest } from '@/lib/newsletter-template'

export const prerender = false

export const POST: APIRoute = async (context) => {
    const { request, locals } = context
    const runtimeEnv = (locals as any).runtime?.env || {}

    // Auth check
    const secret = runtimeEnv.NEWSLETTER_SECRET || import.meta.env.NEWSLETTER_SECRET
    const authHeader = request.headers.get('x-newsletter-secret')

    if (!secret || authHeader !== secret) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const BREVO_API_KEY = runtimeEnv.BREVO_API_KEY || import.meta.env.BREVO_API_KEY
    const LIST_ID = Number(runtimeEnv.BREVO_LIST_ID || import.meta.env.BREVO_LIST_ID) || 2

    if (!BREVO_API_KEY) {
        return new Response(JSON.stringify({ error: 'Brevo API key not configured' }), { status: 500 })
    }

    try {
        // Parse optional query params
        const url = new URL(request.url)
        const daysBack = Number(url.searchParams.get('days')) || 7
        const testMode = url.searchParams.get('test') === 'true'

        // Get posts from the last N days
        const allPosts = await getAllPosts()
        const cutoffDate = new Date()
        cutoffDate.setDate(cutoffDate.getDate() - daysBack)

        const recentPosts = allPosts.filter((post) => {
            const postDate = new Date(post.data.date)
            return postDate >= cutoffDate
        })

        const siteUrl = import.meta.env.SITE || 'https://vatsal.ca'
        const digestPosts = recentPosts.map((post) => postToDigest(post, siteUrl))
        const htmlContent = generateDigestEmail(digestPosts, siteUrl)

        // In test mode, return the HTML preview without sending
        if (testMode) {
            return new Response(htmlContent, {
                status: 200,
                headers: { 'Content-Type': 'text/html' },
            })
        }

        // Send via Brevo Campaign API
        const campaignName = `Weekly Digest — ${new Date().toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })}`

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
                subject: `📬 Weekly Digest — ${digestPosts.length} new post${digestPosts.length !== 1 ? 's' : ''} on vatsal.ca`,
                sender: { name: 'Vatsal Sharma', email: 'vatswork10@gmail.com' },
                htmlContent,
                recipients: { listIds: [LIST_ID] },
                replyTo: 'vatswork10@gmail.com',
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
