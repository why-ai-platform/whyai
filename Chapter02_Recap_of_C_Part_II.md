# Chapter 2: Recap of C (Part II) — Derived Types

**Topic:** Programming in Modern C++ — Foundations

**Prerequisites:** Chapter 1 (types, variables, expressions, statements, control flow).

**What you will learn**
- How to declare, initialize, and use arrays, including multi-dimensional arrays.
- How structures group heterogeneous data, and how they are initialized and accessed.
- What unions are, how their storage differs from structures, and when they are the
  right tool.
- What a pointer is, how pointer arithmetic works, and how pointers relate to arrays.

---

## 1. Introduction

Chapter 1 covered the *fundamental* types. This chapter covers the **derived
types** — types constructed out of other types. C has four such containers and
address mechanisms:

| Derived type | Groups | Access style | Storage |
|---|---|---|---|
| Array | same-typed elements | positional (by index) | sum of all elements |
| Structure | possibly different types | named (by member) | sum of all members (+ padding) |
| Union | possibly different types | named (by member) | size of the **largest** member |
| Pointer | n/a (holds an address) | dereference | one address |

---

## 2. Arrays

### 2.1 What an array is

A variable holds a *single* data item. An **array** holds a collection of one or
more data items, **all of the same type**, laid out contiguously in memory.

To declare one you must supply three things: the element type, a name, and the
maximum number of elements.

```c
double balance[10];       /* 10 doubles: balance[0] .. balance[9] */
```

The size may also be given via a manifest constant, which is better practice than
a bare literal:

```c
#define MAX_ACCOUNTS 10
double balance[MAX_ACCOUNTS];
```

### 2.2 Initialization

```c
int primes[5] = {2, 3, 5, 7, 11};
/* primes[0] == 2, primes[1] == 3, ... primes[4] == 11 */
```

If an initializer list is supplied, C lets you **omit the size** and infers it:

```c
int primes[] = {2, 3, 5, 7, 11};    /* compiler deduces size 5 */
```

Initialization always fills **from the beginning**. If the list is shorter than the
declared size, the remaining elements are set to zero:

```c
int a[5] = {1, 2};     /* a == {1, 2, 0, 0, 0} */
int z[100] = {0};      /* idiom: zero the whole array            */
```

A list *longer* than the declared size is a compile-time error:

```c
int bad[2] = {1, 2, 3};   /* ERROR: too many initializers */
```

### 2.3 Computing the number of elements

The safe way is total size divided by element size — never a hard-coded number:

```c
#include <stdio.h>

int main(void) {
    int primes[] = {2, 3, 5, 7, 11, 13};
    size_t n = sizeof(primes) / sizeof(primes[0]);

    for (size_t i = 0; i < n; ++i)
        printf("%d ", primes[i]);
    printf("\n(%zu elements)\n", n);
    return 0;
}
```

```
2 3 5 7 11 13
(6 elements)
```

> **Caution:** this idiom works only where the array's *type* is visible. Once the
> array is passed to a function it decays to a pointer and `sizeof` gives the
> pointer size instead — which is why C functions taking arrays also take a length.

### 2.4 Access and assignment

Elements are read and written through the index operator, which may appear on
either side of an assignment:

```c
int a[5] = {0};
a[2] = 42;              /* write */
int x = a[2] + 1;       /* read  */
```

C performs **no bounds checking**. Writing `a[7]` on a 5-element array compiles
happily and corrupts unrelated memory — undefined behaviour and a classic source
of security vulnerabilities.

### 2.5 Multi-dimensional arrays

An array of arrays gives a multi-dimensional array. The two-dimensional case (a
matrix) is by far the most common:

```c
#include <stdio.h>

int main(void) {
    int mat[3][4] = {          /* 3 rows, 4 columns */
        {1,  2,  3,  4},
        {5,  6,  7,  8},
        {9, 10, 11, 12}
    };

    for (int r = 0; r < 3; ++r) {
        for (int c = 0; c < 4; ++c)
            printf("%3d", mat[r][c]);
        printf("\n");
    }
    return 0;
}
```

```
  1  2  3  4
  5  6  7  8
  9 10 11 12
```

Accessing an element needs both a row index and a column index. The elements are
stored in **row-major order** — the whole of row 0, then the whole of row 1, and so
on. Three and more dimensions are legal but rare in practice.

