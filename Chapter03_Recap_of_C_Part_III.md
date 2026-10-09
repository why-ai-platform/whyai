# Chapter 3: Recap of C (Part III) — Functions, Library, and the Build Process

**Topic:** Programming in Modern C++ — Foundations

**Prerequisites:** Chapters 1–2 (types, expressions, statements, derived types).

**What you will learn**
- How functions are declared, defined, and called, and what "call by value" means.
- How recursion is structured, and why every recursive function needs a base case.
- What function pointers are, and the classic C dispatch idiom built on them.
- How variadic functions like `printf` work, and what the C standard library offers.
- How to organize a program across headers and source files.
- What actually happens between a source file and an executable.

---

## 1. Introduction

Chapters 1 and 2 covered data types, variables, expressions, statements, and the
derived types (arrays, structures, unions, pointers). This chapter completes the C
recap with functions, then closes out with input/output, the standard library,
program organization, and the build process.

---

## 2. Functions — Basics

### 2.1 The black-box view

A function performs a specific, named computation. Treat it as a black box: it
accepts parameters and (usually) returns a result. A function may take **zero**
parameters and may return **nothing**.

```c
int  square(int x)        { return x * x; }          /* takes one, returns one  */
void greet(void)          { printf("hello\n"); }     /* takes none, returns none */
double now_in_seconds(void);                          /* takes none, returns one  */
```

`void` is used wherever there is nothing to specify or nothing to return.

### 2.2 Declaration versus definition

A **declaration** (also called a *prototype*, *function header*, or *signature*)
tells the compiler the name, return type, and parameter types. It ends with a
semicolon and has no body:

```c
int funct(int param1, int param2);   /* parameter names are optional... */
int funct(int, int);                 /* ...so this is equally valid      */
```

A **definition** supplies the body — a compound statement containing declarations
and statements:

```c
int funct(int x, int y) {
    int t = x + y;
    return t;
}
```

The words *prototype*, *header*, and *signature* recur constantly in C++, so it is
worth fixing them now.

### 2.3 Returning

A `return` statement yields an expression of the declared return type. For a `void`
function, no expression is given:

```c
void log_error(const char *msg) {
    fprintf(stderr, "%s\n", msg);
    return;              /* optional, but recommended — see below */
}
```

In C89 a function with no return value could omit `return` entirely. That is still
allowed, but including it explicitly is strongly advised; the habit pays off in C++,
where control flow out of a function triggers destructor calls and the exit points
matter.

---

## 3. Call by Value

### 3.1 Parameters are copies

C passes arguments by **copying** them. At the call site the arguments are *actual
parameters*; in the definition they are *formal parameters*.

```c
#include <stdio.h>

void funct(int x, int y) {       /* x, y are FORMAL parameters    */
    ++x;
    ++y;
    printf("inside : x=%d y=%d\n", x, y);
}

int main(void) {
    int a = 5, b = 10;
    funct(a, b);                 /* a, b are ACTUAL parameters    */
    printf("outside: a=%d b=%d\n", a, b);
    return 0;
}
```

```
inside : x=6 y=11
outside: a=5 b=10
```

`a` is copied into `x` and `b` into `y`. Because the formals occupy separate
memory, incrementing them has **no effect** on the caller's variables.

### 3.2 Positional matching

C matches arguments to parameters purely by **position** — the first actual maps to
the first formal, and so on. The formal parameter *names* are invisible to the
caller; they are an implementation detail.

### 3.3 Return is also by value

A function's locals cease to exist once it returns, so the result must be *copied*
back to the caller:

```c
int add(int x, int y) {
    int z = x + y;
    return z;          /* a COPY of z's value is handed back */
}

int main(void) {
    int r = add(5, 10);   /* r receives the copy */
    return 0;
}
```

This is the only return mechanism C offers. If you want a function to modify a
caller's variable, you must pass its **address**:

```c
void swap(int *p, int *q) {    /* call by address — C's workaround */
    int t = *p;
    *p = *q;
    *q = t;
}

int main(void) {
    int a = 5, b = 10;
    swap(&a, &b);              /* note the explicit & at the call site */
    /* a == 10, b == 5 */
    return 0;
}
```

> **Looking ahead:** C++ adds **references** (Chapters 10–11), which give you
> call-by-reference semantics without the `*`/`&` noise, and return-by-reference,
> which avoids the copy entirely.

---

## 4. Recursion

A function may call itself. Every recursive function needs two things:

1. A **recursive step** that reduces the problem.
2. One or more **base (exit) conditions** that terminate it.

