# Chapter 4: Programs with I/O and Loops — First Steps in C++

**Topic:** Programming in Modern C++ — From C to C++

**Prerequisites:** Chapters 1–3 (the C recap).

**What you will learn**
- How C++ stream I/O replaces `printf`/`scanf`, and why that is an improvement.
- How namespaces work at the level you need to read and write everyday code.
- The naming convention that maps C standard headers onto C++ standard headers.
- Where variables may be declared in C++ and why that matters.
- The built-in `bool` type, and the history behind it.

---

## 1. Introduction

The C recap is complete. From here on, each topic is presented as a **contrast**:
a familiar task written in C, then the same task written in C++, with an
explanation of what C++ bought us.

This chapter covers the most immediately visible differences — input/output,
variable declarations, the maths library, standard-library header naming, loops,
and the `bool` type.

---

## 2. Hello World: C versus C++

**C:**

```c
#include <stdio.h>

int main() {
    printf("Hello World\n");
    return 0;
}
```

**C++:**

```cpp
#include <iostream>

int main() {
    std::cout << "Hello World" << std::endl;
    return 0;
}
```

Both print:

```
Hello World
```

What changed:

| Aspect | C | C++ |
|---|---|---|
| Header | `<stdio.h>` | `<iostream>` |
| Output target | `stdout` | `std::cout` |
| Mechanism | `printf` — a variadic function | `<<` — a binary operator |
| Newline | `"\n"` | `"\n"` or `std::endl` |
| Namespace | names are global | names live in `std` |

**`std::` is a namespace qualification.** `std` is the *standard namespace*; every
symbol in the C++ standard library lives inside it, so you write `std::cout`,
`std::cin`, `std::endl`.

**`<<` is an operator, not a variadic call.** `printf` takes an arbitrary number of
arguments described by a format string. `<<` is a plain binary operator: the stream
on the left, the thing to print on the right. Because it returns the stream, calls
chain naturally:

```cpp
std::cout << "Hello" << ' ' << "World" << '\n';
/* evaluates as ((((cout << "Hello") << ' ') << "World") << '\n') */
```

**`std::endl` versus `'\n'`.** C's `\n` escape still works in C++. `std::endl` is a
*stream manipulator* that writes a newline **and flushes** the stream. The flush
costs time, so in a loop that prints many lines, prefer `'\n'`:

```cpp
for (int i = 0; i < 1000000; ++i)
    std::cout << i << '\n';          /* fast                        */
    // std::cout << i << std::endl;  /* correct but flushes 10^6 times */
```

---

## 3. Basic I/O with Variables

Task: read two integers and print their sum.

**C:**

```c
#include <stdio.h>

int main() {
    int a, b, sum;             /* C89: all declarations come first */
    scanf("%d %d", &a, &b);    /* format string + ADDRESSES        */
    sum = a + b;
    printf("Sum = %d\n", sum);
    return 0;
}
```

**C++:**

```cpp
#include <iostream>

int main() {
    int a, b;
    std::cin >> a >> b;              /* no format string, no &     */
    int sum = a + b;                 /* declared where it is needed */
    std::cout << "Sum = " << sum << '\n';
    return 0;
}
```

Input `3 4` produces:

```
Sum = 7
```

Three differences are worth naming explicitly.

### 3.1 No format strings

In C, printing an `int` requires `%d`, a `double` requires `%f`, a `size_t`
requires `%zu`. Supply the wrong one and you get undefined behaviour with no
compile-time complaint.

In C++ the compiler already knows each operand's type and selects the correct
formatting automatically:

```cpp
int    i = 42;
double d = 3.14;
char   c = 'x';
std::string s = "text";

std::cout << i << ' ' << d << ' ' << c << ' ' << s << '\n';   /* all correct */
```

This is possible because `<<` is **overloaded** — there is a separate version for
each type. Operator overloading is covered in Chapters 15–16 and 33–34.

### 3.2 No address-of operator on input

`scanf` needs `&a` because C is call-by-value: without the address, `scanf` could
not write back into your variable. `std::cin >> a` needs just `a` — the mechanism
behind this is the **reference**, covered in Chapters 10–11.

```c
scanf("%d", a);      /* C BUG: forgot the & — likely crash, no warning by default */
```

```cpp
std::cin >> a;       /* C++: there is no & to forget */
```

### 3.3 Declarations may appear anywhere

In C89 all declarations in a block had to precede the first executable statement,
which is why `sum` had to be hoisted to the top in the C version. C++ removes that
restriction entirely, so you can declare a variable at the point where you first
have a sensible value for it:

```cpp
std::cin >> a >> b;
int sum = a + b;          /* declared AND initialized together */
```

This matters more than it looks: it eliminates the window during which a variable
exists but holds garbage. (C99 relaxed the same restriction, so modern C can do
this too.)

### 3.4 Checking that input succeeded

A stream converts to `false` when a read fails, so input validation is
straightforward:

```cpp
#include <iostream>

int main() {
    int a, b;
    if (!(std::cin >> a >> b)) {
        std::cerr << "Invalid input\n";
        return 1;
    }
    std::cout << "Sum = " << a + b << '\n';
    return 0;
}
```

