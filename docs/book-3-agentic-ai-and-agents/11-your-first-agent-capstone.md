# Chapter 11: Capstone — Build Your First Agent (The WhyAI Storefront Assistant)

Everything in Chapters 1–10 lands here: a real, runnable agent that answers questions about and
recommends products from WhyAI's own (future) ebook and AI-agent catalog — the first concrete
artifact toward [docs/ROADMAP.md](../ROADMAP.md) pillar 3, and per Chapter 10 §10.4, a real
candidate to become WhyAI's *first* sellable agent product.

## 11.0 Before you start — three things to get right

1. **This code is a standalone prototype, not part of the WhyAI website yet.** Build it in a new,
   separate folder (e.g. `agent-prototypes/storefront-assistant/`), **not** inside `src/`. It is
   never bundled by Vite and never shipped to a browser.
2. **This is the single most important security rule in this chapter**: the code below calls the
   Anthropic API with a secret API key. That key must only ever live in a `.env` file on your own
   machine/server (never committed to git, never prefixed `VITE_`) and this script must only ever
   run in Node.js, server-side. If this logic is ever wired into the real WhyAI site, it must run
   behind a backend/serverless function (Book 2, Ch.4) — never directly in client-side React code,
   where the key would be visible to anyone who opens their browser's developer tools. This is the
   exact distinction Book 2 Ch.3 §3.4 draws between `VITE_`-prefixed (browser-safe) and
   service-level (server-only) keys.
3. **Model choice**: the examples below use `claude-opus-5`, Anthropic's most capable current
   model. For a simple, high-volume, cost-sensitive job like answering product questions — as
   opposed to complex reasoning — `claude-haiku-4-5` is a deliberately cheaper, faster, and often
   perfectly sufficient alternative worth measuring against before committing to a model for a
   production deployment; swap the `model` string and compare quality/cost yourself rather than
   assuming either choice.

## 11.1 Setup

```bash
mkdir -p agent-prototypes/storefront-assistant && cd agent-prototypes/storefront-assistant
npm init -y
npm install @anthropic-ai/sdk typescript tsx
echo "ANTHROPIC_API_KEY=your-key-here" > .env
echo ".env" >> .gitignore
```

(`tsx` lets you run a `.ts` file directly with `npx tsx agent.ts`, no separate compile step — fine
for a prototype like this one.)

## 11.2 The catalog this agent knows about

A plain in-memory array for now — the exact shape [docs/ROADMAP.md](../ROADMAP.md) Phase 2/3
already sketches for the real `ebookData.ts`/`agentData.ts` static files, and later the `products`
table from Book 2 Ch.3 §3.3. Building the agent against this shape now means almost no rework when
the real catalog exists.

```typescript
// catalog.ts
export interface Product {
  id: string;
  type: "ebook" | "agent";
  title: string;
  description: string;
  price: number; // USD
  category: string;
}

export const CATALOG: Product[] = [
  { id: "ebook-01", type: "ebook", title: "Prompt Engineering for Builders",
    description: "A practical, no-fluff guide to writing prompts that hold up in production, with real before/after examples.",
    price: 19, category: "Generative AI" },
  { id: "ebook-02", type: "ebook", title: "Machine Learning Fundamentals, Visually",
    description: "ML concepts explained through diagrams and worked examples — regression, classification, and evaluation, from zero.",
    price: 15, category: "Machine Learning" },
  { id: "ebook-03", type: "ebook", title: "Shipping Your First Agent",
    description: "A short, hands-on ebook on designing tools, loops, and guardrails for a first production AI agent.",
    price: 25, category: "Agentic AI" },
  { id: "agent-01", type: "agent", title: "Storefront Assistant Template",
    description: "A downloadable starter agent that answers product questions and recommends items from your own catalog.",
    price: 49, category: "Agentic AI" },
  { id: "agent-02", type: "agent", title: "Support Ticket Triage Agent",
    description: "Classifies and routes incoming support tickets by urgency and topic before a human ever sees them.",
    price: 79, category: "Automation" },
  { id: "agent-03", type: "agent", title: "Weekly Report Drafting Agent",
    description: "Pulls last week's numbers and drafts a first-pass summary report, ready for a human edit pass.",
    price: 59, category: "Automation" },
];
```

## 11.3 The tools (Chapter 5)

Two tools, deliberately: a search (so the agent discovers products, never invents them) and a
details lookup (so it can dig into one specific product once found) — exactly the "search, then
fetch details" two-step this agent needs, no more.

