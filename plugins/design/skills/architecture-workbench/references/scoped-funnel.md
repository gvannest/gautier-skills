# Scoped funnel and use-case detail

This contract specializes the overview interface for focused feature planning and dependency analysis.
Use the same canonical inventory, source evidence and review identities across all levels.

## Scope and discovery

Support application → bounded context → use case, with direct entry to any level.
A request naming one context starts there; application scope is optional navigation, not a prerequisite inventory.
In projects without established bounded contexts, use evidenced cohesive module boundaries and the project's vocabulary.

Inspect all implemented behavior inside the requested boundary, including operations with no mapped external relationships.
Trace direct external callers, calls, imports, supplied contracts, infrastructure and data access.
Search reverse references where source is available; report the investigated locations and unresolved dynamic dispatch.
External neighbors stay compact. Exploring one is explicit navigation that changes the root, not recursive automatic expansion.
Distinguish external-to-context packages within this repository from third-party packages, external systems and infrastructure.
Keep discovery coverage independent of filters; missing evidence is not evidence of independence.

## Pages and navigation

Use separate linked surfaces, not simultaneous large diagrams:

```text
Application overview                         optional entry level
  Context overview                          all commands/queries + direct neighbors
    Use case
      Dependencies | Execution flow | Data model
```

A persistent breadcrumb identifies the current application, context and use case.
The context catalog has command/query filters, concise hover/focus descriptions and source locations.
Selection highlights incident relationships; an explicit Explore action opens the use-case page.
Keep all implemented use cases discoverable regardless of active connection filters.

Use-case tabs share the selected use-case identity, scenario and selected step/table where relevant.
Support copyable deep links and browser Back/Forward. Restore parent filters, selection and viewport/scroll on return.
Switching detail tabs preserves their individual viewport, expanded objects, active scenario and column disclosure states.
Evidence panels are scoped to their originating route and close or restore a valid selection when navigation changes the root.
A dismissible panel must not reduce the diagram to unreadable fit-to-screen scale.
On narrow surfaces, use a drawer or stacked details and independent diagram scrolling.
Use text labels with semantic colors, a local legend and keyboard-equivalent selection/navigation.
Reuse the pointer/keyboard guarantees of the interface contract where a surface supports panning.
Provide useful states for unknown roots, unmapped dependencies and unavailable sequence/schema evidence.

## Dependencies

Show the selected use case, meaningful internal collaborators, direct callers and directly used external endpoints.
Attach arrows to exact verified endpoints; keep module-level unresolved facts at their established level.
Direction is dependent → dependency. Distinguish calls, imports, supplied contracts, data access and physical storage.
Avoid one box per file/helper; implementation locations belong in evidence unless they represent meaningful components.
Composition-mediated use of another context is not a direct implementation import.
Use-case selection can trace internal use-case calls without implying every pair inside a module is coupled.

## Execution flow

Show a sequence diagram in a dedicated workspace, with meaningful components, external contracts and data objects as participants.
Number messages and provide an accessible ordered step list. Select a step to inspect its concise action and source evidence.
Default to the principal success scenario. Offer verified alternatives/failures as scenario choices instead of one giant branching chart.
Collapse long cohesive subflows behind an explicit disclosure. Preserve the original step identities and source references.
Show transaction boundaries, conditional paths, returns, rollback and asynchronous handoffs when established by evidence.
A message arrow means an interaction; a return arrow is not a reverse implementation dependency.

Inspect implementation order and control flow to build a sequence. A dependency graph cannot establish execution order.
Record per scenario: stable identity, trigger/preconditions, ordered steps, branches, transaction boundaries and outcome.
Record per step: stable identity, source and target participants, operation, ordering/branch condition, evidence and data bindings.
Distinguish static reconstruction from runtime observation; show partial/unverified subflows explicitly.
Do not invent timings, exhaustive paths, trigger effects or ordering among concurrent operations.
A technical transaction/savepoint used to implement a read does not alone make a business query a state-changing command.

## Detailed data model

Show actual persisted structures as table-like cards containing their columns or the target store's equivalent fields.
Use technology-appropriate terminology without forcing relational semantics onto other storage models.
For relational data, expose qualified names, table/view kind, column types, nullability, keys and defaults where established.
Initially show accessed columns plus key columns. Show all columns reveals the remaining metadata without marking it accessed.
Keep full names readable; let the workspace scroll rather than shrinking all cards to fit.

Record exact use-case/step access separately from schema metadata:

- READ includes returned, filtered, joined, ordered and locked columns; distinguish roles when the source establishes them.
- INSERT distinguishes explicitly supplied values, generated/default values and returned columns.
- UPDATE distinguishes predicate/expression reads and written target columns.
- DELETE is row-level impact with predicate reads; it is not a fabricated write to every column.
- Preserve unknown object/column bindings for dynamic expressions or unresolved routines.

Every access binding identifies use case, scenario/step where known, object, access role, columns or unknown scope and evidence.
An object reference does not establish access to all its columns. An accessed view is not automatically a write to its source tables.
Expose schema neighbors on demand. Label them as relationship context when they have no evidenced access/impact for this use case.

Schema links distinguish enforced foreign keys, observed code joins and view/data lineage; each carries its evidence.
Use appropriate schema notation and a local legend, independently of dependency-arrow and sequence-message semantics.
Record key endpoints/cardinality only when established. Show explicit uncertainty for inferred relationships and ownership.
Captured catalogs, source migrations, fixtures and live inspection are different provenance; disclose date/revision and disagreements.

Separate direct access from verified indirect effects through cascades, triggers, routines or derived structures.
Record the originating write, intermediary mechanism and conditions for each indirect effect.
Schema adjacency alone does not prove impact. Avoid presenting possible cascades as executed effects on a success path.
Report limitations where dynamic SQL, runtime branches or unavailable database definitions prevent a complete impact analysis.

## Linked exploration

Selecting a database step offers Show affected data, opening Data model focused on its exact tables and bound columns.
Selecting a table/column lists the selected use case's accessing steps with READ/INSERT/UPDATE/DELETE labels.
A step link returns to that step and scenario in Execution flow. Also expose other evidenced consumers within inventory coverage.
Selecting a dependency can show its related sequence steps; unavailable bindings stay explicitly unavailable.
Clear focus restores the use-case-wide model while retaining disclosure state.
Review records remain attached to canonical dependency boundaries, not transient step numbers or table positions.

## Worked interaction example

This is synthetic illustrative evidence, separate from any project's actual inventory.
A Records context has C Create record, C Link record and Q Find record; Link record returns an ID and has a command-return warning.
Link record reads records.id, inserts links(source_id,target_id) and returns links.id within one evidenced transaction.
The captured schema establishes links.id as a key and source_id/target_id as foreign keys to records.id.

1. Open Records directly. Show all three use cases and only the evidenced direct external neighbors.
2. Explore Link record. Dependencies shows its supplied transaction contract and accessed data.
3. Open Execution flow. Select the insert step and choose Show affected data.
4. Data model highlights INSERT on source_id/target_id and returned READ on id; unrelated columns remain unmarked.
5. Show all columns reveals metadata columns. Foreign-key arrows keep their schema meaning.
6. Select links.source_id, follow its accessing step, then return to Records with its original selection and scroll restored.

For no verified flow or schema metadata, retain the dependency view and explain the evidence gap; never generate invented detail.
