# vatsal.ca

Personal website and blog of **Vatsal Sharma**, built with [**Astro**](https://astro.build/) and [**Tailwind CSS**](https://tailwindcss.com/).

## 🚀 Features

- **Automated Newsletter**: Weekly digest of latest posts sent via Brevo.
- **RSS Feed**: Full RSS support for readers and automated distribution.
- **Page Views**: Live view counting for every blog post using Upstash Redis.
- **Optimized for Cloudflare**: Pre-rendered architecture for fast global delivery and reliable image processing.
- **Modern Tech Stack**: React components, MDX for content, and Radix UI primitives.
- **Quantitative & Data Focused**: Custom components for market data, trading charts, and research notebooks.

## 🛠️ Stack

- **Framework**: Astro (SSG/SSR hybrid)
- **Styling**: Tailwind CSS
- **Components**: React & Lucide icons
- **Database**: Upstash Redis (Pageviews)
- **Email**: Brevo (Newsletter)
- **Deployment**: Cloudflare Pages / Workers

## ⚙️ Configuration

To run this project locally or deploy it, you need the following environment variables:

| Variable | Description |
| --- | --- |
| `UPSTASH_REDIS_REST_URL` | Upstash Redis URL for pageviews |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis token |
| `BREVO_API_KEY` | Brevo API key for newsletter |
| `BREVO_LIST_ID` | Brevo subscriber list ID |
| `BREVO_DOI_TEMPLATE_ID` | Brevo double opt-in template ID |
| `NEWSLETTER_SECRET` | Secret key for triggering automated digests |

## 📦 Deployment on Cloudflare

1. Set up a **Cloudflare Pages** project linked to your GitHub repository.
2. Add the environment variables listed above in the **Cloudflare Dashboard** under **Workers & Pages > Settings > Environment Variables**.
3. For sensitive keys (Brevo, Redis), use **Secrets** via the dashboard or `wrangler secret put`.

---

Made with ♥ by [Vatsal Sharma](https://vatsal.ca)
