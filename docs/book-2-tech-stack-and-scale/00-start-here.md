# Book 2: WhyAI Tech Stack & Scaling to Millions of Users

## Who this book is for

The person who read (or skimmed) Book 1 and is now asking the practical question: **"where does
the database go, what do we actually need to buy/set up, and what happens when a lot of people show
up at once?"** This book assumes zero prior knowledge of servers, databases, or infrastructure — it
builds every idea from the ground up, the same way Book 1 did for the frontend code, then answers
specifically: where is/would the database be, what's missing today, and what changes are needed so
the site stays fast and doesn't fall over as it grows from a handful of visitors to millions.

## How this book is organized

1. **[01-what-is-a-tech-stack.md](01-what-is-a-tech-stack.md)** — the absolute basics: client vs
   server, what a database is, what "hosting" means, what "latency" means.
2. **[02-current-stack-inventory.md](02-current-stack-inventory.md)** — exactly what WhyAI uses
   today, and exactly what's missing (spoiler: there is no database yet — this is normal for where
   the project is).
3. **[03-where-is-the-database.md](03-where-is-the-database.md)** — directly answers "where is the
   database, or where can we add one" — the recommended choice and why, with concrete table
   sketches.
4. **[04-backend-options.md](04-backend-options.md)** — the different ways to add server-side logic,
   and which fits a small team best right now.
5. **[05-authentication-and-security.md](05-authentication-and-security.md)** — how login, and
   keeping data safe, actually works under the hood.
6. **[06-caching-and-cdn.md](06-caching-and-cdn.md)** — what a CDN and caching are, and why they
   matter even before you have millions of users.
7. **[07-scaling-to-millions.md](07-scaling-to-millions.md)** — the core question: what has to be
   true about the system for it to serve a huge number of people at once without slowing down.
8. **[08-latency-budget.md](08-latency-budget.md)** — where time actually goes between a click and
   something appearing on screen, and how to shrink each piece.
9. **[09-cost-and-growth-stages.md](09-cost-and-growth-stages.md)** — a staged plan: what's needed
   at 1,000 users vs. 100,000 vs. 1,000,000+, so you never over-build for a stage you're not at yet.
10. **[10-recommended-architecture-diagram.md](10-recommended-architecture-diagram.md)** — the
    target picture, tied directly back to [docs/ROADMAP.md](../ROADMAP.md)'s phases.
11. **[11-glossary.md](11-glossary.md)** — every term used in this book, defined plainly.

## The one-paragraph version

Today, WhyAI has **no database and no backend server at all** — Book 1 Chapter 17 covers this in
detail. There is nowhere a database "is" right now because nothing has been added yet; this book's
Chapter 3 answers exactly where one would go and what it would store. The honest, short answer to
"can this handle a million users right now" is: **it already can, for exactly what it does today**
— serving static files to browsers scales extremely well, because Vercel's hosting already
distributes those files globally (Chapter 6 explains why). The real scaling challenge only begins
the moment a *database and backend* are added (for real accounts, course progress, ebook/agent
purchases) — and that's precisely the stage this book is written for, matched phase-by-phase to
[docs/ROADMAP.md](../ROADMAP.md).
