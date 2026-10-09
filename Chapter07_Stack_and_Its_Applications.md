# Chapter 7: Stack and Its Applications

**Topic:** Programming in Modern C++ — From C to C++

**Prerequisites:** Chapters 1–6 (arrays, structures, pointers, `std::vector`).

**What you will learn**
- What a stack is and the four operations that define it.
- How to implement a stack in C, and what that implementation costs you.
- Two classic applications: string reversal and postfix expression evaluation.
- How `std::stack` provides the same thing ready-made, for any element type.
- What other containers the C++ standard library offers.

---

## 1. Introduction

This chapter follows the same pattern as the previous two: build something by hand
in C, then obtain it ready-made from the C++ standard library. The subject is the
**stack**, illustrated through two applications — reversing a string and
evaluating a postfix expression.

---

## 2. Stack Recap

A **stack** is a LIFO (last-in, first-out) container holding an arbitrary number of
items, all of the same type. Think of a stack of plates: you add to the top and
remove from the top.

```
 push(E)                      pop()
    │                           │
    ▼                           ▲
  ┌───┐ ← top                 ┌───┐ ← E removed first
  │ E │                       │ E │
  ├───┤                       ├───┤
  │ D │                       │ D │
  ├───┤                       ├───┤
  │ C │                       │ C │
  └───┘                       └───┘
```

Unlike an array, a stack is **conceptually unbounded** — its definition places no
limit on how many items it holds.

### 2.1 Building one in C

The typical steps:

1. Decide the element's data type.
2. Define a structure to hold the elements. In C this requires choosing some
   **maximum size**, because the compiler must know the array's extent.
3. Declare a `top` marker.
4. Implement four operations:

| Operation | Meaning |
|---|---|
| `push(x)` | add `x` to the top |
| `pop()` | remove the top element |
| `top()` | return the top element **without** removing it |
| `empty()` | report whether any elements exist |

`empty()` is not optional: `pop()` and `top()` are both invalid on an empty stack,
so callers need a way to check first.

### 2.2 The limitation

Changing the element type means **rewriting the whole implementation**. A stack of
`char` and a stack of `double` share every line of logic and not one line of code.

Contrast this with `sqrt`, `sin`, or `atan`, which any caller can use directly. The
C standard library provides **no** ready-to-use stack at all, so every project
reinvents it — usually several times, once per element type.

---

## 3. Two Problems Solved with a Stack

### 3.1 String reversal

Reverse the character order of a string: `"ABCDE"` → `"EDCBA"`. Push every
character, then pop them all — LIFO does the reversing for free.

### 3.2 Postfix expression evaluation

In the **infix** notation we normally write, operators sit *between* their operands,
so evaluation requires knowing precedence and associativity:

```
1 + 2 * 3 - 4
```

You must evaluate `2 * 3` first (higher precedence), then apply `+` and `-`
left-to-right:

```
1 + 6 - 4  →  7 - 4  →  3
```

In **postfix** notation (also called Reverse Polish Notation), the operator follows
its operands:

```
1 2 3 * + 4 -
```

No precedence rules and no parentheses are needed. Because each operator's **arity**
is known — here all are binary — the operands immediately preceding it belong to it.

**Algorithm.** Scan left to right:

- If the token is an operand, **push** it.
- If the token is an operator, **pop** as many operands as its arity requires,
  apply the operator, and **push** the result.
- At the end, the single remaining stack element is the answer.

**Walkthrough** of `1 2 3 * + 4 -`:

| Token | Action | Stack (bottom → top) |
|---|---|---|
| `1` | push 1 | `1` |
| `2` | push 2 | `1 2` |
| `3` | push 3 | `1 2 3` |
| `*` | pop 3, pop 2 → 2*3=6, push | `1 6` |
| `+` | pop 6, pop 1 → 1+6=7, push | `7` |
| `4` | push 4 | `7 4` |
| `-` | pop 4, pop 7 → 7-4=3, push | `3` |

