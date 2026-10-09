# Chapter 1: Recap of C (Part I)

**Topic:** Programming in Modern C++ — Foundations

**Prerequisites:** Basic familiarity with any programming language.

**What you will learn**
- Why a C++ course begins with a recap of C.
- The built-in and derived type system of C.
- How variables, literals, operators, expressions, and statements fit together.
- The complete set of control-flow constructs and when each is appropriate.

---

## 1. Why Start With C?

C++ is an *object-oriented* (more precisely, *multi-paradigm*) language that was
designed to be **largely backward compatible** with C. Practically every valid C
program is also a valid C++ program, which means:

- Everything you know about C remains useful.
- Every C++ feature can be understood as "what problem in C does this solve?"

This first part of the material therefore recaps C deliberately: the standard
library, program organization, data types, variables, expressions, statements, and
control flow. Later chapters repeatedly contrast a C solution with the C++ solution
to the same problem.

---

## 2. Hello World

The classic first program, in the style of Kernighan & Ritchie:

```c
#include <stdio.h>

int main(void) {
    printf("Hello World\n");
    return 0;
}
```

Output:

```
Hello World
```

Points to notice:

| Element | Meaning |
|---|---|
| `#include <stdio.h>` | Brings in the declaration of `printf` from the **standard I/O** header. |
| `int main(void)` | Execution always starts at `main`. Its `int` result is the process exit status. |
| `printf` | Writes formatted text to **standard output** (the terminal, by default). |
| `\n` | Escape sequence for newline — moves the cursor to the next line. |
| `return 0` | Conventionally signals "completed successfully" to the operating system. |

> **Note:** without a standard library you could not even write this program. Every
> language ships a base library that every conforming compiler must provide.

---

## 3. Data Types

### 3.1 Built-in (fundamental) types

C provides four core built-in types, plus `bool` from C99 onwards:

```c
char   c = 'A';      /* a single character / small integer   */
int    i = 42;       /* an integer                           */
float  f = 3.14f;    /* single-precision floating point      */
double d = 3.14159;  /* double-precision floating point      */
_Bool  b = 1;        /* C99: true/false  (use <stdbool.h>)   */
```

### 3.2 Standards matter

- **C89** — the first ANSI standard. There was *no* Boolean type; Boolean values
  were plain `int`s with the convention `0 == false`, any non-zero value `== true`.
- **C99** — adds a distinct Boolean type (`_Bool`, with `bool`/`true`/`false`
  macros in `<stdbool.h>`), and makes literals carry `const`-qualified types
  (e.g. the literal `212` has type `const int` rather than being a bare constant).

Always compile with the standard you intend, e.g. `gcc -std=c99` or
`g++ -std=c++17`, so the behaviour you observe matches the behaviour you expect.

### 3.3 Every type has a size

The `sizeof` operator yields the size in bytes of a type or an object:

```c
#include <stdio.h>

int main(void) {
    printf("char   = %zu byte(s)\n", sizeof(char));
    printf("int    = %zu byte(s)\n", sizeof(int));
    printf("double = %zu byte(s)\n", sizeof(double));
    return 0;
}
```

Typical output on a 64-bit desktop platform:

```
char   = 1 byte(s)
int    = 4 byte(s)
double = 8 byte(s)
```

Exact sizes are **implementation-defined**; only minimum ranges are guaranteed by
the standard. Never hard-code `4` where you mean `sizeof(int)`.

### 3.4 Enumerations

An `enum` gives symbolic names to integer values:

```c
enum Color { RED, GREEN, BLUE };     /* RED == 0, GREEN == 1, BLUE == 2 */
enum Status { OK = 200, NOT_FOUND = 404, SERVER_ERROR = 500 };

enum Color wall = GREEN;
```

Enumerations make intent explicit and let the compiler help you, compared with
scattering bare integer literals ("magic numbers") through the code.

### 3.5 `void`

`void` is not a real type — it denotes the *absence* of a type, rather like a zero
in the type system. It appears in three roles:

```c
void  log_message(const char *s);   /* returns nothing            */
int   get_value(void);              /* takes no parameters        */
void *buffer;                       /* pointer to untyped memory  */
```

### 3.6 Derived types

Types built out of other types:

| Derived type | Example | Purpose |
|---|---|---|
| Array | `int a[10];` | Fixed-size sequence of same-typed elements. |
| Structure | `struct P { int x, y; };` | Group of (possibly differently typed) members. |
| Union | `union U { int i; double d; };` | Overlapping storage for one-of-several members. |
| Pointer | `int *p;` | Holds a memory address. |
| Function | `int f(int);` | Named, callable unit of computation. |

These are covered in detail in Chapter 2 and Chapter 3.

