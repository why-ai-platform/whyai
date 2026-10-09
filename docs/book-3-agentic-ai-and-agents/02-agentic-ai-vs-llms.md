# Chapter 2: Agentic AI vs. Generative AI — The Brain and the Body

## 2.1 A large language model, precisely

A large language model (LLM) — like Claude — is, at its core, a system that takes in text and
predicts what text should come next, trained on enormous amounts of writing. Ask it a question, it
generates an answer. Give it a document, it can summarize it. This alone is **generative AI**:
producing new content (text, and with other models, images/audio) from a prompt. Crucially, an
LLM by itself has no memory of anything beyond what's in front of it right now, and no way to *do*
anything in the world — it can only respond with text.

## 2.2 What turns an LLM into an agent

Nothing about the model itself changes. What's added is **scaffolding** around it:

- A **loop** that calls the model repeatedly instead of once (Chapter 1 §1.5).
- **Tools** the model can choose to invoke, whose results get fed back in (Chapter 5).
- **Memory** that persists across loop iterations and even across sessions (Chapter 6).
- A **goal**, given once, that the loop keeps checking progress against, rather than a single
  question-and-answer exchange.

This is why "agentic AI" isn't a different *kind* of AI model — it's a different way of **using**
a generative model. The same Claude model that writes a poem when asked directly is the exact model
doing the reasoning inside an agent's loop; the agent-ness comes entirely from the code wrapped
around it.

## 2.3 The brain/body analogy

A useful mental model: **the LLM is the brain, the scaffolding is the body.** The brain (the model)
can think and decide, but has no hands — it can't search a database or click "charge card" on its
own. The body (your code: the loop, the tool implementations, the memory store) gives the brain
limbs: a way to actually search, actually charge a card, actually send an email — and a way to see
the result of having done so. Neither half is an agent alone: a brain with no body can only talk; a
body with no brain just runs fixed scripts (back to "not an agent," Chapter 1 §1.2).

## 2.4 Why this distinction matters commercially

When WhyAI eventually sells "AI Agents" (pillar 3), customers are paying for the **body** — the
specific tools, the specific loop logic, the specific memory setup tailored to a specific job (a
customer-support agent, a content-drafting agent, a data-entry agent) — not for access to an LLM
itself, which anyone can already get directly from Anthropic, OpenAI, etc. The value WhyAI adds is
in designing a *good body* for a *specific brain* to inhabit: well-chosen tools, a sensible loop,
the right amount of autonomy for the job. Chapter 10 returns to this directly when discussing how
agents are actually priced and sold.

## 2.5 A word on terminology drift

"Agentic AI," "AI agents," and "autonomous agents" are used roughly interchangeably in the industry
today; none of them imply a different underlying model architecture — they all describe systems
built with the scaffolding in §2.2 around an LLM. Be skeptical of any product description that uses
"agent" without being able to say what tools it calls and what loop it runs — per Chapter 1 §1.2,
that's the concrete test for whether something actually is one.