---

## 3. Structures

### 3.1 What a structure is

Like an array, a structure is a container. The difference is that its members
(**data members**) may be of *different* types. (They are not required to differ —
they are merely allowed to.)

```c
struct complex {
    double re;     /* real part      */
    double im;     /* imaginary part */
};

struct book {
    char title[64];
    char author[64];
    int  id;
};
```

### 3.2 Declaring variables, and `typedef`

```c
struct complex x;              /* the 'struct' keyword is required in C */

/* A typedef gives the type an alias so 'struct' can be omitted: */
typedef struct complex Complex;
Complex y;

/* Both steps can be combined: */
typedef struct { double re, im; } Cplx;
Cplx z;
```

The name `typedef` ("type definition") is historical; it really creates a **type
alias** rather than a new type. In C++ the `struct` keyword may be dropped without
any `typedef`.

### 3.3 Initialization

A structure is initialized with a brace list like an array, but the values map to
**members in declaration order**, top to bottom — not to indexed positions:

```c
struct complex x = {2.0, 3.5};    /* x.re == 2.0, x.im == 3.5 */
```

Partial initialization is allowed only **from the top**:

```c
struct complex a = {2.0};         /* OK: re == 2.0, im == 0.0        */
/* There is no positional way to set only 'im' and skip 're'.        */

/* C99 designated initializers remove that restriction: */
struct complex b = { .im = 3.5 }; /* re == 0.0, im == 3.5            */
```

### 3.4 Member access

Members are accessed by **name**, using the dot operator:

```c
#include <stdio.h>

struct complex { double re, im; };

struct complex add(struct complex a, struct complex b) {
    struct complex r;
    r.re = a.re + b.re;
    r.im = a.im + b.im;
    return r;
}

int main(void) {
    struct complex p = {2.0, 3.5};
    struct complex q = {1.0, -0.5};
    struct complex s = add(p, q);
    printf("(%g, %g)\n", s.re, s.im);     /* (3, 3) */
    return 0;
}
```

### 3.5 Positional versus named access

This is a design distinction worth internalizing:

- **Arrays are positional.** All elements have the same type and the same meaning,
  so an index is a perfectly good way to name one.
- **Structures are named.** Members differ in type and in meaning, so a name is
  required — "the second member" would be a meaningless way to refer to `im`.

The same positional-versus-named distinction recurs throughout programming
languages. C function arguments, for instance, are purely positional; some other
languages allow named arguments.

---

## 4. Unions

### 4.1 Syntax versus storage

A `union` looks exactly like a structure — same declaration shape, same dot
notation for access. The difference is in **memory allocation**:

- A structure allocates space for *all* members, because they all exist
  simultaneously.
- A union allocates space for only the *largest* member, because only one member
  holds a meaningful value at any given moment.

```c
#include <stdio.h>

struct s_complex { double re; double im; };     /* both exist at once */
union  u_packet  { int iData; double dData; char cData; };

int main(void) {
    printf("struct = %zu bytes\n", sizeof(struct s_complex));
    printf("union  = %zu bytes\n", sizeof(union  u_packet));
    return 0;
}
```

Typical output:

```
struct = 16 bytes
union  =  8 bytes
```

The structure needs 8 + 8 = 16 bytes. The union needs only 8 — the size of its
largest member, `double` — even though it can also hold an `int` or a `char`.

### 4.2 Only one member is live at a time

Only one member can be initialized (the first one, matching its type), because
there is only one storage location:

```c
union u_packet p = {97};    /* initializes iData */
```

Reading a member other than the one last written gives **unspecified or garbage**
results:

```c
#include <stdio.h>

union u_packet { int iData; double dData; char cData; };

int main(void) {
    union u_packet p;

    p.iData = 97;
    printf("as int    : %d\n",  p.iData);   /* 97  — the member we wrote      */
    printf("as char   : %c\n",  p.cData);   /* 'a' — 97 is ASCII 'a', and the
                                                     high bytes happen to be 0 */
    printf("as double : %g\n",  p.dData);   /* garbage — a double needs 8 bytes
                                                     but only 4 were written   */
    return 0;
}
```

