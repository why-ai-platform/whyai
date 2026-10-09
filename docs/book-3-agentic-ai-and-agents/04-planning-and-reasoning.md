# Chapter 4: Planning & Reasoning — How an Agent Decides What to Do Next

## 4.1 Chain-of-thought — thinking in steps, out loud

The foundational technique: instead of jumping straight to an answer, the model is encouraged (by
the prompt, or natively via "extended thinking" — a mode where the model reasons at length before
answering) to work through a problem step by step, the way a person would on paper, before
committing to a final response. This alone measurably improves accuracy on anything involving
multi-step logic, because it gives the model room to catch its own mistakes before they become the
final answer, rather than the final answer being a single immediate guess.

## 4.2 ReAct — Reason + Act, interleaved

**ReAct** is the specific pattern underlying Chapter 3's loop: alternating between reasoning
("I should check the product's price before recommending it") and acting (actually calling the
tool that checks the price), rather than planning the *entire* multi-step task upfront and then
blindly executing every step. The benefit: each action's real result can change the plan. If the
price-check tool fails or returns something unexpected, a ReAct agent reasons about *that* before
its next action — a rigid upfront plan has no way to adapt mid-execution.

## 4.3 Plan-and-Execute — deciding the whole route first

The alternative to ReAct: have the model lay out a full multi-step plan *before* taking any action
("1. search for ebooks on X, 2. check which are in stock, 3. compare prices, 4. recommend the
cheapest"), then execute each step. This trades adaptability for predictability and efficiency —
useful when steps are unlikely to change based on each other's results, and when you want to show
a user the plan before any action runs (useful for anything irreversible, like a purchase — tying
directly into Chapter 9's human-in-the-loop safety pattern).

## 4.4 Task decomposition — breaking a big goal into small ones

Many real goals are too large for one loop iteration to make progress on directly. "Help this
customer pick the right AI agent for their business" decomposes into smaller sub-goals: understand
their business type, search relevant listings, compare a shortlist, explain the tradeoffs. A
well-designed agent (or its system prompt) breaks a vague big goal into concrete, individually
achievable steps — this is what separates an agent that visibly "wanders" from one that makes
steady, legible progress.

## 4.5 Self-reflection / self-critique — checking your own work

A powerful, simple technique: after producing a draft answer or completing a step, have the agent
(in a separate reasoning pass) critique its own output against the original goal before presenting
it — "does this recommendation actually match what the customer asked for? Did I check the price
before suggesting it?" This catches a category of error that no amount of better *initial*
reasoning fully prevents: compounding small mistakes across a multi-step task. It costs an extra
model call but materially raises reliability for anything customer-facing.

## 4.6 Tree-of-thought / exploring multiple paths

For harder problems, rather than committing to one line of reasoning, an agent can explore several
candidate approaches in parallel (or in sequence, backtracking when one doesn't pan out), and pick
the best one. This is rarely necessary for straightforward business-automation agents (like
Chapter 11's storefront assistant) and is more relevant for genuinely open-ended problems (complex
coding tasks, research); mentioned here so the term is recognized, not because WhyAI's early agents
need it.

## 4.7 Which of these does Chapter 11's capstone actually use?

**ReAct** — it's the natural fit for a conversational storefront assistant: each customer message
is reasoned about and acted on (a tool call, if needed) one step at a time, adapting to what each
tool call reveals, exactly matching Chapter 3's loop. The other patterns in this chapter are
presented so you recognize when a *more* complex agent (multi-step research, an agent that plans a
whole content calendar) would call for Plan-and-Execute or explicit task decomposition instead —
useful vocabulary for Chapter 10's discussion of what's worth building and selling as a product.
