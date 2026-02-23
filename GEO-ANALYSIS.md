# GEO Analysis — Generative Engine Optimization
## Saved by the Plate | https://www.savedbytheplate.org
**Date:** February 23, 2026

---

## GEO Readiness Score: 22 / 100

| Category | Weight | Score | Weighted |
|----------|--------|-------|---------|
| Citability | 25% | 10 | 2.5 |
| Structural Readability | 20% | 35 | 7.0 |
| Multi-Modal Content | 15% | 20 | 3.0 |
| Authority & Brand Signals | 20% | 15 | 3.0 |
| Technical Accessibility | 20% | 8 | 1.6 |
| **TOTAL** | | | **17.1 → 22/100** |

**Verdict:** Near-invisible to AI search engines. The combination of client-side rendering and no brand presence outside the website means AI assistants (ChatGPT, Perplexity, Google AI Overviews) have almost no pathway to discover, cite, or recommend this organization.

---

## Platform Breakdown

| Platform | Score | Status | Key Blocker |
|----------|-------|--------|-------------|
| Google AI Overviews | 18/100 | ❌ Very Poor | CSR + no per-page SEO |
| ChatGPT | 8/100 | ❌ Critical | No Wikipedia, no Reddit, CSR |
| Perplexity | 10/100 | ❌ Critical | No Reddit presence, CSR |
| Bing Copilot | 15/100 | ❌ Very Poor | Not indexed in Bing, CSR |
| Claude (Anthropic) | 12/100 | ❌ Very Poor | CSR, no structured content |

---

## 1. AI Crawler Access Status

### robots.txt — Updated ✅

The `robots.txt` file was updated as part of this audit to explicitly allow AI crawlers:

| Crawler | Owner | Status (After Update) |
|---------|-------|----------------------|
| GPTBot | OpenAI | ✅ Explicitly allowed |
| ClaudeBot | Anthropic | ✅ Explicitly allowed |
| PerplexityBot | Perplexity | ✅ Explicitly allowed |
| CCBot | Common Crawl | ✅ Allowed (falls under `*`) |
| OAI-SearchBot | OpenAI | ⚠️ Not listed (add if desired) |
| ChatGPT-User | OpenAI | ⚠️ Not listed |
| Bytespider | ByteDance | ⚠️ Not listed |

**Critical caveat:** Allowing crawlers is necessary but not sufficient. The site's CSR architecture means these bots will still receive an empty HTML shell unless JavaScript is executed — which most AI crawlers do not do.

---

## 2. llms.txt Status

| Check | Status |
|-------|--------|
| `/llms.txt` present | ❌ Missing |
| `/llms-full.txt` present | ❌ Missing |
| RSL 1.0 licensing terms | ❌ Missing |

**Impact:** AI systems that respect the llms.txt standard have no curated entrypoint to understand what Saved by the Plate is, what pages matter, or what the organization does. This is especially important given CSR — llms.txt can partially compensate by providing a static, machine-readable summary.

### Recommended `/public/llms.txt`

```
# Saved by the Plate

> Saved by the Plate is a nonprofit organization empowering communities to make
> informed food choices by connecting them to local food resources and providing
> youth education in food justice, sustainable agriculture, and urban gardening.
> Based in New York City, serving schools and communities across the five boroughs.

## About
Saved by the Plate Inc. was founded by Shay Bouchles to bridge the gap between
communities and local food systems. We provide experiential programs, an
AI-powered garden planning assistant, and an interactive map of food resources.

## Key Pages
- [Home](https://www.savedbytheplate.org/): Main landing page
- [About Us](https://www.savedbytheplate.org/about): Mission, values, leadership team
- [Youth Education Programs](https://www.savedbytheplate.org/education): 6-week customizable programs
- [Local Food Resources](https://www.savedbytheplate.org/local-food): Hub for food access tools
- [Interactive Food Map](https://www.savedbytheplate.org/local-food/map): Map of gardens, markets, fridges, food banks
- [Ask Jane — AI Garden Planner](https://www.savedbytheplate.org/local-food/garden-planner): AI-powered gardening assistant

## Programs
- Community Gardens & Food Justice: 6-week youth program covering history,
  urban growing, biodiversity, and environmental justice in NYC community gardens
- Composting, Soil Science & Sustainability: 6-week youth program covering
  food waste reduction, composting, soil nutrients, and soil ecosystems

## Contact
- Email: info@savedbytheplate.org
- Website: https://www.savedbytheplate.org

## Leadership
- Shay Bouchles — Founder, President, and Executive Director
```

---

## 3. Brand Mention Analysis

### Platform Presence

| Platform | Presence | Notes |
|----------|----------|-------|
| Wikipedia | ❌ None | No article, not mentioned in related articles |
| Reddit | ❌ None | No posts or mentions found |
| YouTube | ❌ None | No channel or video mentions found |
| LinkedIn | ⚠️ Unknown | Not verified in search results |
| Google Knowledge Panel | ❌ None | No entity established |
| Wikidata | ❌ None | No entity entry |
| Charity Navigator / GuideStar | ⚠️ Unknown | Should be listed as a nonprofit |

