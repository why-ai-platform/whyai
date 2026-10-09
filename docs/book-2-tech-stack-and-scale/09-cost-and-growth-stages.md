# Chapter 9: Growth Stages — What to Do, and When

The single most important idea in this whole book: **almost nothing in Chapter 7 should be done
before it's actually needed.** Building for a million users while you have a hundred wastes time
and money that should go toward the three product pillars instead. This chapter gives concrete
stages with specific triggers for moving to the next one.

## Stage 0 — Today (pre-revenue, validating the idea)

**What exists**: the static frontend only (Chapter 2).
**What to do**: nothing from this book yet, architecturally. Focus entirely on
[docs/ROADMAP.md](../ROADMAP.md) Phases 1–3 — finish course content, ship the ebook and agent
storefronts using payment links, no backend. This stage can already serve a very large number of
simultaneous *visitors* just fine (Chapter 6) — the limiting factor at this stage is having
something worth selling, not infrastructure.
**Move to Stage 1 when**: you need real accounts, or you've made a few sales via payment links and
want automated delivery/tracking instead of manual email.

## Stage 1 — Roughly 0–10,000 users (first real backend)

**What to add**: Supabase (Chapter 3) for auth + database + storage; Row Level Security on every
table from day one (Chapter 5 §5.4); indexes on every foreign key (Chapter 7 §7.3); the one or two
serverless functions needed for payment webhooks (Chapter 4, Chapter 5 §5.5).
**What NOT to add yet**: read replicas, queues, rate-limiting beyond Supabase's defaults, a
dedicated backend server, a CDN beyond what Vercel already gives you. All of this would be solving
problems that don't exist at this traffic level.
**Signal you're outgrowing this stage**: the Supabase dashboard starts showing database CPU/
connection usage regularly near its plan's limit, or query response times visibly creep up on
pages that used to feel instant.

## Stage 2 — Roughly 10,000–100,000 users

**What to add**: client-side data caching (React Query/SWR, Chapter 6 §6.3); a short server-side
cache on frequently-read, rarely-changed data like the course/product catalog (Chapter 6 §6.5);
pagination on any list that's grown past a page or two (Chapter 7 §7.6); basic monitoring/error
tracking (so you find out about problems before an angry email does) — a tool like Sentry is a
reasonable, low-effort addition here.
**What NOT to add yet**: read replicas or sharding — a well-indexed, well-cached single Postgres
instance comfortably handles far more than 100,000 total users (what matters is *concurrent*
load and query complexity, not the total user count alone).
**Signal you're outgrowing this stage**: specific, identifiable slow queries show up repeatedly in
monitoring, concentrated on *reads* (not writes) — that's the specific pattern read replicas solve.

## Stage 3 — Roughly 100,000–1,000,000+ users

**What to add, only as specific signals appear**: a Postgres read replica for read-heavy pages
(Chapter 7 §7.3) if monitoring from Stage 2 points at read load specifically; a queue (Chapter 7
§7.4) if payment or other event volume genuinely starts arriving in bursts large enough to risk
overwhelming a serverless function's concurrency limits; reconsidering Option B from Chapter 4 (a
dedicated backend server) only if a specific feature genuinely can't be expressed well as
database-reads-plus-small-functions — e.g. a complex, long-running AI-agent-execution feature, if
that pillar grows into actually *running* agents for customers rather than just selling downloadable
ones.
**What this stage is not**: a reason to pre-build any of this now. Every item here has a specific
trigger condition — build it when the trigger fires, backed by real monitoring data, not by
guessing in advance.

## A note on cost

Each stage above also roughly tracks typical cost tiers on Supabase/Vercel (both have free tiers
covering Stage 0–1 entirely, then usage-based paid tiers from there) — but the *architectural*
triggers above (CPU/connection limits, slow-query patterns, burst volume) are the right signals to
act on, not a specific dollar figure, since pricing changes over time and varies by provider.

## The one-sentence takeaway

**Build Stage 0–1 now (it's exactly what [docs/ROADMAP.md](../ROADMAP.md) already schedules);
treat every later stage as something to revisit only when its specific, named signal actually
shows up in real usage data — not before.**