Result: **3** — the same answer as the infix expression.

> **Order matters for non-commutative operators.** The *second* value popped is the
> left operand. For `7 4 -` you pop 4 then 7 and compute `7 - 4`, not `4 - 7`.

### 3.3 Other classic stack applications

- **Palindrome detection** — a sequence reading the same in both directions, with
  or without a centre marker.
- **Infix-to-postfix conversion** — the companion to the evaluator above.
- **Depth-first search** — the explicit-stack form of recursive traversal.
- **Function call management** — the call stack itself, including the return
  addresses and local variables of every active function.
- **Expression matching** — checking that brackets `()[]{}` are balanced.

The stack is one of the most broadly useful structures in software.

---

## 4. Reversing a String — C Implementation

The stack is a `struct` containing the container array and a `top` index.

```c
#include <stdio.h>

#define MAXSIZE 100

typedef struct {
    char data[MAXSIZE];     /* the container — fixed maximum size */
    int  top;               /* index of the top element            */
} Stack;

void init(Stack *s)  { s->top = -1; }               /* -1 means empty       */
int  empty(Stack *s) { return s->top == -1; }       /* -1 is not a valid index */
char top(Stack *s)   { return s->data[s->top]; }
void push(Stack *s, char c) { s->data[++s->top] = c; }   /* bump, then store */
void pop(Stack *s)   { if (!empty(s)) --s->top; }        /* check, then drop */

int main(void) {
    const char *str = "ABCDE";
    Stack s;
    init(&s);                                 /* must remember to initialize */

    for (int i = 0; str[i] != '\0'; ++i)
        push(&s, str[i]);                     /* pushes A, B, C, D, E        */

    while (!empty(&s)) {
        printf("%c", top(&s));                /* read the top                */
        pop(&s);                              /* then remove it              */
    }
    printf("\n");
    return 0;
}
```

```
EDCBA
```

Because `E` was pushed last, it comes out first, then `D`, and so on.

Note what the program contains: roughly twenty lines implementing a stack, plus
seven lines actually solving the problem. Note also the hazards — `push` does not
check for overflow, `init` must not be forgotten, and every call needs `&s`.

---

## 5. Postfix Evaluation — C Implementation

Same stack implementation, different client code. This version assumes
single-digit operands and binary operators.

```c
#include <stdio.h>
#include <ctype.h>

#define MAXSIZE 100

typedef struct { int data[MAXSIZE]; int top; } Stack;

void init(Stack *s)  { s->top = -1; }
int  empty(Stack *s) { return s->top == -1; }
int  top(Stack *s)   { return s->data[s->top]; }
void push(Stack *s, int v) { s->data[++s->top] = v; }
void pop(Stack *s)   { if (!empty(s)) --s->top; }

int evaluate(const char *expr) {
    Stack s;
    init(&s);

    for (int i = 0; expr[i] != '\0'; ++i) {
        char c = expr[i];

        if (isspace((unsigned char)c))
            continue;

        if (isdigit((unsigned char)c)) {        /* an operand */
            push(&s, c - '0');
        } else {                                 /* an operator */
            int right = top(&s); pop(&s);        /* popped FIRST  = right operand */
            int left  = top(&s); pop(&s);        /* popped SECOND = left  operand */
            int result = 0;
            switch (c) {
                case '+': result = left + right; break;
                case '-': result = left - right; break;
                case '*': result = left * right; break;
                case '/': result = left / right; break;
            }
            push(&s, result);
        }
    }
    return top(&s);
}

int main(void) {
    printf("%d\n", evaluate("1 2 3 * + 4 -"));   /*  3 */
    printf("%d\n", evaluate("5 1 2 + 4 * + 3 -"));/* 14 */
    return 0;
}
```

```
3
14
```

Limitations of this simplified version, worth being explicit about:

