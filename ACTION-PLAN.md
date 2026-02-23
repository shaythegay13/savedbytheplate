# SEO Action Plan — Saved by the Plate
**Generated:** February 23, 2026 | **Last Updated:** February 23, 2026 (Schema + Sitemap + GEO pass)
**Current Score:** SEO 36/100 | GEO 22/100 | **Target:** SEO 80+/100 | GEO 65+/100

---

## Reference Files
| File | Purpose |
|------|---------|
| [FULL-AUDIT-REPORT.md](FULL-AUDIT-REPORT.md) | Full SEO findings by category |
| [SCHEMA-REPORT.md](SCHEMA-REPORT.md) | Schema detection results and implementation guide |
| [generated-schema.json](generated-schema.json) | Production-ready JSON-LD for all pages |
| [GEO-ANALYSIS.md](GEO-ANALYSIS.md) | AI search readiness deep-dive |
| [STRUCTURE.md](STRUCTURE.md) | Sitemap architecture documentation |
| [public/sitemap.xml](public/sitemap.xml) | ✅ Generated — ready to deploy |
| [public/robots.txt](public/robots.txt) | ✅ Updated — AI bots + sitemap reference added |

---

## Priority Legend
- 🔴 **Critical** — Blocks indexing or causes major ranking loss. Fix immediately.
- 🟠 **High** — Significant ranking impact. Fix within 1 week.
- 🟡 **Medium** — Optimization opportunity. Fix within 1 month.
- 🟢 **Low** — Nice to have. Add to backlog.

---

## 🔴 CRITICAL (Fix This Week)

### C1. Add Per-Page Meta Tags with react-helmet-async
**Impact:** On-Page SEO 20→65 | Effort: Medium (3–4 hours)

Every page currently shares the same title and meta description. This is the single highest-impact fix.

**Install:**
```bash
npm install react-helmet-async
```

**Wrap app in `src/main.tsx`:**
```tsx
import { HelmetProvider } from 'react-helmet-async';

<HelmetProvider>
  <App />
</HelmetProvider>
```

**Add to each page component:**
```tsx
import { Helmet } from 'react-helmet-async';

// In Index.tsx
<Helmet>
  <title>Saved by the Plate — Grow Local, Eat Local</title>
  <meta name="description" content="Connecting communities with sustainable food options and local agriculture education, starting with youth in New York City." />
  <meta property="og:title" content="Saved by the Plate — Grow Local, Eat Local" />
  <meta property="og:url" content="https://www.savedbytheplate.org/" />
  <link rel="canonical" href="https://www.savedbytheplate.org/" />
</Helmet>

// In Education.tsx
<Helmet>
  <title>Youth Food Education Programs — Food Justice & Urban Agriculture | Saved by the Plate</title>
  <meta name="description" content="Customizable 6-week programs for youth exploring food justice, community gardens, composting, and urban agriculture in New York City. In-school and after-school programs available." />
  <link rel="canonical" href="https://www.savedbytheplate.org/education" />
</Helmet>

// In AboutUs.tsx
<Helmet>
  <title>About Saved by the Plate — NYC Food Justice Nonprofit</title>
  <meta name="description" content="Learn about our mission to empower NYC communities through sustainable food education. Meet our founder Shay Bouchles and leadership team." />
  <link rel="canonical" href="https://www.savedbytheplate.org/about" />
</Helmet>

// In LocalFood.tsx
<Helmet>
  <title>Local Food Resources NYC — Gardens, Markets & Food Banks | Saved by the Plate</title>
  <meta name="description" content="Find community gardens, farmers markets, food banks, community fridges, and urban farms near you in New York City." />
  <link rel="canonical" href="https://www.savedbytheplate.org/local-food" />
</Helmet>

// In Map.tsx
<Helmet>
  <title>NYC Food Map — Find Local Food Resources Near You | Saved by the Plate</title>
  <meta name="description" content="Interactive map of community gardens, farmers markets, food banks, community fridges, and urban farms across New York City." />
  <link rel="canonical" href="https://www.savedbytheplate.org/local-food/map" />
</Helmet>

// In GardenPlan.tsx
<Helmet>
  <title>Ask Jane — AI Garden Planning Assistant | Saved by the Plate</title>
  <meta name="description" content="Get personalized gardening advice and custom growing plans from Jane, your AI-powered garden assistant. Free 2-day trial." />
  <link rel="canonical" href="https://www.savedbytheplate.org/local-food/garden-planner" />
</Helmet>

// In Premium.tsx
<Helmet>
  <title>Premium Plans — Full Access to AI Garden Planner | Saved by the Plate</title>
  <meta name="description" content="Unlock full access to Ask Jane AI garden planning, expanded local food resources, and educator tools. Plans from $8/month." />
  <link rel="canonical" href="https://www.savedbytheplate.org/premium" />
</Helmet>

// In ComingSoon.tsx + Auth.tsx + ForagingTest.tsx
<Helmet>
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
```