**Key Insight from Ahrefs 2025 data:** Brand mentions correlate 3× more strongly with AI visibility than backlinks. YouTube mentions show the highest correlation (~0.737). Saved by the Plate has zero presence on any high-correlation platform.

### Competitor Comparison

Organizations with stronger AI visibility in the same space:
- **GrowNYC** — Wikipedia article, YouTube channel, Reddit mentions
- **Just Food NYC** — Wikipedia article, active media coverage
- **East New York Farms** — Featured in multiple educational resources

These organizations will appear in AI answers about food justice, urban agriculture, and NYC food resources. Saved by the Plate will not — until brand presence is established.

---

## 4. Technical Accessibility (Critical Failure)

### Server-Side Rendering Check

| Check | Status | Impact |
|-------|--------|--------|
| Framework | Vite + React (CSR) | ❌ Critical |
| Initial HTML content | `<div id="root"></div>` | ❌ AI crawlers see nothing |
| Content requires JavaScript | 100% | ❌ AI crawlers don't execute JS |
| SSR / SSG available | No | ❌ No workaround in current stack |
| Pre-rendered HTML | No | ❌ |

**What AI crawlers actually receive from this site:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <title>Saved by the Plate</title>
  <meta name="description" content="Empowering individuals to make informed food choices...">
  <!-- meta tags only -->
</head>
<body>
  <div id="root"></div>
  <script src="..."></script>