- Operands are single digits only (`c - '0'`).
- All operators are assumed binary. A fully general evaluator would need a table
  mapping each operator to its arity, and would pop that many operands.
- There is no error handling for malformed input, stack underflow, or
  division by zero.

---

## 6. The C++ Standard Library Stack

C++ provides a stack ready-made in the `<stack>` header. No implementation, no
maximum size, no `top` marker to initialize — and it works for **any** element
type.

```cpp
#include <iostream>
#include <stack>
#include <string>

int main() {
    std::string str = "ABCDE";
    std::stack<char> s;                  /* element type in angle brackets */

    for (char c : str)
        s.push(c);

    while (!s.empty()) {
        std::cout << s.top();
        s.pop();
    }
    std::cout << '\n';
    return 0;
}
```

```
EDCBA
```

### 6.1 Side-by-side comparison

| Operation | C (hand-written) | C++ (`std::stack`) |
|---|---|---|
| Declare | `Stack s;` + a type-specific implementation | `std::stack<char> s;` |
| Initialize | `init(&s);` | not needed |
| Push | `push(&s, item);` | `s.push(item);` |
| Pop | `pop(&s);` | `s.pop();` |
| Read top | `top(&s)` | `s.top()` |
| Is empty | `empty(&s)` | `s.empty()` |
| Count | write your own | `s.size()` |
| Max size | must be chosen in advance | unbounded (grows as needed) |
| Change element type | rewrite everything | change the angle brackets |

Two notational points:

**Member-function (dot) notation.** `s.push(item)` looks like structure member
access, and syntactically it is the same operator — but for an object it invokes a
**member function**. The object `s` is passed implicitly, which is why there is no
"which stack" parameter on every call. Chapter 19 onwards explains how this works.

**The angle brackets are a template argument.** `std::stack<char>` and
`std::stack<double>` are two different types generated from one piece of library
code. That is the mechanism C lacks, and it is why the C version must be rewritten
per element type. Templates are covered in Chapters 54–55.

### 6.2 Postfix evaluation in C++

The client logic is unchanged; only the stack code disappears.

```cpp
#include <iostream>
#include <stack>
#include <string>
#include <cctype>

int evaluate(const std::string &expr) {
    std::stack<int> s;

    for (char c : expr) {
        if (std::isspace(static_cast<unsigned char>(c)))
            continue;

        if (std::isdigit(static_cast<unsigned char>(c))) {
            s.push(c - '0');
        } else {
            int right = s.top(); s.pop();
            int left  = s.top(); s.pop();
            switch (c) {
                case '+': s.push(left + right); break;
                case '-': s.push(left - right); break;
                case '*': s.push(left * right); break;
                case '/': s.push(left / right); break;
            }
        }
    }
    return s.top();
}

int main() {
    std::cout << evaluate("1 2 3 * + 4 -")    << '\n';   /*  3 */
    std::cout << evaluate("5 1 2 + 4 * + 3 -") << '\n';  /* 14 */
    return 0;
}
```

The whole stack implementation — about twenty lines, plus the `MAXSIZE` guess — is
gone, and the program now works for expressions of any length.

### 6.3 A note on `pop()`

`std::stack::pop()` **removes** the top element but does **not** return it. To get
the value you read `top()` first, then `pop()`. This split exists for
exception-safety reasons: a function that both removed and returned the element
could lose it if the copy threw.

```cpp
int x = s.top();   /* read  */
s.pop();           /* remove */
```

---

## 7. Other Standard Library Containers

The standard library goes well beyond `stack`. The ones worth knowing early:

