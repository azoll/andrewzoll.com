// Cloudflare Pages Function: date-gates blog posts.
// Each post URL returns a "Coming on <Date>" placeholder until its publish date.
// On and after the publish date, the static HTML is served as-is.

const SCHEDULE = {
  // Already-published posts (visible immediately).
  "ai-consultant-pricing-small-business": "2026-05-19",
  "3-step-ai-workflow-pattern": "2026-05-19",
  "ai-audit-vs-ai-consultant": "2026-05-20",
  "how-to-automate-quoting-small-business": "2026-05-20",
  "chatgpt-vs-claude-small-business": "2026-05-20",

  // 13-week scheduled posts.
  "ai-customer-follow-up-automation": "2026-05-25",
  "zapier-vs-make-vs-n8n": "2026-06-01",
  "5-ai-workflows-service-business": "2026-06-08",
  "ai-email-management-small-business": "2026-06-15",
  "ai-for-electricians-trade-contractors": "2026-06-22",
  "build-ai-agent-without-developer": "2026-06-29",
  "what-ai-audit-deliverable-looks-like": "2026-07-06",
  "why-diy-ai-projects-stall": "2026-07-13",
  "ai-sales-tools-small-business": "2026-07-20",
  "ai-client-onboarding-15-minutes": "2026-07-27",
  "multi-agent-ai-small-business": "2026-08-03",
  "ai-for-real-estate-teams": "2026-08-10",
  "60-day-ai-implementation-playbook": "2026-08-17",
};

function todayMountain() {
  // Date comparison uses America/Denver so posts go live at 00:00 MT on the
  // labeled publish date, not 00:00 UTC (which would be the evening before).
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Denver",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year").value;
  const m = parts.find((p) => p.type === "month").value;
  const d = parts.find((p) => p.type === "day").value;
  return `${y}-${m}-${d}`;
}

function formatFriendly(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  return `${months[m - 1]} ${d}, ${y}`;
}

function placeholderHtml(publishDate) {
  const friendly = formatFriendly(publishDate);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <meta name="robots" content="noindex,nofollow"/>
  <title>Coming ${friendly} · Andrew Zoll</title>
  <link rel="icon" href="/assets/favicon-primary.png"/>
  <style>
    html,body{margin:0;padding:0;background:#fff;color:#0B1A36;font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;height:100%;}
    .nav{display:flex;justify-content:space-between;align-items:center;padding:24px;border-bottom:1px solid #E8E9EB;}
    .nav a{font-size:14px;font-weight:500;color:#0B1A36;text-decoration:none;}
    .nav .logo img{height:24px;display:block;}
    .wrap{max-width:640px;margin:0 auto;padding:160px 24px 80px;text-align:center;}
    .eyebrow{font-size:12px;font-weight:600;letter-spacing:0.2em;text-transform:uppercase;color:#2F5D3E;margin-bottom:24px;}
    h1{font-size:clamp(32px,4.5vw,48px);font-weight:700;line-height:1.1;letter-spacing:-0.03em;margin:0 0 20px;color:#0B1A36;}
    p{font-size:18px;line-height:1.6;color:#5E6169;margin:0 0 32px;}
    a.btn{display:inline-block;background:#0F2144;color:#fff;text-decoration:none;font-weight:600;font-size:14px;padding:14px 24px;border-radius:6px;}
    .links{margin-top:48px;font-size:14px;color:#888C94;}
    .links a{color:#2F5D3E;text-decoration:none;margin:0 8px;}
  </style>
</head>
<body>
  <div class="nav">
    <a href="/" class="logo"><img src="/assets/logo-primary.png" alt="Andrew Zoll"/></a>
    <a href="/#book">Book the audit →</a>
  </div>
  <div class="wrap">
    <div class="eyebrow">Coming Soon</div>
    <h1>This post goes live ${friendly}.</h1>
    <p>You found it early. Check back on the publish date for the full piece. In the meantime, the audit page is open.</p>
    <a class="btn" href="/blog/">← Back to the blog</a>
    <div class="links">
      <a href="/audit/">The audit</a> · <a href="/os-builder/">OS Builder</a> · <a href="/services/">Services</a>
    </div>
  </div>
</body>
</html>`;
}

export async function onRequest(context) {
  const { params, env, request } = context;
  const slug = params.slug;
  const publishDate = SCHEDULE[slug];

  // Unknown slug: let the static handler return a normal 404.
  if (!publishDate) {
    return env.ASSETS.fetch(request);
  }

  // If the publish date is today or earlier (Mountain Time), serve the real page.
  if (todayMountain() >= publishDate) {
    return env.ASSETS.fetch(request);
  }

  // Otherwise return the "Coming Soon" placeholder.
  return new Response(placeholderHtml(publishDate), {
    status: 200,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "x-robots-tag": "noindex, nofollow",
      "cache-control": "public, max-age=300",
    },
  });
}