---

### C2. XML Sitemap ✅ GENERATED
**Impact:** Technical SEO +15 points | Status: File created at `public/sitemap.xml`

The sitemap has been generated with 9 indexable URLs (Google-standard format — no `priority` or `changefreq`, which are ignored by Google).

**Excluded from sitemap:** `/auth`, `/profile`, `/coming-soon`, `/foraging-test`, `/legal-terms`, `/legal-privacy`, `/waiting-list`

See [STRUCTURE.md](STRUCTURE.md) for full architecture documentation and optional `vite-plugin-sitemap` automation.

**Next step:** After deploying, submit `https://www.savedbytheplate.org/sitemap.xml` in Google Search Console.

---

### C3. robots.txt ✅ UPDATED
**Status:** `public/robots.txt` has been updated with:
- AI crawler entries (GPTBot, ClaudeBot, PerplexityBot, CCBot)
- Sitemap reference: `Sitemap: https://www.savedbytheplate.org/sitemap.xml`

---

### C4. Add Organization + WebSite JSON-LD Schema
**Impact:** Schema 0→40, GEO +3 points | Effort: Low (30 minutes)
**Source:** See `generated-schema.json` → `homepage` key for the full production schema.

Add TWO `<script type="application/ld+json">` blocks to `index.html` inside `<head>`. Use the schemas exactly as written in [generated-schema.json](generated-schema.json) — they include `@id` cross-referencing, `NonprofitOrganization` type, founder details, and contact point.

**Required before deploying:** Fill in the `[FILL: ...]` placeholders:
- `foundingDate` — year organization was founded
- `telephone` — if a public phone number exists
- `address` — street address if publicly listed
- `sameAs` — social media profile URLs (Facebook, Instagram, LinkedIn, etc.)

---

### C5. Noindex Non-Public Pages
**Impact:** Technical SEO | Effort: Low (15 minutes)

Add `<meta name="robots" content="noindex, nofollow">` via react-helmet-async (from C1) to:
- `ComingSoon.tsx`
- `Auth.tsx`
- `ForagingTest.tsx`
- `WaitingList.tsx`

---

## 🟠 HIGH (Fix Within 1 Week)

### H1. Submit to Google Search Console
**Impact:** Indexation foundation | Effort: 1 hour

