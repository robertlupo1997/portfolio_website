# Cloudflare as DNS + Hosting Platform for treylupo.com
## Research Analysis — May 2026

This document covers Cloudflare's role as both DNS provider and hosting platform for expanding
treylupo.com with many subdomains across potentially different tech stacks.

---

## 1. Cloudflare Pages vs Vercel

### Can Cloudflare Pages host a React + Vite site?

Yes, fully. Cloudflare has first-class support for Vite + React.

**Build settings in the Cloudflare Pages dashboard:**
- Framework preset: React (Vite) — or set manually
- Build command: `npm run build`
- Output directory: `dist`
- Node version: set via environment variable `NODE_VERSION=20` (or whatever you use)

**SPA routing:** Add a `_redirects` file in `/public`:
```
/* /index.html 200
```
Or in `wrangler.toml`:
```toml
[site]
not_found_handling = "single-page-application"
```

The Cloudflare Vite plugin (`@cloudflare/vite-plugin`) is optional — it lets you run your app
in the Workers runtime locally during dev and access Cloudflare bindings (KV, D1, etc.). For a
pure React SPA you don't need it.

### Performance comparison

| Metric | Cloudflare Pages | Vercel |
|---|---|---|
| Edge locations | 300+ data centers | ~30 regions |
| Global TTFB (avg) | ~45ms | ~80ms |
| Build times (React/Vite) | Comparable | Comparable |
| Cold starts (serverless) | Near-zero (V8 isolates) | Variable (Node.js) |

For a static React + Vite site (no SSR), both platforms perform comparably for US/EU audiences.
Cloudflare has a measurable advantage in Asia, South America, and Africa due to edge density.

### Developer experience tradeoffs