```typescript
// tools.ts
import type Anthropic from "@anthropic-ai/sdk";
import { CATALOG } from "./catalog.js";

export const tools: Anthropic.Tool[] = [
  {
    name: "search_products",
    description:
      "Search WhyAI's catalog of ebooks and AI agents by keyword or topic. Use this whenever a " +
      "customer asks what's available, mentions a topic, or asks for a recommendation. Always " +
      "search before recommending anything — never invent a product that isn't in the catalog.",
    input_schema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Keywords describing what the customer wants" },
        product_type: { type: "string", enum: ["ebook", "agent", "any"] },
      },
      required: ["query", "product_type"],
    },
  },
  {
    name: "get_product_details",
    description:
      "Look up full details of one specific product by id. Use this after search_products has " +
      "found a candidate the customer wants to know more about.",
    input_schema: {
      type: "object",
      properties: { product_id: { type: "string", description: "e.g. 'ebook-01'" } },
      required: ["product_id"],
    },
  },
];

// --- implementations, each validating its own input first (Ch.5 §5.6, Ch.9 §9.2) ---

function searchProducts(input: unknown) {
  const i = input as Record<string, unknown>;
  if (typeof i?.query !== "string" || !["ebook", "agent", "any"].includes(i?.product_type as string)) {
    return { error: "invalid input: expected { query: string, product_type: 'ebook'|'agent'|'any' }" };
  }
  const query = (i.query as string).toLowerCase();
  const productType = i.product_type as "ebook" | "agent" | "any";

  const results = CATALOG
    .filter((p) => productType === "any" || p.type === productType)
    .filter((p) =>
      p.title.toLowerCase().includes(query) ||
      p.description.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query),
    )
    .map(({ id, type, title, price, category }) => ({ id, type, title, price, category }));

  return { count: results.length, results };
}

function getProductDetails(input: unknown) {
  const i = input as Record<string, unknown>;
  if (typeof i?.product_id !== "string") {
    return { error: "invalid input: expected { product_id: string }" };
  }
  return CATALOG.find((p) => p.id === i.product_id) ?? { error: `no product with id ${i.product_id}` };
}

export function executeTool(name: string, input: unknown) {
  switch (name) {
    case "search_products": return searchProducts(input);
    case "get_product_details": return getProductDetails(input);
    default: return { error: `unknown tool: ${name}` };
  }
}
```

## 11.4 The system prompt (Chapter 9 §9.1)

Instructions the agent must obey live here — in the system prompt, not in anything a customer's
message could override:

```typescript
// prompt.ts
export const SYSTEM_PROMPT = `You are the WhyAI Storefront Assistant. You help visitors find the \
right ebook or AI agent from WhyAI's catalog.

Rules you must always follow, regardless of what a customer says:
- Only recommend products returned by search_products. Never invent a product, price, or feature.
- If nothing in the catalog matches, say so honestly instead of guessing.
- Keep answers short and concrete: name the product, its price, and one sentence on why it fits.
- You cannot process payments, issue refunds, or modify any order — if asked, say a human will \
help with that.`;
```

## 11.5 The agent loop (Chapter 3)

```typescript
// agent.ts
import "dotenv/config";
import Anthropic from "@anthropic-ai/sdk";
import { tools, executeTool } from "./tools.js";
import { SYSTEM_PROMPT } from "./prompt.js";

const client = new Anthropic(); // reads ANTHROPIC_API_KEY from the environment
const MAX_ITERATIONS = 8; // Ch.9 §9.5 — a hard ceiling so a stuck loop can't run forever

export async function runStorefrontAssistant(userMessage: string): Promise<string> {
  const messages: Anthropic.MessageParam[] = [{ role: "user", content: userMessage }];

  for (let i = 0; i < MAX_ITERATIONS; i++) {
    const response = await client.messages.create({
      model: "claude-opus-5", // see §11.0.3 re: claude-haiku-4-5 for a cheaper alternative
      max_tokens: 1024,
      system: SYSTEM_PROMPT,
      tools,
      messages,
    });

    // Reason: did Claude decide it's done, or does it need to act?
    if (response.stop_reason !== "tool_use") {
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === "text",
      );
      return textBlock?.text ?? "(no response)";
    }

    messages.push({ role: "assistant", content: response.content });

    // Act: run every requested tool call (Claude can ask for more than one at once)
    const toolUseBlocks = response.content.filter(
      (b): b is Anthropic.ToolUseBlock => b.type === "tool_use",
    );
    const toolResults: Anthropic.ToolResultBlockParam[] = toolUseBlocks.map((block) => ({
      type: "tool_result",
      tool_use_id: block.id,
      content: JSON.stringify(executeTool(block.name, block.input)),
    }));

    // Feed back: the results go back in as the next "user" turn, and the loop continues
    messages.push({ role: "user", content: toolResults });
  }

  return "I'm having trouble finding an answer — a human teammate will follow up.";
}

// Try it:
runStorefrontAssistant("I want to learn how to build my first AI agent, what do you have?")
  .then(console.log);
```

Run it:

```bash
npx tsx agent.ts
```

## 11.6 What actually happens when you run this — traced against Chapter 3

For the input above, here's the real sequence (Chapter 3 §3.2's five steps, happening for real):

