# Chapter 8: The Latency Budget — Where Time Actually Goes

Chapter 1 §1.5 defined latency as the delay of a round trip. This chapter breaks down, piece by
piece, everything that happens between a visitor clicking something and seeing the result, and what
can be done about each piece. Understanding this breakdown is what lets you target effort at the
part that's actually slow, instead of guessing.

## 8.1 The full chain, for a page load

```
1. DNS lookup       — translating "whyai.co.in" into a server address
2. TCP + TLS setup  — establishing a secure connection (the "S" in HTTPS, Ch.5 §5.7)
3. Server/CDN response — the CDN edge server (Ch.6) returns the requested file(s)
4. Download time    — how long transferring the actual bytes takes, dependent on file size
                       and the visitor's own connection speed
5. Browser parsing & rendering — turning HTML/CSS/JS into pixels on screen
6. JavaScript execution — React mounting, running effects, etc. (Book 1 Ch.4)
[ if a backend call is involved beyond this point: ]
7. Network round trip to the backend/database (Ch.3, Ch.4)
8. Database query time
9. Response travels back, React re-renders with the real data
```

## 8.2 What shrinks each piece

- **DNS (#1)**: largely out of your hands beyond using a reputable DNS provider; negligible for a
  single page load since browsers cache DNS results.
- **TLS setup (#2)**: modern protocols (HTTP/2, HTTP/3 — which Vercel uses automatically) have
  already minimized this; not something to hand-tune.
- **CDN response + download (#3–4)**: this is where Chapter 6's CDN distribution and Chapter 7
  §7.6's code-splitting/image-optimization pay off directly — smaller files, served from somewhere
  physically close to the visitor, shrink this the most.
- **Parsing/rendering/JS execution (#5–6)**: a smaller JavaScript bundle (§7.6 again) parses and
  runs faster; avoiding unnecessary re-renders (writing efficient React code) keeps this snappy too.
- **Backend round trip + database query (#7–8)**: this is the piece that **doesn't exist at all
  today** (Chapter 2) and will appear the moment a real backend is added — this is also exactly
  where Chapter 6's caching and Chapter 7's indexes/connection pooling have the most leverage, since
  this step is typically the single slowest piece of the whole chain once it exists (a database
  query can easily take 10–100x longer than reading an already-cached static file).

## 8.3 Core Web Vitals — the standard way this gets measured

Google defines three specific, standardized metrics worth knowing by name, since tools (Chrome's
own Lighthouse, PageSpeed Insights) report against them directly, and they affect search ranking:

- **LCP (Largest Contentful Paint)** — how long until the biggest visible element (often a hero
  image or headline) has rendered. Target: under 2.5 seconds.
- **INP (Interaction to Next Paint)** — how long after a click/tap until the page visibly responds.
  Target: under 200 milliseconds.
- **CLS (Cumulative Layout Shift)** — how much visible content unexpectedly jumps around as a page
  loads (e.g. an image loading in and pushing text down). Target: as close to zero as possible.

Running Lighthouse against the current WhyAI site is a cheap, concrete way to get real numbers for
§8.1's chain today, before any backend exists — worth doing as a baseline, and a natural fit for a
`chore/` item in [docs/ROADMAP.md](../ROADMAP.md) Phase 0 or Phase 9's polish phase.

## 8.4 Why this matters commercially, not just technically

Slow pages measurably lose sales — a widely cited rule of thumb is that a 1-second delay in page
load can meaningfully reduce conversions (visitors completing a purchase). For WhyAI specifically,
this means the ebook/agent "Buy now" flow (roadmap Phases 2–3) is exactly the kind of interaction
worth keeping fast above almost anything else on the site — it's the one click directly tied to
revenue.