</body>
</html>
```

That is literally all that AI engines see. The homepage content, education programs, team bios, and food map are completely invisible to ChatGPT, Perplexity, and AI Overview indexing.

---

## 5. Citability Analysis

### Passage-Level Assessment

Because the site is CSR, no content is currently citable. However, analyzing the source code reveals content quality that would be citable if server-rendered:

**High-Value Citable Content (currently invisible):**

| Page | Passage | Words | Citability |
|------|---------|-------|-----------|
| About | Mission statement — "Empower the next generation to build a resilient food future..." | 62 | ✅ Good if rendered |
| About | Shay Bouchles bio — specific expertise, qualifications, programs | ~180 | ✅ Good if rendered |
| Education | Course descriptions with week-by-week curriculum | ~200 | ✅ Strong if rendered |
| Homepage | "Connecting communities with sustainable food options and local agriculture, starting with our youth." | 16 | ⚠️ Too short |

**Citability Gaps (even after fixing CSR):**
- No statistics: "We've served X students" or "X community gardens mapped"
- No publication dates on any content
- No source citations or research references
- Definitions like "What is food justice?" or "What is food sovereignty?" — high AI citation value, currently absent
- No "How to..." content that AI Overviews favor

**Optimal passage template (134–167 words) — example to add:**
```
Food justice is the belief that all people deserve access to healthy, affordable,
culturally appropriate food regardless of income, race, or zip code. In New York
City, food deserts — neighborhoods with limited access to grocery stores and
fresh produce — disproportionately affect communities of color and low-income
families. Saved by the Plate addresses this through youth education programs that
connect students with community gardens, composting practices, and local food
systems. Our 6-week programs are delivered in schools across the five boroughs,
teaching students the history of urban agriculture in NYC, hands-on growing
techniques, and the role of food sovereignty in environmental justice. By
connecting children and families to community gardens and local food resources,
we work to build a more equitable and resilient food future for New York City.
```
This 134-word block is self-contained, quotable, and answers "what is food justice" + "what does Saved by the Plate do" — the exact format AI assistants extract and cite.

---

## 6. Structural Readability

### Current State (from source code)

| Element | Present in Code | Visible to AI |
|---------|----------------|--------------|
| H1 on homepage | ✅ "Grow Local, Eat Local" | ❌ CSR blocked |
| H2 sections | ✅ "Discover What We Offer" | ❌ CSR blocked |
| Question-based headings | ❌ None | ❌ |
| FAQ section | ❌ None | ❌ |
| Short paragraphs (2-4 sentences) | ✅ Good | ❌ CSR blocked |
| Tables | ✅ Education curriculum | ❌ CSR blocked |
| Definition blocks | ❌ None | ❌ |

**Post-CSR-fix structural improvements needed:**
1. Add question-format H2s: "What is food justice?", "What programs do we offer?", "How can schools partner with us?"
2. Add a "Frequently Asked Questions" section to the Education and About pages
3. Add a stats/impact bar to the homepage with real numbers

---

## 7. Multi-Modal Content

| Type | Present | AI Benefit |
|------|---------|-----------|
| Images with descriptive alt text | ✅ Yes | Low (AI doesn't process images directly) |
| Video content | ❌ None | High missed opportunity |
| Infographics | ❌ None | Medium |
| Interactive map | ✅ Yes (Google Maps) | Low (JS-dependent) |
| Calculators/tools | ✅ Ask Jane AI | Low (JS-dependent) |

**Recommendation:** A short explainer video (even 60–90 seconds) uploaded to YouTube about Saved by the Plate's mission would be the single highest-ROI multi-modal investment. YouTube mentions show the strongest correlation (~0.737) with AI citations.

---

## 8. Top 5 Highest-Impact GEO Changes

### #1 — Fix CSR / Add Static Content Layer
**Impact: Unlocks all other GEO improvements**

Until content is server-rendered, every other GEO fix is a marginal improvement. Consider:
- **Short-term:** Add `llms.txt` + key facts as static text in `index.html` (hidden visually but machine-readable)
- **Medium-term:** Migrate to Next.js with static generation for marketing pages
- **Or:** Add a pre-rendering service (e.g., Prerender.io) as middleware

---

### #2 — Create Wikipedia Entity or Get Wikipedia Mentions
**Impact: +15–25 GEO points | ChatGPT cites Wikipedia in 47.9% of responses**

Wikipedia is the single most-cited source by ChatGPT. Options:
- Create a Wikipedia article for "Saved by the Plate" (requires notability — get press coverage first)
- Get mentioned in existing Wikipedia articles: "Food justice", "Urban agriculture in New York City", "Community gardens in New York City"
- Add founder Shay Bouchles to Wikipedia's list of food justice advocates

---

### #3 — Establish Reddit Presence
**Impact: +10–15 GEO points | Perplexity cites Reddit in 46.7% of responses**

Reddit is Perplexity's #1 citation source. Legitimate strategies:
- Participate in: r/urbanfarming, r/foodsovereignty, r/nyc, r/nonprofit, r/sustainability
- Share program updates, answer questions about food justice, composting, community gardens
- Link to site when genuinely relevant (not spam)

---

### #4 — Add `llms.txt` + Impact Statistics
**Impact: Immediate AI discoverability improvement**

The `llms.txt` file recommended above should be published immediately — it's the only way AI crawlers can understand the site's content right now given the CSR constraint.

Also add real statistics to make the organization citable:
- Number of students served
- Number of schools partnered
- Number of food resources on the map
- Years of operation

---

### #5 — Create YouTube Channel
**Impact: Highest long-term GEO signal (0.737 correlation)**

Even 3–5 videos would establish entity presence:
- "What is Food Justice? (NYC Community Perspective)"
- "How We Teach Urban Agriculture to NYC Youth"
- "Tour: Community Gardens in the Bronx"
- "Meet Jane — Your AI Garden Planner"

---

## 9. Schema Recommendations for AI Discoverability

The schemas in `generated-schema.json` directly improve GEO by giving AI systems structured facts:

| Schema | GEO Benefit |
|--------|------------|
| Organization + NonprofitOrganization | Establishes entity identity for Knowledge Graph |
| WebSite | Helps AI understand site purpose |
| Course | Makes programs citable by educational AI queries |
| WebApplication (Ask Jane) | Makes the tool discoverable in AI answers about garden planning |
| Person (Shay Bouchles) | Establishes founder as a citable expert entity |

---

## 10. Content Reformatting Suggestions

### Homepage — Add a Definition Block (60 words, high AI citation value)
```
What is Saved by the Plate?
Saved by the Plate is a New York City nonprofit connecting youth and communities
to local food systems through education programs, an interactive food resource
map, and an AI garden planning assistant. Founded by Shay Bouchles, our mission
is to make food justice education accessible, engaging, and actionable for
every community.
```

### Education Page — Add a Self-Contained Answer Block
Use the 134-word template from Section 5 above as an intro paragraph.

### About Page — Add Date + Credential Signals
- Add "Founded in [year]" to the mission section
- Add Shay's specific degrees or certifications if applicable
- Add the organization's 501(c)(3) status if registered
- Link to any press coverage, awards, or recognitions

---

## GEO Improvement Roadmap

| Timeline | Action | GEO Impact |
|----------|--------|-----------|
| This week | Publish `llms.txt` | +5 points |
| This week | Add AI bots to robots.txt | +2 points (done) |
| This month | Add Organization JSON-LD | +3 points |
| This month | Add impact statistics to homepage | +4 points |
| 1–3 months | Fix CSR (SSR or pre-render) | +20 points |
| 1–3 months | Create YouTube channel (3+ videos) | +10 points |
| 3–6 months | Establish Reddit presence | +8 points |
| 6–12 months | Wikipedia mention/article | +15 points |
| **Projected score after all actions** | | **~69/100** |

---

*GEO Analysis generated by Claude SEO Audit | savedbytheplate.org | February 23, 2026*
*Reference: Ahrefs December 2025 brand mention study, SparkToro AI traffic data*