| Container | Header | Shape | Typical use |
|---|---|---|---|
| `std::vector` | `<vector>` | dynamic array | default sequence container |
| `std::stack` | `<stack>` | LIFO | undo history, DFS, expression evaluation |
| `std::queue` | `<queue>` | FIFO | task/job scheduling, BFS |
| `std::deque` | `<deque>` | double-ended queue | push/pop at both ends |
| `std::list` | `<list>` | doubly linked list | frequent middle insertion/removal |
| `std::forward_list` | `<forward_list>` | singly linked list | minimal-overhead list |
| `std::map` | `<map>` | sorted key→value | ordered lookup tables |
| `std::unordered_map` | `<unordered_map>` | hash key→value | fast average-case lookup |
| `std::set` | `<set>` | sorted unique keys | membership, union/intersection |
| `std::priority_queue` | `<queue>` | heap | always-need-the-largest problems |

A quick taste of three of them:

```cpp
#include <iostream>
#include <queue>
#include <map>
#include <set>
#include <string>

int main() {
    std::queue<int> q;
    q.push(1); q.push(2); q.push(3);
    std::cout << q.front() << '\n';          /* 1 — FIFO, not LIFO */

    std::map<std::string, int> ages;
    ages["Mia"] = 31;
    ages["Adam"] = 45;
    for (const auto &kv : ages)               /* iterates in key order */
        std::cout << kv.first << '=' << kv.second << ' ';
    std::cout << '\n';

    std::set<int> s = {3, 1, 4, 1, 5};        /* duplicates dropped */
    std::cout << s.size() << '\n';            /* 4                  */
    std::cout << s.count(4) << '\n';          /* 1 — membership test */
    return 0;
}
```

```
1
Adam=45 Mia=31
4
1
```

**Recommendation:** get familiar with these containers early — even before you have
mastered every language nuance. They make programs shorter, faster to write, and
substantially more robust, and they are the single highest-leverage part of the
standard library.

---

## 8. Common Pitfalls

| Pitfall | Consequence | Fix |
|---|---|---|
| `top()`/`pop()` on an empty stack | undefined behaviour | always check `empty()` first |
| Expecting `pop()` to return a value | compile error or confusion | read `top()`, then `pop()` |
| Popping operands in the wrong order | `4 - 7` instead of `7 - 4` | first pop is the **right** operand |
| Forgetting `init(&s)` in the C version | `top` holds garbage | initialize at declaration |
| Hand-written `push` with no overflow check | buffer overrun past `MAXSIZE` | check `top < MAXSIZE - 1` |
| Using a stack where a queue is needed | reversed processing order | pick the structure that matches the order |
| Hand-rolling a container "for speed" | slower and buggier than the library | measure before replacing |

---

## 9. Summary

- A stack is a LIFO container defined by four operations: `push`, `pop`, `top`,
  `empty`.
- Implementing one in C means choosing a maximum size, maintaining a `top` marker,
  writing four functions, and **rewriting all of it** for every new element type.
  The C standard library offers no stack at all.
- `std::stack` eliminates all of that: no implementation code, no size limit, no
  initialization, and it works for any element type via the angle-bracket
  (template) notation.
- Both applications — string reversal and postfix evaluation — keep exactly the
  same logic in C++; only the hand-written infrastructure disappears.
- The standard library provides the whole family of common data structures:
  `vector`, `queue`, `deque`, `list`, `map`, `set`, `priority_queue`, and more.

---

## 10. Exercises

1. Add overflow checking to the C `push` function. Then explain why `std::stack`
   does not need it.
2. Use a stack to check that the brackets in a string — `()`, `[]`, `{}` — are
   correctly balanced and nested.
3. Extend the postfix evaluator to handle multi-digit operands and the unary minus
   operator. Note where arity assumptions had to change.
4. Write a palindrome checker using a stack, then one using two indices. Compare
   their space usage.
5. Implement infix-to-postfix conversion (the shunting-yard algorithm) using
   `std::stack`.
6. Replace `std::stack<int>` with `std::stack<std::string>` in the reversal
   example and confirm that only the declaration changes.

---

**Next:** Chapter 8 begins the C++ language features proper, starting with `const`
and inline functions as replacements for the preprocessor's `#define`.