```c
/* Factorial: n! = n * (n-1)!  with  0! == 1 */
unsigned long factorial(unsigned n) {
    if (n == 0) return 1;              /* base case      */
    return n * factorial(n - 1);       /* recursive step */
}

/* Fibonacci: two recursive calls per invocation */
unsigned long fib(unsigned n) {
    if (n < 2) return n;               /* base cases: fib(0)=0, fib(1)=1 */
    return fib(n - 1) + fib(n - 2);
}
```

Note that naive `fib` is exponential in time — a good illustration that elegant
recursion is not automatically efficient recursion. Merge sort and quick sort, by
contrast, are recursive *and* efficient.

**Worked example — counting set bits.** A recursive function that counts the 1 bits
in the binary representation of an unsigned integer:

```c
#include <stdio.h>

unsigned count_ones(unsigned n) {
    if (n == 0) return 0;                       /* base case */
    return (n & 1u) + count_ones(n >> 1);       /* low bit + rest */
}

int main(void) {
    printf("%u\n", count_ones(0));    /* 0                     */
    printf("%u\n", count_ones(7));    /* 3  (binary 111)       */
    printf("%u\n", count_ones(10));   /* 2  (binary 1010)      */
    printf("%u\n", count_ones(255));  /* 8  (binary 11111111)  */
    return 0;
}
```

Trace `count_ones(10)` by hand: `1010 → 0 + f(101) → 1 + f(10) → 0 + f(1) → 1 +
f(0) → 0`, summing to 2.

---

## 5. Function Pointers

### 5.1 The problem

Consider a collection of geometric objects — circle, rectangle, and an axis-aligned
right triangle — each of which must be drawn differently.

```c
struct Circle    { double x, y, radius; };          /* centre + radius            */
struct Rectangle { double x, y, width, height; };   /* corner + extents           */
struct Triangle  { double x, y, base, height; };    /* right-angle corner + legs  */
```

Since an object is only ever *one* shape at a time, a union plus a discriminant tag
is the natural C representation (the tagged-union idiom from Chapter 2):

```c
enum GCode { Cir, Rec, Trg };

typedef struct {
    enum GCode gCode;            /* which shape is currently held */
    union {
        struct Circle    c;
        struct Rectangle r;
        struct Triangle  t;
    } u;
} GeoObject;
```

C does **not** allow overloading a function name, so the three drawing routines
need three distinct names:

```c
#include <stdio.h>

void DrawCircle(GeoObject go) {
    printf("Circle at (%g,%g) r=%g\n", go.u.c.x, go.u.c.y, go.u.c.radius);
}
void DrawRectangle(GeoObject go) {
    printf("Rect   at (%g,%g) %gx%g\n", go.u.r.x, go.u.r.y, go.u.r.width, go.u.r.height);
}
void DrawTriangle(GeoObject go) {
    printf("Tri    at (%g,%g) b=%g h=%g\n", go.u.t.x, go.u.t.y, go.u.t.base, go.u.t.height);
}
```

(The `printf` calls stand in for real graphics calls.)

### 5.2 A function name is a pointer

Used **without** parentheses, a function name is a *pointer* — the address at which
the function's code begins. The parentheses are the **function-call operator** that
actually invokes it.

```c
void (*fp)(GeoObject);     /* fp: pointer to a function taking GeoObject, returning void */
fp = DrawCircle;           /* no parentheses: take the address  */
fp(someObject);            /* parentheses: invoke it            */
```

Reading the declaration: the `*` before the name says *`fp` is a pointer*, exactly
parallel to how `int *p` means "`*p` is an `int`", i.e. `p` is a pointer to `int`.

### 5.3 A dispatch table

An array requires all elements to have the same type, so we give the function
pointer type a name via `typedef`, then build a table indexed by the tag:

```c
typedef void (*DrawFunc)(GeoObject);

DrawFunc DrawArr[] = { DrawCircle, DrawRectangle, DrawTriangle };
/*                     index 0=Cir   1=Rec          2=Trg        */
```

Now drawing any object is a single uniform line — the caller never needs to know
which shape it holds:

```c
void Draw(GeoObject go) {
    DrawArr[go.gCode](go);     /* select by tag, then call */
}

int main(void) {
    GeoObject a; a.gCode = Cir; a.u.c = (struct Circle){0, 0, 5};
    GeoObject b; b.gCode = Rec; b.u.r = (struct Rectangle){1, 1, 4, 3};

    Draw(a);
    Draw(b);
    return 0;
}
```

```
Circle at (0,0) r=5
Rect   at (1,1) 4x3
```

Function pointers are a powerful and very widely used C mechanism — graphics
systems, menu handlers, callbacks, sorting comparators, and device drivers all rely
on them.

> **Looking ahead:** C++ turns this hand-built dispatch table into a language
> feature. The tag, the union, and the array of function pointers are all replaced
> by a class hierarchy with **virtual functions**, where the compiler generates and
> maintains the dispatch table (the *virtual function table*) for you. See
> Chapters 41–46.