The `char` read happens to work because the low-order byte of the `int` holds 97,
which is ASCII `'a'`. The `double` read is garbage because `double` occupies more
bytes than were actually written, and the remaining bytes hold whatever was there
before. **Do not rely on this**; reading an inactive union member is not portable.

### 4.3 Why unions exist

A union lets you represent data whose *type* varies over time without reserving
space for every possibility at once. The textbook case is a network port that
receives one of several packet kinds — only one kind arrives at a time, so a union
plus a tag that records which kind is present is both correct and compact:

```c
enum PacketKind { PK_INT, PK_DOUBLE, PK_CHAR };

struct Packet {
    enum PacketKind kind;        /* the discriminant / tag */
    union { int i; double d; char c; } payload;
};

void handle(const struct Packet *p) {
    switch (p->kind) {
        case PK_INT:    /* use p->payload.i */ break;
        case PK_DOUBLE: /* use p->payload.d */ break;
        case PK_CHAR:   /* use p->payload.c */ break;
    }
}
```

This "tagged union" is a very common C idiom. It is also fragile: nothing in the
language forces `kind` and `payload` to stay consistent — that is entirely the
programmer's responsibility.

> **Looking ahead:** C++ achieves the same *variable-type* effect far more safely
> through inheritance and virtual dispatch (Chapters 36–46), and through
> `std::variant` in modern C++. The tagged union above becomes a class hierarchy
> where each packet kind is its own class and the compiler guarantees consistency.

---

## 5. Pointers

### 5.1 Why pointers exist

C was created by the Unix team (Kernighan, Ritchie, and colleagues) because
writing an operating system requires manipulating memory **addresses** directly,
not merely values — and no earlier high-level language supported that well. The
pointer is the result: a first-class way to treat an address as ordinary data.

### 5.2 Declaration and the two operators

A pointer is a variable whose *value* is a memory address. Every pointer holds an
address, but a pointer's **type** is determined by the type of the thing it points
to.

```c
#include <stdio.h>

int main(void) {
    int  i  = 20;
    int *ip = &i;      /* ip is of type "pointer to int" */

    printf("i   = %d\n",  i);      /* 20                   */
    printf("&i  = %p\n",  (void*)&i);
    printf("ip  = %p\n",  (void*)ip);   /* same as &i       */
    printf("*ip = %d\n",  *ip);    /* 20 — content of i     */

    *ip = 30;                      /* write through the pointer */
    printf("i   = %d\n",  i);      /* 30 — i was modified   */
    return 0;
}
```

| Operator | Name | Meaning |
|---|---|---|
| `&x` | address-of | yields the address of object `x` |
| `*p` | dereference / content-of | yields the object stored at address `p` |

Printing `&i` and `ip` produces identical addresses, because that is exactly what
`ip` contains.

### 5.3 Pointer–array duality

An array is a contiguous series of locations, so a pointer can be set to the
array's starting address — and then used to walk it.

```c
#include <stdio.h>

int main(void) {
    int  a[5] = {10, 20, 30, 40, 50};
    int *p    = a;            /* an array name decays to &a[0] */

    printf("%d\n", *p);       /* 10 — first element           */
    printf("%d\n", *(p + 2)); /* 30 — same as a[2]            */
    printf("%d\n", p[3]);     /* 40 — index syntax works too  */

    printf("%d\n", *++p);     /* increment first, then read: 20 */
    return 0;
}
```

```
10
30
40
20
```

### 5.4 Pointer arithmetic is scaled

This is the crucial point. Incrementing a pointer advances it by the **size of the
pointed-to type**, not by one byte:

```c
int *p;          /* ++p advances by sizeof(int)    — typically 4 bytes */
double *q;       /* ++q advances by sizeof(double) — typically 8 bytes */
char *c;         /* ++c advances by 1 byte                             */
```

So `p + 1` means "the location one *element* further on", which is precisely what
makes `p[i]` equivalent to `*(p + i)`.

```c
#include <stdio.h>

int main(void) {
    int a[3] = {1, 2, 3};
    printf("%p\n", (void*)(a + 0));
    printf("%p\n", (void*)(a + 1));   /* 4 bytes higher, not 1 */
    return 0;
}
```

### 5.5 Pointers to structures

