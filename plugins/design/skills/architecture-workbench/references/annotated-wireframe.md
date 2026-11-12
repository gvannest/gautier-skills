# Annotated wireframe

Illustrative only. The interface contract defines required behavior; names, counts, dimensions and colors below are examples.
The same logical selection and directional review identity travel between views.

## A. Collapsed map with a module selected

```text
+----------------------------------------------------------------------------------+
| Project / snapshot      [Module map] [Dependency matrix] [System context] [Export] |
+----------------------------------------------------------------------------------+
| Records: 0 incoming / 2 outgoing connections        [Overview] [Collapse all]        |
| Layers [v] Calls [v] Data [ ] Storage       [ ] Infrastructure       [Inspector]    |
+----------------------------------------------------------------------------------+
| A -> B means A depends on B                                                       |
|                                                                                  |
| +----------------------+                  +----------------------+               |
| | Records      [ + ]   | ------(2)-------> | Reports      [ + ]   |               |
| | Responsibility       |                  | Responsibility       |               |
| | [Select module name] |                  |                      |               |
| +----------------------+                  +----------------------+               |
|             |                                                                    |
|            (1)     +----------------------+                                      |
|             +----> | Shared data          |      Other modules remain in place.  |
|                    +----------------------+                                      |
+----------------------------------------------------------------------------------+
```

- Select the module name to focus its connections. The **+** expands content without changing the module selection.
- Parent cards keep their order. Unrelated peers remain legible and reachable; scrolling reaches content beyond the viewport.
- Counts are distinct mapped facts per connection. An arrow badge opens evidence, not an automatic coupling-severity score.

## B. Expanded trace with inspector

```text
+---------------------------------------------------+------------------------------+
| Records -> Reports      [Back to module]           | CONNECTION REVIEW        [x] |
+---------------------------------------------------+------------------------------+
| +---------------------+   +---------------------+ | Records depends on Reports   |
| | Records       [ - ] |   | Reports       [ - ] | | 2 facts: call + import       |
| | 1 of 3 involved     |   |                     | |                              |
| | [C ! Create record] |-->| [Q Read summary]    | | [Explore involved use cases] |
| |                     |   |                     | |                              |
| | [All use cases (3)] |   | [All use cases (1)] | | Assessment: [Investigate v]  |
| +---------------------+   +---------------------+ | Rationale: [..............]  |
|                                                   | Freshness: Stale              |
| +---------------------+                           | Changed evidence: ...         |
| | Another module [+]  |                           |                              |
| +---------------------+                           | Source evidence and use cases |
+---------------------------------------------------+------------------------------+
```

- Expansion is inside the parent; the rest of the architecture is retained.
- **All use cases** includes operations with no mapped dependencies, independently of current layers or trace filters.
- **!** is an accessible warning: the command changes state and also returns information.
  Activating it explains both behaviors, the return category and source evidence; the C classification remains.
- The inspector uses the same Records-to-Reports review identity whether entered through a module, use case or matrix cell.
- Freshness is separate from assessment: changed evidence can make an Investigate or Justified assessment stale.
- Closing the inspector restores focus to the item that opened it.

## C. Matrix inset for the same connection

```text
                    Dependency ->
Dependent v         Records     Reports     Shared data
Records                --        [2*]          [1]
Reports                            --          [1]

[2*] opens the Records -> Reports inspector and its existing assessment.
```

The matrix covers all eligible pairs even when the map focuses a module; disclose that scope difference.
The marker represents review state in this illustration, not an extra fact.

## D. Business boundaries and execution topology

```text
+ Application ---------------------------------------------------------------+
| Execution                         Business                                 |
| [Interactive process] ----+       + Records -----------------------------+  |
|                           +-----> | C Create record                       |  |
| [Background process] ------------> | Q Find record     Q Isolated probe   |  |
|                                   +--------------------------------------+  |
|                                   + Reports -----------------------------+  |
|                                   | Q Read summary                        |  |
|                                   +--------------------------------------+  |
| Shared data                                                               |
| [Shared records group: Named object A, Named object B]                      |
+---------------------------------------------------------------------------+
```

Process arrows are evidenced entry dependencies; business modules are not children of a process.
Shared data retains one canonical identity even when several business modules use it.
Optional visual aliases point back to that identity and must not duplicate fact counts or reviews.
