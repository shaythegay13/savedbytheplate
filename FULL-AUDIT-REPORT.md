# Full SEO Audit Report — Saved by the Plate
**URL:** https://www.savedbytheplate.org
**Audit Date:** February 23, 2026
**Audited By:** Claude SEO Audit Agent

---

## Executive Summary

| Metric | Score |
|--------|-------|
| **Overall SEO Health Score** | **36 / 100** |
| Technical SEO | 30 / 100 |
| Content Quality | 65 / 100 |
| On-Page SEO | 20 / 100 |
| Schema / Structured Data | 0 / 100 |
| Performance (CWV) | 40 / 100 |
| Images | 65 / 100 |
| AI Search Readiness | 15 / 100 |

**Business Type Detected:** Nonprofit / Community Organization — Food Justice & Sustainable Agriculture
**Tech Stack:** Vite + React (CSR/SPA), TypeScript, React Router DOM, Tailwind CSS, Supabase, Google Gemini AI, Google Maps

### Top 5 Critical Issues
1. **Pure Client-Side Rendering (CSR)** — Search engines receive an empty `<div id="root">`. Content is invisible until JavaScript executes.
2. **No Per-Page Meta Tags** — Every URL shares the same `<title>` and `<meta description>` from `index.html`.
3. **No XML Sitemap** — Search engines must discover all pages through links alone.
4. **Zero Structured Data** — No JSON-LD, no Organization schema, no LocalBusiness, no BreadcrumbList.
5. **Only 1 Google-indexed Page** — `site:savedbytheplate.org` returns a single result, confirming severe indexation issues.

### Top 5 Quick Wins
1. Add `react-helmet-async` and set unique `<title>` + `<meta description>` per route (1–2 hours).
2. Create and publish `/public/sitemap.xml` listing all 13 routes (30 minutes).
3. Add `og:url` and `og:site_name` to `index.html` (10 minutes).
4. Add Organization JSON-LD to `index.html` (30 minutes, immediate schema signal).
5. Add `<link rel="preload">` for hero image to improve LCP (15 minutes).

---

## 1. Technical SEO — Score: 30/100

### Crawlability

| Check | Status | Notes |
|-------|--------|-------|
| robots.txt present | ✅ Pass | Allows all bots |
| Sitemap referenced in robots.txt | ❌ Fail | No `Sitemap:` directive |
| XML Sitemap exists | ❌ Fail | 404 on `/sitemap.xml` and `/sitemap_index.xml` |
| Googlebot can access all pages | ⚠️ Partial | Allowed, but content requires JS execution |
| AI bots (GPTBot, ClaudeBot) | ❌ Fail | Not listed in robots.txt (no explicit Allow) |

**robots.txt Assessment:**
```
Current:
  User-agent: Googlebot / Allow: /
  User-agent: Bingbot / Allow: /
  User-agent: Twitterbot / Allow: /
  User-agent: facebookexternalhit / Allow: /
  User-agent: * / Allow: /

Missing:
  - Sitemap: https://www.savedbytheplate.org/sitemap.xml
  - User-agent: GPTBot (OpenAI)
  - User-agent: ClaudeBot (Anthropic)
  - User-agent: PerplexityBot
  - User-agent: CCBot (Common Crawl)
```

### Indexability

| Check | Status | Notes |
|-------|--------|-------|
| `<html lang="">` attribute set | ✅ Pass | `lang="en"` in index.html |
| Canonical tags | ❌ Fail | Only on 2 pages (Terms/Legal), JS-dependent |
| noindex directives | ✅ Pass | None found (good) |
| Duplicate content risk | ⚠️ Warning | `/terms` and `/privacy` have identical routes as `/legal-terms` and `/legal-privacy` |
| HTTP → HTTPS redirect | ✅ Pass | Site serves HTTPS |
| www vs non-www | ⚠️ Unknown | Need to verify 301 redirect |
| 404 handling | ✅ Pass | NotFound component exists |

### Rendering

| Check | Status | Notes |
|-------|--------|-------|
| Rendering strategy | ❌ CSR | Client-Side Rendering only |
| Initial HTML content | ❌ Fail | Only `<div id="root"></div>` in initial HTML |
| SSR / SSG / ISR | ❌ None | Not implemented |
| Pre-rendering | ❌ None | No static pre-rendering |
| JavaScript required for content | ❌ Critical | 100% JS-dependent |