### 3.7 Strings are a convention, not a type

C has **no** string type. A "C string" is simply a `char` array terminated by the
null character `'\0'`, manipulated by the functions in `<string.h>`:

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char name[16] = "Modern C";    /* stores 'M','o',...,'C','\0'  */
    printf("length = %zu\n", strlen(name));   /* 8 — '\0' not counted */
    strcat(name, "++");
    printf("%s\n", name);                     /* Modern C++            */
    return 0;
}
```

```
length = 8
Modern C++
```

C++ replaces this error-prone convention with the `std::string` class.

### 3.8 Type modifiers

Four modifiers adjust the size and signedness of integer types:

```c
short int        s;   /* at least 16 bits              */
long int         l;   /* at least 32 bits              */
signed char      sc;  /* -128 .. 127 typically         */
unsigned int     u;   /* no negative values; wraps      */
```

```c
unsigned char u = 250;
u += 10;              /* wraps around: 250 + 10 == 260 mod 256 == 4 */
```

---

## 4. Variables

A variable is a named region of storage.

**Naming rules.** A name begins with a letter or underscore, followed by letters,
digits, or underscores. Names are case-sensitive.

```c
int   endOfSession;     /* good: states what it means          */
int   e;                /* poor: meaningless outside 3 lines   */
int   2fast;            /* ERROR: cannot begin with a digit    */
```

**Initialization is optional — but omitting it is a bug waiting to happen.**

```c
int i = 10;      /* defined and initialized                            */
int j;           /* defined but INDETERMINATE — reading it is undefined */

printf("%d\n", j);   /* undefined behaviour: could print anything      */
```

> **Rule of thumb:** initialize every variable at the point of declaration. In
> C++ you can usually also *delay* the declaration until you have a sensible
> initial value, which is better still.

---

## 5. Literals

The **form** of a literal determines its type and value:

```c
42        /* decimal int                    */
052       /* OCTAL   — leading 0  → 42      */
0x2A      /* HEX     — leading 0x → 42      */
0b101010  /* binary (C23 / common extension) → 42 */

3.14      /* double                         */
3.14f     /* float                          */
42L       /* long int                       */
42U       /* unsigned int                   */

'A'       /* character literal (single quotes) — type int in C, char in C++ */
"A"       /* string literal (double quotes) — a 2-char array: 'A', '\0'     */
```

A common beginner trap:

```c
int perms = 0755;    /* this is 493 decimal, NOT 755! */
```

From C99 onwards, literals are treated as `const`-typed data rather than as bare
"fixed values" the way C89 described them.

---

## 6. Operators

Three properties govern how operators combine into expressions.

### 6.1 Arity — how many operands

```c
-x          /* unary   : one operand            */
x + y       /* binary  : two operands           */
c ? a : b   /* ternary : three operands (the only one in C) */
```

### 6.2 Precedence — who binds tighter

```c
int r = 2 + 3 * 4;      /* 14, not 20: * has higher precedence than + */
int s = (2 + 3) * 4;    /* 20: parentheses override precedence        */
```

### 6.3 Associativity — order among equals

```c
int a = 100 / 10 / 2;   /* left-to-right : (100/10)/2 == 5          */
int x, y, z;
x = y = z = 7;          /* right-to-left : x = (y = (z = 7))        */
```

When in doubt, parenthesize. Code is read far more often than it is written.

---

## 7. Expressions

An expression is defined **recursively**:

1. Every literal is an expression. → `42`
2. Every variable is an expression. → `i`
3. Two expressions joined by a binary operator form an expression. → `i + 42`
4. Likewise for unary and ternary operators. → `-i`, `i ? i : 42`
5. A function call is an expression. → `sqrt(i + 42.0)`

So this is a single, legal expression built from all five rules:

```c
(i > 0) ? sqrt(i + 42.0) : -1.0
```

**Anything in C that has a value is an expression.** That includes assignment,
which is *why* chaining works:

```c
int a, b;
a = (b = 5) + 1;    /* b becomes 5; the assignment's value (5) is used → a == 6 */
```

---

## 8. Statements

Expressions cannot stand alone in a program body; they must be turned into
**statements**.

```c
/* 1. Null statement — does nothing, but is syntactically a statement */
;

/* 2. Expression statement — an expression followed by a semicolon     */
i + j;        /* legal, but useless: the value is computed and discarded */
sum = i + j;  /* useful: assignment expression, as a statement           */
printf("hi"); /* useful: function-call expression, as a statement        */

/* 3. Compound statement (block) — statements grouped with braces       */
{
    int temp = i;   /* temp lives only inside this block */
    i = j;
    j = temp;
}