1. Go to [Google Search Console](https://search.google.com/search-console)
2. Add property for `https://www.savedbytheplate.org`
3. Verify ownership via HTML meta tag (add to `index.html` via react-helmet-async)
4. Submit sitemap: `https://www.savedbytheplate.org/sitemap.xml`
5. Use "URL Inspection" to request indexing for: `/`, `/about`, `/education`, `/local-food`, `/local-food/map`

---

### H2. Add Google Analytics 4
**Impact:** Measurement (can't improve what you can't measure) | Effort: 1 hour

Add to `index.html` (replace `G-XXXXXXXXXX` with your Measurement ID):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

### H3. Performance — Hero Image Preload + Lazy Loading
**Impact:** LCP improvement (estimated 3.5s → <2.5s) | Effort: 30 minutes

Add to `index.html` `<head>`:
```html
<link rel="preload" as="image" href="/assets/education-garden-1.jpg">
<link rel="preconnect" href="https://[your-supabase-project].supabase.co" crossorigin>
<link rel="preconnect" href="https://maps.googleapis.com" crossorigin>
<link rel="dns-prefetch" href="https://images.unsplash.com">
```

Add `loading="lazy"` and explicit `width`/`height` to all below-fold `<img>` tags across all page components.

---

### H4. Fix og:url, og:site_name, og:locale
**Impact:** Social sharing + AI citability signals | Effort: 15 minutes

Update `index.html` global OG tags:
```html
<meta property="og:url" content="https://www.savedbytheplate.org/" />
<meta property="og:site_name" content="Saved by the Plate" />
<meta property="og:locale" content="en_US" />
<meta name="twitter:site" content="@[your-twitter-handle]" />
```
Per-page `og:url` values will be set by react-helmet-async (C1).

---

### H5. Noindex Functional Auth-Flow Legal Routes
**Impact:** Canonicalization, crawl budget | Effort: 15 minutes

`/legal-terms` and `/legal-privacy` are **intentional routes** used in the authenticated/subscription user flow to serve terms and privacy content without exposing premium areas. They should not be removed.

**Fix:** Add `noindex` + canonical pointing to the public versions, so search engines ignore them while they remain fully functional:

```tsx
// In LegalTerms.tsx
<Helmet>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href="https://www.savedbytheplate.org/terms" />
</Helmet>

// In LegalPrivacy.tsx
<Helmet>
  <meta name="robots" content="noindex, nofollow" />
  <link rel="canonical" href="https://www.savedbytheplate.org/privacy" />
</Helmet>
```

Also update the checklist item below accordingly.

---

### H6. Publish llms.txt for AI Discoverability
**Impact:** GEO +5 points — immediate AI crawler discoverability | Effort: 15 minutes

This is the only fix that helps AI engines right now, given the CSR constraint. Create `public/llms.txt` with the full content from [GEO-ANALYSIS.md](GEO-ANALYSIS.md) Section 2. It provides AI crawlers a static, machine-readable summary of the organization even when JS rendering fails.

Key sections to include: organization description, program summaries, key page links, contact info, and leadership name.

---

## 🟡 MEDIUM (Fix Within 1 Month)

### M1. Implement Route-Level Code Splitting
**Impact:** Performance (LCP, bundle size) | Effort: 2 hours

All 14 route components are currently bundled together. Lazy-loading splits them into separate chunks:
```tsx
import { lazy, Suspense } from 'react';

const Index = lazy(() => import('./pages/Index'));
const Education = lazy(() => import('./pages/Education'));
const AboutUs = lazy(() => import('./pages/AboutUs'));
const LocalFood = lazy(() => import('./pages/LocalFood'));
const Map = lazy(() => import('./pages/Map'));
const GardenPlan = lazy(() => import('./pages/GardenPlan'));
// ... all other pages

<Suspense fallback={<div className="min-h-screen" />}>
  <Routes>
    <Route path="/" element={<Index />} />
    {/* ... */}
  </Routes>
</Suspense>
```

---

### M2. Add BreadcrumbList Schema to Nested Pages
**Impact:** Breadcrumb rich results in SERPs | Effort: 2 hours

Use schemas from [generated-schema.json](generated-schema.json) → `breadcrumbs` key. Add via `<Helmet>` in:
- `LocalFood.tsx` — 2-level breadcrumb
- `Map.tsx` — 3-level breadcrumb
- `GardenPlan.tsx` — 3-level breadcrumb
- `Education.tsx` — 2-level breadcrumb
- `AboutUs.tsx` — 2-level breadcrumb

---

### M3. Add EducationalOrganization + Course Schema
**Impact:** Course rich results, education query visibility | Effort: 2 hours

Use the full schemas from [generated-schema.json](generated-schema.json) → `education_page` key. Includes:
- `EducationalOrganization` with offer catalog
- `Course` for "Community Gardens & Food Justice" with all 6 week descriptions
- `Course` for "Composting, Soil Science & Sustainability" with all 6 week descriptions

Add via `<Helmet>` in `Education.tsx` using `JSON.stringify()`.

---

### M4. Add WebApplication Schema for Ask Jane
**Impact:** App discoverability in AI queries | Effort: 30 minutes

Use schema from [generated-schema.json](generated-schema.json) → `garden_planner_page` key. Includes all four pricing tiers (Free Trial, Monthly $10, Annual $100, Educator $8) and feature list.

---

### M5. Add Impact Statistics to Homepage
**Impact:** E-E-A-T +10, GEO citability +4 | Effort: 1 hour

Add a stats bar to `Index.tsx` between the hero and feature sections:
```
"X youth served" | "X schools partnered" | "X food resources mapped"
```
These numbers are the most citable content an AI can extract about the organization. Without them, AI systems have no quantifiable facts to cite when asked "What has Saved by the Plate accomplished?"

---

### M6. Add Definition Blocks for AI Citation
**Impact:** GEO citability +6 | Effort: 2 hours

Per the GEO analysis, AI systems favor 134–167 word self-contained answer blocks. Add the following to existing pages:

**Homepage `Index.tsx`** — Add a "What We Do" definition section:
> *"Saved by the Plate is a New York City nonprofit connecting youth and communities to local food systems through education programs, an interactive food resource map, and an AI-powered garden planning assistant. Founded by Shay Bouchles, our mission is to make food justice education accessible, engaging, and actionable for every community across the five boroughs."*

**Education `Education.tsx`** — Add a food justice definition intro before the curriculum tabs:
> *"Food justice is the belief that all people deserve access to healthy, affordable, culturally appropriate food regardless of income, race, or zip code. In New York City, food deserts disproportionately affect communities of color and low-income families. Our 6-week youth programs connect students with community gardens, composting practices, and local food systems — teaching the history of urban agriculture in NYC, hands-on growing techniques, and the role of food sovereignty in environmental justice."*

**About `AboutUs.tsx`** — Add founding date and 501(c)(3) status to the mission card if applicable.

---

### M7. Add Blog / Resources Section
**Impact:** Long-tail traffic, E-E-A-T, GEO citability | Effort: Ongoing

The site has no content marketing. Even 4 posts would dramatically expand reach:

| Topic | Target Query | Priority |
|-------|-------------|----------|
| "What is food justice?" | High AI Overview frequency | 🔴 High |
| "How to find a community fridge near you" | High local intent | 🔴 High |
| "How to start a community garden in NYC" | High volume | 🟠 Medium |
| "Urban gardening for beginners" | Evergreen | 🟡 Medium |
| "Food sovereignty vs food security — what's the difference?" | AI Overview target | 🟡 Medium |

Each post should be 800–1,500 words, include the definition block format (134–167 words per section), and be authored by Shay Bouchles for E-E-A-T.

---

## 🟢 GEO — Brand Presence (3–12 Month Strategy)

These actions address the core GEO weakness: zero brand presence outside the website.

### G1. Create YouTube Channel (Highest GEO ROI)
**Impact:** GEO +10 points | YouTube mentions show 0.737 correlation with AI citations

Even 3 videos would establish entity presence:
1. "What is Food Justice? (A NYC Community Perspective)"
2. "A Day in Our Youth Education Programs" (field footage from the Bronx garden sessions)
3. "How to Use the Saved by the Plate Food Map"

---

### G2. Establish Reddit Presence
**Impact:** GEO +8 points | Perplexity cites Reddit in 46.7% of responses

Relevant subreddits to engage authentically:
- r/urbanfarming, r/composting, r/gardening
- r/foodsovereignty, r/foodjustice
- r/nyc, r/bronx, r/nonprofit

Share program updates, answer questions about food justice/composting/urban farming. Link to site when genuinely relevant.

---

### G3. Get Wikipedia Mentions
**Impact:** GEO +15 points | ChatGPT cites Wikipedia in 47.9% of responses

Short-term (achievable without a dedicated Wikipedia article):
- Get mentioned in: "Urban agriculture in New York City", "Food justice", "Community gardens in New York City"
- Requires press coverage first — get a local NYC news article published about the organization

Long-term: Create a Wikipedia article for "Saved by the Plate" once notability criteria are met (requires coverage in reliable secondary sources).

---

### G4. List on Nonprofit Directories
**Impact:** Authority signals, AI entity recognition | Effort: 2 hours

Register/claim profiles on:
- [Charity Navigator](https://www.charitynavigator.org/) (requires 501(c)(3))
- [GuideStar / Candid](https://candid.org/)
- [IRS Tax Exempt Organization Search](https://apps.irs.gov/app/eos/) (automatic if 501(c)(3))
- [GreatNonprofits](https://greatnonprofits.org/)
- NYC-specific: [NYC Service](https://www.nycservice.org/), [NYC Food Policy](https://www.nycfoodpolicy.org/)

These directories are frequently cited by AI systems when asked about food justice nonprofits in NYC.

---

## 🔵 ARCHITECTURAL (Long-Term, High Impact)

### A1. Migrate to Next.js App Router
**Impact:** All SEO and GEO categories | Effort: Very High

The root cause of 80% of the site's SEO problems is pure CSR. A Next.js migration with:
- **Static Generation (SSG)** for: Homepage, About, Education, Local Food, Premium, Terms, Privacy
- **Server-Side Rendering (SSR)** for: Map (dynamic data), Garden Planner (auth-gated)

Would fix: indexation, per-page meta, Core Web Vitals, AI citability, schema injection, and canonical tags — all at the framework level.

**Estimated score after migration:** SEO 75+/100 | GEO 55+/100 (before other optimizations)

### A2. WebP Image Conversion
Convert all `/src/assets/` JPEG/PNG files to WebP. Expected 30–50% size reduction, ~0.3–0.5s LCP improvement.

### A3. Implement PWA Manifest
Add `manifest.json` + service worker for offline caching and improved Lighthouse mobile scores.

### A4. Add Hreflang for Spanish (Future)
If expanding to serve Spanish-speaking communities — highly relevant for food justice mission in NYC — add `hreflang="es"` variants and Spanish content.

---

## Projected Score After Fixes

| Phase | Key Actions | SEO Score | GEO Score |
|-------|------------|-----------|-----------|
| **Current** | — | 36/100 | 22/100 |
| **Critical (C1–C5)** | Per-page meta, sitemap, schema, noindex | ~55/100 | 25/100 |
| **High (H1–H6)** | GSC, GA4, performance, llms.txt | ~65/100 | 32/100 |
| **Medium (M1–M7)** | Code splitting, all schema, stats, blog | ~76/100 | 42/100 |
| **GEO (G1–G4)** | YouTube, Reddit, Wikipedia, directories | ~76/100 | 58/100 |
| **Architectural (A1–A4)** | Next.js migration, WebP, PWA | ~88/100 | 68/100 |

---

## Master Implementation Checklist

### This Week — Critical
- [x] Per-page `<title>`, `<meta description>`, `<canonical>` added to all 9 public pages (React 19 native hoisting)
- [x] `noindex` added to ComingSoon, Auth, ForagingTest
- [x] Organization + WebSite JSON-LD added to `index.html`
- [x] `og:url`, `og:site_name`, `og:locale` fixed in `index.html`
- [x] `public/sitemap.xml` — generated
- [x] `public/robots.txt` — updated (AI bots + sitemap reference)
- [x] `public/llms.txt` — created

### Week 2 — High Priority
- [ ] Verify site in Google Search Console + submit sitemap *(needs your GSC account)*
- [ ] Install Google Analytics 4 *(needs your GA4 Measurement ID)*
- [x] `<link rel="preload">` for hero Unsplash image added to `index.html`
- [x] `loading="lazy"` + `fetchPriority="high"` added to all images (Index, Education, AboutUs)
- [x] `noindex` + canonical added to `LegalTerms.tsx` and `LegalPrivacy.tsx`

### Month 1 — Medium Priority
- [ ] Add `React.lazy()` + `Suspense` code splitting for all 14 routes
- [ ] Add BreadcrumbList schema to 5 nested pages (from `generated-schema.json`)
- [ ] Add EducationalOrganization + 2× Course schema to `Education.tsx` (from `generated-schema.json`)
- [ ] Add WebApplication schema for Ask Jane to `GardenPlan.tsx` (from `generated-schema.json`)
- [ ] Add impact statistics section to homepage
- [ ] Add definition blocks to Homepage + Education page
- [ ] Publish first 2 blog posts: "What is food justice?" + "How to find a community fridge near you"

### Months 2–3 — GEO Brand Building
- [ ] Create YouTube channel + upload 2–3 program videos
- [ ] Register on Charity Navigator, GuideStar, GreatNonprofits, NYC Food Policy
- [ ] Begin Reddit participation in r/urbanfarming + r/nyc
- [ ] Pitch 1–2 local NYC press outlets for coverage (triggers Wikipedia eligibility)

### Long-Term — Architectural
- [ ] Plan Next.js migration (start with marketing pages only)
- [ ] Convert image assets to WebP format
- [ ] Add PWA manifest

---

*Action Plan updated after Schema, Sitemap, and GEO deep-dives | February 23, 2026*