**Impact:** Googlebot can render JavaScript but uses a two-wave crawl process. Most pages are likely not indexed or indexed with stale content. Bing, DuckDuckGo, and AI crawlers have significantly less JS rendering capability.

### Security Headers
- No `Content-Security-Policy` header (typical for Vite SPAs)
- No `X-Frame-Options` (consider adding)
- HTTPS enforced ✅

---

## 2. Content Quality (E-E-A-T) — Score: 65/100

### Experience, Expertise, Authoritativeness, Trustworthiness

| Signal | Status | Notes |
|--------|--------|-------|
| Founder/team bios | ✅ Good | 9 team members with photos and bios on About page |
| Author attribution | ⚠️ Partial | No author tags on content pages |
| Contact information | ✅ Good | Email contact on Education page |
| Privacy Policy | ✅ Good | Comprehensive policy exists |
| Terms of Service | ✅ Good | Exists and is detailed |
| About Us page | ✅ Good | Mission, values, and team clearly described |
| External credentials | ⚠️ Weak | Partner logos present but no links to awards or press coverage |
| Nonprofit status | ⚠️ Missing | No 501(c)(3) mention or EIN visible |
| Physical address | ❌ Missing | No physical address found |

### Content Depth

| Page | Content Quality | Issues |
|------|----------------|--------|
| Homepage (`/`) | ⚠️ Thin | 3 feature cards + hero; lacks substantive text |
| Education (`/education`) | ✅ Good | Curriculum details, photos, program descriptions |
| About (`/about`) | ✅ Good | Mission, team, values |
| Local Food (`/local-food`) | ⚠️ Thin | Hub page with minimal content |
| Map (`/local-food/map`) | ⚠️ Dynamic | Content loaded from database; hard to index |
| Garden Planner | ⚠️ App-like | AI chat interface; no indexable content |
| Premium (`/premium`) | ⚠️ Thin | Pricing page, limited copy |
| Terms/Privacy | ✅ Present | Legal pages covered |

### Readability
- **Tone:** Accessible and community-focused ✅
- **Reading Level:** Appropriate for general audience ✅
- **Content Freshness:** Unknown — no publish/update dates visible ⚠️

---

## 3. On-Page SEO — Score: 20/100

### Meta Tags Audit

| Element | Status | Current Value |
|---------|--------|---------------|
| Title tag | ⚠️ Global only | "Saved by the Plate" (same for ALL pages) |
| Meta description | ⚠️ Global only | "Empowering individuals to make informed food choices..." (same for ALL pages) |
| og:title | ⚠️ Global only | "Saved by the Plate" |
| og:description | ⚠️ Global only | Same as meta description |
| og:image | ✅ Present | `/lovable-uploads/3f051535-dc60-4ced-bbc6-0fb3a2c1b104.png` |
| og:type | ✅ Present | `website` |
| og:url | ❌ Missing | Not set |
| og:site_name | ❌ Missing | Not set |
| twitter:card | ✅ Present | `summary_large_image` |
| twitter:title | ❌ Missing | Not set |
| twitter:description | ❌ Missing | Not set |
| twitter:site | ❌ Missing | Not set |
| canonical | ❌ Missing | Only on 2 pages, JS-dependent |

### Heading Structure (Homepage)

```
H1: "Grow Local, Eat Local" ✅ (one H1)
H2: "Discover What We Offer" ✅
H3: "Educational Programming" ✅
H3: "Ask Jane" ✅
H3: "Local Food Resources" ✅
```
- H1 presence: ✅ Good
- Keyword in H1: ⚠️ Weak — "Grow Local, Eat Local" is brand-aligned but lacks target keywords
- H1 uniqueness per page: ⚠️ Unknown (cannot verify CSR pages without rendering)

### Internal Linking

| Check | Status |
|-------|--------|
| Navigation links | ✅ Present in Navbar |
| Footer links | ⚠️ Unknown (Navbar component not fully reviewed) |
| Orphan pages | ⚠️ Risk — `/foraging-test`, `/coming-soon` may not be linked |
| Anchor text quality | ⚠️ Weak — "Contact us", "Explore resources", "Chat with Jane" are generic |

### URL Structure