/* 4. Control statement — alters the flow of execution                  */
if (i > j) { /* ... */ }
```

Note the distinction carefully: `i + j` is an *expression*; `i + j;` is a
*statement*. The same applies to assignments and function calls.

---

## 9. Control Constructs

The default flow is **fall-through**: the next statement executes after the
current one. Control constructs change that.

### 9.1 Selection — `if` / `if-else`

```c
if (score >= 90) {
    grade = 'A';
} else if (score >= 80) {
    grade = 'B';
} else {
    grade = 'C';
}
```

Always brace your branches, even single-statement ones — it prevents a whole class
of maintenance bugs.

### 9.2 Selection — `switch`

Multi-way selection on an *integral* value. Each `case` is a **labelled
statement**; `default` handles every unmatched value.

```c
#include <stdio.h>

void describe(char op) {
    switch (op) {
        case '+':
        case '-':
            printf("additive operator\n");
            break;          /* without break, control FALLS THROUGH */
        case '*':
        case '/':
            printf("multiplicative operator\n");
            break;
        default:
            printf("not an operator\n");
            break;
    }
}
```

The missing `break` is the single most common `switch` bug. When fall-through is
intentional (as with `'+'` and `'-'` above), say so in a comment.

### 9.3 Iteration — `for`

A `for` loop has four parts: initialization, condition (tested before every
iteration), body, and the end-of-loop step.

```c
int sum = 0;
for (int i = 1; i <= 10; ++i) {   /* init; condition; step */
    sum += i;                      /* body                  */
}
/* sum == 55 */
```

Declaring the index inside the parentheses (as above) scopes it to the loop. This
was not allowed in C89, but is allowed in C99 and in C++ — and is strongly
preferred, because it prevents the index from leaking into surrounding code.

### 9.4 Iteration — `while` and `do...while`

```c
/* while: test BEFORE the body — may run zero times */
int n = 1234, digits = 0;
while (n > 0) {
    n /= 10;
    ++digits;
}
/* digits == 4 */

/* do-while: test AFTER the body — always runs at least once */
int choice;
do {
    printf("Enter 1-3: ");
    scanf("%d", &choice);
} while (choice < 1 || choice > 3);
```

Choose `do...while` when the body must execute at least once (menus, retry loops);
choose `while` otherwise.

### 9.5 Jump statements

```c
for (int i = 0; i < 10; ++i) {
    if (i % 2 == 0) continue;   /* skip to the next iteration        */
    if (i > 7)      break;      /* leave the loop entirely           */
    printf("%d ", i);
}
/* prints: 1 3 5 7 */

int find(const int *a, int n, int key) {
    for (int i = 0; i < n; ++i)
        if (a[i] == key)
            return i;           /* return: leave the function        */
    return -1;
}
```

`goto` also exists, but is **advised against**: a well-structured program has no
need for it, and it makes control flow very hard to reason about.

```c
goto cleanup;      /* legal, but almost always the wrong tool */
```

---

## 10. Common Pitfalls

| Pitfall | Example | Fix |
|---|---|---|
| Assignment in a condition | `if (x = 5)` always true | `if (x == 5)` |
| Reading an uninitialized variable | `int j; use(j);` | `int j = 0;` |
| Accidental octal literal | `0755` is 493 | Write `755` |
| Missing `break` in `switch` | silent fall-through | Add `break`, or comment the intent |
| Hard-coded type sizes | `malloc(n * 4)` | `malloc(n * sizeof(int))` |
| Unsigned wrap-around | `unsigned u = 0; --u;` is huge | Use signed types for quantities that can go negative |

---

## 11. Summary

This chapter covered the ground floor of C, which is also the ground floor of C++:

- Basic input/output through the standard library.
- The type system: built-in types, `enum`, `void`, derived types, modifiers, and
  the fact that strings are a convention rather than a type.
- Variable definition and initialization, and why initialization matters.
- Literals and how their form determines their type.
- Operators (arity, precedence, associativity) and the recursive definition of
  expressions.
- How expressions become statements, and the four kinds of statement.
- The full set of control-flow constructs: selection, iteration, and jumps.

---

## 12. Exercises

1. Write a program that prints the size, in bytes, of every built-in type on your
   machine, and compare the results with a classmate on a different platform.
2. Predict the value of `1 + 2 * 3 - 4 / 2` without running it, then verify.
3. Rewrite the following `switch` as an `if`-`else` chain, and say which version
   reads better: a function mapping `1..7` to weekday names.
4. Using a `while` loop, reverse the digits of an integer (e.g. `1234` → `4321`).
5. Explain why `int j; printf("%d", j);` is undefined behaviour rather than
   merely "printing a random number".

---

**Next:** Chapter 2 covers the derived types of C in depth — arrays, structures,
unions, and pointers.