`std::cerr` is the standard error stream — the counterpart of C's `stderr`.

---

## 4. The Maths Library

Task: compute a square root.

**C:**

```c
#include <stdio.h>
#include <math.h>

int main() {
    double x = 2.0;
    printf("sqrt(%g) = %g\n", x, sqrt(x));
    return 0;
}
```

**C++:**

```cpp
#include <iostream>
#include <cmath>

int main() {
    double x = 2.0;
    std::cout << "sqrt(" << x << ") = " << std::sqrt(x) << '\n';
    return 0;
}
```

```
sqrt(2) = 1.41421
```

Two conventions are at work:

1. **Header renaming.** A C standard header is used from C++ by prefixing its name
   with `c` and dropping the `.h`: `math.h` → `<cmath>`, `stdio.h` → `<cstdio>`,
   `stdlib.h` → `<cstdlib>`, `string.h` → `<cstring>`.
2. **Namespace migration.** The functions move into `std`, so `sqrt` becomes
   `std::sqrt`.

### 4.1 The `using` shortcut

Writing `std::` on every symbol becomes tiresome. A using-directive makes the whole
namespace visible in the current scope:

```cpp
#include <iostream>
#include <cmath>
using namespace std;          /* placed after the includes */

int main() {
    double x = 2.0;
    cout << "sqrt(" << x << ") = " << sqrt(x) << '\n';   /* no std:: needed */
    return 0;
}
```

> **Caution:** `using namespace std;` is fine in small single-file programs and in
> teaching examples, and it appears throughout these chapters for brevity. It is a
> poor idea in a **header file** or in a large program, because it drags thousands
> of names into scope and invites collisions. The targeted alternative is a
> *using-declaration*, which imports just what you need:
>
> ```cpp
> using std::cout;
> using std::endl;
> ```
>
> Namespaces are covered properly in Chapter 35.

---

## 5. Namespaces: C versus C++ Standard Libraries

In C, every standard library name is **global**, and therefore effectively
reserved. You cannot define your own `printf` while also using the library's:

```c
/* C: this collides with the library's printf */
int printf(const char *fmt, ...);   /* conflicting definition */
```

In C++, standard library names live in `std`, so your own names and the library's
coexist peacefully:

```cpp
#include <iostream>

namespace myapp {
    void print(const std::string &s) { std::cout << s << '\n'; }
}

int main() {
    myapp::print("no collision with std::print");
    return 0;
}
```

A useful analogy: a namespace is like a family name. Two people may share the given
name "Alex"; the family name distinguishes `smith::Alex` from `jones::Alex`.

---

## 6. Header Naming Conventions

Because C++ is backward compatible with C, a C program will generally compile as
C++ — including its use of the C standard library. The convention table:

| You are writing | Header is from | How to include | Namespace |
|---|---|---|---|
| C | C standard library | `#include <stdio.h>` | global |
| C++ | C standard library | `#include <cstdio>` | `std::` |
| C++ | C++ standard library | `#include <iostream>` | `std::` |
| C | C++ standard library | **not possible** | — |

The last row is not an oversight: C++ headers depend on C++-only features
(classes, templates, overloading) that a C compiler cannot parse.

> **Warning — deprecated header forms.** C++ headers with a `.h` extension, such as
> `<iostream.h>`, are **pre-standard** and were removed from the language. Some very
> old compilers still accept them silently. If `#include <iostream.h>` compiles on
> your system without an error, your toolchain is badly out of date — move to a
> current compiler and never use this form.

```cpp
#include <iostream.h>   /* WRONG: pre-standard, do not use */
#include <iostream>     /* correct                          */
```

---

## 7. Loops

Loops are essentially unchanged from C — only the I/O differs.

**C:**

```c
#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    int sum = 0;
    for (int i = 0; i <= n; ++i)
        sum += i;
    printf("Sum = %d\n", sum);
    return 0;
}
```

**C++:**

```cpp
#include <iostream>

int main() {
    int n;
    std::cin >> n;
    int sum = 0;
    for (int i = 0; i <= n; ++i)     /* i is scoped to the loop */
        sum += i;
    std::cout << "Sum = " << sum << '\n';
    return 0;
}
```

### 7.1 Loop-local index variables

Declaring the index inside the parentheses restricts its **scope** to the loop:

```cpp
for (int i = 0; i < 10; ++i) {
    /* i is visible here */
}
/* i is NOT visible here — referencing it is a compile error */
```

This is good practice: the index cannot leak, cannot be accidentally reused, and
the compiler catches mistakes for you. It was impossible in C89, and is available
in both C99 and C++.

### 7.2 Range-based `for` (C++11 and later)

Worth knowing even this early, because it removes the index entirely when you are
simply visiting every element:

```cpp
#include <iostream>
#include <vector>

int main() {
    std::vector<int> v = {2, 3, 5, 7, 11};

    for (int x : v)                  /* read each element    */
        std::cout << x << ' ';
    std::cout << '\n';

    for (int &x : v)                 /* modify each element  */
        x *= 2;

    for (const int &x : v)           /* read without copying */
        std::cout << x << ' ';
    std::cout << '\n';
    return 0;
}
```

```
2 3 5 7 11
4 6 10 14 22
```

---

## 8. The Boolean Type

### 8.1 Before there was a `bool`

C89 had no Boolean type. The convention was an `int` plus two manifest constants:

```c
#define TRUE  1
#define FALSE 0

int found = FALSE;
if (/* ... */) found = TRUE;
```

### 8.2 C++'s built-in `bool`

C++ has `bool` as a **built-in type**, alongside `int`, `char`, `float`, and
`double`, with two reserved lowercase literal keywords `true` and `false`:

```cpp
#include <iostream>

int main() {
    bool x = true;
    bool y = false;

    std::cout << x << ' ' << y << '\n';                      /* 1 0        */
    std::cout << std::boolalpha << x << ' ' << y << '\n';    /* true false */
    return 0;
}
```

```
1 0
true false
```

By default a `bool` prints as `1`/`0`; the `std::boolalpha` manipulator switches to
the words.

**Why it is an improvement.** A `bool` variable documents itself: a reader knows it
can only ever be true or false. A C-style `int` used as a Boolean could hold `7`,
and nothing in the type system objects:

```c
int flag = 7;           /* C: legal, and "true" by the non-zero rule */
```

```cpp
bool flag = 7;          /* C++: converted to true, but the type says
                           only two values are meaningful             */
```

### 8.3 C's later answer: `_Bool` and `<stdbool.h>`

C99 added a genuine Boolean type named `_Bool` (note the capital B), plus a header
`<stdbool.h>` supplying three macros — `bool` (mapped to `_Bool`), and
`true`/`false` (mapped to 1 and 0):

```c
#include <stdbool.h>

bool found = false;     /* C99: prefer this over the int-as-bool convention */
```

So modern C has a Boolean type too; C++ simply had one first and made it a
keyword rather than a macro.

---

## 9. Side-by-Side Reference

| Task | C | C++ |
|---|---|---|
| Include I/O | `#include <stdio.h>` | `#include <iostream>` |
| Print | `printf("%d\n", n);` | `std::cout << n << '\n';` |
| Read | `scanf("%d", &n);` | `std::cin >> n;` |
| Error output | `fprintf(stderr, ...)` | `std::cerr << ...` |
| Maths | `#include <math.h>`, `sqrt` | `#include <cmath>`, `std::sqrt` |
| Boolean | `int` + macros, or `<stdbool.h>` | built-in `bool`, `true`, `false` |
| Declare anywhere | C99 onwards | always |
| Library names | global | in namespace `std` |

---

## 10. Common Pitfalls

| Pitfall | Example | Fix |
|---|---|---|
| `using namespace std;` in a header | pollutes every including file | use `std::` or targeted `using` declarations |
| `std::endl` inside a hot loop | flushes on every line | use `'\n'` |
| Using `<iostream.h>` | pre-standard header | use `<iostream>` |
| Not checking stream state | `cin >> n;` on bad input leaves `n` unchanged | test `if (!(std::cin >> n))` |
| Mixing `printf` and `std::cout` carelessly | interleaving can look out of order | pick one, or call `std::ios::sync_with_stdio(true)` |
| Expecting `cout << b` to print "true" | prints `1` | use `std::boolalpha` |

---

## 11. Summary

- C++ replaces `printf`/`scanf` with the **stream operators** `<<` and `>>`, which
  need no format strings and no address-of operator, because the compiler knows
  each operand's type.
- All standard library names live in the **`std` namespace**, so library names and
  your own names never collide; `using namespace std;` is a convenience for small
  programs only.
- C standard headers are reachable from C++ as `<cname>` (drop `.h`, prefix `c`),
  with their contents in `std`.
- Declarations may appear **anywhere** a statement may appear, so a variable can be
  created at the moment it first has a meaningful value.
- Loop indices declared inside `for(...)` are scoped to the loop.
- `bool`, `true`, and `false` are built into the language.

Taken together these remove a great deal of bookkeeping: no format-specifier
tables to memorize, no forgotten `&`, no hoisted declarations holding garbage.

---

## 12. Exercises

1. Write a C++ program that reads a name and an age and prints a greeting. Make it
   reject non-numeric input for age by checking the stream state.
2. Convert a C program of yours that uses `printf`/`scanf` to use streams. Note
   every format specifier you were able to delete.
3. Print the same `double` with 2, 6, and 10 digits of precision using
   `std::setprecision` from `<iomanip>`.
4. Demonstrate that a loop-scoped `i` is invisible after the loop, and explain the
   compiler error you get.
5. Write a program using `std::boolalpha` that prints the result of several
   comparisons as `true`/`false`.
6. Time a loop printing 100,000 lines with `std::endl` versus `'\n'`. Report the
   difference.

---

**Next:** Chapter 5 contrasts C arrays and C strings with the C++ `std::vector`
and `std::string`.