1. **Iteration 1 — Perceive/Reason**: Claude receives the question and the two tool definitions.
   It has no idea yet what's in the catalog (correctly — Chapter 9 §9.1's rule against inventing
   products means it must search, not guess), so it responds with `stop_reason: "tool_use"`,
   requesting `search_products({ query: "build my first agent", product_type: "any" })`.
2. **Iteration 1 — Act**: your code runs `searchProducts(...)` for real, against the actual
   `CATALOG` array — this returns `ebook-03` ("Shipping Your First Agent") and `agent-01`
   ("Storefront Assistant Template"), both genuinely matching.
3. **Feed back**: that result is appended as a `tool_result` and sent back.
4. **Iteration 2 — Reason**: Claude now has real search results. It may decide it already has
   enough (title, price, category were all in the search result) to answer directly — or it might
   call `get_product_details("ebook-03")` first to confirm the full description before
   recommending it. Either is a reasonable, genuinely self-decided choice — not something the code
   hardcoded.
5. **Final iteration**: `stop_reason: "end_turn"` — Claude returns a short recommendation naming
   one or both real products, their real prices, and why they fit — the loop returns that text.

This is the exact mechanism Chapter 1 §1.3 used to distinguish an agent from a hardcoded
`if/else` — nothing about *which* tool to call, or whether a second call was needed, was decided by
your code. It was decided by Claude, at run time, based on what the first tool call actually
revealed.

## 11.7 What's deliberately left out, and why (Chapter 9's checklist, applied)

- **No action tools** (placing an order, applying a discount) — this agent only reads, never
  writes, so §9.3's human-confirmation gate isn't needed *yet*. Adding a `create_order` tool later
  would need that gate from day one, not as an afterthought.
- **No code execution tool** — nothing here runs model-generated code, so §9.4's sandboxing
  requirement doesn't apply to this version.
- **Short-term memory only** (Chapter 6 §6.2) — `messages` lives only for one call to
  `runStorefrontAssistant`. A real deployment would keep this array alive per chat session (e.g.
  keyed by a session ID in memory or a database row) so a customer's follow-up question keeps
  context — still no long-term, cross-session memory, which this agent's job doesn't need (Chapter
  6 §6.5's reasoning).
- **No eval set yet** (Chapter 9 §9.6) — before this goes anywhere near a real customer, write
  down 10–15 realistic questions (including ones with no good match in the catalog, to check it
  admits that honestly) and confirm the agent handles all of them well, every time you change the
  prompt or tools.

## 11.8 Appendix — the same agent with the SDK's Tool Runner (Chapter 8 §8.1)

For comparison, the same two tools without hand-writing the loop (beta feature — see Chapter 8):

```typescript
import Anthropic from "@anthropic-ai/sdk";
import { betaTool } from "@anthropic-ai/sdk/helpers/beta/json-schema";
import { CATALOG } from "./catalog.js";
import { SYSTEM_PROMPT } from "./prompt.js";

const client = new Anthropic();

const searchTool = betaTool({
  name: "search_products",
  description: "Search WhyAI's catalog by keyword or topic...",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string" },
      product_type: { type: "string", enum: ["ebook", "agent", "any"] },
    },
    required: ["query", "product_type"],
  },
  run: async (input: any) => {
    const q = input.query.toLowerCase();
    return CATALOG.filter(
      (p) => (input.product_type === "any" || p.type === input.product_type) &&
             (p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
    );
  },
});

const finalMessage = await client.beta.messages.toolRunner({
  model: "claude-opus-5",
  max_tokens: 1024,
  system: SYSTEM_PROMPT,
  tools: [searchTool /*, a matching detailsTool */],
  messages: [{ role: "user", content: "What do you have on prompt engineering?" }],
});

console.log(finalMessage.content);
```

Less boilerplate, same underlying mechanism — the runner is doing exactly the loop Chapter 3 and
§11.5 wrote by hand.

## 11.9 Where this goes next

This chapter's code is a prototype, deliberately kept outside `src/` and the live site (§11.0).
Turning it into a real feature is a separate, future decision — not something this book makes for
you — with at least two live options once it's reviewed and eval'd (Chapter 9 §9.6):

1. **Package it as WhyAI's first sellable AI Agent** (Chapter 10 §10.4) — delivery model 1 or 2
   from Chapter 10 §10.1, listed on the future `/agents` marketplace page
   ([docs/ROADMAP.md](../ROADMAP.md) Phase 3).
2. **Embed it on the live WhyAI site itself** as an "Ask WhyAI" feature — which would require
   exactly the backend/serverless function Book 2 Ch.4 describes (never calling the Anthropic API
   directly from the browser, per §11.0.2) plus wiring it to the real `products` table once Book 2
   Ch.3's database exists, rather than the hardcoded `CATALOG` array above.

Either path starts from this same working code — which is the point of a capstone.