A member can be reached through a pointer with `(*p).member`, but the arrow
operator `->` is the idiomatic shorthand:

```c
#include <stdio.h>

struct complex { double re, im; };

int main(void) {
    struct complex c = {2.0, 3.5};
    struct complex *p = &c;

    printf("%g\n", (*p).re);   /* explicit dereference, then member */
    printf("%g\n", p->re);     /* identical, and preferred          */

    p->im = -1.0;              /* writes through the pointer        */
    printf("%g\n", c.im);      /* -1                                */
    return 0;
}
```

Note that `*p.re` would **not** work: `.` binds tighter than `*`, so it would mean
`*(p.re)`.

### 5.6 Dynamic allocation

`malloc` allocates memory at run time and returns an untyped pointer (`void *`),
which in C you cast to the type you need. This is how you build an array whose size
is only known at run time:

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    int n;
    printf("How many elements? ");
    if (scanf("%d", &n) != 1 || n <= 0) return 1;

    int *a = (int *)malloc(n * sizeof(int));   /* allocate */
    if (a == NULL) {                            /* ALWAYS check */
        fprintf(stderr, "out of memory\n");
        return 1;
    }

    for (int i = 0; i < n; ++i) a[i] = i * i;
    for (int i = 0; i < n; ++i) printf("%d ", a[i]);
    printf("\n");

    free(a);        /* release it — forgetting this is a memory leak */
    a = NULL;       /* defensive: avoid using a dangling pointer     */
    return 0;
}
```

Every `malloc` must be matched by exactly one `free`. Forgetting leaks memory;
freeing twice, or using memory after freeing it, is undefined behaviour. C++
replaces this manual discipline with `new`/`delete` (Chapters 17–18), and then with
containers and smart pointers that handle it automatically.

---

## 6. Common Pitfalls

| Pitfall | Example | Consequence |
|---|---|---|
| Out-of-bounds index | `int a[5]; a[5] = 1;` | memory corruption, no diagnostic |
| `sizeof` on a decayed array | `void f(int a[]) { sizeof(a); }` | gives pointer size, not array size |
| Reading an inactive union member | write `.iData`, read `.dData` | garbage value |
| Forgetting the union tag | tag says `INT`, payload holds a `double` | silent misinterpretation |
| `*p.member` instead of `p->member` | `*p.re` | compile error (`.` binds first) |
| Dereferencing an uninitialized pointer | `int *p; *p = 1;` | crash or corruption |
| Leaking or double-freeing | missing/duplicated `free` | leak, or heap corruption |

---

## 7. Summary

This chapter covered C's derived types:

- **Arrays** — contiguous, same-typed, positionally accessed, fixed size, no bounds
  checking. Size is best computed as `sizeof(a)/sizeof(a[0])`.
- **Structures** — heterogeneous members accessed by name, initialized in
  declaration order, the basic tool for modelling a record.
- **Unions** — structure-like syntax but overlapping storage, sized to the largest
  member; safe only in combination with a discriminant tag.
- **Pointers** — variables holding addresses, with `&` and `*` as their two
  operators, scaled arithmetic that makes `p[i]` equal `*(p+i)`, `->` for member
  access, and `malloc`/`free` for run-time allocation.

---

## 8. Exercises

1. Write a function that returns the sum of an `int` array. Explain why it must
   take the length as a second parameter.
2. Declare a `struct point3d` and write functions to add two points and to compute
   a dot product. Initialize one point using designated initializers.
3. Measure `sizeof` for a structure with members `char`, `int`, `char`. Explain
   the result in terms of alignment padding, and reorder the members to shrink it.
4. Build the tagged-union `Packet` from §4.3 and write a `print` function. Then
   deliberately set a wrong tag and observe what happens — this is the fragility
   C++ inheritance later removes.
5. Without running the code, state what `*(a + 2)`, `a[2]`, `2[a]`, and `*a + 2`
   each evaluate to for `int a[] = {10, 20, 30};`. Then verify.
6. Write a program that allocates an array of `n` doubles with `malloc`, fills it,
   prints it, and frees it. Run it under a leak checker (e.g. `valgrind`) with the
   `free` removed, and read the report.

---

**Next:** Chapter 3 covers functions, function pointers, the C standard library,
program organization across headers and source files, and the build process.
