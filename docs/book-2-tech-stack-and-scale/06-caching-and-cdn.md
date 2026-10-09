# Chapter 6: Caching & CDNs — Why WhyAI Already Scales Better Than It Looks

## 6.1 What is a CDN?

A **CDN** ("Content Delivery Network") is a network of servers spread across many physical
locations worldwide, each holding a copy of your site's files. When someone in Mumbai visits
WhyAI, a CDN serves them from a server physically near Mumbai, rather than every visitor on Earth
making a request all the way to one single server location — shortening the physical distance
(and therefore the time, see Chapter 8) data has to travel.

## 6.2 WhyAI already gets this, today, automatically

Vercel (Chapter 1 §1.4) distributes everything in `dist/` — the output of `npm run build` — across
its own global CDN **automatically**, with zero extra configuration. This is a genuinely important,
underappreciated fact: **the current entirely-static WhyAI app can already serve an enormous number
of simultaneous visitors with low latency worldwide**, purely because serving a fixed set of files
from many nearby locations is one of the best-understood, most scalable problems in computing — far
easier than scaling a database or custom backend logic (Chapter 7). This is also why the "no backend
yet" state of the project, covered throughout this book, is not a scaling weakness today — it's
arguably a scaling *strength*, temporarily.

## 6.3 What is caching, generally?

**Caching** means storing a copy of some result so a repeat request can be answered from that
stored copy instead of redoing the original (often expensive) work. Several layers of caching
matter for a growing WhyAI:

- **Browser caching** — a visitor's own browser remembers files (images, the JS bundle) it already
  downloaded, so revisiting the site doesn't re-download everything. Controlled by HTTP headers
  the server sends, which Vercel sets sensible defaults for automatically.
- **CDN caching** (§6.2) — the CDN itself holds a cached copy at each location, refreshed whenever
  a new deployment happens.
- **Database query caching** — once a real database exists (Chapter 3), some queries (e.g. "the
  list of all published courses," which changes rarely) are good candidates to cache in memory for
  a short time server-side, so not every single visitor's page load re-runs the same expensive
  database query from scratch.
- **Client-side data caching** — a library like **React Query** or **SWR** (not currently installed,
  but a very standard choice once real API calls exist) automatically caches data fetched from the
  backend *inside the React app itself*, so navigating back to a page you already visited in this
  session can show already-fetched data instantly, re-fetching only in the background to check for
  updates.

## 6.4 Why caching specifically matters for "millions of users"

Without caching, every one of a million page loads would hit the database directly for the same,
largely unchanging catalog data (course lists, ebook/agent listings) — multiplying load on the
single resource (the database) that is hardest and most expensive to scale (Chapter 7). Caching the
*results* of those reads, at whichever layer makes sense, is usually a far cheaper fix than scaling
the database itself, and is exactly the kind of cheap, high-leverage technique Chapter 9's staged
plan introduces well before more expensive measures like database read replicas.

## 6.5 A concrete, WhyAI-specific example

Course content (Book 1 Ch.11) rarely changes once published. Once it moves into Supabase (Chapter
3), fetching it on every single page load from the database for every visitor is unnecessary work.
A simple cache (even just a short, 5-minute in-memory cache on the serverless function reading it,
or a client-side React Query cache) means the database only actually gets queried once every few
minutes *regardless of how many thousands of visitors loaded that course in between* — this one
technique alone can be the difference between a database that's comfortably idle and one that's
overloaded, at the same traffic level.