| URL | Assessment |
|-----|-----------|
| `/` | ✅ Clean |
| `/local-food` | ✅ Descriptive |
| `/local-food/map` | ✅ Hierarchical |
| `/local-food/garden-planner` | ✅ Descriptive |
| `/education` | ✅ Clean |
| `/about` | ✅ Standard |
| `/foraging-test` | ⚠️ Unclear purpose |
| `/coming-soon` | ⚠️ Should be noindexed |

---

## 4. Schema / Structured Data — Score: 0/100

**No structured data found anywhere on the site.**

### Missing Schema Opportunities

| Schema Type | Priority | Pages |
|-------------|----------|-------|
| `Organization` | 🔴 Critical | Homepage, About |
| `NonprofitOrganization` | 🔴 Critical | Homepage |
| `WebSite` (with SearchAction) | 🔴 High | Homepage |
| `BreadcrumbList` | 🟡 High | All pages |
| `LocalBusiness` / `FoodEstablishment` | 🟡 High | Map, Local Food |
| `EducationalOrganization` | 🟡 High | Education page |
| `Course` | 🟡 Medium | Education page |
| `FAQPage` | 🟢 Medium | About, Education |
| `Person` (team bios) | 🟢 Low | About page |

### Recommended Organization Schema (for index.html)
```json
{
  "@context": "https://schema.org",
  "@type": ["Organization", "NonprofitOrganization"],
  "name": "Saved by the Plate",
  "url": "https://www.savedbytheplate.org",
  "logo": "https://www.savedbytheplate.org/lovable-uploads/[logo-file]",
  "description": "Empowering individuals to make informed food choices by connecting them to local food sources and sustainable agriculture education.",
  "sameAs": [],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "general inquiry",
    "availableLanguage": "English"
  }
}
```

---

## 5. Performance (Core Web Vitals) — Score: 40/100

**Note:** Lab data estimated from codebase analysis. Run Google PageSpeed Insights for real-world field data.

### Estimated Core Web Vitals

| Metric | Estimated | Threshold | Status |
|--------|-----------|-----------|--------|
| LCP (Largest Contentful Paint) | ~3.5–5s | < 2.5s Good | ❌ Needs Improvement |
| INP (Interaction to Next Paint) | ~100–200ms | < 200ms Good | ⚠️ Borderline |
| CLS (Cumulative Layout Shift) | ~0.05–0.15 | < 0.1 Good | ⚠️ Borderline |
| FCP (First Contentful Paint) | ~2.5–4s | < 1.8s Good | ❌ Needs Improvement |
| TTFB (Time to First Byte) | ~200–400ms | < 800ms Good | ✅ Pass |

### Performance Issues Found

**Critical:**
- Hero image loaded from Unsplash (external, no `<link rel="preload">`)
- No code splitting — all 14 route components loaded upfront
- No `loading="lazy"` on below-fold images
- No `React.lazy()` or `React.Suspense` for route-level splitting

**High:**
- Standard `<img>` tags instead of optimized image component
- No WebP/AVIF image formats
- `gpteng.co` third-party script in `<head>` (render-blocking potential)
- 31 local image assets not compressed or optimized

**Medium:**
- No service worker / PWA caching
- No resource hints (`dns-prefetch`, `preconnect`) for external resources (Supabase, Google APIs)

### Quick Performance Wins
```html
<!-- Add to index.html <head> -->
<link rel="preload" as="image" href="/assets/education-garden-1.jpg">
<link rel="preconnect" href="https://[your-supabase-url].supabase.co">
<link rel="preconnect" href="https://maps.googleapis.com">
<link rel="dns-prefetch" href="https://images.unsplash.com">
```

---

## 6. Images — Score: 65/100

### Image Audit Summary

| Check | Status | Count |
|-------|--------|-------|
| Alt text present | ✅ Good | ~85% of images have descriptive alt text |
| Lazy loading (`loading="lazy"`) | ❌ Missing | 0 images use lazy loading |
| WebP/AVIF format | ❌ Missing | All images are JPEG/PNG |
| External image dependency | ⚠️ Risk | Hero image served from Unsplash |
| Image dimensions specified | ⚠️ Partial | CSS sizing used, no explicit width/height |
| Decorative images with empty alt | ⚠️ Review | Background/decorative images need `alt=""` |

### Images with Good Alt Text (examples)
- `alt="Urban garden"` — hero background
- `alt="Youth education program in community garden"` — education section
- `alt="Community garden with labeled vegetable beds"` — local food section
- `alt="Shay Bouchles, Founder, President, and Executive Director"` — team photo

