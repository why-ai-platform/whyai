# Chapter 10: How AI Agents Are Actually Sold

This chapter turns Chapters 1–9's concepts into a business question: once you've built an agent,
what exactly does a customer pay for and receive? This directly informs
[docs/ROADMAP.md](../ROADMAP.md) pillar 3 ("Sell AI Agents") and Phases 2–3's v0 storefront design.

## 10.1 Four real delivery models, from simplest to most involved

1. **Downloadable configuration/template** — the buyer receives the agent's "recipe": the system
   prompt, the tool definitions, and setup instructions for connecting it to their own API key and
   their own data. Cheapest to deliver (no hosting at all on your side — exactly the "payment link
   + zip/GitHub-repo-access delivery" v0 already sketched in [docs/ROADMAP.md](../ROADMAP.md)
   Phase 3), but requires the buyer to have some technical ability to set it up themselves.
2. **Source code / starter project** — a working, runnable implementation (like Chapter 11's
   capstone) the buyer can run and adapt, rather than just a prompt+schema recipe. More setup
   friction for the buyer than a no-code template, but far more customizable, and a natural
   "premium tier" above option 1 for the same agent idea.
3. **Hosted/subscription agent** — the seller runs the agent on their own infrastructure (Chapter
   8's Managed Agents platform, or a self-hosted server) and the buyer just uses it — via a chat
   widget, an API endpoint, or an integration — paying recurring (not one-time) fees. Highest
   ongoing cost and support burden for the seller (you're now operating a live service, with all
   of Book 2's scaling/latency/security concerns applying directly to *your* servers, not just
   WhyAI's main site), but the easiest buying experience, and the only model that produces
   recurring revenue instead of one-time sales.
4. **Usage-based / API access** — the buyer is billed per call or per token actually consumed,
   rather than a flat price — common for agents whose value scales with volume (e.g. a
   support-ticket-triage agent priced per ticket handled). Requires real usage metering and billing
   infrastructure — a later-stage option, not a v0 one.

## 10.2 Matching delivery model to WhyAI's actual roadmap stage

[docs/ROADMAP.md](../ROADMAP.md) Phase 3 (AI Agents Marketplace v0) is explicitly built with **zero
backend** — which maps directly onto delivery model 1 or 2 above: sell a downloadable
template/starter project via a payment link, deliver access manually (a GitHub invite, a zip file)
at first. Delivery model 3 (hosted/subscription) only becomes viable once Phase 6's real commerce
engine (recurring billing, real infrastructure to run the hosted agent on) exists — attempting it
earlier would mean operating a live paid service on top of the same mock-everything foundation Book
1 documents, which is not a safe place to run anything customers are paying a recurring fee for.

## 10.3 Pricing — what a buyer is actually paying for

Across all four models, the honest answer to "what's the value" is: **the specific tool design and
prompt engineering for a specific job, already debugged** (Chapters 4–5), not access to the
underlying LLM (anyone can get that directly, as Chapter 2 §2.4 noted) and not the idea of "an
agent" in the abstract. A buyer should be able to see, before paying, roughly what tools the agent
has and what it can/can't do — the same honesty principle this entire documentation project has
followed for WhyAI's own codebase (Book 1 Ch.19's frank "known issues" chapter) applies directly to
how agents get marketed: overselling autonomy a template doesn't actually have is the fastest way
to lose trust in a brand-new marketplace.

## 10.4 The dogfooding opportunity

Chapter 11's capstone — a WhyAI Storefront Assistant — isn't only a learning exercise. Once built
and refined, it's a legitimate candidate to become **WhyAI's own first AI Agent product**: the
exact same agent, packaged as delivery model 1 or 2 (§10.1), sold to *other* small storefronts that
want the same kind of product-recommendation assistant for their own catalog. This is the
concrete, honest version of "we sell AI agents" — selling something WhyAI actually built, tested,
and uses itself, rather than an agent that only exists as a product listing. Whether and how to
package it this way is a decision for after Chapter 11 is working and reviewed, not before.
