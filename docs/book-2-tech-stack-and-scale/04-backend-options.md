# Chapter 4: Backend Options — The Different Ways to Add Server-Side Logic

Chapter 3 covered *where data lives*. This chapter covers *where logic that must run on a server*
lives — things like "verify this payment webhook is really from Stripe," which cannot safely run
in the visitor's own browser (Chapter 5 explains exactly why).

## 4.1 Option A: Backend-as-a-Service (recommended starting point)

**What it is**: a provider (Supabase, from Chapter 3) handles the database, auth, and file storage
for you, and lets you add small bits of custom server logic — called **serverless/edge
functions** — only where you specifically need something beyond "read/write a table." You never
manage a server process yourself; you just write a function, and the provider runs it on demand,
anywhere in the world.

**Where this is used in WhyAI's plan**: [docs/ROADMAP.md](../ROADMAP.md) Phase 6
(`feat/stripe-checkout-integration`) needs exactly one such function — the one that receives
Stripe's "payment succeeded" webhook, verifies its signature (Chapter 5), and marks an order paid
in the database. That's a handful of lines, not a whole application.

**Why it fits WhyAI**: almost everything the three product pillars need (reading course content,
reading/writing a user's own progress, listing products, recording an order) is a direct
database read/write with security rules attached (Chapter 5) — no custom server process required
at all for those. Only payment webhooks genuinely need a small custom function.

## 4.2 Option B: A dedicated backend server (Node.js/Express, or the README's original FastAPI idea)

**What it is**: a full, continuously-running server application you write, deploy, and keep
running yourself — handling every request, talking to the database directly, with complete control
over every detail. WhyAI's original [README.md](../../README.md) sketched this as a possible
direction ("Backend: FastAPI (Python)").

**Why this isn't the current recommendation**: it's considerably more work to build, deploy, scale,
and keep patched/secure, for a benefit (full control) that WhyAI's three pillars don't currently
need. It becomes the right move later specifically when you hit a limit Option A can't handle —
e.g. a genuinely complex, long-running job (Chapter 9 names concrete triggers for this).

## 4.3 Option C: Serverless functions directly on Vercel (no separate backend provider)

**What it is**: Vercel (the hosting platform WhyAI already uses) can itself run small server-side
functions, placed in an `api/` folder in this same repository, deployed automatically alongside the
frontend. Functionally similar to Supabase's Edge Functions (Option A), but *without* needing a
second provider account if the only thing needed is, say, a payment webhook handler, and the
database lives in Supabase regardless.

**In practice for WhyAI**: Options A and C aren't mutually exclusive — [docs/ROADMAP.md](../ROADMAP.md)
Phase 6 explicitly leaves this as either/or ("Vercel Function or Supabase Edge Function"), since
both achieve the same result for the one function actually needed right now.

## 4.4 The recommendation, stated plainly

**Use Supabase for the database, authentication, and file storage (Option A). Write the one or two
small server-side functions actually needed (payment webhooks) as either a Supabase Edge Function
or a Vercel Function (Option C) — whichever is less setup at the time.** Do not build a dedicated,
continuously-running backend server (Option B) until a concrete need Option A/C genuinely can't
meet shows up — Chapter 9 gives specific signs to watch for.
