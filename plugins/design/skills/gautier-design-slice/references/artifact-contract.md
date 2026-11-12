# Feature design artifact contract

Shared by the two workflows of `gautier-design-slice`. Keep metadata conventions here rather than duplicating them.

## Layout and stable identity

```text
docs/features/<feature-slug>/
  README.md
  R1-<subject>.md
  R2-<subject>.md
  R2.1-<subject>.md
  R2.2-<subject>.md
  tasks/
    R1-T1-<subject>.md
    R1-T2-<subject>.md
    R2.1-T1-<subject>.md
```

Round IDs are unique within a feature. Task IDs are round-scoped and unique within a feature.
Allocate new unused IDs. Once referenced, IDs stay stable; dependency edges and README order define execution order.
Never renumber existing records merely to put a newly discovered prerequisite first. Cross-feature references include paths.
A prerequisite refactor can therefore receive a later numeric ID while appearing earlier in dependency order.
Nested IDs use dotted suffixes: `R2.1`, `R2.2`, then `R2.2.1` if genuinely necessary.
Tasks inherit their owning leaf ID, for example `R2.1-T1`. Do not create extra nesting merely for symmetry.

## Round metadata

```yaml
---
id: R2
status: not-started
feature: "[[README.md]]"
depends_on:
  - "[[R1-execution.md]]"
description: Define the provider fetch contract and accepted import scope.
---
```

New round stubs contain ONLY this front matter. `description` is one to three short lines.
For no prerequisites, use `depends_on: []`. States: `not-started`, `in-progress`, `done`.
`done` records explicit agreement on both design and task decomposition, not code delivery.
A legacy document using another schema/status needs an explicit, scoped metadata migration; do not silently reinterpret it as done.
Optional hierarchy fields are `parent_round` (one wiki link) and `sub_rounds` (an array of wiki links; absent means empty).
A round with sub-rounds is a group; one without is a leaf. Read [nested rounds](nested-rounds.md) when grouping/splitting
or loading a nested round. Parent context is not a `depends_on` prerequisite.

## Task metadata and content

```yaml
---
id: R2-T1
status: not-started
executor: agent
design: "[[../R2-provider-contract.md]]"
depends_on:
  - "[[R1-T3-register-handlers.md]]"
description: Implement the provider request adapter against the agreed contract.
---
```

Task states: `not-started`, `in-progress`, `done`; these describe implementation, unlike round states.
`executor` is a required string enum: `human` or `agent`, not a boolean or free-form tag.
Agree this value with the developer as part of the task breakdown and display it in the round's task table.
Propose an executor when useful, but do not infer assignment from task complexity or finalize unassigned tasks.
A human task may be reserved for learning or control. Agents may explain/review it, but must not take over implementation
without an explicit request or reassignment. An agent task is suitable for agent execution once implementation is separately
authorized and its implementation prerequisites are complete; this design skill never grants that authorization.
Executor and status are independent. Changing executor does not renumber the task or mark it complete.

A task links its design; that design links its feature README, parent context and prerequisite designs.
Use cross-round/cross-feature task links for real implementation prerequisites. A design dependency alone does not specify
which implementation task must finish first. A missing prerequisite task is a planning gap, not a satisfied dependency.

Every task contains:

1. **Problem:** the concrete gap to close, in a short paragraph.
2. **Solution:** bounded change and a focused Mermaid diagram; explain the diagram briefly.
3. **Acceptance criteria:** observable behaviors, invariants and material failure/edge cases.
4. **Interfaces:** public contracts to add/change, their responsibilities and relevant types; reference the agreed design.
5. **Definition of done:** task-specific proof/checks, compatibility obligations and required documentation updates.

A task should normally fit roughly one reviewable page; this is a readability aim, not a rule to split cohesive work arbitrarily.
Task acceptance states what must be true; definition of done states how completion is demonstrated.
Use named test seams and independent expected results. Reuse the repository's test infrastructure and exact proof.
No fabricated passing checks, broad automatic test deletion or implementation inferred from design completion.

## Link resolution and validation

