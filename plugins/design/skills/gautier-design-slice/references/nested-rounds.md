# Nested design rounds

Load when a round is too large to review comfortably, when grouping rounds, or when reading a nested round.
Use the same design workflow recursively; introduce hierarchy only for a distinct reviewable question, not a numerical size limit.

## Agree a split

Propose child purposes, shared contracts, dependencies and what remains in the parent. Obtain the developer's agreement.
Keep the existing parent ID. Allocate stable children such as `R2.1`, `R2.2`; deeper children can be `R2.2.1`.
Keep round files beside the feature README so link resolution stays simple; hierarchy is metadata, not nested directories.

The parent becomes a concise scope/shared-agreements document and child index. It owns no new implementation tasks.
List every direct child in BOTH the parent's `sub_rounds` front matter and a body table with ID/link, purpose, dependencies and status.
Keep the table consistent with the child front matter. List direct children here, not a duplicate flattened list of every descendant.
Each nested child must point back to its immediate parent with `parent_round` and retain its root `feature` README link.
Top-level rounds use `feature` as their context link and omit `parent_round`.
Each leaf owns its design and task files, such as `tasks/R2.1-T1-adapter.md`.
Scaffold all agreed children with front matter only, update the parent and feature index, then stop for a child-round handoff.
A parent merely planning children does not count as a completed design.

If the round already has task files or is done, pause the split and agree a migration/reopening scope first.
Preserve task IDs, implementation states and links; do not automatically renumber, delete or duplicate existing work.

## Metadata examples

Parent `R2-provider.md` (existing content retained):

```yaml
---
id: R2
status: in-progress
feature: "[[README.md]]"
depends_on:
  - "[[R1-execution.md]]"
sub_rounds:
  - "[[R2.1-auth.md]]"
  - "[[R2.2-fetch.md]]"
description: Coordinate provider ingestion contracts and the two focused child designs.
---
```

Child `R2.1-auth.md`:

```yaml
---
id: R2.1
status: not-started
feature: "[[README.md]]"
parent_round: "[[R2-provider.md]]"
depends_on: []
description: Define provider authentication and credential handling.
---
```

The parent body contains its human-readable index, for example:

| ID / document | Purpose | Depends on | Status |
| --- | --- | --- | --- |
| [R2.1](R2.1-auth.md) | Authentication contract | Inherits R1 | not-started |
| [R2.2](R2.2-fetch.md) | Fetch contract | R2.1; inherits R1 | not-started |

Before handoff, verify every `sub_rounds` entry has a reciprocal `parent_round` link and appears in this table.
The child table shows effective prerequisites, including inherited ones; child `depends_on` stores its direct prerequisites.

A sibling `R2.2-fetch.md` can depend on `"[[R2.1-auth.md]]"` when it needs the authentication contract.
There is no implicit ordering between siblings.

## Context and readiness are different

Read ancestor documents from outermost parent to immediate parent, plus the feature README.
Read prerequisite designs before code, using the shared contract's prerequisite-first traversal.
A child's effective prerequisites are its own `depends_on` plus every ancestor's `depends_on`, including transitive prerequisites.
Each effective prerequisite must be done and clear of review flags before child design starts.
If a prerequisite is a group, load its descendant designs too and verify all are done and clear of review flags.
Depending on a group means depending on its complete agreed contract; depend on a specific leaf when only that contract is needed.
Ancestor context must also be clear of review flags; settle any unresolved shared contract required by the child before proceeding.

The parent itself may remain in-progress while children are designed. Do not put a parent in its descendant's `depends_on`:
that would require the parent to finish before the child, while parent completion waits for that child.
Likewise a parent cannot depend on its descendants. If a shared foundation needs a hard done gate, give it a separate child/sibling
round and make consumers depend on that completed design.

Check containment and prerequisites separately: reciprocal parent/child links are intentional and not a dependency cycle.
Also verify the completion graph (groups wait for children, leaves wait for effective prerequisites) is acyclic;
this catches indirect deadlocks through other groups. Report any cycle without starting the affected design.

## Completing the tree

Leaf completion: design, atomic tasks, executor assignments and dependencies are agreed; documents validate.
Group completion: shared scope/contracts and decomposition are agreed, every direct child is done and clear of review flags,
and its child index is consistent. Each child applies these rules recursively. No duplicate task decomposition is required at a group.

Do not mark ancestors done automatically when a leaf finishes. Update their indexes and report which groups may now be finalized;
finalize a group only when its own completion conditions and agreements are verified.
Design completion never depends on task implementation having finished.
