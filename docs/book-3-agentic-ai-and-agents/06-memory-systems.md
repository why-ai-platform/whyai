# Chapter 6: Memory Systems — What an Agent Remembers, and Where

## 6.1 The context window is not memory — it's working attention

Every model has a maximum amount of text it can consider at once (its **context window** — see
Book 2's glossary for the general concept). The full message history from Chapter 3 lives inside
this window during one conversation. This is **not** memory in the sense of "the agent remembers
you" — close the chat, lose the window, and everything in it is gone unless something *outside*
the model explicitly saved it. Everything in this chapter is about that "outside" part.

## 6.2 Short-term (session) memory

The simplest real memory: the running message history itself, kept alive for the duration of one
session/conversation by your own code (an array in memory, or a row in a database keyed by session
ID) and resent to the model on every turn (the API itself is stateless — Book 2 Ch.1 §1.3 — it
remembers nothing between requests on its own). This is enough for "remember what the customer said
three messages ago, in this conversation" — exactly what Chapter 11's agent needs, and all it
needs, for a reasonably short support/sales conversation.

## 6.3 Long-term memory — remembering across sessions

For an agent that should recall a specific customer across *separate* visits ("welcome back, last
time you were looking at our agent-building ebook"), something has to persist the relevant facts
outside any one conversation's history — typically a real database (Book 2 Ch.3): a row per
customer, storing what's worth remembering. This is architecturally the same problem Book 2 Ch.3
already solves for WhyAI's course progress and purchase history — "agent memory" and "application
data" are often just the same database, read by a tool instead of directly by a page.

## 6.4 Semantic memory and embeddings — remembering by meaning, not exact match

Looking something up by an exact ID (`get_product_details("ebook-42")`) is easy. Looking something
up by *meaning* ("something like what I bought last time, but shorter") is harder — this is what
**embeddings** solve: a way of converting text into a list of numbers (a vector) such that
texts with similar *meaning* end up as similar vectors, even if they share no exact words. A
**vector database** stores these and can answer "find me the stored items whose meaning is closest
to this new piece of text" — the mechanism behind **RAG** (Retrieval-Augmented Generation): instead
of (or in addition to) tool calls to a structured database, an agent can retrieve the most
*semantically relevant* chunks of text (product descriptions, past support answers, documentation)
and include them in its context before answering.

## 6.5 Does WhyAI's capstone agent need any of this?

**No — and that's a deliberate, instructive choice.** Chapter 11's storefront assistant uses only
short-term memory (§6.2): the conversation history for one chat session, resent on every turn. The
product catalog is small and well-structured enough that a plain keyword/structured search tool
(Chapter 5) finds the right ebook/agent without needing semantic search over embeddings — a classic
case of **not reaching for the more sophisticated tool before the simple one has been shown to
fail**. If WhyAI's catalog later grows to hundreds of products with overlapping, hard-to-keyword
descriptions, §6.4's embeddings approach is the natural next step — but building it before that
point would be solving a problem that doesn't exist yet, the same principle Book 2 Ch.9 applies to
infrastructure scaling generally.

## 6.6 A practical warning: memory is also a security surface

Anything an agent remembers about a customer is customer data, with all the same obligations as any
other stored personal data (Book 2 Ch.5, [docs/ROADMAP.md](../ROADMAP.md) §6 risk #11) — don't
store more than the agent actually needs, and apply the same Row Level Security thinking (Book 2
Ch.5 §5.4) so one customer's agent memory is never readable by another customer's session.
