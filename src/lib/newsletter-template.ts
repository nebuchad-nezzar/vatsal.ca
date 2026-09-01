import type { CollectionEntry } from 'astro:content'

export interface DigestPost {
    title: string
    description: string
    date: Date
    url: string
    tags: string[]
    premium?: boolean
}

export interface NewsletterData {
    title: string
    description: string  // The main commentary ("What Moved This Week")
    date: Date
    isDaily?: boolean
    issueNumber?: string
    topThree?: { title: string; description: string }[]
    events?: { badge: string; description: string }[]
    keyTakeaways?: string[]
    conceptCornerTitle?: string
    conceptCornerText?: string
    onMyDesk?: { title: string; description: string; link?: string }[]
}

/**
 * Generates a branded, premium cream-and-white weekly digest or newsletter email.
 */
export function generateDigestEmail(posts: DigestPost[], siteUrl: string, newsletterData?: NewsletterData): string {
    const dateToUse = newsletterData ? new Date(newsletterData.date) : new Date();
    const day = dateToUse.getUTCDate();
    const month = dateToUse.toLocaleString('en-US', { month: 'long', timeZone: 'UTC' });
    const year = dateToUse.getUTCFullYear();
    const getOrdinal = (d: number) => {
        if (d > 3 && d < 21) return 'th';
        switch (d % 10) {
            case 1:  return "st";
            case 2:  return "nd";
            case 3:  return "rd";
            default: return "th";
        }
    };
    const formattedDate = `${month} ${day}${getOrdinal(day)}, ${year}`;

    const cleanDesc = newsletterData ? newsletterData.description.replace(/<[^>]+>/g, '').replace(/\{\/\*[\s\S]*?\*\/\}/g, '').replace(/\s+/g, ' ').trim() : '';
    const preheaderText = newsletterData 
        ? `${cleanDesc.slice(0, 120)}...`
        : `Here's what I published this week on System Design, Quant, AI, and Markets.`;

    // Generate invisible spacing block to block inbox text leakage
    const preheaderSpaces = Array(150).fill('&zwnj;&nbsp;').join('');

    // Dynamic blocks helper rendering
    const topThreeBlock = renderTopThree(newsletterData?.topThree);
    const eventsBlock = renderEvents(newsletterData?.events);
    const takeawaysBlock = renderKeyTakeaways(newsletterData?.keyTakeaways);
    const conceptCornerBlock = renderConceptCorner(newsletterData?.conceptCornerTitle, newsletterData?.conceptCornerText);
    const onMyDeskBlock = renderOnMyDesk(newsletterData?.onMyDesk);
    const latestResearchBlock = newsletterData?.isDaily ? '' : renderLatestResearch(posts);

    const emailTitle = newsletterData 
        ? (newsletterData.isDaily ? `The Daily Alpha Pulse — ${newsletterData.title}` : `Weekly Market Outlook — ${newsletterData.title}`)
        : `Weekly Digest — Vatsal Sharma`;

    return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="format-detection" content="telephone=no, date=no, address=no, email=no">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${emailTitle}</title>
<!--[if mso]>
<style type="text/css">
  body, table, td, h1, h2, p, span, div, a { font-family: Arial, sans-serif !important; }
</style>
<noscript>
  <xml>
    <o:OfficeDocumentSettings>
      <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
  </xml>
</noscript>
<![endif]-->
<style type="text/css">
  /* Reset */
  a { text-decoration: none; }
  
  /* Hover States */
  .primary-btn { transition: all 0.2s ease; }
  .primary-btn:hover { background-color: #333333 !important; }
  .article-link { transition: all 0.2s ease; }
  .article-link:hover { background-color: #f5f5f5 !important; }

  /* Mobile Responsive */
  @media only screen and (max-width: 600px) {
    .container { width: 100% !important; max-width: 100% !important; }
    .content-pad { padding: 32px 20px !important; }
    .hero-pad { padding: 40px 20px 24px 20px !important; }
    .masthead-pad { padding: 24px 20px !important; }
    .footer-pad { padding: 32px 20px 24px 20px !important; }
    .key-takeaway-pad { padding: 8px 20px 32px 20px !important; }
    .cta-pad { padding: 12px 20px 40px 20px !important; }
    .legal-pad { padding: 24px 20px 32px 20px !important; }
    .divider-pad { padding: 0 20px !important; }
  }

  /* Dark Mode */
  @media (prefers-color-scheme: dark) {
    body, .outer-bg { background-color: #121212 !important; }
    .inner-bg { background-color: #1a1a1a !important; box-shadow: none !important; }
    .masthead-bg { background-color: #000000 !important; }
    h1, h2, .text-main { color: #f4f1ea !important; }
    .text-sub { color: #aaaaaa !important; }
    .divider { background-color: #333333 !important; }
    .border-block { border-color: #333333 !important; }
    .card-bg { background-color: #222222 !important; }
    .badge-bg { background-color: #2a2a2a !important; border-color: #333333 !important; color: #f4f1ea !important; }
    .number-circle { background-color: #222222 !important; color: #b8960c !important; }
    .legal-text { color: #777777 !important; }
    .cta-td { background-color: #f4f1ea !important; }
    .cta-button { color: #000000 !important; }
    .primary-btn:hover { background-color: #ffffff !important; }
    .article-link:hover { background-color: #2a2a2a !important; }
    .gold-accent { color: #d4a94e !important; }
  }
</style>
</head>
<body style="margin:0; padding:0; background-color:#f4f1ea; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; -webkit-font-smoothing:antialiased; color:#1a1a1a;" class="outer-bg text-main">

<!-- Hidden Preheader for Inbox Preview -->
<div style="display:none; font-size:1px; color:#f4f1ea; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
  ${preheaderText} ${preheaderSpaces}
</div>

<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f4f1ea; padding:24px 0;" class="outer-bg">
<tr>
<td align="center">

<table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" class="container inner-bg border-block" style="max-width:640px; width:100%; border-collapse:collapse; background-color:#ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.03);">

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- BLACK MASTHEAD                                              -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <tr>
    <td class="masthead-bg masthead-pad" style="background-color:#0a0a0a; padding:24px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:middle;">
            <a href="${siteUrl}" target="_blank" style="text-decoration:none; display:inline-block; vertical-align:middle;">
              <img src="https://vatsal.ca/logo.png" alt="Vatsal.ca Logo" width="48" style="display:block; border:none; max-width:48px; height:auto;">
            </a>
            <span style="display:inline-block; vertical-align:middle; margin-left:16px; border-left:1px solid #333333; padding-left:16px;">
              <span class="gold-accent" style="font-size:15px; font-weight:600; color:#b8960c; letter-spacing:2px; text-transform:uppercase;">${newsletterData?.isDaily ? 'The Daily Alpha Pulse' : 'VWAP'}</span>
            </span>
          </td>
          <td style="text-align:right; vertical-align:middle;">
            <span style="font-size:11px; color:#888888; letter-spacing:1px; font-weight:500;">
              ${newsletterData?.issueNumber ? `NO. ${newsletterData.issueNumber}` : ''}
            </span>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- Thin Gold Accent -->
  <tr><td style="height:3px; background-color:#b8960c; font-size:0; line-height:0;">&nbsp;</td></tr>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- HERO TITLE AREA                                             -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <tr>
    <td class="hero-pad" style="padding:40px 40px 24px 40px;">
      
      <!-- VWAP Highlighted Header (Bolded) -->
      <div style="font-size:14px; font-weight:800; color:#b8960c; letter-spacing:1.5px; margin-bottom:16px; text-transform:uppercase;" class="gold-accent">
        ${newsletterData?.isDaily 
          ? 'Daily Trade Catalyst' 
          : `<span style="font-weight:800;">V</span>atsal's
             <span style="font-weight:800; margin-left:2px;">W</span>eekly
             <span style="font-weight:800; margin-left:2px;">A</span>lpha
             <span style="font-weight:800; margin-left:2px;">P</span>ulse`}
      </div>

      <h1 class="text-main" style="margin:0 0 4px 0; font-size:32px; font-weight:normal; color:#0a0a0a; letter-spacing:-0.5px; font-family:Georgia, 'Times New Roman', serif;">
        ${newsletterData ? (newsletterData.isDaily ? 'Daily Market Commentary' : 'Weekly Market Outlook') : 'Weekly Digest'}
      </h1>
      
      <div class="text-sub" style="font-size:14px; color:#666666; font-weight:500; text-align:right;">
        ${formattedDate}
      </div>
    </td>
  </tr>

  <!-- Divider -->
  <tr><td class="divider-pad" style="padding:0 40px;"><div class="divider" style="height:1px; background-color:#eeeeee;"></div></td></tr>

  ${takeawaysBlock}

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- WHAT MOVED THIS WEEK / MAIN INTRO                           -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <tr>
    <td class="content-pad" style="padding:16px 40px 32px 40px;">
      <h2 class="gold-accent" style="margin:0 0 16px 0; font-size:14px; font-weight:600; color:#b8960c; text-transform:uppercase; letter-spacing:1.5px;">
        ${newsletterData ? (newsletterData.isDaily ? 'What Moved Today' : 'What Moved This Week') : 'Overview'}
      </h2>
      <div class="text-main" style="font-size:15px; line-height:1.7; color:#333333;">
        ${newsletterData ? formatCommentary(newsletterData.description, siteUrl) : `<p>Here's a digest of what I published this week on System Design, Quant, AI, and Markets.</p>`}
      </div>
    </td>
  </tr>
  ${topThreeBlock}
  ${eventsBlock}
  ${conceptCornerBlock}
  ${onMyDeskBlock}
  ${latestResearchBlock}

  <!-- CTA -->
  <tr>
    <td class="cta-pad" style="padding:12px 40px 40px 40px;" align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td class="cta-td primary-btn" style="background-color:#0a0a0a; border-radius:3px; text-align:center;">
            <a href="${siteUrl}/blog" class="cta-button" style="display:block; padding:12px 40px; color:#ffffff; font-size:12px; font-weight:600; text-decoration:none; letter-spacing:1.5px; text-transform:uppercase;">
              View All Research &rarr;
            </a>
          </td>
        </tr>
      </table>
    </td>
  </tr>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- FOOTER                                                      -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <tr>
    <td class="masthead-bg footer-pad" style="background-color:#0a0a0a; padding:32px 40px 24px 40px; text-align:center;">
      <a href="${siteUrl}" target="_blank" style="text-decoration:none; display:inline-block; margin-bottom:20px;">
        <img src="https://vatsal.ca/logo.png" alt="Vatsal.ca Logo" width="56" style="display:block; border:none; opacity:0.9; max-width:56px; height:auto;">
      </a>
      <div>
        <a href="https://x.com/vats360" class="text-sub" style="margin:0 14px; color:#888888; font-size:11px; text-decoration:none; font-weight:500; letter-spacing:1px; text-transform:uppercase;">X</a>
        <a href="https://www.linkedin.com/in/vats1910/" class="text-sub" style="margin:0 14px; color:#888888; font-size:11px; text-decoration:none; font-weight:500; letter-spacing:1px; text-transform:uppercase;">LinkedIn</a>
        <a href="mailto:vatswork10@gmail.com" class="text-sub" style="margin:0 14px; color:#888888; font-size:11px; text-decoration:none; font-weight:500; letter-spacing:1px; text-transform:uppercase;">Contact</a>
      </div>
    </td>
  </tr>
  <tr><td class="masthead-bg divider-pad" style="background-color:#0a0a0a; padding:0 40px;"><div class="divider" style="height:1px; background-color:#222222;"></div></td></tr>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- LEGAL                                                       -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <tr>
    <td class="masthead-bg legal-pad" style="background-color:#0a0a0a; padding:24px 40px 32px 40px;">
      <p class="legal-text" style="margin:0 0 10px 0; font-size:9px; line-height:1.6; color:#555555; font-weight:600; text-transform:uppercase; letter-spacing:1px;">
        Important Disclosures
      </p>
      <p class="legal-text" style="margin:0 0 10px 0; font-size:9px; line-height:1.6; color:#555555;">
        This communication is published by Vatsal Sharma (&ldquo;the Author&rdquo;) and distributed via vatsal.ca for informational and educational purposes only. It does not constitute investment advice, a solicitation, an offer to buy or sell, or a recommendation of any security, financial product, strategy, or transaction. Nothing herein should be construed as legal, tax, accounting, or regulatory guidance.
      </p>
      <p class="legal-text" style="margin:0 0 10px 0; font-size:9px; line-height:1.6; color:#555555;">
        The Author may hold positions in securities or instruments discussed herein and is under no obligation to disclose such positions or to refrain from trading. Past performance is not indicative of future results. All investments carry risk, including the potential loss of principal. Forward-looking statements are inherently uncertain and actual results may differ materially from those expressed or implied.
      </p>
      <p class="legal-text" style="margin:0 0 10px 0; font-size:9px; line-height:1.6; color:#555555;">
        The views and opinions expressed are solely those of the Author and do not represent those of any current or former employer, institution, fund, or affiliated entity. This publication is not affiliated with, endorsed by, or sponsored by any broker-dealer, investment advisor, or regulatory body. The Author is not a registered investment advisor, broker-dealer, or licensed financial professional under any jurisdiction.
      </p>
      <p class="legal-text" style="margin:0 0 10px 0; font-size:9px; line-height:1.6; color:#555555;">
        Recipients should conduct their own independent research and due diligence and consult with qualified legal, tax, and financial advisors before making any investment decision. By receiving this newsletter, you acknowledge that no fiduciary, advisory, or professional relationship is created between you and the Author. You assume full responsibility for any actions taken based on the content herein.
      </p>
      <p class="legal-text" style="margin:0 0 16px 0; font-size:9px; line-height:1.6; color:#555555;">
        This material is confidential and intended solely for the use of the individual or entity to which it is addressed. Unauthorized redistribution, reproduction, or disclosure of this publication or its contents, in whole or in part, is strictly prohibited without the prior written consent of the Author.
      </p>
      <div class="divider" style="height:1px; background-color:#222222; margin-bottom:16px;"></div>
      <p class="legal-text" style="margin:0; font-size:9px; color:#555555; text-align:center;">
        &copy; 2026 Vatsal Sharma. All rights reserved. &nbsp;&middot;&nbsp; <a href="${siteUrl}" class="legal-text" style="color:#777777; text-decoration:none;">vatsal.ca</a>
        &nbsp;&middot;&nbsp; <a href="{{unsubscribe}}" class="legal-text" style="color:#777777; text-decoration:underline;">Unsubscribe</a>
        &nbsp;&middot;&nbsp; <a href="${siteUrl}/privacy" class="legal-text" style="color:#777777; text-decoration:underline;">Privacy</a>
        &nbsp;&middot;&nbsp; <a href="${siteUrl}/terms" class="legal-text" style="color:#777777; text-decoration:underline;">Terms</a>
      </p>
    </td>
  </tr>

</table>

</td>
</tr>
</table>

<div style="display:none !important; visibility:hidden !important; opacity:0; color:transparent; height:0; width:0; overflow:hidden; font-size:0; line-height:0;">
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// HTML Rendering Helpers
// ─────────────────────────────────────────────────────────────────────────────

function formatCommentary(text: string, siteUrl: string = 'https://vatsal.ca'): string {
    // 1. Remove MDX imports
    let cleanText = text.replace(/import\s+[\s\S]+?from\s+['"].+?['"]/g, '');
    
    // 2. Strip JSX comments
    cleanText = cleanText.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');

    // 3. Strip JSX component blocks line by line without regex backtracking
    const lines = cleanText.split('\n');
    const filteredLines: string[] = [];
    let insideDiv = 0;

    for (const line of lines) {
        const trimmed = line.trim();
        const openDivs = (line.match(/<div/gi) || []).length;
        const closeDivs = (line.match(/<\/div>/gi) || []).length;
        
        if (openDivs > 0 || closeDivs > 0 || insideDiv > 0) {
            insideDiv += (openDivs - closeDivs);
            if (insideDiv < 0) insideDiv = 0;
            continue;
        }

        if (trimmed.startsWith('<') && !trimmed.startsWith('<http')) {
            continue;
        }

        filteredLines.push(line);
    }

    cleanText = filteredLines.join('\n');
    cleanText = cleanText.replace(/<[^>]+>/g, '');
    cleanText = cleanText.replace(/---\s*$/g, '');

    // Check if there is a callout / footer section separated by ***
    const parts = cleanText.split(/\n\s*\*\*\*\s*\n/);
    const mainBody = parts[0] || '';
    const footerBody = parts.slice(1).join('\n').trim();

    // 4. Simple Markdown conversion for main commentary body
    const mainHtml = mainBody.split('\n\n')
        .map(p => p.trim())
        .filter(Boolean)
        .map(p => {
            if (p.startsWith('<p') || p.startsWith('<hr') || p.startsWith('<h3')) {
                return p;
            }
            let formatted = p.replace(/\n/g, '<br />');
            formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong style="color:#0a0a0a;">$1</strong>');
            formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color:#b8960c; text-decoration:underline;">$1</a>');
            return `<p class="text-main" style="margin:0 0 16px 0; font-size:15px; line-height:1.7; color:#333333;">${formatted}</p>`;
        })
        .join('');

    if (!footerBody) {
        return mainHtml;
    }

    // Render footer callout box nicely for *** sections
    const footerItems = footerBody.split('\n\n').filter(Boolean).map((block, idx) => {
        let formatted = block;
        // Strip 👉 emoji if present anywhere
        formatted = formatted.replace(/👉\s*/g, '');
        // Bold title
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong class="text-main" style="color:#0a0a0a; display:block; font-size:15px; margin-bottom:4px;">$1</strong>');
        // Format markdown link cleanly
        formatted = formatted.replace(/\[(.*?)\]\((.*?)\)/g, '<span style="display:inline-block; margin-top:6px;"><a href="$2" class="gold-accent" style="color:#b8960c; font-weight:600; text-decoration:underline;">$1 &rarr;</a></span>');
        formatted = formatted.replace(/\n/g, '<br />');
        const divider = idx > 0 ? '<div class="divider" style="height:1px; background-color:#eeeeee; margin:16px 0;"></div>' : '';
        return `${divider}<div class="text-sub" style="font-size:14px; color:#555555; line-height:1.6;">${formatted}</div>`;
    }).join('');

    const footerCardHtml = `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-bg border-block" style="background-color:#fcfbf8; border:1px solid #e8e3d8; border-left:3px solid #b8960c; border-radius:4px; margin-top:28px; margin-bottom:12px;">
      <tr>
        <td style="padding:20px 24px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:16px;">
            <tr>
              <td style="vertical-align:middle;">
                <div class="gold-accent" style="font-size:12px; letter-spacing:2px; color:#b8960c; text-transform:uppercase; font-weight:600;">Offerings:</div>
              </td>
              <td style="text-align:right; vertical-align:middle;">
                <img src="${siteUrl}/logo.png" alt="Logo" width="28" style="display:inline-block; border:none; max-width:28px; height:auto; opacity:0.9;">
              </td>
            </tr>
          </table>
          ${footerItems}
        </td>
      </tr>
    </table>`;

    return mainHtml + footerCardHtml;
}

function renderTopThree(topThree?: { title: string; description: string }[]): string {
    if (!topThree || topThree.length === 0) return '';
    const items = topThree.map((item, index) => {
        const dividerRow = index > 0 
            ? '<tr><td colspan="2" style="padding-bottom:20px;"><div class="divider" style="height:1px; background-color:#f9f9f9;"></div></td></tr>' 
            : '';
        return `
      <!-- ${index + 1} -->
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:20px;">
        ${dividerRow}
        <tr>
          <td style="width:32px; vertical-align:top; padding-top:2px;">
            <div class="number-circle" style="width:24px; height:24px; background-color:#f4f1ea; border-radius:50%; text-align:center; line-height:24px; font-size:12px; font-weight:600; color:#b8960c;">${index + 1}</div>
          </td>
          <td style="vertical-align:top; padding-left:12px;">
            <div class="text-main" style="font-size:16px; font-weight:600; color:#0a0a0a; margin-bottom:4px;">${item.title}</div>
            <div class="text-sub" style="font-size:14px; color:#555555; line-height:1.6;">${item.description}</div>
          </td>
        </tr>
      </table>`;
    }).join('');

    return `
  <!-- Divider -->
  <tr><td class="divider-pad" style="padding:0 40px;"><div class="divider" style="height:1px; background-color:#eeeeee;"></div></td></tr>
  <tr>
    <td class="content-pad" style="padding:32px 40px;">
      <h2 class="gold-accent" style="margin:0 0 24px 0; font-size:14px; font-weight:600; color:#b8960c; text-transform:uppercase; letter-spacing:1.5px;">Top Three</h2>
      ${items}
    </td>
  </tr>`;
}

function renderEvents(events?: { badge: string; description: string }[]): string {
    if (!events || events.length === 0) return '';
    const items = events.map((item, index) => {
        const isLast = index === events.length - 1;
        const divider = isLast ? '' : '<tr><td style="padding:0;"><div class="divider" style="height:1px; background-color:#f9f9f9;"></div></td></tr>';
        return `
        <tr>
          <td style="padding:12px 0;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
              <td style="vertical-align:top; padding-right:16px; width:60px;">
                <span class="badge-bg text-main" style="display:inline-block; font-size:11px; font-weight:600; color:#0a0a0a; background-color:#f4f1ea; padding:4px 10px; border-radius:3px; letter-spacing:1px; border:1px solid #e8e3d8;">${item.badge}</span>
              </td>
              <td style="vertical-align:top;">
                <span class="text-main" style="font-size:14px; color:#333333; line-height:1.6;">${item.description}</span>
              </td>
            </tr></table>
          </td>
        </tr>
        ${divider}`;
    }).join('');

    return `
  <!-- Divider -->
  <tr><td class="divider-pad" style="padding:0 40px;"><div class="divider" style="height:1px; background-color:#eeeeee;"></div></td></tr>
  <tr>
    <td class="content-pad" style="padding:32px 40px;">
      <h2 class="gold-accent" style="margin:0 0 20px 0; font-size:14px; font-weight:600; color:#b8960c; text-transform:uppercase; letter-spacing:1.5px;">Events &amp; Earnings</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${items}
      </table>
    </td>
  </tr>`;
}

function renderKeyTakeaways(keyTakeaways?: string[]): string {
    if (!keyTakeaways || keyTakeaways.length === 0) return '';
    const items = keyTakeaways.map((item) => `
              <tr><td class="text-main" style="padding:4px 0; font-size:14px; color:#1a1a1a; line-height:1.6;">
                <span class="gold-accent" style="color:#b8960c; font-weight:bold; margin-right:8px;">&bull;</span>${item}
              </td></tr>`).join('');

    return `
  <tr>
    <td class="key-takeaway-pad" style="padding:24px 40px 12px 40px;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-bg border-block" style="background-color:#fcfbf8; border:1px solid #e8e3d8; border-left:3px solid #b8960c; border-radius:2px;">
        <tr>
          <td style="padding:24px 28px;">
            <div class="gold-accent" style="font-size:12px; letter-spacing:2px; color:#b8960c; text-transform:uppercase; font-weight:600; margin-bottom:12px;">Key Takeaways</div>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
              ${items}
            </table>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

function renderConceptCorner(title?: string, text?: string): string {
    if (!title || !text) return '';
    return `
  <!-- Divider -->
  <tr><td class="divider-pad" style="padding:0 40px;"><div class="divider" style="height:1px; background-color:#eeeeee;"></div></td></tr>
  <tr>
    <td class="content-pad" style="padding:32px 40px;">
      <h2 class="gold-accent" style="margin:0 0 16px 0; font-size:14px; font-weight:600; color:#b8960c; text-transform:uppercase; letter-spacing:1.5px;">${title}</h2>
      <p class="text-main" style="margin:0; font-size:15px; line-height:1.7; color:#333333;">
        ${text}
      </p>
    </td>
  </tr>`;
}

function renderOnMyDesk(onMyDesk?: { title: string; description: string; link?: string }[]): string {
    if (!onMyDesk || onMyDesk.length === 0) return '';
    const items = onMyDesk.map((item, index) => {
        const isLast = index === onMyDesk.length - 1;
        const divider = isLast ? '' : '<tr><td style="padding:0;"><div class="divider" style="height:1px; background-color:#f9f9f9; margin-top:4px; margin-bottom:4px;"></div></td></tr>';
        const titleMarkup = item.link 
            ? `<a href="${item.link}" class="text-main article-link" style="font-size:15px; font-weight:600; color:#0a0a0a; text-decoration:none;">${item.title} &rarr;</a>`
            : `<span class="text-main" style="font-size:15px; font-weight:600; color:#0a0a0a;">${item.title}</span>`;
        return `
        <tr>
          <td style="padding:8px 0;">
            ${titleMarkup}
            <br>
            <span class="text-sub" style="font-size:14px; color:#666666; line-height:1.6; display:inline-block; margin-top:2px;">${item.description}</span>
          </td>
        </tr>
        ${divider}`;
    }).join('');

    return `
  <!-- Divider -->
  <tr><td class="divider-pad" style="padding:0 40px;"><div class="divider" style="height:1px; background-color:#eeeeee;"></div></td></tr>
  <tr>
    <td class="content-pad" style="padding:32px 40px;">
      <h2 class="gold-accent" style="margin:0 0 16px 0; font-size:14px; font-weight:600; color:#b8960c; text-transform:uppercase; letter-spacing:1.5px;">On My Desk This Week</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        ${items}
      </table>
    </td>
  </tr>`;
}

function renderLatestResearch(posts: DigestPost[]): string {
    if (posts.length === 0) return '';
    const items = posts.map((post) => {
        const badgeText = post.premium ? 'Premium' : 'Research';
        const borderStyle = post.premium ? 'border-left:3px solid #b8960c;' : 'border-left:3px solid #e0e0e0;';
        const badgeColor = post.premium ? 'color:#b8960c;' : 'color:#888888;';
        const badgeClass = post.premium ? 'gold-accent' : 'text-sub';

        return `
      <a href="${post.url}" style="text-decoration:none; display:block;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" class="card-bg border-block article-link" style="margin-bottom:12px; border:1px solid #eeeeee;">
          <tr>
            <td style="padding:16px 20px; ${borderStyle} background-color:#fafafa;" class="card-bg">
              <div class="${badgeClass}" style="font-size:10px; ${badgeColor} font-weight:700; text-transform:uppercase; letter-spacing:1.5px; margin-bottom:6px;">${badgeText}</div>
              <div class="text-main" style="font-size:15px; font-weight:600; color:#0a0a0a; margin-bottom:4px;">${post.title}</div>
              <div class="text-sub" style="font-size:13px; color:#666666;">${post.description} &rarr;</div>
            </td>
          </tr>
        </table>
      </a>`;
    }).join('');

    return `
  <!-- Divider -->
  <tr><td class="divider-pad" style="padding:0 40px;"><div class="divider" style="height:1px; background-color:#eeeeee;"></div></td></tr>
  <tr>
    <td class="content-pad" style="padding:32px 40px 24px 40px;">
      <h2 class="gold-accent" style="margin:0 0 16px 0; font-size:14px; font-weight:600; color:#b8960c; text-transform:uppercase; letter-spacing:1.5px;">Latest Research</h2>
      ${items}
    </td>
  </tr>`;
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
        premium: post.data.premium,
    }
}

export function generateWelcomeEmail(firstName: string, siteUrl: string): string {
    const greeting = firstName ? `Hi ${firstName},` : 'Hi,';
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to the Readership</title>
  <style>
    body { margin:0; padding:0; background-color:#fbf9f4; font-family:-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing:antialiased; }
    table { border-collapse:collapse; }
    p { margin:0 0 16px 0; font-size:15px; line-height:1.7; color:#333333; }
    ol { margin:0 0 20px 0; padding-left:20px; }
    li { margin-bottom:12px; font-size:15px; line-height:1.7; color:#333333; }
    a { color:#b8960c; text-decoration:underline; }
    @media only screen and (max-width: 600px) {
      .container { width:100% !important; padding:10px !important; }
      .content-pad { padding:24px 20px !important; }
      .header-pad { padding:30px 20px 20px 20px !important; }
    }
  </style>
</head>
<body style="margin:0; padding:0; background-color:#fbf9f4;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#fbf9f4; padding:20px 0;">
    <tr>
      <td align="center">
        <!-- Main Box -->
        <table class="container" role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background-color:#ffffff; border:1px solid #e8e3d8; border-radius:4px; overflow:hidden;">
          
          <!-- Black Masthead Header -->
          <tr>
            <td class="header-pad" style="background-color:#0a0a0a; padding:45px 40px 35px 40px;" align="center">
              <a href="${siteUrl}" target="_blank" style="text-decoration:none;">
                <img src="https://vatsal.ca/logo.png" alt="Vatsal.ca Logo" width="64" style="display:block; border:none; margin-bottom:16px; max-width:64px; height:auto;">
              </a>
              <div style="font-size:12px; font-weight:700; color:#b8960c; letter-spacing:3px; text-transform:uppercase; margin-bottom:0;">WELCOME TO THE READERSHIP</div>
            </td>
          </tr>

          <!-- Main Content -->
          <tr>
            <td class="content-pad" style="padding:40px 40px 32px 40px;">
              <p style="font-size:16px; font-weight:600; color:#0a0a0a; margin-bottom:20px;">${greeting}</p>
              
              <p>Thank you for subscribing. You are officially plugged into a network of business leaders navigating market volatility.</p>
              
              <p style="margin-top:24px;">Moving forward, here is your roadmap for what is coming across your desk:</p>
              
              <ol style="margin-top:16px;">
                <li>
                  <strong style="color:#0a0a0a;">The Daily Alpha Pulse:</strong> Short, market briefings covering key risks, macro events, and daily trade catalysts.
                </li>
                <li>
                  <strong style="color:#0a0a0a;">VWAP (Weekly):</strong> A Sunday dispatch (Vatsal's Weekly Alpha Pulse) for when your mindset shifts from "weekend mode" back to "market prep mode." We set the table for the week ahead, detailing actionable trading strategies, cross-asset correlation shifts, and current market rotations. Each brief also includes upcoming earnings prep, options mechanics in Concept Corner, and a look at exactly what is on my reading desk.
                </li>
                <li>
                  <strong style="color:#0a0a0a;">Deep-Dive Engineering & Quant Blogs:</strong> Direct notifications whenever I publish a technical or research blog on system design, trade strategies, or AI/ML.
                </li>
              </ol>
              
              <p style="margin-top:24px;">Glad to have you on board.</p>
              
              <p style="margin-bottom:0;">
                Kind Regards,<br />
                <strong>Vatsal Sharma</strong><br />
                <a href="${siteUrl}" style="color:#b8960c; text-decoration:none; font-size:13px;">vatsal.ca</a>
              </p>
            </td>
          </tr>
          
          <!-- Cream Footer -->
          <tr>
            <td style="background-color:#fcfbf8; border-top:1px solid #eeeeee; padding:20px 40px; text-align:center;">
              <span style="font-size:11px; color:#888888;">
                You received this because you subscribed at <a href="${siteUrl}" style="color:#666666; text-decoration:underline;">vatsal.ca</a>.
              </span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
