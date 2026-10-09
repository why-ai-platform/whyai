# Chapter 1: What Is an "Agent"?

## 1.1 The short definition

An **AI agent** is a system that: (1) is given a goal, not a single instruction, (2) decides for
itself what steps to take to reach that goal, (3) can take real actions — not just produce text —
and (4) uses the result of each action to decide its next step, repeating until the goal is done or
it gives up. The key word is **autonomy**: you don't tell it every step; you tell it the destination.

## 1.2 Three things that are *not* agents, to sharpen the definition

- **A plain chatbot.** You ask a question, it answers, conversation over. It doesn't take actions
  in the world (book a flight, query a database, run code) and it doesn't pursue a multi-step goal
  on its own — every reply is one isolated turn.
- **A script.** `for file in files: resize(file)` is entirely predetermined — every step was
  decided by the programmer in advance. An agent, by contrast, decides its own steps at
  **run time**, based on what it discovers along the way (if the resize fails, it might retry, try
  a different approach, or ask for help — a plain script does exactly what it's told, nothing more).
- **A single LLM API call.** Asking an LLM "write me a product description" and taking the first
  answer is a single step, not a loop. An agent might write a draft, check it against a style
  guide (a second step it decided to take), rewrite it, and only then present the result — multiple
  self-directed steps toward one goal.

## 1.3 A concrete example, side by side

**Not an agent** — a customer asks "do you have anything on prompt engineering?" and a hardcoded
`if query.includes("prompt")` returns a fixed product ID. Works for that one phrase, breaks for any
rephrasing, can't handle a follow-up question.

**An agent** — a customer asks the same question. The agent decides, on its own, to call a
`search_products` tool with a query it writes itself (not a hardcoded keyword match), reads the
results, decides whether they're actually relevant, and — if the customer then asks "is there
something shorter?" — uses what it already learned about the customer's interest to call
`search_products` again with different criteria, without anyone telling it to. This exact example
is what Chapter 11's capstone builds, for real.

## 1.4 Why this matters for WhyAI specifically

Pillar 3 of [docs/ROADMAP.md](../ROADMAP.md) is "sell AI agents" — which only makes sense as a
product if a buyer is getting genuine autonomous behavior, not a chatbot with a different name.
Understanding precisely where the line is (§1.2 above) is what stops "agent" from being a buzzword
slapped on a feature that doesn't actually have autonomy — both for building WhyAI's own agents
credibly, and for evaluating what's genuinely worth selling in the marketplace versus what's just a
scripted FAQ bot.

## 1.5 The loop, previewed

Every agent, no matter how simple or elaborate, runs some version of this loop:

```
 ┌─────────────┐
 │   PERCEIVE   │  ← read the current situation (a user message, a tool's result)
 └──────┬──────┘
        ▼
 ┌─────────────┐
 │    REASON    │  ← decide what to do next (Chapter 4)
 └──────┬──────┘
        ▼
 ┌─────────────┐
 │     ACT      │  ← take an action — call a tool (Chapter 5)
 └──────┬──────┘
        │
        └─── result feeds back into PERCEIVE ──→ repeat until done
```

Chapter 3 names each piece of this loop properly and shows exactly what code implements it.
Chapters 4–6 go deep on REASON, ACT, and what the agent remembers across loop iterations.