---

## 6. Input/Output and Variadic Functions

`<stdio.h>` provides `printf` and `scanf`, both driven by **format strings**:

```c
#include <stdio.h>

int main(void) {
    int    n;
    double x;
    printf("Enter an int and a double: ");
    if (scanf("%d %lf", &n, &x) != 2) return 1;   /* note the & — call by address */
    printf("n=%d  x=%.3f  n*x=%.3f\n", n, x, n * x);
    return 0;
}
```

These are **variadic** functions — their parameter count is not fixed at compile
time. `printf` cannot know in advance whether you will print one value or ten, so
it is declared with an ellipsis:

```c
int printf(const char *format, ...);
```

The format string is the only thing telling `printf` how many arguments follow and
what their types are. Get it wrong and the behaviour is undefined — there is no
compile-time type checking of the variadic part (though good compilers warn):

```c
printf("%d\n", 3.14);     /* WRONG: %d with a double — undefined behaviour */
printf("%s\n", 42);       /* WRONG: treats 42 as an address — likely crash  */
```

File I/O follows the same pattern through a *file pointer*:

```c
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("data.txt", "w");
    if (fp == NULL) { perror("fopen"); return 1; }
    fprintf(fp, "%d %g\n", 42, 3.5);
    fclose(fp);
    return 0;
}
```

> **Looking ahead:** C++ streams replace format strings with the type-safe
> `<<` and `>>` operators, so `std::cout << n` works out the formatting from `n`'s
> type and cannot be given the wrong specifier. See Chapter 4.

---

## 7. The C Standard Library

Without a standard library you could not even write "Hello World", since `printf`
lives there. Every language must ship a base library that every conforming compiler
provides.

**The entire C standard library remains available in C++.** C++ *adds to* it; it
does not replace it.

The library is organized into header files. Five that you will reach for constantly:

| Header | Purpose | Representative functions |
|---|---|---|
| `<stdio.h>` | input/output | `printf`, `scanf`, `fopen`, `fgets` |
| `<stdlib.h>` | general utilities | `malloc`, `free`, `atoi`, `qsort`, `bsearch`, `rand` |
| `<string.h>` | C-string manipulation | `strlen`, `strcpy`, `strcat`, `strcmp`, `memcpy` |
| `<math.h>` | mathematics | `sqrt`, `sin`, `cos`, `pow`, `atan` |
| `<errno.h>` | error reporting | `errno` and its error-number constants |

**Recommendation:** before hand-writing a routine, check the header's full function
list in the manual. The task you are about to implement very often already exists —
tested, optimized, and portable.

---

## 8. Program Organization

### 8.1 Separate interface from implementation

Good practice is to split **header files** (interfaces: prototypes, types,
constants) from **source files** (implementations). This mirrors how the standard
library itself is built: `stdio.h` exposes only prototypes, while the
implementations live in a precompiled library.

### 8.2 Two kinds of include

```c
#include <stdio.h>      /* angle brackets: system / standard-library headers */
#include "Solver.h"     /* double quotes : your own project headers          */
```

Broadly, the form tells the preprocessor **where to search** — system include
directories versus the current project directory. (The exact rules are
implementation-defined; the convention is universal.)

### 8.3 Worked example — a quadratic solver

**`Solver.h`** — the interface. Parameter names may be omitted in a header, though
naming them documents intent:

```c
#ifndef SOLVER_H          /* include guard: prevents double inclusion */
#define SOLVER_H

/* Solves a*x^2 + b*x + c == 0.
   Writes the two roots as (real, imaginary) pairs through the out-parameters.
   Returns 1 if the roots are real, 0 if they are complex conjugates. */
int solve(double a, double b, double c,
          double *root_real, double *root_imag);

#endif /* SOLVER_H */
```

**`Solver.c`** — the implementation. Note it includes its *own* header, so any
mismatch between declaration and definition is caught by the compiler:

```c
#include "Solver.h"
#include <math.h>

int solve(double a, double b, double c,
          double *root_real, double *root_imag) {
    double disc = b * b - 4 * a * c;
    if (disc >= 0) {
        root_real[0] = (-b + sqrt(disc)) / (2 * a);
        root_real[1] = (-b - sqrt(disc)) / (2 * a);
        root_imag[0] = root_imag[1] = 0.0;
        return 1;
    } else {
        root_real[0] = root_real[1] = -b / (2 * a);
        root_imag[0] =  sqrt(-disc) / (2 * a);
        root_imag[1] = -root_imag[0];
        return 0;
    }
}
```

**`main.c`** — the application. It includes only the *header*, never the
implementation:

```c
#include <stdio.h>
#include "Solver.h"

int main(void) {
    double re[2], im[2];
    int real_roots = solve(1.0, -3.0, 2.0, re, im);   /* x^2 - 3x + 2 */

    if (real_roots)
        printf("real roots: %g, %g\n", re[0], re[1]);
    else
        printf("complex: %g+%gi, %g%gi\n", re[0], im[0], re[1], im[1]);
    return 0;
}
```

```
real roots: 2, 1
```

Because both `main.c` and `Solver.c` include the same header, the caller's view and
the implementation can never drift out of sync.

**General rule:** anything shared — functions, macros, constants, types — goes in a
header; implementations go in separate source files that include that header; and
applications include only the header.

---

## 9. The Build Process

```
  source (.c / .cpp)
        │
        ▼
  preprocessor          #include, #define, #if — pure text substitution
        │
        ▼
  compiler  →  assembly (.s)
        │
        ▼
  assembler →  object file (.o / .obj)
        │
        ▼
  linker               combines your object files with precompiled libraries
        │               (e.g. the implementation behind <stdio.h>)
        ▼
  executable
```

Driving it by hand makes each stage visible:

```sh
gcc -std=c99 -E  main.c -o main.i      # stop after preprocessing
gcc -std=c99 -S  main.c -o main.s      # stop after compilation (assembly)
gcc -std=c99 -c  main.c -o main.o      # stop after assembly (object file)
gcc main.o Solver.o -lm -o solver      # link, including the math library
```

An IDE hides this pipeline behind a single Build button. From the command line you
must link libraries explicitly — hence `-lm` above for `<math.h>`.

---

## 10. Tools and Practice

- **IDEs and editors.** Many options exist — Code::Blocks, Visual Studio, Eclipse,
  CLion, VS Code. Any is fine; an open-source option such as Code::Blocks, Eclipse,
  or VS Code keeps you unencumbered.
- **Always state the language standard explicitly** so that observed behaviour
  matches expected behaviour:

  ```sh
  gcc -std=c99   -Wall -Wextra -o prog prog.c
  g++ -std=c++17 -Wall -Wextra -o prog prog.cpp
  ```

- **Turn warnings on and read them.** `-Wall -Wextra` (or `/W4` on MSVC) catches a
  large fraction of the pitfalls listed in these chapters before the program ever
  runs. Treating warnings as errors (`-Werror`) is a good habit on new code.

---

## 11. Common Pitfalls

| Pitfall | Example | Consequence |
|---|---|---|
| Expecting a function to modify its argument | `void f(int x){++x;}` | caller's variable unchanged |
| Returning the address of a local | `int* f(){int x; return &x;}` | dangling pointer |
| Recursion without a base case | `int f(int n){return f(n-1);}` | stack overflow |
| Format-string / argument mismatch | `printf("%d", 3.14)` | undefined behaviour |
| Not checking `scanf`'s return value | `scanf("%d",&n);` on bad input | `n` left indeterminate |
| Missing include guards | header included twice | duplicate-definition errors |
| Forgetting to link a library | using `sqrt` without `-lm` | undefined-reference at link time |

---

## 12. Summary

This chapter completed the C recap:

- **Functions** — declaration versus definition, prototypes and signatures,
  `void` for "nothing", and the recommendation to always `return` explicitly.
- **Call by value** — arguments and return values are copies, matched
  positionally; modifying the caller requires passing addresses.
- **Recursion** — a recursive step plus at least one base case.
- **Function pointers** — a function name without `()` is its address; `typedef`
  plus an array of function pointers gives you a dispatch table, the C precursor to
  virtual functions.
- **Variadic I/O** — `printf`/`scanf` rely on format strings and are not type
  checked, which C++ streams fix.
- **The standard library** — fully available in C++, organized by header, and worth
  searching before writing your own.
- **Program organization** — headers for interfaces, sources for implementations,
  include guards, and `<>` versus `""`.
- **The build process** — preprocess, compile, assemble, link.

This closes the C recap. From the next chapter onward, each topic contrasts a
common task written in C with the same task written in C++, showing how C++ does it
more efficiently, more safely, and more concisely.

---

## 13. Exercises

1. Write `void increment(int *p)` and `int increment_by_value(int x)`. Call both
   and explain the difference in observed behaviour.
2. Implement `factorial` both recursively and iteratively. Compare them for
   `n = 20` and for `n = 25`, and explain what goes wrong.
3. Time naive recursive `fib(35)`. Then add memoization and time it again.
4. Extend the `GeoObject` dispatch table with a fourth shape. Count exactly how
   many places in the code you had to edit — this count is the maintenance cost
   that virtual functions later eliminate.
5. Write `qsort`-compatible comparison functions for `int` and for C strings, and
   use them to sort arrays of each.
6. Split any single-file program you have written into `.h` and `.c` files with
   include guards, and build it with explicit `-c` and link steps.