**Vercel advantages:**
- Best-in-class PR preview comments (posts URLs directly in GitHub PR)
- Tighter Next.js integration (not relevant for Vite)
- Slightly more polished dashboard and deployment logs
- 6,000 build minutes/month free (vs Cloudflare's 500 builds)
- Runtime logs retained for 1 hour (short, but better analytics tooling)

**Cloudflare Pages advantages:**
- Unlimited bandwidth (Vercel caps at 100 GB/month free)
- 300+ edge locations vs Vercel's ~30
- Entire ecosystem in one place: DNS, CDN, Workers, R2, D1, WAF
- No vendor lock-in on framework (Vercel's DX optimization favors Next.js)
- Pages + Workers integrates naturally for API routes
- Free tier is commercial use allowed (Vercel Hobby is non-commercial only — relevant once
  you put business-related content on the site)

**Cloudflare Pages disadvantages:**
- 500 builds/month shared across ALL projects in your account (see critical note below)
- WAF custom rules require paid plan
- Dashboard is improving but lags Vercel's UX polish

### The 500 builds/month constraint — critical for "expand massively"

The 500 monthly build limit is the single most important constraint for your use case. It is
**shared across all Cloudflare Pages projects in your account**.

Example: 8 subdomains, each with a CI/CD pipeline that builds on every push:
- Daily commits to 8 projects = 240 builds/month minimum
- With active development on multiple projects simultaneously, you can easily hit 500 in 2–3 weeks

At that point, all builds queue until the next month resets. Mitigation options:
- Only trigger builds on `main` pushes (not every branch)
- Use branch deploy controls in the Pages dashboard to limit preview builds
- Upgrade to Cloudflare Pages Pro ($25/month) which includes 5,000 builds/month
- Keep less-active subdomains on Cloudflare Pages and put active-development projects on Vercel

Vercel Hobby gives 6,000 build minutes/month (with 100 deployments/day cap), which is far more
permissive for active development workflows.

---

## 2. Cloudflare DNS Setup — Step-by-Step Migration

### Prerequisites

- A Cloudflare account (free tier works)
- Access to your domain registrar (whoever manages treylupo.com)
- Note your current DNS records before starting — export them

### Step 1: Add domain to Cloudflare

1. Log in at [dash.cloudflare.com](https://dash.cloudflare.com)
2. Click "Add a site" (top-right)
3. Enter `treylupo.com`
4. Select the **Free** plan
5. Cloudflare automatically scans your existing DNS records

### Step 2: Review scanned DNS records

Cloudflare will import records it finds. Verify:
- `A` or `CNAME` record for the root domain (`@`)
- Any existing `www`, `mail`, or other subdomains
- MX records (email) — critical to get right
- TXT records (SPF, DKIM, site verification)

Add any missing records before proceeding. Missing records = outage after nameserver switch.

### Step 3: Disable DNSSEC at your registrar (if active)

**Critical:** If DNSSEC is currently enabled at your registrar, disable it first. Switching
nameservers with DNSSEC active will make your domain unreachable. Wait for TTL to expire
(usually a few hours) after disabling.

### Step 4: Note your assigned Cloudflare nameservers

After step 1, Cloudflare displays two nameservers specific to your account, e.g.:
```
aria.ns.cloudflare.com
ben.ns.cloudflare.com
```
The names vary per account — use the ones shown in your dashboard Overview.

### Step 5: Lower TTL at current provider (optional but recommended)

24–48 hours before switching, set TTL to 300 seconds (5 minutes) on your current DNS provider.
This minimizes propagation time and potential downtime window.

### Step 6: Update nameservers at your registrar

Log into your domain registrar (GoDaddy, Namecheap, Google Domains, Squarespace, etc.):
- Find "DNS Management" or "Nameserver Settings"
- Remove existing nameservers
- Add the two Cloudflare nameservers exactly as shown
- Save

### Step 7: Wait for propagation

- Cloudflare email confirmation: usually 1–24 hours
- Global DNS propagation: up to 48 hours (typically much faster)
- Status changes to "Active" in Cloudflare dashboard

Verify with: `dig NS treylupo.com` or [whatsmydns.net](https://whatsmydns.net)

### Adding CNAME records for subdomains

Once Cloudflare is your DNS provider, all record management happens in the Cloudflare dashboard
under DNS > Records.

**Example records for different hosts:**

| Subdomain | Type | Name | Target | Proxy status |
|---|---|---|---|---|
| docs.treylupo.com | CNAME | docs | yourproject.pages.dev | Proxied (orange) |
| blog.treylupo.com | CNAME | blog | yourproject.pages.dev | Proxied (orange) |
| app.treylupo.com | CNAME | app | cname.vercel-dns.com | DNS only (grey) |
| api.treylupo.com | CNAME | api | yourworker.workers.dev | Proxied (orange) |
| lab.treylupo.com | CNAME | lab | myapp.up.railway.app | DNS only (grey) |

Proxy status (orange cloud) routes traffic through Cloudflare's CDN and applies DDoS/WAF
protection. DNS only (grey cloud) resolves directly to the target without Cloudflare proxying.

---

## 3. Cloudflare Pages — Multiple Projects on Subdomains

### How it works

Yes, you can host multiple independent Pages projects on different subdomains of the same domain.
Each project gets its own Git repository, build pipeline, and deployment.

**The process for each subdomain:**

1. Create a new Pages project in the dashboard (connect a GitHub repo)
2. Go to the project > Settings > Custom Domains > "Set up a domain"
3. Enter the subdomain (e.g., `docs.treylupo.com`)
4. Cloudflare automatically creates the CNAME record in your DNS zone

**Critical requirement:** You MUST go through the "Add a custom domain" flow in the Pages
dashboard. Do NOT manually add a CNAME record in DNS pointing to `yourproject.pages.dev` without
first completing the dashboard flow. Doing so results in a 522 error. The Pages dashboard handles
certificate provisioning and routing — the manual CNAME alone is insufficient.

### Limits per project

- 100 custom domains per project (Free tier)
- Projects: soft limit of 100 per account
- The 500 builds/month is shared across all projects (see Section 1 for implications)

### Example architecture for treylupo.com subdomains on Pages

```
treylupo.com        → Pages project: portfolio (main site)
docs.treylupo.com   → Pages project: docs-site (separate repo)
blog.treylupo.com   → Pages project: blog (separate repo)
lab.treylupo.com    → Pages project: lab-experiments (separate repo)
```

Each project is fully independent with its own deployments, previews, and environment variables.

---

## 4. Hybrid Architecture — Cloudflare DNS + Mixed Hosts

### Yes, this is the recommended pattern

Using Cloudflare as your authoritative DNS while pointing different subdomains at different
hosting platforms is standard practice and works well. Cloudflare as DNS is the control plane;
each subdomain's CNAME points to wherever that service is actually hosted.

### The orange cloud vs grey cloud decision (critical for Vercel)

This is the most important operational detail in a hybrid setup:

**For subdomains pointing to Cloudflare Pages or Workers:**
- Use orange cloud (Proxied) — traffic routes through Cloudflare, gets CDN + DDoS + WAF

**For subdomains pointing to Vercel:**
- Use grey cloud (DNS only) — set the CNAME to `cname.vercel-dns.com` as DNS only
- Reason: Cloudflare proxying in front of Vercel causes Vercel to display a "reverse proxy
  detected" warning, breaks Vercel's own DDoS/caching layer, and hides real client IPs from
  Vercel's analytics
- You lose Cloudflare's CDN/DDoS protection on those subdomains, but Vercel provides its own

**For subdomains pointing to Railway:**
- Railway provides a CNAME target (e.g., `myapp.up.railway.app`)
- Can use either grey or orange cloud — orange cloud works but adds latency for server-rendered
  apps; prefer grey cloud for Railway backend services

**For subdomains pointing to Streamlit:**
- Streamlit Cloud does NOT support real custom domains. You can only set a custom subdomain
  under `*.streamlit.app`. You cannot CNAME your own domain to a Streamlit Cloud deployment.
- To have `demos.treylupo.com` pointing to a Streamlit app, you need to self-host the Streamlit
  app on a platform that supports custom domains: Railway, Fly.io, a VPS, or a Docker container
  on any host. Then CNAME your subdomain to that host.

### Worked example: hybrid setup for treylupo.com

```
# Cloudflare Pages (orange cloud - fully proxied)
treylupo.com         → Pages project (portfolio)
docs.treylupo.com    → Pages project (documentation)
blog.treylupo.com    → Pages project (blog)

# Vercel (grey cloud - DNS only)
app.treylupo.com     → CNAME → cname.vercel-dns.com

# Railway (grey cloud preferred)
api.treylupo.com     → CNAME → yourservice.up.railway.app

# Cloudflare Worker (orange cloud)
edge.treylupo.com    → Worker (redirects, auth proxy, edge logic)

# Self-hosted Streamlit on Railway or Fly.io
demos.treylupo.com   → CNAME → yourapp.fly.dev or yourapp.railway.app
```

---

## 5. Cloudflare Workers — When to Use Them

### What Workers are

Cloudflare Workers are serverless JavaScript/TypeScript functions that run at Cloudflare's edge
(300+ locations). They use V8 isolates — near-zero cold starts, no Node.js runtime.

**Free tier:** 100,000 requests/day (resets daily at 00:00 UTC), 10ms CPU time per invocation.

Workers are the right tool for:

### Useful for subdomain expansion

**Redirects and URL routing:**
```javascript
export default {
  async fetch(request) {
    const url = new URL(request.url);
    // Redirect old URLs to new subdomains
    if (url.pathname.startsWith('/docs')) {
      return Response.redirect('https://docs.treylupo.com' + url.pathname.slice(5), 301);
    }
    return fetch(request);
  }
}
```

**Edge authentication / access control:**
Check auth tokens at the edge before the request reaches your origin server.

**API proxy / CORS headers:**
Add CORS headers to responses from third-party APIs without exposing API keys in the browser.

**A/B testing:**
Route a percentage of traffic to a different Pages deployment or Workers response.

**Dynamic redirects for subdomain management:**
As you add subdomains, a single Worker can handle routing logic centrally.

### Workers vs Pages Functions

Pages Functions are Workers under the hood — same V8 runtime, same limits. The difference is
operational:
- **Pages Functions** live inside your Pages project (`/functions` directory), colocated with
  your static assets. Good for API routes within a site.
- **Workers** are standalone, deployed independently, and can handle any URL pattern or custom
  domain. Better for cross-subdomain logic, standalone APIs, or complex routing.

### The 10ms CPU limit matters for API use cases

10ms CPU time per invocation (free tier) is sufficient for:
- Redirects
- Header manipulation
- Simple auth token validation
- KV lookups
- Fetch-and-return proxying

It is NOT sufficient for:
- CPU-heavy computation (data processing, ML inference)
- Large dataset transformations
- Complex cryptography

For an `api.treylupo.com` that does significant computation, you need either the Workers Paid
plan ($5/month, 30s CPU per invocation) or a backend service on Railway/Fly.io.

---

## 6. SSL/TLS and Security on Cloudflare Free Tier

### SSL/TLS

**Universal SSL:** Included free. Cloudflare automatically provisions a certificate for your
domain and all proxied subdomains. No configuration needed.

**Modes:**
- `Flexible` — encrypts browser-to-Cloudflare, Cloudflare-to-origin is plain HTTP
- `Full` — encrypts both legs (origin cert can be self-signed)
- `Full (strict)` — encrypts both legs, origin cert must be valid
- **Recommended:** `Full (strict)` if your origin supports it (Cloudflare Pages and Workers do)

For Pages-hosted subdomains, Cloudflare handles both the edge and origin certificate automatically.
For grey-cloud subdomains (Vercel, Railway), SSL is handled by those platforms — Cloudflare's
cert doesn't apply since traffic isn't proxied.

### DDoS Protection

- **L3/L4 DDoS mitigation:** Included free, unmetered. Cloudflare absorbs volumetric attacks
  (bandwidth floods, SYN floods) automatically.
- **L7 application-layer DDoS:** Basic protection included free. Advanced DDoS rules require
  Business/Enterprise plan.

### WAF (Web Application Firewall)

**Free tier includes:**
- Basic WAF with Cloudflare-managed rules (common CVEs, OWASP top 10 patterns)
- 5 Page Rules

**Free tier does NOT include:**
- Custom WAF rules (require Pro plan at $20/month)
- Rate limiting rules
- Bot Fight Mode is available free for some protections

For a portfolio/developer site, the free tier WAF is adequate.

### Additional free security features

- HSTS (HTTP Strict Transport Security) — configurable
- Automatic HTTPS rewrites
- Hotlink protection
- Browser Integrity Check (blocks known malicious bots)

---

## 7. Best Practice Recommendation

### For "expand massively" with many subdomains, each a different tech stack

**Recommended architecture: Cloudflare DNS + hybrid hosting**

Migrate DNS to Cloudflare immediately — this is a no-brainer regardless of where you host.
Cloudflare as DNS is free, gives you one control plane for all subdomains, instant CNAME additions,
and universal SSL for proxied subdomains.

For hosting, use the right platform for each subdomain's needs:

| Subdomain type | Recommended host | Why |
|---|---|---|
| Static/SPA sites (portfolio, blog, docs) | Cloudflare Pages | Free bandwidth, edge CDN, stays within one ecosystem |
| Active-development Next.js apps | Vercel | Next.js is Vercel's native platform |
| Backend APIs (Node, Python, Go) | Railway or Fly.io | Real compute, no cold starts, easy deploy |
| Edge logic (redirects, auth, routing) | Cloudflare Workers | 100K req/day free, zero cold starts, colocated with DNS |
| Streamlit demos | Self-host on Railway/Fly | Streamlit Cloud doesn't support custom domains |
| Databases / KV / object storage | Cloudflare D1 / KV / R2 | Free tier is generous; integrates with Workers and Pages |

### Architectural decision tree

```
Does the project build to static files? (React/Vite, Astro, Hugo, etc.)
  YES → Cloudflare Pages
  NO → Is it Next.js with SSR/ISR?
         YES → Vercel
         NO → Is it a Python/Node backend?
                YES → Railway or Fly.io
                NO → Is it edge logic/redirects?
                       YES → Cloudflare Workers
```

### Scaling beyond the free tier

The two free tier limits you'll hit first with active expansion:
1. **Cloudflare Pages: 500 builds/month** across all projects. Once you have 5+ active repos
   each deploying on commits, you'll bump into this. Solution: upgrade Pages to Pro ($25/month)
   for 5,000 builds, or strategically keep some projects on Vercel Hobby.
2. **Vercel Hobby bandwidth: 100 GB/month.** If any Vercel-hosted subdomain gets meaningful
   traffic, upgrade to Pro ($20/month) or migrate that subdomain to Cloudflare Pages.

### Avoid: Pure single-platform if you're mixing stacks

Forcing everything onto one platform creates artificial constraints. A Python Streamlit app
doesn't belong on Cloudflare Pages (can't host it). A Next.js app on Cloudflare Pages requires
an adapter and loses some features. Use the right tool.

---

## 8. Cost Comparison

### Free tier head-to-head

| Feature | Cloudflare Pages (Free) | Vercel Hobby (Free) |
|---|---|---|
| **Bandwidth** | Unlimited | 100 GB/month |
| **Builds/month** | 500 (shared across all projects) | 6,000 build minutes |
| **Concurrent builds** | 1 | 1 |
| **Deployments/day** | Unlimited (build limit applies) | 100 |
| **Projects** | 100 (soft limit) | 200 |
| **Custom domains per project** | 100 | 50 |
| **Preview deployments** | Yes (unlimited active) | Yes |
| **PR comments with preview URL** | Yes | Yes |
| **Commercial use** | Yes | No (personal/non-commercial only) |
| **Serverless functions** | Via Workers (100K req/day shared) | 1M invocations/month included |
| **File limit per site** | 20,000 files, 25 MB max per file | 100 MB source upload limit |
| **Build timeout** | 20 minutes | 45 minutes |

### Cloudflare Workers (Free tier, separate from Pages)

- 100,000 requests/day (not per month — resets daily)
- 10ms CPU time per invocation
- 1 GB Workers KV storage
- 5 MB R2 storage per operation (10 GB total/month)
- 5 GB D1 database storage

### Paid tier comparison (when you outgrow free)

| Tier | Price | Key upgrade |
|---|---|---|
| Cloudflare Pages Pro | $25/month | 5,000 builds/month, 5 concurrent builds |
| Cloudflare Workers Paid | $5/month | 10M requests/month, 30s CPU per invocation |
| Vercel Pro | $20/month/user | 1 TB bandwidth, 24,000 build minutes, unlimited projects |

**For a portfolio expanding to 8–10 subdomains with moderate traffic:**
- Stay on Cloudflare Pages free for static subdomains
- Add Workers Paid ($5/month) when the 100K requests/day limit becomes a constraint
- Cloudflare Pro total is typically cheaper than Vercel Pro for the same scale

---

## Summary: Action Plan for treylupo.com

### Phase 1: Migrate DNS to Cloudflare (do this first, ~30 minutes)

1. Create Cloudflare account, add `treylupo.com`
2. Cloudflare scans existing DNS — verify all records are correct
3. If DNSSEC is on at registrar, disable it first
4. Update nameservers at your registrar to Cloudflare's assigned pair
5. Wait for propagation (Cloudflare emails you when active)
6. Existing Vercel deployment continues working — just point the CNAME for `treylupo.com` and
   `www.treylupo.com` to `cname.vercel-dns.com` as **DNS only (grey cloud)**

### Phase 2: Add each new subdomain as it's created

For a Cloudflare Pages subdomain:
```
1. Create Pages project → connect GitHub repo
2. Set build command + output dir
3. In Pages dashboard: Custom Domains → "Set up a domain" → enter docs.treylupo.com
4. Cloudflare auto-creates the DNS record (proxied, orange cloud)
```

For a Vercel subdomain:
```
1. Deploy on Vercel
2. In Vercel: Settings → Domains → Add domain → enter app.treylupo.com
3. In Cloudflare DNS: add CNAME app → cname.vercel-dns.com → DNS only (grey cloud)
```

For a Railway subdomain:
```
1. Deploy on Railway
2. In Railway: Settings → Domains → Add custom domain
3. Railway gives you a CNAME target (e.g., myapp.up.railway.app)
4. In Cloudflare DNS: add CNAME lab → myapp.up.railway.app → grey cloud (or orange)
```

For a Cloudflare Worker:
```
1. Deploy worker with wrangler
2. In Workers dashboard: Settings → Triggers → Custom Domains → Add domain
3. Cloudflare handles the DNS and routing automatically
```

### Key things to remember

- Do NOT manually add DNS CNAMEs for Pages subdomains before completing the Pages Custom Domain
  flow — results in 522 errors
- Vercel subdomains must be grey cloud (DNS only) in Cloudflare DNS
- The 500 builds/month limit is shared — plan deployment frequency accordingly
- Streamlit Cloud cannot be used with custom domains — use Railway or Fly.io to self-host
  Streamlit if you want demos.treylupo.com
- Workers free tier CPU limit (10ms) means Workers are for routing/proxy logic, not heavy compute
- Cloudflare Pages commercial use allowed; Vercel Hobby is non-commercial only

---

*Sources consulted:*
- [Cloudflare Pages limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Cloudflare Workers pricing](https://developers.cloudflare.com/workers/platform/pricing/)
- [Cloudflare DNS full setup](https://developers.cloudflare.com/dns/zone-setups/full-setup/setup/)
- [Cloudflare free plan overview](https://www.cloudflare.com/plans/free/)
- [Vercel Hobby plan docs](https://vercel.com/docs/plans/hobby)
- [Cloudflare Pages React guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-react-site/)
- [Cloudflare Pages vs Vercel 2026](https://thesoftwarescout.com/vercel-vs-cloudflare-pages-2026-which-deployment-platform-should-you-choose/)
- [Hybrid DNS with Cloudflare + Vercel](https://knowledge.buka.sh/avoiding-vercels-reverse-proxy-warning-when-using-cloudflare-dns/)
- [Cloudflare Pages vs Workers](https://www.justaftermidnight247.com/insights/cloudflare-pages-vs-workers-which-one-should-you-use/)
