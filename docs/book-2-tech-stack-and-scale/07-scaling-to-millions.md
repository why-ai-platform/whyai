# Chapter 7: Scaling to Millions of Users — What Has to Be True

This is the central chapter the user asked for directly: what does the system need, architecturally,
to serve a very large number of people at once without slowing down or falling over?

## 7.1 The two different things people mean by "scale"

1. **Scaling the frontend/static files** — already solved for WhyAI today, automatically, by
   Vercel's CDN (Chapter 6). Serving the same unchanging files to a million people is not a hard
   problem with modern hosting.
2. **Scaling the backend and database** — the real challenge, and what the rest of this chapter is
   about. This only becomes relevant once Chapter 3's database and Chapter 4's backend logic exist
   — but it's worth understanding the shape of the problem now, so it's designed in from the start
   rather than retrofitted under pressure later.

## 7.2 Stateless servers — the first principle

A server is **stateless** if it doesn't permanently remember anything about a specific visitor
between requests *in its own memory* — any request could be handled by any server instance, because
all the real state (who's logged in, what they bought) lives in the database/session token, not in
one particular server process's memory. This matters because it's what makes **horizontal
scaling** possible: if load increases, you can simply run *more copies* of a stateless server
side-by-side to share the work, and it doesn't matter which copy answers which request. Serverless
functions (Chapter 4) are stateless by design, automatically — this is a meaningful advantage of
that approach for scaling, essentially for free, without anyone having to engineer it.

**Horizontal scaling** (running more copies) is contrasted with **vertical scaling** (making one
server more powerful — more CPU/memory). Horizontal scaling is generally the more effective, more
resilient strategy for internet-scale traffic, and it's the default behavior of serverless
platforms (Vercel Functions, Supabase Edge Functions) — they automatically run more copies as
traffic increases, without anyone manually provisioning anything.

## 7.3 The database is usually the real bottleneck

Unlike stateless application servers, a relational database like Postgres (Chapter 3) is
fundamentally **stateful** — it's the one place all the real, authoritative data actually lives,
and you can't just spin up 50 independent, disconnected copies of it (they'd disagree with each
other about what the data is). This is why, in almost every real-world system, **the database is
the resource that scaling effort eventually concentrates on**. Key techniques, roughly in the order
they become worth doing as traffic grows (tied to Chapter 9's stages):

- **Indexes** — a database index is a bit like a book's index page: a separate, fast-to-search
  structure built on a specific column (e.g. `orders.user_id`) so looking up "all of this user's
  orders" doesn't require scanning every row in the whole table. Nearly free to add, and the single
  highest-leverage thing to get right early — every foreign-key column from Chapter 3's table
  sketches (`course_progress.user_id`, `orders.user_id`, etc.) should have one.
- **Connection pooling** — opening a brand-new connection to the database for every single request
  is relatively slow and resource-heavy; a **connection pool** keeps a set of already-open
  connections ready to reuse. Supabase provides this (via a tool called PgBouncer) with no setup
  required — worth knowing it's there and why it matters once traffic grows, even though nothing
  needs to be configured for it today.
- **Caching reads** (Chapter 6) — reduces how often the database is hit at all for data that
  doesn't change often.
- **Read replicas** — once a single database instance genuinely can't keep up with *read* traffic
  (people viewing courses/products, far more common than people writing new orders), you can create
  **read replicas**: copies of the database kept automatically in sync, which handle read-only
  queries, leaving the original ("primary") database free to handle writes (new orders, new
  progress records). Supabase supports this as a paid add-on once it's actually needed — not
  something to set up preemptively.
- **Sharding** — splitting one huge database into multiple smaller databases, each holding a
  portion of the data (e.g. by user id range). This is a last-resort, significant-complexity
  technique that essentially no app at WhyAI's current or near-future scale needs — mentioned here
  only so the term is recognized if it ever comes up; Chapter 9 explicitly does not recommend
  planning for it yet.

## 7.4 Handling spiky load: queues

Some operations happen in unpredictable bursts rather than smooth, steady traffic — a payment
webhook (Chapter 5 §5.5) firing the instant someone completes checkout is a good example: most of
the time there are none, then several might arrive in a short window during a sale or promotion. A
**queue** is a pattern where, instead of processing something immediately and risking being
overwhelmed by a burst, you quickly record "this needs to be processed" into a queue and handle
items from it steadily, at a sustainable pace. For WhyAI's near-term scale, this is not yet
necessary — Supabase Edge/Vercel Functions (Chapter 4) already handle a very large number of
webhook bursts without any extra engineering — but it's a concept worth recognizing as a lever that
exists if payment volume ever gets extreme enough to need it (Chapter 9 gives a concrete threshold).

## 7.5 Rate limiting

**Rate limiting** caps how many requests a single source (one user, one IP address) can make in a
given time window, protecting the system from being overwhelmed — whether by a malicious attack, a
buggy script accidentally hammering an endpoint, or simply one visitor's browser tab stuck in a
retry loop. Supabase Auth includes sensible rate limits on login attempts by default (also directly
helping with the brute-force risk in [docs/ROADMAP.md](../ROADMAP.md) §6 risk #10); additional
rate limiting on custom functions (Chapter 4) is cheap insurance worth adding once those exist,
even at modest traffic.

## 7.6 Frontend performance techniques that also matter at scale

Scaling isn't only a backend concern — a few frontend techniques reduce the *amount* of work every
single visitor's browser and the backend both have to do:

- **Code-splitting / lazy loading** — instead of one visitor downloading the JavaScript for every
  page of the app on their very first visit, Vite/React can split the bundle so, e.g., the Practice
  platform's code only downloads when someone actually navigates there. Smaller initial download =
  faster first paint for every visitor, at any scale.
- **Image optimization** — serving appropriately-sized, modern-format (e.g. WebP) images instead of
  large originals meaningfully reduces data transferred per page view, which matters multiplied
  across millions of page views.
- **Pagination** — once there are, say, thousands of courses/ebooks/agents instead of 8, catalog
  pages must fetch and render a page at a time (e.g. 20 items), not the entire catalog at once —
  both for the visitor's browser's sake and to avoid an unnecessarily large database query on every
  page load.

## 7.7 The honest summary

**None of the database-scaling techniques in §7.3 are things WhyAI needs today.** They're listed
here so the *shape* of the problem is understood and so the current build (Chapter 3's table
design, adding indexes on foreign keys from day one) doesn't make them harder later. Chapter 9
turns this into a concrete, staged checklist: what to do now, what to defer, and the specific signal
that means it's time to act on each item.