Front-matter links are quoted YAML strings of the exact form `"[[relative/path.md]]"`.
Paths resolve relative to the containing document, including `..` for parent/cross-feature references.
Use exact filenames, not bare IDs, aliases, title-only links or heading fragments. Body/index links may use ordinary Markdown.
Resolve prerequisites by the metadata graph, not numeric order. Read each target's metadata to verify its identity and state.

Before completing a skill run, verify:

- Required front-matter fields have the correct type: IDs/status/description and context links are strings; `depends_on` is an array.
- Filename IDs match front-matter IDs, including dotted hierarchy; round/task identities are unique in their feature.
- Every finalized task has `executor: human` or `executor: agent`, agreed with the developer and mirrored in its task table.
- All context/dependency links resolve and target the right document type. Prerequisites form an acyclic graph.
- Containment is a separate acyclic tree with reciprocal parent/sub-round links. Parent links are not prerequisite edges.
- Group completion and inherited prerequisite rules cannot create a readiness deadlock; follow the nested-round contract.
- Design dependencies reference designs; task dependencies reference tasks. Feature context points to the intended README.
- README/round-table IDs, links, dependency summaries and statuses match the authoritative front matter.
- New stubs have no design body, tasks are written only after agreement, and application files are untouched.
- Diagrams follow `mermaid-diagrams`; report rendering/inspection status accurately and obey local documentation limits.

## Refactors discovered during design

Classify by whether today's agreed feature needs the change, not by how attractive the refactor looks.

### Required now

If the refactor is bounded by the current round's agreed contracts, make it an atomic implementation task (or small task set)
and add explicit dependency edges from affected tasks. It need not be the first numeric ID, but executes before its dependents.

If it has unresolved architectural decisions or a distinct reviewable mechanism, create an agreed prerequisite design round.
Update the feature map and `depends_on` links while keeping IDs stable. The prerequisite starts as a front-matter-only stub.
Pause the dependent round until this prerequisite is done. Let the developer choose the prerequisite skill invocation;
do not recursively launch design sessions or design several rounds in one response.

If a shared backlog entry becomes necessary now, link it to the owning prerequisite design/task and mark its disposition
there. Do not leave the feature dependent on a vague backlog intention.

### Deferred

Use an existing repository-wide refactor backlog. If none exists and there is an actual deferred item to record,
create `docs/features/BACKLOG.md`. Do not create an empty backlog or a duplicate local backlog.
Each entry is concise and has:

- A stable ID such as `REF-001` and a short title.
- Origin links to feature/round, current limitation and why it is not needed for this delivery.
- A concrete revisit trigger, such as a second tenant, changed authority or measured refresh cost.
- A high-level acceptance goal and disposition: `deferred`, `promoted`, `resolved` or `dropped`.
- When promoted, links to the design/tasks that now own it. Avoid duplicate specifications.

Record the entry when discovered, after discussing its scope/disposition with the developer; do not wait until delivery.
The feature README links to the authoritative entry. A deferred entry is not an implementation task or a `depends_on` edge.
At slice planning, inspect existing backlog entries for relevance. Ask about genuine applicable prerequisites; do not turn every
historical suggestion into mandatory work. Future configuration mechanisms follow this rule rather than being built speculatively.
At slice delivery, reconcile unresolved follow-ups into this shared owner; preserve origin references and resolved dispositions.

## Changed agreements and lifecycle

If an upstream contract changes, identify affected downstream designs and tasks and record review requirements in their indexes.
Use an optional YAML boolean `review_required` (unquoted `true`/`false`; absent means false).
Set `review_required: true` on affected designs/tasks where appropriate, with a short reason in the body/index; preserve their
existing status and implementation history. Treat a flagged dependency as unusable until explicit re-review clears the flag.
Do not invalidate every descendant merely because wording or formatting changed; assess actual contract impact.
Reopening a done round requires explicit developer direction and agreement on the revision. Clear review flags only after review.

If local repository policy calls for retiring delivered feature plans, move lasting contracts to module/context guides and ADRs,
retain unresolved work in its backlog owner and update dependent links before deleting superseded design documents.
A missing/deleted dependency must never silently count as satisfied. Neither workflow performs implementation or delivery cleanup
unless separately requested.
