# Chapter 5: Tool Use & Function Calling — How an Agent Actually Does Things

## 5.1 What a "tool" really is

A tool is nothing exotic: **it's a regular function you already know how to write**, with three
things added so a language model can decide to call it:

1. A **name** — a short identifier, e.g. `search_products`.
2. A **description** — plain English explaining what it does and when to use it. This is the
   *only* thing the model has to decide whether and when to call it — vague or missing descriptions
   are the single most common cause of an agent calling the wrong tool, or not calling one when it
   should.
3. An **input schema** — a precise specification of what arguments it takes (names, types, which
   are required), written in **JSON Schema**, a standard format for describing the shape of data.

The model never runs your function directly — it has no ability to execute code. What it does is
**request** a call, by producing structured output naming the tool and its arguments; your own
code is what actually runs the function and hands back the result. This is why Chapter 3 §3.2 drew
"act" as a step the *orchestrator* performs, not the model itself.

## 5.2 A concrete tool definition

```ts
{
  name: "search_products",
  description: "Search WhyAI's catalog of ebooks and AI agents by keyword or topic. Use this whenever a customer asks what's available, mentions a topic they're interested in, or asks for a recommendation.",
  input_schema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Keywords describing what the customer is looking for" },
      product_type: { type: "string", enum: ["ebook", "agent", "any"], description: "Restrict the search to one product type, or 'any' for both" },
    },
    required: ["query"],
  },
}
```

Notice there's no code here yet — this is purely the *description* of the tool, which is what gets
sent to the model alongside the conversation. Chapter 11 pairs this exact definition with its real
implementation.

## 5.3 Function calling, the mechanism

"Function calling" is the industry term for what §5.1 describes: a model trained to recognize when
a task calls for an available tool, and to produce its request in a strict, structured format (not
casual prose like "I think you should search for X") so your code can parse it reliably every time
— no fragile text-matching required. When Claude decides to call a tool, its response contains a
distinctly-typed `tool_use` block with the exact tool name and a JSON object of arguments that
*already matches* the schema you provided — Chapter 3 §3.4 showed exactly where this appears in
the API response.

## 5.4 Common categories of tools, with real examples

- **Data lookup tools** — read-only queries against your own data: `search_products`,
  `get_product_details(id)`. The overwhelming majority of a typical business agent's tools fall
  here, and they're the lowest-risk category — a lookup can't modify anything.
- **Action tools** — tools that change state: `add_to_cart`, `create_support_ticket`,
  `send_email`. These carry real consequences if called incorrectly or too eagerly, which is
  exactly why Chapter 9 discusses requiring human confirmation before anything in this category
  actually executes for the first time a new agent is deployed.
- **External API tools** — wrapping a third-party service (a shipping-rate API, a payment
  provider's status check) as a tool, so the agent can incorporate real-world, live information.
- **Code execution as a tool** — some platforms (including Claude's own API) offer a built-in
  tool that lets the model write and run small scripts itself, useful for calculations or data
  transformations too fiddly to hand-code a dedicated tool for.
- **Search tools** — letting an agent look something up on the live web when its own data isn't
  enough; a specialized case of "external API tool" common enough to usually ship as a built-in,
  pre-built tool on the platform itself rather than something you write by hand.

## 5.5 Why schemas matter more than they look like they should

A loose schema (`{ query: "string" }` with no `enum`, no `description`, no `required`) still
technically works, but produces an agent that calls tools with inconsistent, hard-to-validate
arguments — a customer asking in Hindi, French, or broken English might produce wildly different
`query` strings, and a `product_type` field left as a free-form string instead of a fixed `enum`
will eventually come back as `"books"` or `"ebook "` (trailing space) instead of the exact value
your matching code expects. Tight schemas — explicit `enum`s, `required` fields, clear
`description`s — are the cheapest reliability improvement available in agent design, and cost
nothing extra to write. Chapter 11's tools are deliberately written this way.

## 5.6 Validate what comes back, always

A model-generated tool call is **untrusted input to your own code** — treat it exactly like you'd
treat a value typed into a web form by a stranger. Before running a tool's handler, validate the
parsed arguments actually match what you expect (right types, values within range, no unexpected
extra fields) rather than trusting the schema alone guarantees it — Chapter 11's code does this
explicitly, and Chapter 9 covers why this matters most for any tool that can change state or touch
a filesystem/network resource.
