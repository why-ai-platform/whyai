# Chapter 11: Glossary

Terms specific to backend/infrastructure/scaling, in addition to Book 1's glossary (which covers
frontend/React/TypeScript terms). Alphabetical.

**Backend** — the server-side part of an application (Ch.1 §1.3).

**CDN (Content Delivery Network)** — a network of geographically distributed servers caching and
serving your files from a location near each visitor (Ch.6 §6.1).

**Client** — the visitor's own device/browser, making requests (Ch.1 §1.1).

**Connection pooling** — reusing a set of already-open database connections instead of opening a
new one per request (Ch.7 §7.3).

**Core Web Vitals** — Google's standardized page-speed metrics: LCP, INP, CLS (Ch.8 §8.3).

**Database** — organized, persistent, shared storage for data that must survive beyond one visit
(Ch.1 §1.2).

**Foreign key** — a column in one database table whose value refers to a row in another table
(Ch.3 §3.3).

**Hashing** — a one-way transformation used to store passwords without ever storing the original
text (Ch.5 §5.2).

**Horizontal scaling** — handling more load by running more copies of a stateless server, rather
than making one server more powerful (Ch.7 §7.2).

**HTTPS** — the encrypted version of the web's core protocol, protecting data in transit (Ch.5
§5.7).

**Index (database)** — a structure built on a column to make lookups on it fast, without scanning
every row (Ch.7 §7.3).

**Latency** — the delay of a round trip between client and server (Ch.1 §1.5).

**PostgreSQL ("Postgres")** — the specific, widely-used, open-source relational database
recommended for WhyAI (Ch.1 §1.2, Ch.3).

**Queue** — a pattern for handling bursts of work at a steady, sustainable pace instead of all at
once (Ch.7 §7.4).

**Rate limiting** — capping how many requests one source can make in a time window (Ch.7 §7.5).

**Read replica** — an automatically-kept-in-sync copy of a database used to handle read-only
queries separately from the primary database (Ch.7 §7.3).

**Relational database** — a database organizing data into tables with defined relationships
between them (Ch.1 §1.2).

**Round trip** — one request from client to server and the response back (Ch.1 §1.1).

**Row Level Security (RLS)** — database-enforced rules restricting which rows a given request is
allowed to see or change (Ch.5 §5.4).

**Server** — a remote computer a client sends requests to (Ch.1 §1.1).

**Serverless function** — a small piece of server-side code run on demand by a provider, without
you managing a continuously-running server process (Ch.4 §4.1).

**Session / token** — a way for a server to recognize a logged-in visitor on later requests without
re-checking their password every time (Ch.5 §5.3).

**Sharding** — splitting one large database into multiple smaller ones, each holding part of the
data; a last-resort scaling technique (Ch.7 §7.3).

**Signed URL** — a temporary, cryptographically-verified link granting time-limited access to a
file (Ch.5 §5.6).

**Stateless** — a server that doesn't permanently remember visitor-specific data in its own memory
between requests (Ch.7 §7.2).

**Supabase** — the recommended managed-Postgres-plus-auth-plus-storage provider for WhyAI (Ch.3
§3.2).

**Webhook** — a request a third-party service sends to your server to report that something
happened (e.g. a payment succeeding) (Ch.5 §5.5).

See also: **[Book 1's glossary](../book-1-codebase-explained/20-glossary.md)** for frontend/React/
TypeScript terms.
