# Chapter 3: Agent Architecture — The Loop, Piece by Piece

Chapter 1 §1.5 sketched the perceive → reason → act loop. This chapter names every real component
that implements it, so Chapter 11's code is recognizable the moment you see it.

## 3.1 The core components

- **The model (brain)** — Claude, called once per loop iteration. Given the conversation so far
  and a list of available tools, it decides either "I'm done, here's my final answer" or "I need to
  call this tool with these arguments."
- **The message history** — a running, ordered list of everything said and done so far: the
  original user request, the model's responses, each tool call, and each tool's result. This *is*
  the agent's working memory for the current task (Chapter 6 covers memory that persists *beyond*
  one task).
- **The tools** — functions the model can request to have run, each with a name, a description
  (so the model knows when to use it), and a schema describing what arguments it takes (Chapter 5).
- **The orchestrator (the loop itself)** — the plain code that: sends the current history to the
  model, checks whether it asked for a tool, actually runs that tool if so, appends the result to
  the history, and sends everything back — repeating until the model says it's done.
- **The stop condition** — what tells the loop to stop: the model producing a final answer with no
  further tool calls, hitting a maximum number of iterations (a safety limit — see Chapter 9), or
  an unrecoverable error.

## 3.2 One iteration, traced

Using Claude's API as the concrete example (full working version in Chapter 11):

1. **Perceive**: the orchestrator sends Claude the message history plus the tool definitions.
2. **Reason**: Claude's response comes back with a `stop_reason`. If it's `"tool_use"`, Claude has
   decided an action is needed and included which tool, with what arguments, as a structured
   (not free-text) block in its response.
3. **Act**: the orchestrator's code reads that tool name and arguments, actually runs the
   corresponding function (e.g. a real database query, a real search), and gets a real result.
4. **Feed back**: that result is appended to the message history as a `tool_result`, and the loop
   sends the updated history back to Claude — back to step 1, now with new information Claude didn't
   have before.
5. This repeats until Claude's `stop_reason` comes back as `"end_turn"` — no more tool calls, just
   a final text answer — which the loop then returns to whoever asked the original question.

## 3.3 Why the loop, and not one giant prompt

A natural question: why not just ask the model to figure everything out and answer in one shot? Two
reasons tool use/looping solves that a single prompt can't:

- **The model can't know things it wasn't told, and a prompt is finite.** A single prompt can't
  contain your entire product catalog, every customer's order history, and the current date, all
  up to date, every time. Tools let the agent fetch exactly the specific, current information it
  needs, exactly when it needs it, instead of requiring everything to be pre-loaded.
- **The right next step often depends on what a previous step revealed.** "Search for ebooks about
  prompt engineering, then check if any are on sale" genuinely requires seeing the search results
  *before* knowing which product's price to check — that's inherently sequential, which a single,
  one-shot prompt cannot express.

## 3.4 Where this maps onto real code

Every piece above has a direct, named counterpart in the Claude API (covered precisely in Chapter
5 and used for real in Chapter 11):

| Architecture piece | Claude API concept |
|---|---|
| Message history | the `messages` array passed to every request |
| Tools | the `tools` array, each with `name`, `description`, `input_schema` |
| Reason → decide to act | response `content` containing a `tool_use` block, `stop_reason: "tool_use"` |
| Act | your own function, called with the tool's `input` |
| Feed back | a `tool_result` block appended to `messages`, keyed by `tool_use_id` |
| Stop condition | `stop_reason: "end_turn"`, or a loop-iteration cap you set yourself |

With this vocabulary fixed, Chapter 4 goes deeper on the "reason" step — exactly how a model
decides *what* to do, not just *that* it should call a tool.
