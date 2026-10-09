# Chapter 10: The Recommended Target Architecture

This chapter draws the destination — the system once [docs/ROADMAP.md](../ROADMAP.md)'s Phases
through Stage 2 (Chapter 9) are complete — and ties every piece back to exactly where it was
explained in this book and exactly which roadmap phase builds it.

## 10.1 The diagram

```
                              VISITOR'S BROWSER
                      (React app from Book 1 — unchanged)
                                     │
                     ┌───────────────┼────────────────┐
                     ▼                                 ▼
        ┌─────────────────────┐           ┌─────────────────────────┐
        │   VERCEL CDN/EDGE     │           │  Payment provider's own │
        │  (Ch.6) — serves the  │           │  hosted Checkout page   │
        │  static app globally, │           │  (Stripe/Razorpay) —    │
        │  cached, low-latency  │           │  WhyAI never touches    │
        └──────────┬───────────┘           │  card data (Ch.5)       │
                   │                        └───────────┬─────────────┘
                   │  reads/writes (with RLS, Ch.5 §5.4)│  webhook: "payment
                   ▼                                     │  succeeded" (Ch.5 §5.5)
        ┌─────────────────────────────────────────┐      ▼
        │              SUPABASE (Ch.3)             │  ┌───────────────────┐
        │  ┌───────────────┐  ┌──────────────────┐ │  │ Serverless function │
        │  │   PostgreSQL   │  │   Auth service    │ │  │ (Vercel or Supabase │
        │  │  users, courses,│  │ real signup/login │ │  │  Edge, Ch.4) —       │
        │  │  products,     │  │ /sessions (Ch.5)  │ │  │  verifies webhook    │
        │  │  orders,       │  └──────────────────┘ │◄─┤  signature, marks    │
        │  │  progress      │  ┌──────────────────┐ │  │  order paid in DB    │
        │  │  (indexed,     │  │  File Storage      │ │  └───────────────────┘
        │  │   Ch.7 §7.3)   │  │  ebook PDFs, agent │ │
        │  └───────────────┘  │  packages, signed  │ │
        │                      │  URLs (Ch.5 §5.6)  │ │
        │                      └──────────────────┘ │
        └─────────────────────────────────────────┘
```

## 10.2 Reading the diagram as a request

A concrete trace, combining everything in this book: a logged-in visitor clicks "Buy now" on an
ebook.

1. The click is handled entirely client-side (Book 1 Ch.1 §1.3) — no page reload.
2. The app redirects to the payment provider's own hosted checkout page (not WhyAI's own server —
   this is why WhyAI never has to handle card numbers at all, Chapter 5's PCI-scope point).
3. The visitor pays. The provider sends a signed webhook to WhyAI's one small serverless function
   (Chapter 4).
4. That function verifies the signature (Chapter 5 §5.5), then writes to the `orders` table in
   Supabase's Postgres database (Chapter 3) — allowed because this function uses a privileged
   service-level key, not the public key the browser uses, which is exactly why this step cannot
   happen in the browser itself.
5. The visitor's browser, back on WhyAI, queries Supabase directly (now allowed, by Row Level
   Security, to see only *their own* new order — Chapter 5 §5.4) and shows the unlocked download,
   generated as a signed, expiring URL (Chapter 5 §5.6) pointing at the file in Supabase Storage.
6. The static app shell around all of this was served from Vercel's CDN (Chapter 6), unaffected by
   any of the steps above, staying fast for every other visitor regardless of how much backend
   activity is happening for this one purchase.

## 10.3 Mapped to `docs/ROADMAP.md`

| Diagram piece | Roadmap phase |
|---|---|
| Vercel CDN (already exists) | — (Stage 0, Chapter 9) |
| Supabase Postgres + Auth | Phase 5 |
| `products`/`orders` tables + RLS | Phase 6 |
| Payment provider checkout + webhook function | Phase 6 |
| File Storage + signed download URLs | Phase 6 |
| Course progress table | Phase 7 |
| Caching, pagination, monitoring (Stage 2, Ch.9) | Phase 8 (analytics) + ongoing |

This is the same picture [docs/ROADMAP.md](../ROADMAP.md) already describes in prose — this
chapter exists to make it literally visible as one diagram, for a reader who's just read both books
front to back and wants the final destination in one glance.