### Images Needing Review
- Background/decorative images in partner section
- Jane AI avatar images (multiple PNG variants)
- Inline SVG icons (already accessible via Lucide React)

---

## 7. AI Search Readiness — Score: 15/100

### AI Crawler Accessibility

| Bot | robots.txt Status | Can Access Content |
|-----|------------------|-------------------|
| GPTBot (OpenAI) | ⚠️ Not listed (falls under `*`) | ⚠️ Partial (JS rendering required) |
| ClaudeBot (Anthropic) | ⚠️ Not listed | ⚠️ Partial |
| PerplexityBot | ⚠️ Not listed | ⚠️ Partial |
| GoogleBot (AI Overview) | ✅ Allowed | ⚠️ Partial (JS rendering) |
| CCBot (Common Crawl / LLM training) | ⚠️ Not listed | ⚠️ Partial |

### AI Citability Assessment

| Signal | Status | Notes |
|--------|--------|-------|
| `llms.txt` file | ❌ Missing | Not present at `/llms.txt` |
| Factual, citable content | ⚠️ Partial | Good content exists but behind JS |
| Structured data for context | ❌ Missing | No JSON-LD for AI context |
| Author/organization attribution | ⚠️ Weak | About page has team info but not machine-readable |
| Statistics/data points | ⚠️ Weak | No quantifiable impact stats visible |
| Passage-level citability | ❌ Poor | JS rendering blocks passage extraction |

### Generative Engine Optimization (GEO) Gaps

1. **No `llms.txt`** — AI systems cannot discover a curated summary of your content
2. **CSR blocks AI citation** — LLMs crawling your site see only `<div id="root">`
3. **No statistics or impact data** — AI answers about food justice/urban agriculture favor sources with specific data points
4. **No FAQ schema** — Missed opportunity for AI Overview rich results
5. **No nonprofit/mission statement in structured data** — AI assistants can't easily surface your organization's mission

---

## 8. Duplicate Routes & URL Issues

| Issue | Routes | Recommendation |
|-------|--------|----------------|
| Duplicate legal pages | `/terms` = `/legal-terms`, `/privacy` = `/legal-privacy` | Choose one canonical URL; 301 redirect the other |
| Unaccessible/hidden route | `/foraging-test` | Add noindex or link from navigation |
| Placeholder page | `/coming-soon` | Add `<meta name="robots" content="noindex">` |
| Waiting list page | No visible route | Confirm it's intentionally hidden |

---

## 9. Analytics & Tracking

| Tool | Status |
|------|--------|
| Google Analytics 4 | ❌ Not found |
| Google Search Console | ❌ Not verified (no sitemap submitted) |
| Vercel Analytics | ❌ Not found |
| Bing Webmaster Tools | ❌ Not found |
| Lovable Tracking | ⚠️ Dev-only (lovable-tagger) |
| Stripe (payment analytics) | ✅ Present |
| Beehiiv (email analytics) | ✅ Present |
| Donately (donation analytics) | ✅ Present |

**Critical Gap:** No website analytics means you cannot measure organic traffic, page performance, or conversion from SEO improvements.

---

## 10. Competitor & Market Context

**Search Visibility:** Only 1 indexed page (homepage) per `site:` query — extremely low.

**Target Keywords (Inferred):**
- "food justice education" / "food sovereignty youth programs"
- "local food resources [city]" / "community garden map"
- "urban agriculture education"
- "AI garden planner" / "garden planning assistant"
- "food bank near me" / "community fridge [city]"

**Content Gap:** No blog, no news section, no case studies — major missed opportunity for long-tail keyword traffic and E-E-A-T building.

---

## SEO Health Score Breakdown

| Category | Weight | Raw Score | Weighted |
|----------|--------|-----------|---------|
| Technical SEO | 25% | 30 | 7.5 |
| Content Quality | 25% | 65 | 16.3 |
| On-Page SEO | 20% | 20 | 4.0 |
| Schema / Structured Data | 10% | 0 | 0.0 |
| Performance (CWV) | 10% | 40 | 4.0 |
| Images | 5% | 65 | 3.3 |
| AI Search Readiness | 5% | 15 | 0.75 |
| **TOTAL** | **100%** | — | **35.8 / 100** |

---

*Report generated by Claude SEO Audit | savedbytheplate.org | February 23, 2026*
