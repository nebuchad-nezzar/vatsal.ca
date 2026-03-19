import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async (context) => {
    const { request, locals } = context;
    const runtimeEnv = (locals as any).runtime?.env || {};

    const BREVO_API_KEY = runtimeEnv.BREVO_API_KEY || import.meta.env.BREVO_API_KEY;
    const LIST_ID = Number(runtimeEnv.BREVO_LIST_ID || import.meta.env.BREVO_LIST_ID) || 2;
    const DOI_TEMPLATE_ID = Number(runtimeEnv.BREVO_DOI_TEMPLATE_ID || import.meta.env.BREVO_DOI_TEMPLATE_ID);
    const REDIRECT_URL = import.meta.env.SITE || 'https://vatsal.ca';

    if (!BREVO_API_KEY) {
        return new Response(JSON.stringify({ error: 'Server configuration error' }), {
            status: 500,
        });
    }

    try {
        const body = await request.json();
        const { email, fullName, honeypot } = body;

        // 1. Honeypot check
        if (honeypot) {
            return new Response(JSON.stringify({ message: 'Subscribed successfully' }), {
                status: 200,
            });
        }

        if (!email) {
            return new Response(JSON.stringify({ error: 'Email is required' }), {
                status: 400,
            });
        }

        // 2. Extra disposable email check (Server-side)
        const DISPOSABLE_DOMAINS = ['mailinator.com', 'temp-mail.org', '10minutemail.com'];
        const domain = email.split('@')[1];
        if (domain && DISPOSABLE_DOMAINS.includes(domain.toLowerCase())) {
            return new Response(JSON.stringify({ error: 'Please use a permanent email address' }), {
                status: 400,
            });
        }

        const nameParts = (fullName || '').trim().split(/\s+/);
        const firstName = nameParts[0] || '';
        const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

        // 3. Determine if we use Double Opt-In or Standard
        const useDOI = !isNaN(DOI_TEMPLATE_ID) && DOI_TEMPLATE_ID > 0;
        const endpoint = useDOI
            ? 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation'
            : 'https://api.brevo.com/v3/contacts';

        const payload = useDOI ? {
            email,
            attributes: { FIRSTNAME: firstName, LASTNAME: lastName },
            includeListIds: [LIST_ID],
            templateId: DOI_TEMPLATE_ID,
            redirectionUrl: REDIRECT_URL
        } : {
            email,
            attributes: { FIRSTNAME: firstName, LASTNAME: lastName },
            listIds: [LIST_ID],
            updateEnabled: true
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'api-key': BREVO_API_KEY,
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(payload),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
            if (data.code === 'duplicate_parameter') {
                return new Response(JSON.stringify({ message: 'You are already subscribed!' }), {
                    status: 200,
                });
            }
            return new Response(JSON.stringify({ error: data.message || 'Subscription failed' }), {
                status: response.status,
            });
        }

        const successMessage = useDOI
            ? 'Success! Please check your email to confirm your subscription.'
            : 'Subscribed successfully!';

        return new Response(JSON.stringify({ message: successMessage }), {
            status: 200,
        });
    } catch (error) {
        console.error('Newsletter API Error:', error);
        return new Response(JSON.stringify({ error: 'Internal server error' }), {
            status: 500,
        });
    }
};
